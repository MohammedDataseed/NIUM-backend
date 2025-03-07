//documents-consolidate.service.ts

import { Injectable, BadRequestException, InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFDocument, PDFName, PDFObject, PDFDict, PDFRawStream } from 'pdf-lib';
import axios from 'axios';
import { Request, Response } from 'express'; // Import Express and types

@Injectable()
export class PdfService {
  private readonly s3: S3Client;
  private baseUrl = 'http://localhost:3002'; // Replace with your actual domain

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

  // async mergeFilesByFolder(folderName: string) {
  //   const prefix = `${folderName}/`;

  //   const listParams = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //     Prefix: prefix,
  //   };

  //   try {
  //     const response = await this.s3.send(new ListObjectsV2Command(listParams));
  //     const files = response.Contents || [];

  //     if (!files.length) {
  //       throw new BadRequestException(`No files found in folder: ${folderName}`);
  //     }

  //     const mergedFiles = files.filter(file => file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
  //     for (const mergedFile of mergedFiles) {
  //       const deleteParams = {
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedFile.Key,
  //       };
  //       await this.s3.send(new DeleteObjectCommand(deleteParams));
  //       console.log(`Deleted old merged file: ${mergedFile.Key}`);
  //     }

  //     const filesToMerge = files.filter(file => !file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
  //     if (!filesToMerge.length) {
  //       throw new BadRequestException(`No non-merged PDF files found to merge in folder: ${folderName}`);
  //     }

  //     const mergedPdf = await PDFDocument.create();

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
  //           responseType: 'arraybuffer',
  //           headers: { 'User-Agent': 'Mozilla/5.0' },
  //         });
  //         const fileData = response.data;

  //         const subPdf = await PDFDocument.load(fileData).catch(() => null);
  //         if (subPdf) {
  //           const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
  //           copiedPages.forEach((page) => mergedPdf.addPage(page));
  //         }
  //       } catch (err) {
  //         console.error(`Error processing ${file.Key}:`, err.message);
  //       }
  //     }

  //     if (mergedPdf.getPageCount() === 0) {
  //       throw new InternalServerErrorException(`No valid PDFs found to merge in folder: ${folderName}`);
  //     }

  //     const mergedPdfBytes = await mergedPdf.save();
  //     const mergedFileName = `merged_${Date.now()}.pdf`;
  //     const mergedKey = `${prefix}${mergedFileName}`;

  //     const uploadParams = {
  //       Bucket: process.env.AWS_S3_BUCKET_NAME,
  //       Key: mergedKey,
  //       Body: mergedPdfBytes,
  //       ContentType: 'application/pdf',
  //     };

  //     await this.s3.send(new PutObjectCommand(uploadParams));
  //     const signedUrl = await getSignedUrl(
  //       this.s3,
  //       new GetObjectCommand({
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedKey,
  //       }),
  //       { expiresIn: 3600 }
  //     );

  //     return {
  //       message: 'Merged PDF uploaded successfully.',
  //       file_url: signedUrl,
  //     };
  //   } catch (error) {
  //     if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(`Error merging files: ${error.message}`);
  //   }
  // }

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
  //       throw new BadRequestException(`No files found in folder: ${folderName}`);
  //     }

  //     // Delete existing merged files
  //     const mergedFiles = files.filter(file => file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
  //     for (const mergedFile of mergedFiles) {
  //       const deleteParams = {
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedFile.Key,
  //       };
  //       await this.s3.send(new DeleteObjectCommand(deleteParams));
  //       console.log(`Deleted old merged file: ${mergedFile.Key}`);
  //     }

  //     const filesToMerge = files.filter(file => !file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
  //     if (!filesToMerge.length) {
  //       throw new BadRequestException(`No non-merged PDF files found to merge in folder: ${folderName}`);
  //     }

  //     const mergedPdf = await PDFDocument.create();

  //     // First, merge all files without compression
  //     for (const file of filesToMerge) {
  //       const signedUrl = await getSignedUrl(
  //         this.s3,
  //         new GetObjectCommand({
  //           Bucket: process.env.AWS_S3_BUCKET_NAME,
  //           Key: file.Key,
  //         }),
  //         { expiresIn: 7200 }
  //       );

