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
exports.PdfController = exports.UploadPdfDto = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../../services/v1/order/order.service");
const opentracing = require("opentracing");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const document_consolidate_service_1 = require("../../../services/v1/document-consolidate/document-consolidate.service");
const class_validator_1 = require("class-validator");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({ region: 'ap-south-1' });
class UploadPdfDto {
}
exports.UploadPdfDto = UploadPdfDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadPdfDto.prototype, "partner_order_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadPdfDto.prototype, "document_type_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadPdfDto.prototype, "base64_file", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UploadPdfDto.prototype, "merge_doc", void 0);
let PdfController = class PdfController {
    constructor(ordersService, pdfService) {
        this.ordersService = ordersService;
        this.pdfService = pdfService;
        this.s3BaseUrl = 'https://docnest.s3.ap-south-1.amazonaws.com';
    }
    async uploadDocument(api_key, partner_id, uploadPdfDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("upload-document-controller");
        try {
            await this.ordersService.validatePartnerHeaders(partner_id, api_key);
            const { partner_order_id, document_type_id, base64_file, merge_doc } = uploadPdfDto;
            if (!partner_order_id || !document_type_id || !base64_file) {
                throw new common_1.BadRequestException("Missing required fields.");
            }
            const pureBase64 = base64_file.replace(/^data:application\/pdf;base64,/, "");
            const uploadedDocument = await this.pdfService.uploadDocumentByOrderId(partner_order_id, document_type_id, pureBase64, merge_doc);
            return uploadedDocument;
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async uploadFile(file, orderId) {
        if (!file)
            throw new common_1.BadRequestException("File is required");
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            throw new common_1.BadRequestException("Order ID is required and must be a non-empty string");
        }
        const folderName = orderId.trim();
        return await this.pdfService.uploadFile(file.buffer, file.originalname, folderName);
    }
    async listFilesByOrderId(orderId) {
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            throw new common_1.BadRequestException("Order ID is required and must be a non-empty string");
        }
        const folderName = orderId.trim();
        return await this.pdfService.listFilesByFolder(folderName);
    }
    async mergeFilesByOrderId(orderId) {
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            throw new common_1.BadRequestException("Order ID is required and must be a non-empty string");
        }
        const folderName = orderId.trim();
        return await this.pdfService.mergeFilesByFolder(folderName);
    }
    async updateFile(file, orderId, fileName) {
        if (!file)
            throw new common_1.BadRequestException("File is required");
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            throw new common_1.BadRequestException("Order ID is required and must be a non-empty string");
        }
        if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
            throw new common_1.BadRequestException("File name is required and must be a non-empty string");
        }
        const folderName = orderId.trim();
        const oldFileKey = `${folderName}/${fileName.trim()}`;
        const newFileKey = `${folderName}/${file.originalname}`;
        return await this.pdfService.updateFile(file.buffer, oldFileKey, newFileKey, file.mimetype);
    }
    async deleteFile(orderId, fileName) {
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            throw new common_1.BadRequestException("Order ID is required and must be a non-empty string");
        }
        if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
            throw new common_1.BadRequestException("File name is required and must be a non-empty string");
        }
        const folderName = orderId.trim();
        const fileKey = `${folderName}/${fileName.trim()}`;
        return await this.pdfService.deleteFile(fileKey);
    }
    async getMergedPdf(folder, filename, res) {
        const bucket = 'docnest';
        const key = `${folder}/${filename}`;
        try {
            const command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
            const s3Response = await s3.send(command);
            if (!s3Response.Body) {
                throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${filename}`);
            s3Response.Body.pipe(res);
        }
        catch (error) {
            console.error('Error fetching file from S3:', error);
            throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, swagger_1.ApiOperation)({ summary: "Upload a PDF document by Order ID" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                partner_order_id: {
                    type: "string",
                    example: "BMFORDERID786",
                },
                document_type_id: {
                    type: "string",
                    example: "9aae975b52a0803109e4538a0bafd3e9m84deewb",
                },
                base64_file: {
                    type: "string",
                    example: "JVBERi0xLjQKJ...",
                    description: "Base64 encoded document",
                },
                merge_doc: { type: "boolean", example: false },
            },
            required: ["orderId", "document_type_id", "base64_file", "merge_doc"],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "PDF document uploaded successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid base64 format or order not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    __param(0, (0, common_1.Headers)("api_key")),
    __param(1, (0, common_1.Headers)("partner_id")),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UploadPdfDto]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)("upload-file"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({
        summary: "Upload a file to AWS S3 under a specified partner_order_id folder",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "File to upload",
                },
                partner_order_id: {
                    type: "string",
                    description: "partner Order ID to use as folder name",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "File uploaded successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("partner_order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)("list-by-order"),
    (0, swagger_1.ApiOperation)({
        summary: "List all files in an partner_order_id folder from AWS S3 with signed URLs",
    }),
    (0, swagger_1.ApiQuery)({
        name: "partner_order_id",
        required: true,
        description: "Order ID to list files from its folder",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Successfully retrieved list of files with signed URLs",
        schema: {
            type: "object",
            properties: {
                partner_order_id: { type: "string", description: "Order ID folder" },
                files: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "File name" },
                            signed_url: {
                                type: "string",
                                description: "Signed URL to access the file",
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    __param(0, (0, common_1.Query)("partner_order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "listFilesByOrderId", null);
__decorate([
    (0, common_1.Post)("merge-by-order"),
    (0, swagger_1.ApiOperation)({
        summary: "Merge all PDFs in an partner_order_id folder and upload to AWS S3",
    }),
    (0, swagger_1.ApiQuery)({
        name: "partner_order_id",
        required: true,
        description: "Order ID folder containing  to merge",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Merged uploaded successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    __param(0, (0, common_1.Query)("partner_order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "mergeFilesByOrderId", null);
__decorate([
    (0, common_1.Put)("update"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({
        summary: "Update an existing file in an partner_order_id folder in AWS S3 with a new file",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "New file to replace the existing one",
                },
                partner_order_id: {
                    type: "string",
                    description: "Order ID folder containing the file",
                },
                file_name: {
                    type: "string",
                    description: 'Name of the existing file to update (e.g., "1741154856501_bmf_flow_api.pdf")',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "File updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "File not found" }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("partner_order_id")),
    __param(2, (0, common_1.Body)("file_name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Delete)("delete"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete a file from an partner_order_id folder in AWS S3",
    }),
    (0, swagger_1.ApiQuery)({
        name: "partner_order_id",
        required: true,
        description: "Order ID folder containing the file",
    }),
    (0, swagger_1.ApiQuery)({
        name: "file_name",
        required: true,
        description: 'Name of the file to delete (e.g., "123.html")',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "File deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "File not found" }),
    __param(0, (0, common_1.Query)("partner_order_id")),
    __param(1, (0, common_1.Query)("file_name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)('esign/:folder/:filename'),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "getMergedPdf", null);
exports.PdfController = PdfController = __decorate([
    (0, swagger_1.ApiTags)("Document Management"),
    (0, common_1.Controller)("documents"),
    __metadata("design:paramtypes", [order_service_1.OrdersService,
        document_consolidate_service_1.PdfService])
], PdfController);
//# sourceMappingURL=documents-consolidate.controller.js.map