//documents-consolidate.service.ts

import { Injectable, BadRequestException, InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

@Injectable()
export class PdfService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
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
        { expiresIn: 3600 }
      );
      return {
        message: 'File uploaded successfully.',
        file_url: signedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Upload error: ${error.message}`);
    }
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
      throw new InternalServerErrorException(`Error listing files: ${error.message}`);
    }
  }

  async mergeFilesByFolder(folderName: string) {
    const prefix = `${folderName}/`;

    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    };

    try {
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];

      if (!files.length) {
        throw new BadRequestException(`No files found in folder: ${folderName}`);
      }

      const mergedFiles = files.filter(file => file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
      for (const mergedFile of mergedFiles) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedFile.Key,
        };
        await this.s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted old merged file: ${mergedFile.Key}`);
      }

      const filesToMerge = files.filter(file => !file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
      if (!filesToMerge.length) {
        throw new BadRequestException(`No non-merged PDF files found to merge in folder: ${folderName}`);
      }

      const mergedPdf = await PDFDocument.create();

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
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          const fileData = response.data;

          const subPdf = await PDFDocument.load(fileData).catch(() => null);
          if (subPdf) {
            const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
        } catch (err) {
          console.error(`Error processing ${file.Key}:`, err.message);
        }
      }

      if (mergedPdf.getPageCount() === 0) {
        throw new InternalServerErrorException(`No valid PDFs found to merge in folder: ${folderName}`);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const mergedFileName = `merged_${Date.now()}.pdf`;
      const mergedKey = `${prefix}${mergedFileName}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: mergedKey,
        Body: mergedPdfBytes,
        ContentType: 'application/pdf',
      };

      await this.s3.send(new PutObjectCommand(uploadParams));
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedKey,
        }),
        { expiresIn: 3600 }
      );

      return {
        message: 'Merged PDF uploaded successfully.',
        file_url: signedUrl,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error merging files: ${error.message}`);
    }
  }

  async updateFile(buffer: Buffer, oldFileKey: string, newFileKey: string, contentType: string = 'application/pdf') {
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
      throw new InternalServerErrorException(`Error checking file existence: ${error.message}`);
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
      throw new InternalServerErrorException(`Error checking file existence: ${error.message}`);
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

  async mergeAndUploadPDF(documents: any[], clientName: string, folderName: string) {
    if (!documents || !Array.isArray(documents)) {
      throw new BadRequestException('Invalid input format. "documents" must be an array.');
    }
    if (!clientName || typeof clientName !== 'string' || !clientName.trim()) {
      throw new BadRequestException('Client name is required.');
    }

    const sanitizedClientName = clientName.trim().replace(/\s+/g, '_');
    const mergedPdfBytes = await this.mergeDocuments(documents);
    const filename = `merged_${sanitizedClientName}_${Date.now()}.pdf`;
    const key = `${folderName}/${filename}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: mergedPdfBytes,
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
        { expiresIn: 3600 }
      );
      return {
        message: 'Merged PDF uploaded successfully!',
        file_url: signedUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error uploading merged PDF: ${error.message}`);
    }
  }

  private async mergeDocuments(documents: any[]) {
    const mergedPdf = await PDFDocument.create();

    for (const doc of documents) {
      for (const key in doc) {
        let fileData = null;

        if (
          doc[key].startsWith('https://storage.idfy.com') ||
          doc[key].startsWith('https://res.cloudinary.com')
        ) {
          fileData = await this.decodeBase64PDF(doc[key]);
        } else {
          fileData = await this.fetchFile(doc[key]);
        }

        if (fileData) {
          try {
            const subPdf = await PDFDocument.load(fileData).catch(() => null);
            if (subPdf) {
              const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
              copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
          } catch (err) {
            console.error(`Error processing ${key}:`, err.message);
          }
        }
      }
    }

    return await mergedPdf.save();
  }

  private async fetchFile(url: string) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  }

  private async decodeBase64PDF(url: string) {
    try {
      const response = await axios.get(url, {
        responseType: 'text',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const base64String = response.data.trim().replace(/[^a-zA-Z0-9+/=]/g, '');
      if (base64String.startsWith('JVBERi0x')) {
        return Buffer.from(base64String, 'base64');
      } else {
        throw new Error('Invalid Base64 content');
      }
    } catch (error) {
      console.error(`Error decoding Base64 PDF from ${url}:`, error.message);
      return null;
    }
  }

 
}