  //       try {
  //         const response = await axios.get(signedUrl, {
  //           responseType: 'arraybuffer',
  //           headers: { 'User-Agent': 'Mozilla/5.0' },
  //         });
  //         const fileData = response.data;

  //         const subPdf = await PDFDocument.load(fileData).catch(() => null);
  //         if (subPdf) {
  //           const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
  //           copiedPages.forEach((page) => mergedPdf.addPage(page));
  //         }
  //       } catch (err) {
  //         console.error(`Error processing ${file.Key}:`, err.message);
  //       }
  //     }

  //     if (mergedPdf.getPageCount() === 0) {
  //       throw new InternalServerErrorException(`No valid PDFs found to merge in folder: ${folderName}`);
  //     }

  //     let mergedPdfBytes = await mergedPdf.save();
      
  //     // Compression logic
  //     if (mergedPdfBytes.length > MAX_SIZE_BYTES) {
  //       console.log('Initial size exceeds 4MB, applying compression...');
  //       let compressionLevel = 0.9; // Start with 90% quality
        
  //       while (mergedPdfBytes.length > MAX_SIZE_BYTES && compressionLevel > 0.1) {
  //         const compressedPdf = await PDFDocument.load(mergedPdfBytes);
  //         const pages = compressedPdf.getPages();

  //         for (const page of pages) {
  //           // This is a simplified compression approach
  //           // In practice, you'd need to handle images specifically
  //           const scaleFactor = compressionLevel;
  //           page.scale(scaleFactor, scaleFactor);
  //         }

  //         mergedPdfBytes = await compressedPdf.save({
  //           useObjectStreams: true,
  //           updateFieldAppearances: false
  //         });
          
  //         compressionLevel -= 0.1; // Reduce quality by 10% each iteration
  //         console.log(`Compressed to ${(mergedPdfBytes.length / (1024 * 1024)).toFixed(2)}MB at ${compressionLevel * 100}% quality`);
  //       }

  //       if (mergedPdfBytes.length > MAX_SIZE_BYTES) {
  //         throw new InternalServerErrorException(
  //           `Could not compress PDF below 4MB. Final size: ${(mergedPdfBytes.length / (1024 * 1024)).toFixed(2)}MB`
  //         );
  //       }
  //     }

  //     const mergedFileName = `merged_${Date.now()}.pdf`;
  //     const mergedKey = `${prefix}${mergedFileName}`;

  //     const uploadParams = {
  //       Bucket: process.env.AWS_S3_BUCKET_NAME,
  //       Key: mergedKey,
  //       Body: mergedPdfBytes,
  //       ContentType: 'application/pdf',
  //     };

  //     await this.s3.send(new PutObjectCommand(uploadParams));
  //     const signedUrl = await getSignedUrl(
  //       this.s3,
  //       new GetObjectCommand({
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: mergedKey,
  //       }),
  //       { expiresIn: 3600 }
  //     );

  //     return {
  //       message: 'Merged PDF uploaded successfully.',
  //       file_url: signedUrl,
  //       size_mb: (mergedPdfBytes.length / (1024 * 1024)).toFixed(2)
  //     };
  //   } catch (error) {
  //     if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(`Error merging files: ${error.message}`);
  //   }
  // }

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
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          const fileData = response.data;

