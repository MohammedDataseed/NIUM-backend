"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdf = require("html-pdf-node");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const util_1 = require("util");
const writeFile = (0, util_1.promisify)(fs.writeFile);
const unlink = (0, util_1.promisify)(fs.unlink);
const buffer_1 = require("buffer");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const pdf_lib_1 = require("pdf-lib");
const axios_1 = require("axios");
let PdfService = class PdfService {
    constructor(documentRepository, orderRepository, documentTypeRepository, configService) {
        this.documentRepository = documentRepository;
        this.orderRepository = orderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.configService = configService;
        this.MAX_SIZE_BYTES = 15 * 1024 * 1024;
        this.TEMP_DIR = path.join(process.cwd(), "src/dev-assets");
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async listFilesByFolder(folderName) {
        const prefix = `${folderName}/`;
        const listParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Prefix: prefix,
        };
        try {
            const response = await this.s3.send(new client_s3_1.ListObjectsV2Command(listParams));
            const files = response.Contents || [];
            const fileList = await Promise.all(files.map(async (file) => {
                const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: file.Key,
                }), { expiresIn: 3600 });
                return {
                    name: file.Key.replace(prefix, ""),
                    signed_url: signedUrl,
                };
            }));
            return {
                order_id: folderName,
                files: fileList,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error listing files: ${error.message}`);
        }
    }
    async optimizePdf(pdfDoc, aggressive = false) {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const pageNode = page.node;
            pageNode.delete(pdf_lib_1.PDFName.of("UserUnit"));
            pageNode.delete(pdf_lib_1.PDFName.of("Annots"));
            const contentStream = pageNode.get(pdf_lib_1.PDFName.of("Contents"));
            if (contentStream) {
                if (Array.isArray(contentStream)) {
                    for (const stream of contentStream) {
                        if (stream instanceof pdf_lib_1.PDFRawStream) {
                            stream.dict.set(pdf_lib_1.PDFName.of("Filter"), pdf_lib_1.PDFName.of("FlateDecode"));
                        }
                    }
                }
                else if (contentStream instanceof pdf_lib_1.PDFRawStream) {
                    contentStream.dict.set(pdf_lib_1.PDFName.of("Filter"), pdf_lib_1.PDFName.of("FlateDecode"));
                }
            }
        }
        const fontCache = new Map();
        for (const page of pages) {
            const resources = page.node.Resources();
            if (resources && resources.has(pdf_lib_1.PDFName.of("Font"))) {
                const fonts = resources.lookup(pdf_lib_1.PDFName.of("Font"));
                for (const [fontKey, fontRef] of fonts.entries()) {
                    const fontKeyStr = fontRef.toString();
                    if (fontCache.has(fontKeyStr)) {
                        fonts.set(fontKey, fontCache.get(fontKeyStr));
                    }
                    else {
                        fontCache.set(fontKeyStr, fontRef);
                    }
                }
            }
        }
        const saveOptions = {
            useObjectStreams: true,
            updateFieldAppearances: false,
            compress: true,
        };
        if (aggressive) {
            saveOptions.addToCatalog = false;
        }
        return await pdfDoc.save(saveOptions);
    }
    async serveDocument(folderName, fileName) {
        const s3Key = `${folderName}/${fileName}`;
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
        }), { expiresIn: 3600 });
        const response = await axios_1.default.get(signedUrl, {
            responseType: "stream",
        });
        return response.data;
    }
    async updateFile(buffer, oldFileKey, newFileKey, contentType = "application/pdf") {
        const headParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: oldFileKey,
        };
        try {
            await this.s3.send(new client_s3_1.HeadObjectCommand(headParams));
        }
        catch (error) {
            if (error.name === "NotFound") {
                throw new common_1.NotFoundException(`File not found: ${oldFileKey}`);
            }
            throw new common_1.InternalServerErrorException(`Error checking file existence: ${error.message}`);
        }
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: newFileKey,
            Body: buffer,
            ContentType: contentType,
        };
        try {
            await this.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
            if (newFileKey !== oldFileKey) {
                const deleteParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: oldFileKey,
                };
                await this.s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
                console.log(`Deleted old file: ${oldFileKey}`);
            }
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: newFileKey,
            }), { expiresIn: 3600 });
            return {
                message: "File updated successfully.",
                file_url: signedUrl,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Update error: ${error.message}`);
        }
    }
    async deleteFile(fileKey) {
        const headParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        };
        try {
            await this.s3.send(new client_s3_1.HeadObjectCommand(headParams));
        }
        catch (error) {
            if (error.name === "NotFound") {
                throw new common_1.NotFoundException(`File not found: ${fileKey}`);
            }
            throw new common_1.InternalServerErrorException(`Error checking file existence: ${error.message}`);
        }
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        };
        try {
            await this.s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
            return {
                message: "File deleted successfully.",
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Delete error: ${error.message}`);
        }
    }
    async uploadFile(buffer, originalName, folderName) {
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
            await this.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            }), { expiresIn: 3600 });
            return {
                message: "File uploaded successfully.",
                file_url: signedUrl,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Upload error: ${error.message}`);
        }
    }
    async convertImageToPdf(imageBuffer, ext) {
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
            const pdfBuffer = await pdf.generatePdf(file, {
                format: "A4",
                printBackground: true,
            });
            console.log(`PDF generated from image, size: ${pdfBuffer.length} bytes`);
            return pdfBuffer;
        }
        catch (error) {
            console.error(`Error in convertImageToPdf: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Image conversion failed: ${error.message}`);
        }
    }
    async uploadDocumentByOrderId(partner_order_id, document_type_id, base64File, merge_doc = false) {
        var _a;
        const order = await this.orderRepository.findOne({
            where: { partner_order_id },
        });
        if (!order)
            throw new common_1.BadRequestException(`Order ID ${partner_order_id} not found`);
        const documentType = await this.documentTypeRepository.findOne({
            where: { hashed_key: document_type_id },
        });
        if (!documentType)
            throw new common_1.BadRequestException(`Invalid document_type_id: ${document_type_id}`);
        function isValidBase64(str) {
            if (!str || str.length % 4 !== 0)
                return false;
            const validChars = /^[A-Za-z0-9+/]+={0,2}$/;
            return validChars.test(str.slice(0, 1000));
        }
        if (!isValidBase64(base64File))
            throw new common_1.BadRequestException("Invalid Base64 encoding.");
        let mimeType, base64Data;
        const fileMatch = base64File.match(/^data:(image\/jpeg|image\/jpg|image\/png|application\/pdf);base64,(.+)$/);
        if (fileMatch) {
            mimeType = fileMatch[1];
            base64Data = fileMatch[2];
        }
        else {
            base64Data = base64File;
            const magicNumbers = {
                JVBERi0: "application/pdf",
                "/9j/": "image/jpeg",
                iVBORw: "image/png",
            };
            mimeType = (_a = Object.entries(magicNumbers).find(([magic]) => base64Data.startsWith(magic))) === null || _a === void 0 ? void 0 : _a[1];
            if (!mimeType)
                throw new common_1.BadRequestException("Invalid base64 format. Only JPEG, JPG, PNG, and PDF allowed.");
        }
        let buffer = buffer_1.Buffer.from(base64Data, "base64");
        const MAX_SIZE_BYTES = 15 * 1024 * 1024;
        if (buffer.length > MAX_SIZE_BYTES)
            throw new common_1.BadRequestException("File size must be ≤ 15MB");
        const existingDocument = await this.documentRepository.findOne({
            where: { entityId: order.id, document_type_id: documentType.id },
        });
        if (existingDocument) {
            console.log("Existing docs found");
            const url = new URL(existingDocument.documentUrl.url);
            const existingFileKey = url.pathname.substring(1);
            console.log(existingFileKey);
            await this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: existingFileKey,
            }));
            console.log(`Deleted ${existingFileKey} from S3`);
            await this.documentRepository.destroy({
                where: { documentId: existingDocument.documentId },
            });
            console.log(`Deleted document ${existingDocument.documentId} from DB`);
        }
        const folderName = partner_order_id;
        const fileExtension = mimeType.split("/")[1];
        const individualFileName = `${partner_order_id}_${document_type_id}.${fileExtension}`;
        const individualKey = `${folderName}/${individualFileName}`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: individualKey,
            Body: buffer,
            ContentType: mimeType,
        };
        await this.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
        const individualSignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: individualKey,
        }), { expiresIn: 3600 });
        const individualMaskedUrl = individualSignedUrl;
        const document = await this.documentRepository.create({
            entityId: order.id,
            entityType: "customer",
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
        let mergedDocument = null;
        let mergedUrl = null;
        if (merge_doc) {
            console.log("Merging documents...");
            const mergeResult = await this.mergeFilesByFolder(partner_order_id);
            if (mergeResult.files && mergeResult.files.length > 0) {
                const mergedFile = mergeResult.files[0];
                mergedUrl = mergedFile.url;
                const fileSize = mergedFile.buffer.length;
                let existingMergedDocument = await this.documentRepository.findOne({
                    where: {
                        entityId: order.id,
                        document_name: `merged_${partner_order_id}.pdf`,
                    },
                });
                if (existingMergedDocument) {
                    await this.documentRepository.update({
                        documentUrl: {
                            url: mergedUrl,
                            mimeType: "application/pdf",
                            size: fileSize,
                            uploadedAt: new Date().toISOString(),
                        },
                        isUploaded: true,
                    }, { where: { id: existingMergedDocument.id } });
                    mergedDocument = existingMergedDocument;
                    console.log("Existing merged document updated:", mergedDocument);
                }
                else {
                    mergedDocument = await this.documentRepository.create({
                        entityId: order.id,
                        entityType: "customer",
                        purposeId: null,
                        document_type_id: documentType.id,
                        document_name: `merged_${partner_order_id}.pdf`,
                        documentUrl: {
                            url: mergedUrl,
                            mimeType: "application/pdf",
                            size: fileSize,
                            uploadedAt: new Date().toISOString(),
                        },
                        isUploaded: true,
                    });
                    console.log("New merged document uploaded to DB:", mergedDocument);
                }
                await this.orderRepository.update({
                    merged_document: {
                        url: mergedUrl,
                        mimeType: "application/pdf",
                        size: fileSize,
                        createdAt: new Date().toISOString(),
                        documentIds: [mergedDocument.id],
                    },
                }, { where: { partner_order_id: partner_order_id } });
            }
            else {
                throw new common_1.InternalServerErrorException("Merged file could not be processed.");
            }
        }
        return Object.assign({ message: merge_doc
                ? "Document uploaded and merged successfully"
                : "Document uploaded successfully", document_id: document.entityId }, (merge_doc && {
            merged_document_id: mergedDocument.id,
        }));
    }
    async compressToSize(pdfBuffer, maxSize) {
        const tempInput = path.join(this.TEMP_DIR, `input_${Date.now()}.pdf`);
        const tempOutput = path.join(this.TEMP_DIR, `output_${Date.now()}.pdf`);
        try {
            await writeFile(tempInput, pdfBuffer);
            const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${tempOutput} ${tempInput}`;
            const { exec } = require("child_process");
            await new Promise((resolve, reject) => {
                exec(gsCommand, (error) => {
                    if (error) {
                        reject(new Error(`Ghostscript compression failed: ${error.message}`));
                    }
                    else {
                        resolve(null);
                    }
                });
            });
            const compressedBuffer = await fs.promises.readFile(tempOutput);
            console.log(`Compressed PDF size: ${compressedBuffer.length} bytes`);
            if (compressedBuffer.length > maxSize) {
                console.warn(`Compressed PDF (${compressedBuffer.length} bytes) still exceeds max size (${maxSize} bytes).`);
            }
            return compressedBuffer;
        }
        catch (error) {
            console.error(`Error in compressToSize: ${error.message}`);
            throw new common_1.InternalServerErrorException(`PDF compression failed: ${error.message}`);
        }
        finally {
            try {
                await fs.promises.unlink(tempInput);
                await fs.promises.unlink(tempOutput);
            }
            catch (cleanupError) {
                console.warn(`Failed to delete temp files: ${cleanupError.message}`);
            }
        }
    }
    async mergeFilesByFolder(folderName, newFileBuffer, newFileMimeType) {
        const prefix = `${folderName}/`;
        const MAX_SIZE_BYTES = 4 * 1024 * 1024;
        const listParams = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };
        const response = await this.s3.send(new client_s3_1.ListObjectsV2Command(listParams));
        const files = response.Contents || [];
        if (!files.length && !newFileBuffer)
            throw new common_1.BadRequestException(`No files found in folder: ${folderName}`);
        const mergedPdf = await pdf_lib_1.PDFDocument.create();
        for (const file of files.filter(f => !f.Key.includes("merge_document_"))) {
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: file.Key,
            }), { expiresIn: 3600 });
            const response = await axios_1.default.get(signedUrl, { responseType: "arraybuffer" });
            let fileData = buffer_1.Buffer.from(response.data);
            if (file.Key.endsWith(".pdf")) {
                const subPdf = await pdf_lib_1.PDFDocument.load(fileData);
                const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            else if (file.Key.match(/\.(jpeg|jpg|png)$/)) {
                fileData = await sharp(fileData)
                    .resize({ width: 1000 })
                    .jpeg({ quality: 70 })
                    .toBuffer();
                const image = await mergedPdf.embedJpg(fileData);
                const page = mergedPdf.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            }
        }
        if (newFileBuffer && newFileMimeType) {
            if (newFileMimeType === "application/pdf") {
                const subPdf = await pdf_lib_1.PDFDocument.load(newFileBuffer);
                const copiedPages = await mergedPdf.copyPages(subPdf, subPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            else {
                newFileBuffer = await sharp(newFileBuffer)
                    .resize({ width: 1000 })
                    .jpeg({ quality: 70 })
                    .toBuffer();
                const image = await mergedPdf.embedJpg(newFileBuffer);
                const page = mergedPdf.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            }
        }
        if (mergedPdf.getPageCount() === 0)
            throw new common_1.BadRequestException(`No valid files to merge in folder: ${folderName}`);
        let mergedBytes = await mergedPdf.save();
        mergedBytes = buffer_1.Buffer.from(mergedBytes);
        if (mergedBytes.length > MAX_SIZE_BYTES) {
            console.warn(`Merged file exceeds limit. Further compression applied.`);
            mergedBytes = await this.compressPdfWithPdfLib(buffer_1.Buffer.from(mergedBytes), MAX_SIZE_BYTES);
        }
        const mergedKey = `${prefix}merge_document_${folderName}.pdf`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: mergedKey,
            Body: mergedBytes,
            ContentType: "application/pdf",
        }));
        const maskedUrl = `${process.env.API_BASE_URL}/v1/api/documents/esign/${mergedKey}`;
        return {
            files: [{ buffer: mergedBytes, url: maskedUrl, s3Key: mergedKey }],
        };
    }
    async compressPdfWithPdfLib(pdfBuffer, maxSize) {
        let pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
        let compressedBuffer = buffer_1.Buffer.from(await pdfDoc.save());
        let quality = 80;
        while (compressedBuffer.length > maxSize && quality > 30) {
            console.warn(`Compressed size (${compressedBuffer.length} bytes) still exceeds limit. Reducing quality.`);
            const newPdfDoc = await pdf_lib_1.PDFDocument.create();
            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => newPdfDoc.addPage(page));
            compressedBuffer = buffer_1.Buffer.from(await newPdfDoc.save());
            quality -= 10;
        }
        return compressedBuffer;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DOCUMENTS_REPOSITORY")),
    __param(1, (0, common_1.Inject)("ORDER_REPOSITORY")),
    __param(2, (0, common_1.Inject)("DOCUMENT_TYPE_REPOSITORY")),
    __metadata("design:paramtypes", [Object, Object, Object, config_1.ConfigService])
], PdfService);
//# sourceMappingURL=document-consolidate.service.js.map