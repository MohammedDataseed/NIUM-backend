// documents-consolidate.service.ts

import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as pdf from 'html-pdf-node';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
import { Buffer } from 'buffer';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  PDFDocument,
  PDFName,
  PDFObject,
  PDFDict,
  PDFRawStream,
} from 'pdf-lib';
import axios from 'axios';
import { Order } from '../../../database/models/order.model';
import { Documents } from '../../../database/models/documents.model';
import { DocumentType } from '../../../database/models/documentType.model'; // Assuming document_type table exists

@Injectable()
export class PdfService {
  private readonly s3: S3Client;
  private readonly MAX_SIZE_BYTES = 15 * 1024 * 1024; // 1MB limit
  private readonly TEMP_DIR = path.join(process.cwd(), 'src/dev-assets');

  constructor(
    @Inject('DOCUMENTS_REPOSITORY')
    private readonly documentRepository: typeof Documents,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    @Inject('DOCUMENT_TYPE_REPOSITORY')
    private readonly documentTypeRepository: typeof DocumentType,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async listFilesByFolder(folderName: string) {
    const prefix = `${folderName}/`;

    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    };

    try {
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];

      const fileList = await Promise.all(
        files.map(async (file) => {
          const signedUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: file.Key,
            }),
            { expiresIn: 3600 },
          );
          return {
            name: file.Key.replace(prefix, ''),
            signed_url: signedUrl,
          };
        }),
      );

      return {
        order_id: folderName,
        files: fileList,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error listing files: ${error.message}`,
      );
    }
  }

  async optimizePdf(
    pdfDoc: PDFDocument,
    aggressive: boolean = false,
  ): Promise<Uint8Array> {
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const pageNode = page.node;
      pageNode.delete(PDFName.of('UserUnit'));
      pageNode.delete(PDFName.of('Annots'));

      const contentStream = pageNode.get(PDFName.of('Contents'));
      if (contentStream) {
        if (Array.isArray(contentStream)) {
          for (const stream of contentStream) {
            if (stream instanceof PDFRawStream) {
              stream.dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
            }
          }
        } else if (contentStream instanceof PDFRawStream) {
          contentStream.dict.set(
            PDFName.of('Filter'),
            PDFName.of('FlateDecode'),
          );
        }
      }
    }

    const fontCache = new Map<string, PDFObject>();
    for (const page of pages) {
      const resources = page.node.Resources();
      if (resources && resources.has(PDFName.of('Font'))) {
        const fonts = resources.lookup(PDFName.of('Font')) as PDFDict;
        for (const [fontKey, fontRef] of fonts.entries()) {
          const fontKeyStr = fontRef.toString();
          if (fontCache.has(fontKeyStr)) {
            fonts.set(fontKey, fontCache.get(fontKeyStr)!);
          } else {
            fontCache.set(fontKeyStr, fontRef);
          }
        }
      }
    }

    const saveOptions: any = {
      useObjectStreams: true,
      updateFieldAppearances: false,
      compress: true,
    };

    if (aggressive) {
      saveOptions.addToCatalog = false;
    }

    return await pdfDoc.save(saveOptions);
  }

  async serveDocument(folderName: string, fileName: string) {
    const s3Key = `${folderName}/${fileName}`;
    const signedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
      }),
      { expiresIn: 3600 },
    );

    const response = await axios.get(signedUrl, {
      responseType: 'stream',
    });

    return response.data; // Stream to be piped in your HTTP response
  }

  async updateFile(
    buffer: Buffer,
    oldFileKey: string,
    newFileKey: string,
    contentType: string = 'application/pdf',
  ) {
    // Step 1: Check if the old file exists
    const headParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: oldFileKey,
    };

    try {
      await this.s3.send(new HeadObjectCommand(headParams)); // Throws 404 if file doesn't exist
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(`File not found: ${oldFileKey}`);
      }
      throw new InternalServerErrorException(
        `Error checking file existence: ${error.message}`,
      );
    }

    // Step 2: Update the file with the new filename and content type
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: newFileKey, // Use the uploaded file's original name
      Body: buffer,
      ContentType: contentType, // Use the uploaded file's MIME type
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));

      // Step 3: Delete the old file if the filename changed
      if (newFileKey !== oldFileKey) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: oldFileKey,
        };
        await this.s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted old file: ${oldFileKey}`);
      }

      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: newFileKey,
        }),
        { expiresIn: 3600 },
      );
      return {
        message: 'File updated successfully.',
        file_url: signedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Update error: ${error.message}`);
    }
  }

  async deleteFile(fileKey: string) {
    // Step 1: Check if the file exists
    const headParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    try {
      await this.s3.send(new HeadObjectCommand(headParams)); // Throws 404 if file doesn't exist
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }
      throw new InternalServerErrorException(
        `Error checking file existence: ${error.message}`,
      );
    }

    // Step 2: Delete the file
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(deleteParams));
      return {
        message: 'File deleted successfully.',
      };
    } catch (error) {
      throw new InternalServerErrorException(`Delete error: ${error.message}`);
    }
  }

  async uploadFile(buffer: Buffer, originalName: string, folderName: string) {
    const folder = folderName ? `${folderName}/` : '';
    const fileName = `${Date.now()}_${originalName}`;
    const key = `${folder}${fileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 3600 },
      );
      return {
        message: 'File uploaded successfully.',
        file_url: signedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Upload error: ${error.message}`);
    }
  }

  async uploadDocumentByOrderId(
    partner_order_id: string,
    document_type_id: string,
    base64File: string,
    merge_doc: boolean = false,
  ) {
    const order = await this.orderRepository.findOne({
      where: { partner_order_id },
    });
    if (!order) {
      throw new BadRequestException(`Order ID ${partner_order_id} not found`);
    }

    const documentType = await this.documentTypeRepository.findOne({
      where: { hashed_key: document_type_id },
    });
    if (!documentType) {
      throw new BadRequestException(
        `Invalid document_type_id: ${document_type_id}`,
      );
    }

    function isValidBase64(str: string): boolean {
      const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
    }

    if (!isValidBase64(base64File)) {
      throw new BadRequestException('Invalid Base64 encoding.');
    }

    let mimeType: string, base64Data: string;
    const fileMatch = base64File.match(
      /^data:(image\/jpeg|image\/jpg|image\/png|application\/pdf);base64,(.+)$/,
    );
    if (fileMatch) {
      mimeType = fileMatch[1];
      base64Data = fileMatch[2];
    } else {
      base64Data = base64File;
      const magicNumbers: Record<string, string> = {
        JVBERi0: 'application/pdf',
        '/9j/': 'image/jpeg',
        iVBORw: 'image/png',
      };
      mimeType = Object.entries(magicNumbers).find(([magic]) =>
        base64Data.startsWith(magic),
      )?.[1];
      if (!mimeType) {
        throw new BadRequestException(
          'Invalid base64 format. Only JPEG, JPG, PNG, and PDF allowed.',
        );
      }
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const MAX_SIZE_BYTES = 15 * 1024 * 1024;
    if (buffer.length > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size must be ≤ 15MB');
    }

    const existingDocument = await this.documentRepository.findOne({
      where: { entityId: order.id, document_type_id: documentType.id },
    });

    if (existingDocument) {
      console.log('Existing docs found');
      const url = new URL(existingDocument.documentUrl.url);
      const existingFileKey = url.pathname.substring(1);
      console.log(existingFileKey);
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: existingFileKey,
        }),
      );
      console.log(`Deleted ${existingFileKey} from S3`);
      await this.documentRepository.destroy({
        where: { documentId: existingDocument.documentId },
      });
      console.log(`Deleted document ${existingDocument.documentId} from DB`);
    }

    // Upload the new individual file
    const folderName = partner_order_id;
    const fileExtension = mimeType.split('/')[1];
    const individualFileName = `${partner_order_id}_${document_type_id}.${fileExtension}`;
    const individualKey = `${folderName}/${individualFileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: individualKey,
      Body: buffer,
      ContentType: mimeType,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    const individualSignedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: individualKey,
      }),
      { expiresIn: 3600 },
    );
    const individualMaskedUrl = individualSignedUrl;

    const document = await this.documentRepository.create({
      entityId: order.id,
      entityType: 'customer',
      purposeId: null,
      document_type_id: documentType.id,
      document_name: individualFileName,
      documentUrl: {
        url: individualMaskedUrl,
        mimeType,
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
      },
      isUploaded: true,
    });

    // Merge if merge_doc=true
    let mergedDocument: any = null;

    let mergedUrl: string | null = null;
    if (merge_doc) {
      console.log('Merging documents...');
      const mergeResult = await this.mergeFilesByFolder(partner_order_id);
      if (mergeResult.files && mergeResult.files.length > 0) {
        // mergedUrl = mergeResult.files[0].url;
        const mergedFile = mergeResult.files[0];
        mergedUrl = mergedFile.url;

        // Get file size from buffer
        const fileSize = mergedFile.buffer.length;
        // Check if an existing merged document exists
        const existingMergedDocument = await this.documentRepository.findOne({
          where: {
            entityId: order.id,
            document_name: `merged_${partner_order_id}.pdf`,
          },
        });

        // If exists, update it; otherwise, create a new one
        if (existingMergedDocument) {
          await this.documentRepository.update(
            {
              documentUrl: {
                url: mergedUrl,
                mimeType: 'application/pdf',
                size: fileSize,
                uploadedAt: new Date().toISOString(),
              },
              isUploaded: true,
            },
            { where: { id: existingMergedDocument.id } },
          );

          mergedDocument = existingMergedDocument; // Use the existing document reference
          console.log('Existing merged document updated:', mergedDocument);
        } else {
          // Create new merged document
          mergedDocument = await this.documentRepository.create({
            entityId: order.id,
            entityType: 'customer',
            purposeId: null,
            document_type_id: documentType.id,
            document_name: `merged_${partner_order_id}.pdf`,
            documentUrl: {
              url: mergedUrl,
              mimeType: 'application/pdf',
              size: fileSize,
              uploadedAt: new Date().toISOString(),
            },
            isUploaded: true,
          });

          console.log('New merged document uploaded to DB:', mergedDocument);
        }
        // Correctly update order with merged document object
        await this.orderRepository.update(
          {
            merged_document: {
              url: mergedUrl,
              mimeType: 'application/pdf',
              size: fileSize,
              created_at: new Date().toISOString(),
              documentIds: [mergedDocument.id], // Assuming document has an `id`
            },
          },
          { where: { partner_order_id } },
        );
      } else {
        throw new InternalServerErrorException(
          'Merged file could not be processed.',
        );
      }
    }

    return {
      message: merge_doc
        ? 'Document uploaded and merged successfully'
        : 'Document uploaded successfully',
      document_id: document.entityId,
      ...(merge_doc && {
        merged_document_id: mergedDocument.id, // Include merged document ID
      }),
    };
  }

  private async compressToSize(
    pdfBuffer: Buffer,
    maxSize: number,
  ): Promise<Buffer> {
    const tempInput = path.join(this.TEMP_DIR, `input_${Date.now()}.pdf`);
    const tempOutput = path.join(this.TEMP_DIR, `output_${Date.now()}.pdf`);

    try {
      // Save the original PDF buffer to a temporary file
      await writeFile(tempInput, pdfBuffer);

      // Run Ghostscript compression command
      const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${tempOutput} ${tempInput}`;
      const { exec } = require('child_process');

      await new Promise((resolve, reject) => {
        exec(gsCommand, (error: any) => {
          if (error) {
            reject(
              new Error(`Ghostscript compression failed: ${error.message}`),
            );
          } else {
            resolve(null);
          }
        });
      });

      // Read the compressed file
      const compressedBuffer = await fs.promises.readFile(tempOutput);
      console.log(`Compressed PDF size: ${compressedBuffer.length} bytes`);

      if (compressedBuffer.length > maxSize) {
        console.warn(
          `Compressed PDF (${compressedBuffer.length} bytes) still exceeds max size (${maxSize} bytes).`,
        );
      }

      return compressedBuffer;
    } catch (error) {
      console.error(`Error in compressToSize: ${error.message}`);
      throw new InternalServerErrorException(
        `PDF compression failed: ${error.message}`,
      );
    } finally {
      // Cleanup temporary files
      try {
        await fs.promises.unlink(tempInput);
        await fs.promises.unlink(tempOutput);
      } catch (cleanupError) {
        console.warn(`Failed to delete temp files: ${cleanupError.message}`);
      }
    }
  }

  async mergeFilesByFolder(
    folderName: string,
    newFileBuffer?: Buffer,
    newFileMimeType?: string,
  ) {
    const prefix = `${folderName}/`;
    const MAX_SIZE_BYTES = 4 * 1024 * 1024;

    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    };
    const response = await this.s3.send(new ListObjectsV2Command(listParams));
    const files = response.Contents || [];
    if (!files.length && !newFileBuffer) {
      throw new BadRequestException(`No files found in folder: ${folderName}`);
    }

    const mergedPdf = await PDFDocument.create();

    // Add existing files (PDF, JPEG, PNG)
    for (const file of files.filter(
      (f) => !f.Key.includes('merge_document_'),
    )) {
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: file.Key,
        }),
        { expiresIn: 3600 },
      );
      const response = await axios.get(signedUrl, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const fileData = Buffer.from(response.data);

      if (file.Key.endsWith('.pdf')) {
        const subPdf = await PDFDocument.load(fileData);
        const copiedPages = await mergedPdf.copyPages(
          subPdf,
          subPdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (
        file.Key.endsWith('.jpeg') ||
        file.Key.endsWith('.jpg') ||
        file.Key.endsWith('.png')
      ) {
        const imagePdf = await PDFDocument.create();
        const image = file.Key.endsWith('.png')
          ? await imagePdf.embedPng(fileData)
          : await imagePdf.embedJpg(fileData);
        imagePdf.addPage([image.width, image.height]).drawImage(image);
        const copiedPages = await mergedPdf.copyPages(
          imagePdf,
          imagePdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
    }

    // Add new file if provided
    if (newFileBuffer && newFileMimeType) {
      if (newFileMimeType === 'application/pdf') {
        const subPdf = await PDFDocument.load(newFileBuffer);
        const copiedPages = await mergedPdf.copyPages(
          subPdf,
          subPdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else {
        const imagePdf = await PDFDocument.create();
        const image =
          newFileMimeType === 'image/png'
            ? await imagePdf.embedPng(newFileBuffer)
            : await imagePdf.embedJpg(newFileBuffer);
        imagePdf.addPage([image.width, image.height]).drawImage(image);
        const copiedPages = await mergedPdf.copyPages(
          imagePdf,
          imagePdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
    }

    if (mergedPdf.getPageCount() === 0) {
      throw new BadRequestException(
        `No valid files to merge in folder: ${folderName}`,
      );
    }

    // let mergedBytes = await mergedPdf.save();

    // // Apply compression to fit within the 4MB limit
    // mergedBytes = await this.compressToSize(mergedBytes, MAX_SIZE_BYTES);
    let mergedBytes = await mergedPdf.save();
    mergedBytes = Buffer.from(mergedBytes); // Convert Uint8Array to Buffer

    // Apply compression to fit within the 4MB limit
    mergedBytes = await this.compressToSize(
      Buffer.from(mergedBytes),
      MAX_SIZE_BYTES,
    );

    const mergedKey = `${prefix}merge_document_${folderName}.pdf`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: mergedKey,
        Body: mergedBytes,
        ContentType: 'application/pdf',
      }),
    );
    // ACL: "public-read", // ✅ Ensures permanent public access

    const mergedSignedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: mergedKey,
      }),
      { expiresIn: 3600 },
    );

    // ✅ Construct permanent public URL instead of using signed URL
    const mergedPublicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${mergedKey}`;
    // const maskedUrl = `${process.env.API_BASE_URL}/v1/api/documents/${folderName}/merge_document_${folderName}.pdf`;
    const maskedUrl = `${process.env.API_BASE_URL}/v1/api/documents/esign/${mergedKey}`;
    // const maskedUrl = `http://localhost:3002/v1/api/documents/${mergedKey}`;

    // return { files: [{ buffer: Buffer.from(mergedBytes), url: mergedSignedUrl, s3Key: mergedKey }] };
    // return { files: [{ buffer: Buffer.from(mergedBytes), url: mergedSignedUrl, s3Key: mergedKey }] };
    // return {
    //   files: [
    //     {
    //       buffer: Buffer.from(mergedBytes),
    //       url: mergedPublicUrl,
    //       s3Key: mergedKey,
    //     },
    //   ],
    // };
    return {
      files: [
        {
          buffer: Buffer.from(mergedBytes),
          url: maskedUrl,
          s3Key: mergedKey,
        },
      ],
    };
  }
}