          const subPdf = await PDFDocument.load(fileData).catch(() => null);
          if (subPdf) {
            const copiedPages = await currentPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach((page) => currentPdf.addPage(page));

            const tempBytes = await this.optimizePdf(currentPdf);
            if (tempBytes.length > MAX_SIZE_BYTES) {
              currentPdf = await PDFDocument.create();
              const newCopiedPages = await currentPdf.copyPages(subPdf, subPdf.getPageIndices());
              newCopiedPages.forEach((page) => currentPdf.addPage(page));
              pageGroups.push(currentPdf);
            }
          }
        } catch (err) {
          console.error(`Error processing ${file.Key}:`, err.message);
        }
      }

      if (pageGroups.every(pdf => pdf.getPageCount() === 0)) {
        throw new InternalServerErrorException(`No valid PDFs found to merge in folder: ${folderName}`);
      }

      const results: { file_url: string; size_mb: string; s3Key: string }[] = [];
      for (let i = 0; i < pageGroups.length; i++) {
        const optimizedBytes = await this.optimizePdf(pageGroups[i]);
        if (optimizedBytes.length > MAX_SIZE_BYTES) {
          throw new InternalServerErrorException(
            `Could not optimize part ${i + 1} below 4MB. Size: ${(optimizedBytes.length / (1024 * 1024)).toFixed(2)}MB`
          );
        }

        const mergedFileName = `merged_${Date.now()}_part${i + 1}.pdf`;
        const mergedKey = `${prefix}${mergedFileName}`;

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedKey,
          Body: optimizedBytes,
          ContentType: 'application/pdf',
        };

        await this.s3.send(new PutObjectCommand(uploadParams));

        const maskedUrl = `${this.baseUrl}/documents/${folderName}/${mergedFileName}`;

        results.push({
          file_url: maskedUrl,
          size_mb: (optimizedBytes.length / (1024 * 1024)).toFixed(2),
          s3Key: mergedKey,
        });
      }

      return {
        message: `Merged PDF split into ${results.length} parts, all uploaded successfully.`,
        files: results.map(result => ({
          file_url: result.file_url,
          size_mb: result.size_mb,
        })),
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error merging files: ${error.message}`);
    }
  }

  async optimizePdf(pdfDoc: PDFDocument, aggressive: boolean = false): Promise<Uint8Array> {
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
          contentStream.dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
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
      { expiresIn: 3600 }
    );

    const response = await axios.get(signedUrl, {
      responseType: 'stream',
    });

    return response.data; // Stream to be piped in your HTTP response
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

 
}

// import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { PDFDocument, PDFName, PDFObject, PDFDict, PDFRawStream } from 'pdf-lib';
// import axios from 'axios';

// @Injectable()
// export class PdfService {
//   private readonly s3: S3Client;
//   private baseUrl = 'http://localhost:3002'; // Replace with your actual domain (e.g., https://yourwebsite.com)

//   constructor() {
//     this.s3 = new S3Client({
//       region: process.env.AWS_REGION,
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       },
//     });
//   }

//   async uploadFile(buffer: Buffer, originalName: string, folderName: string) {
//     const folder = folderName ? `${folderName}/` : '';
//     const fileName = `${Date.now()}_${originalName}`;
//     const key = `${folder}${fileName}`;

//     const uploadParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: key,
//       Body: buffer,
//       ContentType: 'application/pdf',
//     };

//     try {
//       await this.s3.send(new PutObjectCommand(uploadParams));
//       const maskedUrl = `${this.baseUrl}/documents/${folderName}/${fileName}`;
//       return {
//         message: 'File uploaded successfully.',
//         file_url: maskedUrl,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(`Upload error: ${error.message}`);
//     }
//   }

//   async listFilesByFolder(folderName: string) {
//     const prefix = `${folderName}/`;

//     const listParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Prefix: prefix,
//     };

//     try {
//       const response = await this.s3.send(new ListObjectsV2Command(listParams));
//       const files = response.Contents || [];

//       const fileList = files.map((file) => {
//         const fileName = file.Key.replace(prefix, '');
//         return {
//           name: fileName,
//           signed_url: `${this.baseUrl}/documents/${folderName}/${fileName}`, // Masked URL
//         };
//       });

//       return {
//         order_id: folderName,
//         files: fileList,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(`Error listing files: ${error.message}`);
//     }
//   }

//   async mergeFilesByFolder(folderName: string) {
//     const prefix = `${folderName}/`;
//     const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB in bytes

//     const listParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Prefix: prefix,
//     };

//     try {
//       const response = await this.s3.send(new ListObjectsV2Command(listParams));
//       const files = response.Contents || [];

//       if (!files.length) {
//         throw new BadRequestException(`No files found in folder: ${folderName}`);
//       }

//       const mergedFiles = files.filter(file => file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
//       for (const mergedFile of mergedFiles) {
//         const deleteParams = {
//           Bucket: process.env.AWS_S3_BUCKET_NAME,
//           Key: mergedFile.Key,
//         };
//         await this.s3.send(new DeleteObjectCommand(deleteParams));
//         console.log(`Deleted old merged file: ${mergedFile.Key}`);
//       }

//       const filesToMerge = files.filter(file => !file.Key.includes('merged_') && file.Key.endsWith('.pdf'));
//       if (!filesToMerge.length) {
//         throw new BadRequestException(`No non-merged PDF files found to merge in folder: ${folderName}`);
//       }

//       const mergedPdf = await PDFDocument.create();
//       const pageGroups: PDFDocument[] = [mergedPdf];
//       let currentPdf = mergedPdf;

//       for (const file of filesToMerge) {
//         const signedUrl = await getSignedUrl(
//           this.s3,
//           new GetObjectCommand({
//             Bucket: process.env.AWS_S3_BUCKET_NAME,
//             Key: file.Key,
//           }),
//           { expiresIn: 3600 }
//         );

//         try {
//           const response = await axios.get(signedUrl, {
//             responseType: 'arraybuffer',
//             headers: { 'User-Agent': 'Mozilla/5.0' },
//           });
//           const fileData = response.data;

//           const subPdf = await PDFDocument.load(fileData).catch(() => null);
//           if (subPdf) {
//             const copiedPages = await currentPdf.copyPages(subPdf, subPdf.getPageIndices());
//             copiedPages.forEach((page) => currentPdf.addPage(page));

//             const tempBytes = await this.optimizePdf(currentPdf);
//             if (tempBytes.length > MAX_SIZE_BYTES) {
//               currentPdf = await PDFDocument.create();
//               const newCopiedPages = await currentPdf.copyPages(subPdf, subPdf.getPageIndices());
//               newCopiedPages.forEach((page) => currentPdf.addPage(page));
//               pageGroups.push(currentPdf);
//             }
//           }
//         } catch (err) {
//           console.error(`Error processing ${file.Key}:`, err.message);
//         }
//       }

//       if (pageGroups.every(pdf => pdf.getPageCount() === 0)) {
//         throw new InternalServerErrorException(`No valid PDFs found to merge in folder: ${folderName}`);
//       }

//       const results: { file_url: string; size_mb: string; s3Key: string }[] = [];
//       for (let i = 0; i < pageGroups.length; i++) {
//         const optimizedBytes = await this.optimizePdf(pageGroups[i]);
//         if (optimizedBytes.length > MAX_SIZE_BYTES) {
//           throw new InternalServerErrorException(
//             `Could not optimize part ${i + 1} below 4MB. Size: ${(optimizedBytes.length / (1024 * 1024)).toFixed(2)}MB`
//           );
//         }

//         const mergedFileName = `merged_${Date.now()}_part${i + 1}.pdf`;
//         const mergedKey = `${prefix}${mergedFileName}`;

//         const uploadParams = {
//           Bucket: process.env.AWS_S3_BUCKET_NAME,
//           Key: mergedKey,
//           Body: optimizedBytes,
//           ContentType: 'application/pdf',
//         };

//         await this.s3.send(new PutObjectCommand(uploadParams));

//         const maskedUrl = `${this.baseUrl}/documents/${folderName}/${mergedFileName}`;

//         results.push({
//           file_url: maskedUrl,
//           size_mb: (optimizedBytes.length / (1024 * 1024)).toFixed(2),
//           s3Key: mergedKey,
//         });
//       }

//       return {
//         message: `Merged PDF split into ${results.length} parts, all uploaded successfully.`,
//         files: results.map(result => ({
//           file_url: result.file_url,
//           size_mb: result.size_mb,
//         })),
//       };
//     } catch (error) {
//       if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(`Error merging files: ${error.message}`);
//     }
//   }

//   async optimizePdf(pdfDoc: PDFDocument, aggressive: boolean = false): Promise<Uint8Array> {
//     const pages = pdfDoc.getPages();
//     for (const page of pages) {
//       const pageNode = page.node;
//       pageNode.delete(PDFName.of('UserUnit'));
//       pageNode.delete(PDFName.of('Annots'));

//       const contentStream = pageNode.get(PDFName.of('Contents'));
//       if (contentStream) {
//         if (Array.isArray(contentStream)) {
//           for (const stream of contentStream) {
//             if (stream instanceof PDFRawStream) {
//               stream.dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
//             }
//           }
//         } else if (contentStream instanceof PDFRawStream) {
//           contentStream.dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
//         }
//       }
//     }

//     const fontCache = new Map<string, PDFObject>();
//     for (const page of pages) {
//       const resources = page.node.Resources();
//       if (resources && resources.has(PDFName.of('Font'))) {
//         const fonts = resources.lookup(PDFName.of('Font')) as PDFDict;
//         for (const [fontKey, fontRef] of fonts.entries()) {
//           const fontKeyStr = fontRef.toString();
//           if (fontCache.has(fontKeyStr)) {
//             fonts.set(fontKey, fontCache.get(fontKeyStr)!);
//           } else {
//             fontCache.set(fontKeyStr, fontRef);
//           }
//         }
//       }
//     }

//     const saveOptions: any = {
//       useObjectStreams: true,
//       updateFieldAppearances: false,
//       compress: true,
//     };

//     if (aggressive) {
//       saveOptions.addToCatalog = false;
//     }

//     return await pdfDoc.save(saveOptions);
//   }

//   async serveDocument(folderName: string, fileName: string) {
//     const s3Key = `${folderName}/${fileName}`;
//     const signedUrl = await getSignedUrl(
//       this.s3,
//       new GetObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: s3Key,
//       }),
//       { expiresIn: 3600 }
//     );

//     const response = await axios.get(signedUrl, {
//       responseType: 'stream',
//     });

//     return response.data; // Stream to be piped in your HTTP response
//   }

//   async updateFile(buffer: Buffer, oldFileKey: string, newFileKey: string, contentType: string = 'application/pdf') {
//     const headParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: oldFileKey,
//     };

//     try {
//       await this.s3.send(new HeadObjectCommand(headParams));
//     } catch (error) {
//       if (error.name === 'NotFound') {
//         throw new NotFoundException(`File not found: ${oldFileKey}`);
//       }
//       throw new InternalServerErrorException(`Error checking file existence: ${error.message}`);
//     }

//     const uploadParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: newFileKey,
//       Body: buffer,
//       ContentType: contentType,
//     };

//     try {
//       await this.s3.send(new PutObjectCommand(uploadParams));

//       if (newFileKey !== oldFileKey) {
//         const deleteParams = {
//           Bucket: process.env.AWS_S3_BUCKET_NAME,
//           Key: oldFileKey,
//         };
//         await this.s3.send(new DeleteObjectCommand(deleteParams));
//         console.log(`Deleted old file: ${oldFileKey}`);
//       }

//       const maskedUrl = `${this.baseUrl}/documents/${newFileKey.split('/')[0]}/${newFileKey.split('/')[1]}`;
//       return {
//         message: 'File updated successfully.',
//         file_url: maskedUrl,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(`Update error: ${error.message}`);
//     }
//   }

//   async deleteFile(fileKey: string) {
//     const headParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: fileKey,
//     };

//     try {
//       await this.s3.send(new HeadObjectCommand(headParams));
//     } catch (error) {
//       if (error.name === 'NotFound') {
//         throw new NotFoundException(`File not found: ${fileKey}`);
//       }
//       throw new InternalServerErrorException(`Error checking file existence: ${error.message}`);
//     }

//     const deleteParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: fileKey,
//     };

//     try {
//       await this.s3.send(new DeleteObjectCommand(deleteParams));
//       return {
//         message: 'File deleted successfully.',
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(`Delete error: ${error.message}`);
//     }
//   }
// }
