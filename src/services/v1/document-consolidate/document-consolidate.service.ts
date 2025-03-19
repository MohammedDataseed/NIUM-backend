import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as pdf from "html-pdf-node";


import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import axios from "axios";
import * as puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import * as sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from "@nestjs/config";
import { Buffer } from "buffer";
import { Order } from "src/database/models/order.model";
import { Documents } from "src/database/models/documents.model";
import { DocumentType } from "src/database/models/documentType.model";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

@Injectable()
export class PdfService {
  private readonly s3: S3Client;
  private readonly MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB limit
  private readonly TEMP_DIR = path.join(process.cwd(), "temp");

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
    if (!fs.existsSync(this.TEMP_DIR)) {
      fs.mkdirSync(this.TEMP_DIR, { recursive: true });
    }
  }

  async listFilesByFolder(folderName: string) {
    const prefix = `${folderName}/`;
    const listParams = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };

    try {
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];
      const fileList = await Promise.all(
        files.map(async (file) => {
          const signedUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: file.Key }),
            { expiresIn: 3600 }
          );
          return { name: file.Key.replace(prefix, ""), signed_url: signedUrl };
        })
      );
      return { order_id: folderName, files: fileList };
    } catch (error) {
      throw new InternalServerErrorException(`Error listing files: ${error.message}`);
    }
  }

  async uploadDocumentByOrderId(
    partner_order_id: string,
    document_type_id: string,
    base64File: string,
    merge_doc: boolean = false
  ) {
    const order = await this.orderRepository.findOne({ where: { partner_order_id } });
    if (!order) throw new BadRequestException(`Order ID ${partner_order_id} not found`);

    const documentType = await this.documentTypeRepository.findOne({
      where: { hashed_key: document_type_id },
    });
    if (!documentType) throw new BadRequestException(`Invalid document_type_id: ${document_type_id}`);

    function isValidBase64(str: string): boolean {
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
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

    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length > this.MAX_SIZE_BYTES) throw new BadRequestException("File size must be ≤ 1MB");

    const existingDocument = await this.documentRepository.findOne({
      where: { entityId: order.id, document_type_id: documentType.id },
    });

    if (existingDocument) {
      console.log("Existing docs found");
      const url = new URL(existingDocument.documentUrl.url);
      const existingFileKey = url.pathname.substring(1);
      await this.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: existingFileKey }));
      console.log(`Deleted ${existingFileKey} from S3`);
      await this.documentRepository.destroy({ where: { documentId: existingDocument.documentId } });
      console.log(`Deleted document ${existingDocument.documentId} from DB`);
    }

    const folderName = partner_order_id;
    const fileExtension = mimeType.split("/")[1];
    const individualFileName = `${partner_order_id}_${document_type_id}.${fileExtension}`;
    const individualKey = `${folderName}/${individualFileName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: individualKey,
        Body: buffer,
        ContentType: mimeType,
      })
    );
    const individualSignedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: individualKey }),
      { expiresIn: 3600 }
    );

    const document = await this.documentRepository.create({
      entityId: order.id,
      entityType: "customer",
      purposeId: null,
      document_type_id: documentType.id,
      document_name: individualFileName,
      documentUrl: { url: individualSignedUrl, mimeType, size: buffer.length, uploadedAt: new Date().toISOString() },
      isUploaded: true,
    });

    let mergedDocument: any = null;
    let mergedUrl: string | null = null;
    if (merge_doc) {
      console.log("Merging documents...");
      const mergeResult = await this.mergeFilesByFolder(partner_order_id);
      if (mergeResult.files && mergeResult.files.length > 0) {
        const mergedFile = mergeResult.files[0];
        mergedUrl = mergedFile.url;
        const fileSize = mergedFile.buffer.length;

        const existingMergedDocument = await this.documentRepository.findOne({
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
          console.log("Existing merged document updated:", mergedDocument);
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
          console.log("New merged document uploaded to DB:", mergedDocument);
        }

        await this.orderRepository.update(
          {
            merged_document: { url: mergedUrl, mimeType: "application/pdf", size: fileSize, createdAt: new Date().toISOString(), documentIds: [mergedDocument.id] },
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
    console.log(`Starting mergeFilesByFolder for folder: ${folderName}`);
    const prefix = `${folderName}/`;
    const tempDir = path.join(this.TEMP_DIR, `${folderName}_${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      console.log(`Fetching files from S3 with prefix: ${prefix}`);
      const listParams = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };
      const response = await this.s3.send(new ListObjectsV2Command(listParams));
      const files = response.Contents || [];
      console.log(`Found ${files.length} files in S3: ${JSON.stringify(files.map(f => f.Key))}`);

      if (!files.length && !newFileBuffer) {
        console.log(`No files found in folder and no newFileBuffer provided`);
        throw new BadRequestException(`No files found in folder: ${folderName}`);
      }

      const mergedPdf = await PDFDocument.create();
      for (const file of files.filter((f) => !f.Key.includes("merge_document_"))) {
        console.log(`Processing file: ${file.Key}`);
        const signedUrl = await getSignedUrl(
          this.s3,
          new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: file.Key }),
          { expiresIn: 3600 }
        );
        const response = await axios.get(signedUrl, { responseType: "arraybuffer" });
        let fileData = Buffer.from(response.data);
        console.log(`Downloaded file ${file.Key}, size: ${fileData.length} bytes`);
        const ext = file.Key.split(".").pop()?.toLowerCase();

        if (ext === "pdf") {
          const subPdf = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          console.log(`Added ${copiedPages.length} pages from ${file.Key}`);
        } else if (["jpg", "jpeg", "png"].includes(ext)) {
          // Compress image before converting to PDF
          fileData = await sharp(fileData)
            .resize({ width: 800 }) // Reduce resolution
            .jpeg({ quality: 50 }) // Lower quality for JPEG
            .toBuffer();
          console.log(`Compressed image ${file.Key}, new size: ${fileData.length} bytes`);
          const pdfBuffer = await this.convertImageToPdf(fileData, "jpg");
          const imgPdf = await PDFDocument.load(pdfBuffer);
          const copiedPages = await mergedPdf.copyPages(imgPdf, imgPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          console.log(`Added ${copiedPages.length} pages from converted ${file.Key}`);
        }
      }

      if (newFileBuffer && newFileMimeType) {
        console.log(`Processing new file, MIME type: ${newFileMimeType}, size: ${newFileBuffer.length} bytes`);
        let processedBuffer = newFileBuffer;
        if (newFileMimeType === "application/pdf") {
          const subPdf = await PDFDocument.load(processedBuffer);
          const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          console.log(`Added ${copiedPages.length} pages from new PDF`);
        } else if (["image/jpeg", "image/png"].includes(newFileMimeType)) {
          processedBuffer = await sharp(newFileBuffer)
            .resize({ width: 800 })
            .jpeg({ quality: 50 })
            .toBuffer();
          console.log(`Compressed new image, new size: ${processedBuffer.length} bytes`);
          const pdfBuffer = await this.convertImageToPdf(processedBuffer, "jpg");
          const imgPdf = await PDFDocument.load(pdfBuffer);
          const copiedPages = await mergedPdf.copyPages(imgPdf, imgPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          console.log(`Added ${copiedPages.length} pages from converted new image`);
        }
      }

      if (mergedPdf.getPageCount() === 0) {
        console.log(`No valid files to merge`);
        throw new BadRequestException(`No valid files to merge in folder: ${folderName}`);
      }

      let mergedBytes: Buffer = Buffer.from(await mergedPdf.save());
      console.log(`Merged PDF size before compression: ${mergedBytes.length} bytes`);
      mergedBytes = await this.compressToSize(mergedBytes, this.MAX_SIZE_BYTES);
      console.log(`Merged PDF size after compression: ${mergedBytes.length} bytes`);

      const mergedKey = `${prefix}merge_document_${folderName}.pdf`;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: mergedKey,
          Body: mergedBytes,
          ContentType: "application/pdf",
        })
      );
      console.log(`Uploaded merged PDF to S3 with key: ${mergedKey}`);

      const mergedSignedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: mergedKey }),
        { expiresIn: 3600 }
      );
      console.log(`Generated signed URL for ${mergedKey}`);

      console.log(`mergeFilesByFolder completed successfully`);
      return { files: [{ buffer: mergedBytes, url: mergedSignedUrl, s3Key: mergedKey }] };
    } catch (error) {
      console.error(`Error in mergeFilesByFolder: ${error.message}`);
      throw new InternalServerErrorException(`Merge failed: ${error.message}`);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log(`Cleaned up temp directory: ${tempDir}`);
    }
  }

  // private async convertImageToPdf(imageBuffer: Buffer, ext: string): Promise<Buffer> {
  //   const tempImgPath = path.join(this.TEMP_DIR, `img_${Date.now()}.${ext}`);
  //   const tempPdfPath = path.join(this.TEMP_DIR, `pdf_${Date.now()}.pdf`);
  
  //   let browser;
  //   try {
  //     await writeFile(tempImgPath, imageBuffer);
  //     console.log(`Image written to ${tempImgPath}, size: ${imageBuffer.length} bytes`);
  
  //     // Check if the file exists before proceeding
  //     if (!fs.existsSync(tempImgPath)) {
  //       throw new Error(`Temporary image file not found: ${tempImgPath}`);
  //     }
  
  //     // browser = await puppeteer.launch({ headless: "new" });
  //     browser = await puppeteer.launch({ headless: true });

  //     const page = await browser.newPage();
  //     console.log(tempImgPath)
  
  //     const imageUrl = `file://${tempImgPath.replace(/\\/g, "/")}`;
  
  //     // Properly formatted HTML page
  //     const htmlContent = `
  //       <html>
  //       <head>
  //         <style>
  //           body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
  //           img { max-width: 100%; max-height: 100vh; object-fit: contain; }
  //         </style>
  //       </head>
  //       <body>
  //         <img src="${imageUrl}" />
  //       </body>
  //       </html>
  //     `;
  
  //     await page.setContent(htmlContent, { waitUntil: "load" });
  //     await page.waitForSelector("img");
  
  //     const pdfBuffer = await page.pdf({
  //       path: tempPdfPath,
  //       format: "A4",
  //       printBackground: true,
  //     });
  
  //     console.log(`PDF created at ${tempPdfPath}, size: ${pdfBuffer.length} bytes`);
  
  //     return pdfBuffer;
  //   } catch (error) {
  //     console.error(`Error in convertImageToPdf: ${error.message}`);
  //     throw new InternalServerErrorException(`Image conversion failed: ${error.message}`);
  //   } finally {
  //     if (browser) await browser.close();
  //     if (fs.existsSync(tempImgPath)) fs.unlinkSync(tempImgPath);
  //     if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
  //   }
  // }

  private async convertImageToPdf(imageBuffer: Buffer, ext: string): Promise<Buffer> {
    try {
        const base64Image = `data:image/${ext};base64,${imageBuffer.toString("base64")}`;
        
        const htmlContent = `
            <html>
            <head>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${base64Image}" />
            </body>
            </html>
        `;

        const file = { content: htmlContent };
        const pdfBuffer = await pdf.generatePdf(file, { format: "A4", printBackground: true });

        console.log(`PDF generated from image, size: ${pdfBuffer.length} bytes`);
        return pdfBuffer;
    } catch (error) {
        console.error(`Error in convertImageToPdf: ${error.message}`);
        throw new InternalServerErrorException(`Image conversion failed: ${error.message}`);
    }
}

  private async compressToSize(pdfBuffer: Buffer, maxSize: number): Promise<Buffer> {
    const tempInput = path.join(this.TEMP_DIR, `input_${Date.now()}.pdf`);
    const tempOutput = path.join(this.TEMP_DIR, `output_${Date.now()}.pdf`);

    try {
        // Save the original PDF buffer to a temporary file
        await writeFile(tempInput, pdfBuffer);

        // Run Ghostscript compression command
        const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${tempOutput} ${tempInput}`;
        const { exec } = require("child_process");

        await new Promise((resolve, reject) => {
            exec(gsCommand, (error: any) => {
                if (error) {
                    reject(new Error(`Ghostscript compression failed: ${error.message}`));
                } else {
                    resolve(null);
                }
            });
        });

        // Read the compressed file
        const compressedBuffer = await fs.promises.readFile(tempOutput);
        console.log(`Compressed PDF size: ${compressedBuffer.length} bytes`);

        if (compressedBuffer.length > maxSize) {
            console.warn(`Compressed PDF (${compressedBuffer.length} bytes) still exceeds max size (${maxSize} bytes).`);
        }

        return compressedBuffer;
    } catch (error) {
        console.error(`Error in compressToSize: ${error.message}`);
        throw new InternalServerErrorException(`Compression failed: ${error.message}`);
    } finally {
        // Cleanup temp files
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
}

}