//documents-consolidate.service.ts

import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Buffer } from "buffer";
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PDFDocument,
  PDFName,
  PDFObject,
  PDFDict,
  PDFRawStream,
} from "pdf-lib";
import { Op } from 'sequelize';

import axios from "axios";
import { Request, Response } from "express"; // Import Express and types
import { Order } from "src/database/models/order.model";
import { Documents } from "src/database/models/documents.model";
import { DocumentType } from "src/database/models/documentType.model"; // Assuming document_type table exists

@Injectable()
export class PdfService {
  private readonly s3: S3Client;
  private baseUrl = "http://localhost:3002"; // Replace with your actual domain
  private readonly MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB limit

  constructor(
    @Inject("DOCUMENTS_REPOSITORY")
    private readonly documentRepository: typeof Documents,
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("DOCUMENT_TYPE_REPOSITORY")
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

  // async uploadDocumentByOrderId(
  //   partner_order_id: string,
  //   document_type_id: string,
  //   base64File: string,
  //   merge_doc: boolean = false // ✅ Default: false
  // ) {
  //   // 1️⃣ Check if the order exists
  //   const order = await this.orderRepository.findOne({ where: { partner_order_id } });
  //   if (!order) {
  //     throw new BadRequestException(`Order ID ${partner_order_id} not found`);
  //   }
  
  //   // 2️⃣ Validate document_type_id
  //   const documentType = await this.documentTypeRepository.findOne({ where: { hashed_key: document_type_id } });
  //   if (!documentType) {
  //     throw new BadRequestException(`Invalid document_type_id: ${document_type_id}`);
  //   }
  
  //   // 3️⃣ Validate and Extract base64 Data
  //   function isValidBase64(str: string): boolean {
  //     const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  //     return base64Regex.test(str);
  //   }
  
  //   if (!isValidBase64(base64File)) {
  //     throw new BadRequestException("Invalid Base64 encoding. Ensure it's properly formatted.");
  //   }
  
  //   let mimeType: string;
  //   let base64Data: string;
  
  //   const fileMatch = base64File.match(/^data:(image\/jpeg|image\/jpg|image\/png|application\/pdf);base64,(.+)$/);
  
  //   if (fileMatch) {
  //     mimeType = fileMatch[1];
  //     base64Data = fileMatch[2];
  //   } else {
  //     base64Data = base64File;
  //     const magicNumbers: Record<string, string> = {
  //       "JVBERi0": "application/pdf",
  //       "/9j/": "image/jpeg",
  //       "iVBORw": "image/png",
  //     };
  //     mimeType = Object.entries(magicNumbers).find(([magic]) => base64Data.startsWith(magic))?.[1];
  
  //     if (!mimeType) {
  //       throw new BadRequestException("Invalid base64 format. Only JPEG, JPG, PNG, and PDF files are allowed.");
  //     }
  //   }
  
  //   let buffer = Buffer.from(base64Data, "base64");
  
  //   // 4️⃣ Validate file size (Max: 1 MB)
  //   const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
  //   if (buffer.length > MAX_SIZE_BYTES) {
  //     throw new BadRequestException(`File size must be less than or equal to 1MB.`);
  //   }
  
  //   // 5️⃣ Check if a document with the same type already exists
  //   const existingDocument = await this.documentRepository.findOne({
  //     where: { entityId: order.id, document_type_id: documentType.id },
  //   });
  
  //   if (existingDocument) {
  //     console.log('existing docs')
  //     const existingFileKey = existingDocument.documentUrl.url.split(`${process.env.AWS_S3_BUCKET_NAME}/`)[1];
  
  //     try {
  //       // ✅ Delete the old file (regardless of `merge_doc`)
  //       await this.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: existingFileKey }));
  //     } catch (error) {
  //       console.warn(`⚠️ Warning: Failed to delete old file from S3: ${error.message}`);
  //     }
  
  //     // ✅ Delete existing document record
  //     await this.documentRepository.destroy({ where: { documentId: existingDocument.documentId } });
  
  //   }
  
    
  //   if (merge_doc) {
  //     // ✅ Merge document logic
  //     console.log("🔄 Merging documents...");

  //     // Merge files from S3 folder
  //     const mergeResult = await this.mergeFilesByFolder(partner_order_id);

  //     // Ensure that mergeResult returns the S3 Key of the merged file
  //     if (mergeResult.files && mergeResult.files.length > 0) {
  //       buffer = Buffer.from(mergeResult.files[0].s3Key); // Use the merged file buffer
  //       mimeType = "application/pdf"; // Ensure mimeType is PDF after merging
  //     } else {
  //       throw new InternalServerErrorException("Merged file could not be processed correctly.");
  //     }
  //   }
  //   // 6️⃣ Upload the new (or merged) file to S3
  //   const folderName = partner_order_id;
  //   const fileExtension = mimeType.split("/")[1];
  //   const fileName = merge_doc
  //     ? `merge_document_${partner_order_id}.pdf` // ✅ Use this name for merged files
  //     : `${partner_order_id}_${document_type_id}.${fileExtension}`;
  
  //   const key = `${folderName}/${fileName}`;
  
  //   const uploadParams = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //     Key: key,
  //     Body: buffer,
  //     ContentType: mimeType,
  //   };
  
  //   try {
  //     await this.s3.send(new PutObjectCommand(uploadParams));
  
  //     // 7️⃣ Generate Signed URL (for internal use)
  //     const signedUrl = await getSignedUrl(
  //       this.s3,
  //       new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }),
  //       { expiresIn: 3600 }
  //     );
  
  //     // 8️⃣ Create a masked URL
  //     // const maskedUrl = `https://nium.thestorywallcafe.com/documents/${partner_order_id}/${fileName}`;
  
  //     const maskedUrl=signedUrl
  //     // 9️⃣ Save new document details in the database
  //     const document = await this.documentRepository.create({
  //       entityId: order.id,
  //       entityType: "customer",
  //       purposeId: null,
  //       document_type_id: documentType.id,
  //       document_name: fileName,
  //       documentUrl: {
  //         url: maskedUrl, // Save the masked URL instead of the signed URL
  //         mimeType,
  //         size: buffer.length,
  //         uploadedAt: new Date().toISOString(),
  //       },
  //       isUploaded: true,
  //     });
  
  //     return {
  //       message: merge_doc ? "File merged successfully" : "File replaced successfully",
  //       document_id: document.documentId,
  //       document_url: maskedUrl,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(`Upload error: ${error.message}`);
  //   }
  // }
  
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


  // async mergeFilesByFolder(folderName: string) {
  //   const prefix = `${folderName}/`;
  //   const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB in bytes
  
  //   const listParams = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //     Prefix: prefix,
  //   };
  
  //   try {
  //     const response = await this.s3.send(new ListObjectsV2Command(listParams));
  //     const files = response.Contents || [];
  
  //     if (!files.length) {
  //       throw new BadRequestException(
  //         `No files found in folder: ${folderName}`
  //       );
  //     }
  
  //     const mergedFiles = files.filter(
  //       (file) => file.Key.includes("merged_") && file.Key.endsWith(".pdf")
  //     );
  //     for (const mergedFile of mergedFiles) {
  //       const deleteParams = {
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedFile.Key,
  //       };
  //       await this.s3.send(new DeleteObjectCommand(deleteParams));
  //       console.log(`Deleted old merged file: ${mergedFile.Key}`);
  //     }
  
  //     const filesToMerge = files.filter(
  //       (file) => !file.Key.includes("merged_") && file.Key.endsWith(".pdf")
  //     );
  //     if (!filesToMerge.length) {
  //       throw new BadRequestException(
  //         `No non-merged PDF files found to merge in folder: ${folderName}`
  //       );
  //     }
  
  //     const mergedPdf = await PDFDocument.create();
  //     const pageGroups: PDFDocument[] = [mergedPdf];
  //     let currentPdf = mergedPdf;
  
  //     for (const file of filesToMerge) {
  //       const signedUrl = await getSignedUrl(
  //         this.s3,
  //         new GetObjectCommand({
  //           Bucket: process.env.AWS_S3_BUCKET_NAME,
  //           Key: file.Key,
  //         }),
  //         { expiresIn: 3600 }
  //       );
  
  //       try {
  //         const response = await axios.get(signedUrl, {
  //           responseType: "arraybuffer",
  //           headers: { "User-Agent": "Mozilla/5.0" },
  //         });
  //         const fileData = response.data;
  
  //         const subPdf = await PDFDocument.load(fileData).catch(() => null);
  //         if (subPdf) {
  //           const copiedPages = await currentPdf.copyPages(
  //             subPdf,
  //             subPdf.getPageIndices()
  //           );
  //           copiedPages.forEach((page) => currentPdf.addPage(page));
  
  //           const tempBytes = await this.optimizePdf(currentPdf);
  //           if (tempBytes.length > MAX_SIZE_BYTES) {
  //             currentPdf = await PDFDocument.create();
  //             const newCopiedPages = await currentPdf.copyPages(
  //               subPdf,
  //               subPdf.getPageIndices()
  //             );
  //             newCopiedPages.forEach((page) => currentPdf.addPage(page));
  //             pageGroups.push(currentPdf);
  //           }
  //         }
  //       } catch (err) {
  //         console.error(`Error processing ${file.Key}:`, err.message);
  //       }
  //     }
  
  //     if (pageGroups.every((pdf) => pdf.getPageCount() === 0)) {
  //       throw new InternalServerErrorException(
  //         `No valid PDFs found to merge in folder: ${folderName}`
  //       );
  //     }
  
  //     const results: { file_url: string; size_mb: string; s3Key: string }[] = [];
  //     for (let i = 0; i < pageGroups.length; i++) {
  //       const optimizedBytes = await this.optimizePdf(pageGroups[i]);
  //       if (optimizedBytes.length > MAX_SIZE_BYTES) {
  //         throw new InternalServerErrorException(
  //           `Could not optimize part ${i + 1} below 4MB. Size: ${(
  //             optimizedBytes.length /
  //             (1024 * 1024)
  //           ).toFixed(2)}MB`
  //         );
  //       }
  
  //       const mergedFileName = `merged_${Date.now()}_part${i + 1}.pdf`;
  //       const mergedKey = `${prefix}${mergedFileName}`;
  
  //       const uploadParams = {
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedKey,
  //         Body: optimizedBytes,
  //         ContentType: "application/pdf",
  //       };
  
  //       await this.s3.send(new PutObjectCommand(uploadParams));
  
  //       const maskedUrl = `${this.baseUrl}/documents/${folderName}/${mergedFileName}`;
  
  //       results.push({
  //         file_url: maskedUrl,
  //         size_mb: (optimizedBytes.length / (1024 * 1024)).toFixed(2),
  //         s3Key: mergedKey, // Return the s3Key here
  //       });
  //     }
  
  //     return {
  //       message: `Merged PDF split into ${results.length} parts, all uploaded successfully.`,
  //       files: results,
  //     };
  //   } catch (error) {
  //     if (
  //       error instanceof BadRequestException ||
  //       error instanceof InternalServerErrorException
  //     ) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       `Error merging files: ${error.message}`
  //     );
  //   }
  // }
  

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


  async uploadDocumentByOrderId(
    partner_order_id: string,
    document_type_id: string,
    base64File: string,
    merge_doc: boolean = false // ✅ Default: false
  ) {
    // 1️⃣ Check if the order exists
    const order = await this.orderRepository.findOne({ where: { partner_order_id } });
    if (!order) {
      throw new BadRequestException(`Order ID ${partner_order_id} not found`);
    }
  
    // 2️⃣ Validate document_type_id
    const documentType = await this.documentTypeRepository.findOne({ where: { hashed_key: document_type_id } });
    if (!documentType) {
      throw new BadRequestException(`Invalid document_type_id: ${document_type_id}`);
    }
  
    // 3️⃣ Validate and Extract base64 Data
    function isValidBase64(str: string): boolean {
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
    }
  
    if (!isValidBase64(base64File)) {
      throw new BadRequestException("Invalid Base64 encoding. Ensure it's properly formatted.");
    }
  
    let mimeType: string;
    let base64Data: string;
  
    const fileMatch = base64File.match(/^data:(image\/jpeg|image\/jpg|image\/png|application\/pdf);base64,(.+)$/);
  
    if (fileMatch) {
      mimeType = fileMatch[1];
      base64Data = fileMatch[2];
    } else {
      base64Data = base64File;
      const magicNumbers: Record<string, string> = {
        "JVBERi0": "application/pdf",
        "/9j/": "image/jpeg",
        "iVBORw": "image/png",
      };
      mimeType = Object.entries(magicNumbers).find(([magic]) => base64Data.startsWith(magic))?.[1];
  
      if (!mimeType) {
        throw new BadRequestException("Invalid base64 format. Only JPEG, JPG, PNG, and PDF files are allowed.");
      }
    }
  
    let buffer = Buffer.from(base64Data, "base64");
  
    // 4️⃣ Validate file size (Max: 1 MB)
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
    if (buffer.length > MAX_SIZE_BYTES) {
      throw new BadRequestException(`File size must be less than or equal to 1MB.`);
    }
  
    // 5️⃣ Check if a document with the same type already exists
    const existingDocument = await this.documentRepository.findOne({
      where: { entityId: order.id, document_type_id: documentType.id },
    });
  
    if (existingDocument) {
      console.log('Existing docs found')
      const existingFileKey = existingDocument.documentUrl.url.split(`${process.env.AWS_S3_BUCKET_NAME}/`)[1];
      
      console.log(existingFileKey)
      try {
        // ✅ Delete the old file (regardless of `merge_doc`)
        await this.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: existingFileKey }));
      } catch (error) {
        console.warn(`⚠️ Warning: Failed to delete old file from S3: ${error.message}`);
      }
  
