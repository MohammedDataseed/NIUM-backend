import { Buffer } from "buffer";
import { ConfigService } from "@nestjs/config";
import { PDFDocument } from "pdf-lib";
import { Order } from "src/database/models/order.model";
import { Documents } from "src/database/models/documents.model";
import { DocumentType } from "src/database/models/documentType.model";
export declare class PdfService {
    private readonly documentRepository;
    private readonly orderRepository;
    private readonly documentTypeRepository;
    private readonly configService;
    private readonly s3;
    private readonly MAX_SIZE_BYTES;
    private readonly TEMP_DIR;
    constructor(documentRepository: typeof Documents, orderRepository: typeof Order, documentTypeRepository: typeof DocumentType, configService: ConfigService);
    listFilesByFolder(folderName: string): Promise<{
        order_id: string;
        files: {
            name: string;
            signed_url: string;
        }[];
    }>;
    optimizePdf(pdfDoc: PDFDocument, aggressive?: boolean): Promise<Uint8Array>;
    serveDocument(folderName: string, fileName: string): Promise<any>;
    updateFile(buffer: Buffer, oldFileKey: string, newFileKey: string, contentType?: string): Promise<{
        message: string;
        file_url: string;
    }>;
    deleteFile(fileKey: string): Promise<{
        message: string;
    }>;
    uploadFile(buffer: Buffer, originalName: string, folderName: string): Promise<{
        message: string;
        file_url: string;
    }>;
    private convertImageToPdf;
    uploadDocumentByOrderId(partner_order_id: string, document_type_id: string, base64File: string, merge_doc?: boolean): Promise<{
        merged_document_id: any;
        message: string;
        document_id: string;
    }>;
    private compressToSize;
    mergeFilesByFolder(folderName: string, newFileBuffer?: Buffer, newFileMimeType?: string): Promise<{
        files: {
            buffer: Uint8Array<ArrayBufferLike>;
            url: string;
            s3Key: string;
        }[];
    }>;
    compressPdfWithPdfLib(pdfBuffer: Buffer, maxSize: number): Promise<Buffer>;
}
