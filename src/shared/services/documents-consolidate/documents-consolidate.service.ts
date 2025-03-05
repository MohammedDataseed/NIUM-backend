// documents-consolidate.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
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
        { expiresIn: 3600 } // URL expires in 1 hour
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
    const prefix = `${folderName}/`; // Folder prefix in S3

    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    };

    try {
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];

      // Generate signed URLs for each file
      const fileList = await Promise.all(
        files.map(async (file) => {
          const signedUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: file.Key,
            }),
            { expiresIn: 3600 } // URL expires in 1 hour
          );
          return {
            name: file.Key.replace(prefix, ''), // Remove folder prefix from name
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
      // ACL removed
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      return {
        message: 'Merged PDF uploaded successfully!',
        file_url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
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

      const base64String = response.data.trim().replace(/[^A-Za-z0-9+/=]/g, '');
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