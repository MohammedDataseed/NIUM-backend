// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { PDFDocument } from 'pdf-lib';
// import { HttpService } from '@nestjs/axios';
// import { lastValueFrom } from 'rxjs';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class PdfService {
//   constructor(private readonly httpService: HttpService) {}

//   // Fetch PDF file from a URL
//   async fetchFile(url: string): Promise<Buffer | null> {
//     try {
//       const response = await lastValueFrom(
//         this.httpService.get(url, {
//           responseType: 'arraybuffer',
//           headers: { 'User-Agent': 'Mozilla/5.0' },
//         }),
//       );
//       return Buffer.from(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${url}:`, error.message);
//       return null;
//     }
//   }

//   // Decode Base64 PDF content correctly
//   async decodeBase64PDF(base64String: string): Promise<Buffer | null> {
//     try {
//       base64String = base64String.replace(/\s/g, ''); // Remove spaces/newlines
//       const buffer = Buffer.from(base64String, 'base64');

//       // Check if it starts with "%PDF"
//       if (buffer.toString('utf-8', 0, 4) !== '%PDF') {
//         throw new Error('Invalid PDF content');
//       }

//       return buffer;
//     } catch (error) {
//       console.error('Error decoding Base64 PDF:', error.message);
//       return null;
//     }
//   }

//   // Merge multiple PDFs
//   async mergeDocuments(documents: Record<string, string>[]): Promise<string> {
//     const mergedPdf = await PDFDocument.create();

//     for (const doc of documents) {
//       for (const key in doc) {
//         let fileData: Buffer | null = null;

//         if (doc[key].startsWith('https://storage.idfy.com') || doc[key].startsWith('https://res.cloudinary.com')) {
//           fileData = await this.decodeBase64PDF(doc[key]);
//         } else {
//           fileData = await this.fetchFile(doc[key]);
//         }

//         if (fileData) {
//           try {
//             const subPdf = await PDFDocument.load(fileData);
//             const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
//             copiedPages.forEach((page) => mergedPdf.addPage(page));
//           } catch (err) {
//             console.error(`Error processing ${key}:`, err.message);
//           }
//         }
//       }
//     }

//     // Ensure the dev-assets directory exists

//     const outputDir = path.join(__dirname, '../../../../src/dev-assets');
    
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir, { recursive: true });
//     }

//     // Save merged PDF file
//     const mergedPdfBytes = await mergedPdf.save();
//     const filename = `merged_${Date.now()}.pdf`;
//     const outputPath = path.join(outputDir, filename);

//     try {
//       fs.writeFileSync(outputPath, mergedPdfBytes);
//       console.log(`PDF saved at: ${outputPath}`);
//       return filename;
//     } catch (err) {
//       console.error(`Error saving PDF:`, err.message);
//       throw new InternalServerErrorException('Failed to save merged PDF');
//     }
//   }
// }


import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  constructor(private readonly httpService: HttpService) {}

  // Fetch PDF file from a URL
  async fetchFile(url: string): Promise<Buffer | null> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }),
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  }

  // Decode Base64 PDF content correctly
  async decodeBase64PDF(base64String: string): Promise<Buffer> {
    try {
      base64String = base64String.replace(/\s/g, ''); // Remove spaces/newlines
      const buffer = Buffer.from(base64String, 'base64');

      // Check if it starts with "%PDF"
      if (buffer.toString('utf-8', 0, 4) !== '%PDF') {
        throw new Error('Invalid PDF content');
      }

      return buffer;
    } catch (error) {
      console.error('Error decoding Base64 PDF:', error.message);
      throw new BadRequestException('Invalid Base64 PDF content'); // Stop execution
    }
  }

  // Merge multiple PDFs
  async mergeDocuments(documents: Record<string, string>[]): Promise<string> {
    const mergedPdf = await PDFDocument.create();

    for (const doc of documents) {
      for (const key in doc) {
        let fileData: Buffer | null = null;

        try {
          if (doc[key].startsWith('https://storage.idfy.com') || doc[key].startsWith('https://res.cloudinary.com')) {
            fileData = await this.decodeBase64PDF(doc[key]); // Throws error if invalid
          } else {
            fileData = await this.fetchFile(doc[key]);
          }
        } catch (error) {
          throw new BadRequestException(`Error processing document ${key}: ${error.message}`);
        }

        if (fileData) {
          try {
            const subPdf = await PDFDocument.load(fileData);
            const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } catch (err) {
            console.error(`Error processing ${key}:`, err.message);
            throw new InternalServerErrorException(`Failed to process PDF: ${key}`);
          }
        }
      }
    }

    // Ensure the dev-assets directory exists
    const outputDir = path.join(__dirname, '../../../../src/dev-assets');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save merged PDF file
    const mergedPdfBytes = await mergedPdf.save();
    const filename = `merged_${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);

    try {
      fs.writeFileSync(outputPath, mergedPdfBytes);
      console.log(`PDF saved at: ${outputPath}`);
      return filename;
    } catch (err) {
      console.error(`Error saving PDF:`, err.message);
      throw new InternalServerErrorException('Failed to save merged PDF');
    }
  }
}
