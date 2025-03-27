//documents-consolidate.service.ts

import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
import { Buffer } from "buffer";
import { Readable } from "stream";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PDFDocument,
  PDFName,
  PDFObject,
  PDFDict,
  PDFRawStream,
} from "pdf-lib";
import { Op } from "sequelize";

import axios from "axios";
import { Request, Response } from "express"; // Import Express and types
import { Order } from "src/database/models/order.model";
import { Documents } from "src/database/models/documents.model";
import { DocumentType } from "src/database/models/documentType.model"; // Assuming document_type table exists

@Injectable()
export class PdfService {
  private readonly s3: S3Client;
  // Add this to your class definition (e.g., PdfService)
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  constructor(
    @Inject("DOCUMENTS_REPOSITORY")
    private readonly documentRepository: typeof Documents,
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("DOCUMENT_TYPE_REPOSITORY")
    private readonly documentTypeRepository: typeof DocumentType,
    private readonly configService: ConfigService
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
            { expiresIn: 3600 }
          );
          return {
            name: file.Key.replace(prefix, ""),
            signed_url: signedUrl,
          };
        })
      );

      return {
        order_id: folderName,
        files: fileList,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error listing files: ${error.message}`
      );
    }
  }

  async optimizePdf(
    pdfDoc: PDFDocument,
    aggressive: boolean = false
  ): Promise<Uint8Array> {
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const pageNode = page.node;
      pageNode.delete(PDFName.of("UserUnit"));
      pageNode.delete(PDFName.of("Annots"));

      const contentStream = pageNode.get(PDFName.of("Contents"));
      if (contentStream) {
        if (Array.isArray(contentStream)) {
          for (const stream of contentStream) {
            if (stream instanceof PDFRawStream) {
              stream.dict.set(PDFName.of("Filter"), PDFName.of("FlateDecode"));
            }
          }
        } else if (contentStream instanceof PDFRawStream) {
          contentStream.dict.set(
            PDFName.of("Filter"),
            PDFName.of("FlateDecode")
          );
        }
      }
    }

    const fontCache = new Map<string, PDFObject>();
    for (const page of pages) {
      const resources = page.node.Resources();
      if (resources && resources.has(PDFName.of("Font"))) {
        const fonts = resources.lookup(PDFName.of("Font")) as PDFDict;
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
      { expiresIn: 3600 }
    );

    const response = await axios.get(signedUrl, {
      responseType: "stream",
    });

    return response.data; // Stream to be piped in your HTTP response
  }

  async updateFile(
    buffer: Buffer,
    oldFileKey: string,
    newFileKey: string,
    contentType: string = "application/pdf"
  ) {
    // Step 1: Check if the old file exists
    const headParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: oldFileKey,
    };

    try {
      await this.s3.send(new HeadObjectCommand(headParams)); // Throws 404 if file doesn't exist
    } catch (error) {
      if (error.name === "NotFound") {
        throw new NotFoundException(`File not found: ${oldFileKey}`);
      }
      throw new InternalServerErrorException(
        `Error checking file existence: ${error.message}`
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
        { expiresIn: 3600 }
      );
      return {
        message: "File updated successfully.",
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
      if (error.name === "NotFound") {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }
      throw new InternalServerErrorException(
        `Error checking file existence: ${error.message}`
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
        message: "File deleted successfully.",
      };
    } catch (error) {
      throw new InternalServerErrorException(`Delete error: ${error.message}`);
    }
  }

  async uploadFile(buffer: Buffer, originalName: string, folderName: string) {
    const folder = folderName ? `${folderName}/` : "";
    const fileName = `${Date.now()}_${originalName}`;
    const key = `${folder}${fileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 3600 }
      );
      return {
        message: "File uploaded successfully.",
        file_url: signedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Upload error: ${error.message}`);
    }
  }


  async uploadLargeFileToS3(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    const partSize = 5 * 1024 * 1024; // 5MB
    const totalParts = Math.ceil(buffer.length / partSize);

    if (buffer.length <= partSize) {
      await this.s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }));
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }

    const multipartUpload = await this.s3.send(new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    }));
    const uploadId = multipartUpload.UploadId;
    if (!uploadId) throw new Error("Failed to initiate multipart upload");

    const uploadPromises = [];
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, buffer.length);
      const partBuffer = buffer.slice(start, end);

      uploadPromises.push(
        this.s3.send(new UploadPartCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          PartNumber: i + 1,
          UploadId: uploadId,
          Body: partBuffer,
        })).then(res => ({
          PartNumber: i + 1,
          ETag: res.ETag,
        }))
      );
    }

    const uploadedParts = await Promise.all(uploadPromises);

    await this.s3.send(new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: uploadedParts },
    }));

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  async uploadDocumentByOrderId(
    partner_order_id: string,
    document_type_id: string,
    base64File: string,
    merge_doc: boolean = false
  ) {
    const order = await this.orderRepository.findOne({ where: { partner_order_id } });
    if (!order) throw new BadRequestException(`Order ID ${partner_order_id} not found`);
  
    const documentType = await this.documentTypeRepository.findOne({ where: { hashed_key: document_type_id } });
    if (!documentType) throw new BadRequestException(`Invalid document_type_id: ${document_type_id}`);
  
    function isValidBase64(str: string): boolean {
      if (!str || str.length % 4 !== 0) return false;
      const validChars = /^[A-Za-z0-9+/]+={0,2}$/;
      return validChars.test(str.slice(0, 1000));
    }
  
    if (!isValidBase64(base64File)) throw new BadRequestException("Invalid Base64 encoding.");
  
    let mimeType: string, base64Data: string;
    const fileMatch = base64File.match(/^data:(image\/jpeg|image\/jpg|image\/png|application\/pdf);base64,(.+)$/);
    if (fileMatch) {
      mimeType = fileMatch[1];
      base64Data = fileMatch[2];
    } else {
      base64Data = base64File;
      const magicNumbers: Record<string, string> = {
        JVBERi0: "application/pdf",
        "/9j/": "image/jpeg",
        iVBORw: "image/png",
      };
      mimeType = Object.entries(magicNumbers).find(([magic]) => base64Data.startsWith(magic))?.[1];
      if (!mimeType) throw new BadRequestException("Invalid base64 format. Only JPEG, JPG, PNG, and PDF allowed.");
    }
  
    const chunkSize = 4 * 1024 * 1024; // 4MB chunks
    const totalSize = Buffer.byteLength(base64Data, "base64");
    const MAX_SIZE_BYTES = 50 * 1024 * 1024; // Increased to 50MB
    if (totalSize > MAX_SIZE_BYTES) throw new BadRequestException("File size must be ≤ 50MB");
  
    let buffer: Buffer;
    if (totalSize <= chunkSize) {
      buffer = Buffer.from(base64Data, "base64");
    } else {
      const chunks: Buffer[] = [];
      for (let i = 0; i < base64Data.length; i += chunkSize) {
        const chunk = base64Data.slice(i, i + chunkSize);
        chunks.push(Buffer.from(chunk, "base64"));
      }
      buffer = Buffer.concat(chunks);
    }
  
    const existingDocument = await this.documentRepository.findOne({
      where: { entityId: order.id, document_type_id: documentType.id },
    });
  
    if (existingDocument) {
      const url = new URL(existingDocument.documentUrl.url);
      const existingFileKey = url.pathname.substring(1);
      await this.s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: existingFileKey,
      }));
      await this.documentRepository.destroy({ where: { documentId: existingDocument.documentId } });
    }
  
    const folderName = partner_order_id;
    const fileExtension = mimeType.split("/")[1];
    const individualFileName = `${partner_order_id}_${document_type_id}.${fileExtension}`;
    const individualKey = `${folderName}/${individualFileName}`;
  
    await this.uploadLargeFileToS3(individualKey, buffer, mimeType);
    const individualSignedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: individualKey,
      }),
      { expiresIn: 3600 }
    );
  
    const document = await this.documentRepository.create({
      entityId: order.id,
      entityType: "customer",
      purposeId: null,
      document_type_id: documentType.id,
      document_name: individualFileName,
      documentUrl: {
        url: individualSignedUrl,
        mimeType,
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
      },
      isUploaded: true,
    });
  
    let mergedDocument: any = null;
    let mergedUrl: string | null = null;
    if (merge_doc) {
      const mergeResult = await this.mergeFilesByFolder(partner_order_id);
      if (mergeResult.files && mergeResult.files.length > 0) {
        const mergedFile = mergeResult.files[0];
        mergedUrl = mergedFile.url;
        const fileSize = mergedFile.buffer.length;
  
        let existingMergedDocument = await this.documentRepository.findOne({
          where: { entityId: order.id, document_name: `merged_${partner_order_id}.pdf` },
        });
  
        if (existingMergedDocument) {
          await this.documentRepository.update(
            {
              documentUrl: { url: mergedUrl, mimeType: "application/pdf", size: fileSize, uploadedAt: new Date().toISOString() },
              isUploaded: true,
            },
            { where: { id: existingMergedDocument.id } }
          );
          mergedDocument = existingMergedDocument;
        } else {
          mergedDocument = await this.documentRepository.create({
            entityId: order.id,
            entityType: "customer",
            purposeId: null,
            document_type_id: documentType.id,
            document_name: `merged_${partner_order_id}.pdf`,
            documentUrl: { url: mergedUrl, mimeType: "application/pdf", size: fileSize, uploadedAt: new Date().toISOString() },
            isUploaded: true,
          });
        }
  
        await this.orderRepository.update(
          {
            merged_document: {
              url: mergedUrl,
              mimeType: "application/pdf",
              size: fileSize,
              createdAt: new Date().toISOString(),
              documentIds: [mergedDocument.id],
            },
          },
          { where: { partner_order_id } }
        );
      } else {
        throw new InternalServerErrorException("Merged file could not be processed.");
      }
    }
  
    return {
      message: merge_doc ? "Document uploaded and merged successfully" : "Document uploaded successfully",
      document_id: document.entityId,
      ...(merge_doc && { merged_document_id: mergedDocument.id }),
    };
  }

  async mergeFilesByFolder(folderName: string, newFileBuffer?: Buffer, newFileMimeType?: string) {
    const prefix = `${folderName}/`;
    const listParams = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };
    const response = await this.s3.send(new ListObjectsV2Command(listParams));
    const files = response.Contents || [];
  
    if (!files.length && !newFileBuffer)
      throw new BadRequestException(`No files found in folder: ${folderName}`);
  
    const mergedPdf = await PDFDocument.create();
    const MAX_BATCH = 5;
  
    // Filter out the merged document to avoid re-merging it
    const individualFiles = files.filter(file => !file.Key.endsWith(`merged_document_${folderName}.pdf`));
  
    for (let i = 0; i < individualFiles.length; i += MAX_BATCH) {
      const chunkFiles = individualFiles.slice(i, i + MAX_BATCH);
      for (const file of chunkFiles) {
        const signedUrl = await getSignedUrl(this.s3, new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: file.Key,
        }), { expiresIn: 3600 });
  
        const response = await axios.get(signedUrl, { responseType: "arraybuffer" });
        let fileData = Buffer.from(response.data);
  
        if (file.Key.endsWith(".pdf")) {
          const subPdf = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.Key.match(/\.(jpeg|jpg|png)$/)) {
          fileData = await sharp(fileData)
            .resize({ width: 1000 })
            .jpeg({ quality: 70 })
            .toBuffer();
          const image = await mergedPdf.embedJpg(fileData);
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
      }
    }
  
    if (newFileBuffer && newFileMimeType) {
      if (newFileMimeType === "application/pdf") {
        const subPdf = await PDFDocument.load(newFileBuffer);
        const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else {
        newFileBuffer = await sharp(newFileBuffer)
          .resize({ width: 1000 })
          .jpeg({ quality: 70 })
          .toBuffer();
        const image = await mergedPdf.embedJpg(newFileBuffer);
        const page = mergedPdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
    }
  
    let mergedBytes = await mergedPdf.save();
    mergedBytes = await this.compressPdfWithPdfLib(Buffer.from(mergedBytes), this.MAX_FILE_SIZE);
  
    const mergedKey = `${prefix}merged_document_${folderName}.pdf`;
    await this.uploadLargeFileToS3(mergedKey, Buffer.from(mergedBytes), "application/pdf");
  
    const apiBaseUrl = this.configService.get<string>("API_BASE_URL");
    const maskedUrl = `${apiBaseUrl}/v1/api/documents/esign/${mergedKey}`; // Masked URL using API_BASE_URL
    return {
      files: [{ buffer: Buffer.from(mergedBytes), url: maskedUrl, s3Key: mergedKey }],
    };
    // return {
    //   files: [{ buffer: Buffer.from(mergedBytes), url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${mergedKey}`, s3Key: mergedKey }],
    // };
  }
  async mergeFilesByFolder1(folderName: string, newFileBuffer?: Buffer, newFileMimeType?: string) {
    const prefix = `${folderName}/`;
    const listParams = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };
    const response = await this.s3.send(new ListObjectsV2Command(listParams));
    const files = response.Contents || [];
  
    if (!files.length && !newFileBuffer)
      throw new BadRequestException(`No files found in folder: ${folderName}`);
  
    const mergedPdf = await PDFDocument.create();
    const MAX_BATCH = 5;
  
    for (let i = 0; i < files.length; i += MAX_BATCH) {
      const chunkFiles = files.slice(i, i + MAX_BATCH);
      for (const file of chunkFiles) {
        const signedUrl = await getSignedUrl(this.s3, new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: file.Key,
        }), { expiresIn: 3600 });
  
        // Fix 1: Use axios.get instead of axios.default.get
        const response = await axios.get(signedUrl, { responseType: "arraybuffer" });
        let fileData = Buffer.from(response.data);
  
        if (file.Key.endsWith(".pdf")) {
          const subPdf = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.Key.match(/\.(jpeg|jpg|png)$/)) {
          fileData = await sharp(fileData)
            .resize({ width: 1000 })
            .jpeg({ quality: 70 })
            .toBuffer();
          const image = await mergedPdf.embedJpg(fileData);
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
      }
    }
  
    if (newFileBuffer && newFileMimeType) {
      if (newFileMimeType === "application/pdf") {
        const subPdf = await PDFDocument.load(newFileBuffer);
        const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else {
        newFileBuffer = await sharp(newFileBuffer)
          .resize({ width: 1000 })
          .jpeg({ quality: 70 })
          .toBuffer();
        const image = await mergedPdf.embedJpg(newFileBuffer);
        const page = mergedPdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
    }
  
    let mergedBytes = await mergedPdf.save();
    // Fix 2: Ensure MAX_FILE_SIZE is defined in the class
    mergedBytes = await this.compressPdfWithPdfLib(Buffer.from(mergedBytes), this.MAX_FILE_SIZE);
  
    const mergedKey = `${prefix}merged_document_${folderName}.pdf`;
    // Fix 3: Convert Uint8Array to Buffer
    await this.uploadLargeFileToS3(mergedKey, Buffer.from(mergedBytes), "application/pdf");
  
    return {
      files: [{ buffer: Buffer.from(mergedBytes), url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${mergedKey}`, s3Key: mergedKey }],
    };
  }
  

  async compressPdfWithPdfLib(pdfBuffer: Buffer, maxSize: number): Promise<Buffer> {
    let pdfDoc = await PDFDocument.load(pdfBuffer);
    let compressedBuffer = Buffer.from(await pdfDoc.save());

    let quality = 80; // Initial compression quality
    while (compressedBuffer.length > maxSize && quality > 50) {
      console.warn(`Compressed size (${compressedBuffer.length} bytes) still exceeds limit. Reducing quality.`);

      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      compressedBuffer = Buffer.from(await newPdfDoc.save());
      quality -= 10; // Lower quality for next iteration if needed
    }

    return compressedBuffer;
  }

}
