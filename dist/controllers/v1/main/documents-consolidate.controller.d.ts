import { OrdersService } from "../../../services/v1/order/order.service";
import { Response } from "express";
import { PdfService } from "../../../services/v1/document-consolidate/document-consolidate.service";
export declare class UploadPdfDto {
    partner_order_id: string;
    document_type_id: string;
    base64_file: string;
    merge_doc: boolean;
}
export declare class PdfController {
    private readonly ordersService;
    private readonly pdfService;
    constructor(ordersService: OrdersService, pdfService: PdfService);
    private readonly s3BaseUrl;
    uploadDocument(api_key: string, partner_id: string, uploadPdfDto: UploadPdfDto): Promise<{
        merged_document_id: any;
        message: string;
        document_id: string;
    }>;
    uploadFile(file: Express.Multer.File, orderId: string): Promise<{
        message: string;
        file_url: string;
    }>;
    listFilesByOrderId(orderId: string): Promise<{
        order_id: string;
        files: {
            name: string;
            signed_url: string;
        }[];
    }>;
    mergeFilesByOrderId(orderId: string): Promise<{
        files: {
            buffer: Buffer<Uint8Array<ArrayBufferLike>>;
            url: string;
            s3Key: string;
        }[];
    }>;
    updateFile(file: Express.Multer.File, orderId: string, fileName: string): Promise<{
        message: string;
        file_url: string;
    }>;
    deleteFile(orderId: string, fileName: string): Promise<{
        message: string;
    }>;
    getMergedPdf(folder: string, filename: string, res: Response): Promise<void>;
}