      // ✅ Delete existing document record
      await this.documentRepository.destroy({ where: { documentId: existingDocument.documentId } });
    }
  
    if (merge_doc) {
      // ✅ Merge document logic
      console.log("🔄 Merging documents...");
  
      // Merge files from S3 folder
      const mergeResult = await this.mergeFilesByFolder(partner_order_id);
  
      // Ensure that mergeResult returns the S3 Key of the merged file
      if (mergeResult.files && mergeResult.files.length > 0) {
        buffer = Buffer.from(mergeResult.files[0].s3Key); // Use the merged file buffer
        mimeType = "application/pdf"; // Ensure mimeType is PDF after merging
      } else {
        throw new InternalServerErrorException("Merged file could not be processed correctly.");
      }
    }
  
    // 6️⃣ Upload the new (or merged) file to S3
    const folderName = partner_order_id;
    const fileExtension = mimeType.split("/")[1];
    const fileName = merge_doc
      ? `merge_document_${partner_order_id}.pdf` // ✅ Use this name for merged files
      : `${partner_order_id}_${document_type_id}.${fileExtension}`;
  
    const key = `${folderName}/${fileName}`;
  
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    };
  
    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
  
      // 7️⃣ Generate Signed URL (for internal use)
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }),
        { expiresIn: 3600 }
      );
  
      // 8️⃣ Create a masked URL
      const maskedUrl = signedUrl;
  
      // 9️⃣ Save new document details in the database
      const document = await this.documentRepository.create({
        entityId: order.id,
        entityType: "customer",
        purposeId: null,
        document_type_id: documentType.id,
        document_name: fileName,
        documentUrl: {
          url: maskedUrl, // Save the masked URL instead of the signed URL
          mimeType,
          size: buffer.length,
          uploadedAt: new Date().toISOString(),
        },
        isUploaded: true,
      });
  
      return {
        message: merge_doc ? "File merged successfully" : "File replaced successfully",
        document_id: document.documentId,
        document_url: maskedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Upload error: ${error.message}`);
    }
  }
  async mergeFilesByFolder(folderName: string) {
    const prefix = `${folderName}/`;
    const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB in bytes
  
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    };
  
    try {
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];
  
      if (!files.length) {
        throw new BadRequestException(
          `No files found in folder: ${folderName}`
        );
      }
  
      const mergedFiles = files.filter(
        (file) => file.Key.includes("merged_") && file.Key.endsWith(".pdf")
      );
      for (const mergedFile of mergedFiles) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedFile.Key,
        };
        await this.s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted old merged file: ${mergedFile.Key}`);
      }
  
      const filesToMerge = files.filter(
        (file) => !file.Key.includes("merged_") && file.Key.endsWith(".pdf")
      );
      if (!filesToMerge.length) {
        throw new BadRequestException(
          `No non-merged PDF files found to merge in folder: ${folderName}`
        );
      }
  
      const mergedPdf = await PDFDocument.create();
      const pageGroups: PDFDocument[] = [mergedPdf];
      let currentPdf = mergedPdf;
  
      for (const file of filesToMerge) {
        const signedUrl = await getSignedUrl(
          this.s3,
          new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.Key,
          }),
          { expiresIn: 3600 }
        );
  
        try {
          const response = await axios.get(signedUrl, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0" },
          });
          const fileData = response.data;
  
          const subPdf = await PDFDocument.load(fileData).catch(() => null);
          if (subPdf) {
            const copiedPages = await currentPdf.copyPages(
              subPdf,
              subPdf.getPageIndices()
            );
            copiedPages.forEach((page) => currentPdf.addPage(page));
  
            const tempBytes = await this.optimizePdf(currentPdf);
            if (tempBytes.length > MAX_SIZE_BYTES) {
              currentPdf = await PDFDocument.create();
              const newCopiedPages = await currentPdf.copyPages(
                subPdf,
                subPdf.getPageIndices()
              );
              newCopiedPages.forEach((page) => currentPdf.addPage(page));
              pageGroups.push(currentPdf);
            }
          }
        } catch (err) {
          console.error(`Error processing ${file.Key}:`, err.message);
        }
      }
  
      if (pageGroups.every((pdf) => pdf.getPageCount() === 0)) {
        throw new InternalServerErrorException(
          `No valid PDFs found to merge in folder: ${folderName}`
        );
      }
  
      const results: { file_url: string; size_mb: string; s3Key: string }[] = [];
      for (let i = 0; i < pageGroups.length; i++) {
        const optimizedBytes = await this.optimizePdf(pageGroups[i]);
        if (optimizedBytes.length > MAX_SIZE_BYTES) {
          throw new InternalServerErrorException(
            `Could not optimize part ${i + 1} below 4MB. Size: ${(
              optimizedBytes.length /
              (1024 * 1024)
            ).toFixed(2)}MB`
          );
        }
  
        const mergedFileName = `merged_${Date.now()}_part${i + 1}.pdf`;
        const mergedKey = `${prefix}${mergedFileName}`;
  
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedKey,
          Body: optimizedBytes,
          ContentType: "application/pdf",
        };
  
        await this.s3.send(new PutObjectCommand(uploadParams));
  
        const maskedUrl = `${this.baseUrl}/documents/${folderName}/${mergedFileName}`;
  
        results.push({
          file_url: maskedUrl,
          size_mb: (optimizedBytes.length / (1024 * 1024)).toFixed(2),
          s3Key: mergedKey, // Return the s3Key here
        });
      }
  
      return {
        message: `Merged PDF split into ${results.length} parts, all uploaded successfully.`,
        files: results,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error merging files: ${error.message}`
      );
    }
  }
    
}
