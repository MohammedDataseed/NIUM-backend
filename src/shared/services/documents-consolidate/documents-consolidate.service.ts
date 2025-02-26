//documents-consolidate.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { S3Client, ListObjectsV2Command, PutObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";
import { PDFDocument } from "pdf-lib";
import axios from "axios";

@Injectable()
export class PdfService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.DO_SPACE_REGION,
      endpoint: `https://${process.env.DO_SPACE_REGION}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
      },
    });
  }

  /**
   * Fetch all folders and files from a given path in DigitalOcean Spaces
   */
  async getAllFoldersAndFiles(path: string, role: string) {
    if (!role) throw new BadRequestException("Role is required.");
    if (!["client", "admin"].includes(role.toLowerCase())) {
      throw new BadRequestException("Invalid role. Must be 'client' or 'admin'.");
    }

    if (!path.startsWith("Fibregrid_projects/")) {
      path = `Fibregrid_projects/${path}`;
    }

    const params = {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Prefix: path,
      Delimiter: "/",
    };

    try {
      const response = await this.s3.send(new ListObjectsV2Command(params));

      let subfolders = response.CommonPrefixes
        ? response.CommonPrefixes.map((prefix) => prefix.Prefix.replace(path, "").replace(/\/$/, ""))
        : [];

      let files = response.Contents
        ? response.Contents.filter((obj) => obj.Key !== path).map((obj) => ({
            name: obj.Key.replace(path, ""),
            url: `https://${process.env.DO_SPACE_BUCKET_NAME}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/${obj.Key}`,
          }))
        : [];

      if (role.toLowerCase() === "client") {
        const hiddenFolders = ["stage 1", "stage 2", "stage 3"];
        subfolders = subfolders.filter((folder) => !hiddenFolders.includes(folder));
      }

      return { folder_path: path, subfolders, files };
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching files: ${error.message}`);
    }
  }

  /**
   * Upload a file to an existing folder in DigitalOcean Spaces
   */
  async uploadFile(buffer: Buffer, originalName: string, folderPath: string, role: string) {
    if (!role) throw new BadRequestException("Role is required.");
    if (!["client", "admin"].includes(role.toLowerCase())) {
      throw new BadRequestException("Invalid role. Must be 'client' or 'admin'.");
    }

    if (!folderPath.startsWith("Fibregrid_projects/")) {
      folderPath = `Fibregrid_projects/${folderPath}`;
    }
    if (!folderPath.endsWith("/")) {
      folderPath += "/";
    }

    const fileName = `${Date.now()}_${originalName}`;
    const fullFilePath = `${folderPath}${fileName}`;

   
    try {
      // const uploadParams = {
      //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
      //   Key: fullFilePath,
      //   Body: buffer,
      //   ContentType: "application/pdf",
      //   // ACL: "public-read", // ✅ Ensures the file is accessible publicly
      //   ACL: ObjectCannedACL.PUBLIC_READ, // ✅ Use the correct enum value
      // };
      const uploadParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: fullFilePath,
        Body: buffer,
        ContentType: "application/pdf",
        ACL: "public-read" as ObjectCannedACL, // ✅ Explicit type casting
      };
      
    
      await this.s3.send(new PutObjectCommand(uploadParams));
    
      return {
        message: "File uploaded successfully.",
        file_url: `https://${process.env.DO_SPACE_BUCKET_NAME}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/${fullFilePath}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Upload Error: ${error.message}`);
    }
  }

  /**
   * Merge multiple PDFs from URLs and upload to DigitalOcean Spaces
   */
  async mergeAndUploadPDF(documents: any[], clientName: string) {
    if (!documents || !Array.isArray(documents)) {
      throw new BadRequestException("Invalid input format. 'documents' must be an array.");
    }

    if (!clientName || typeof clientName !== "string" || !clientName.trim()) {
      throw new BadRequestException("Client name is required.");
    }

    const sanitizedClientName = clientName.trim().replace(/\s+/g, "_");
    const mergedPdfBytes = await this.mergeDocuments(documents);
    const filename = `merged_${Date.now()}.pdf`;
    const filePath = `Fibregrid_projects/FY_25-26/NIUM/NIUM-NODE_NIU_25-26_01_[Ekfrazo]/stage 1/documents-consolidated/${sanitizedClientName}/${filename}`;

    try {
      const uploadParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: filePath,
        Body: mergedPdfBytes,
        ContentType: "application/pdf",
        // ACL: "public-read",
      };

      await this.s3.send(new PutObjectCommand(uploadParams));

      return {
        message: "Merged PDF uploaded successfully!",
        file_url: `https://${process.env.DO_SPACE_BUCKET_NAME}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/${filePath}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error uploading merged PDF: ${error.message}`);
    }
  }

  /**
   * Merge multiple PDF documents
   */
  private async mergeDocuments(documents: any[]) {
    const mergedPdf = await PDFDocument.create();

    for (const doc of documents) {
      for (const key in doc) {
        let fileData = null;

        if (
          doc[key].startsWith("https://storage.idfy.com") ||
          doc[key].startsWith("https://res.cloudinary.com")
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
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
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
        responseType: "text",
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      let base64String = response.data.trim().replace(/[^A-Za-z0-9+/=]/g, "");

      if (base64String.startsWith("JVBERi0x")) {
        return Buffer.from(base64String, "base64");
      } else {
        throw new Error("Invalid Base64 content");
      }
    } catch (error) {
      console.error(`Error decoding Base64 PDF from ${url}:`, error.message);
      return null;
    }
  }
}
