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
exports.DocumentTypeController = void 0;
const common_1 = require("@nestjs/common");
const documentType_service_1 = require("../../../services/v1/document/documentType.service");
const documentType_model_1 = require("../../../database/models/documentType.model");
const opentracing = require("opentracing");
const documentType_dto_1 = require("../../../dto/documentType.dto");
const swagger_1 = require("@nestjs/swagger");
let DocumentTypeController = class DocumentTypeController {
    constructor(documentTypeService) {
        this.documentTypeService = documentTypeService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-document-types-request");
        try {
            const whereCondition = params;
            const documentTypes = await this.documentTypeService.findAll(span, whereCondition);
            return documentTypes.map((doc) => ({
                document_type_id: doc.hashed_key,
                document_name: doc.name,
            }));
        }
        finally {
            span.finish();
        }
    }
    async createDocumentType(createDocumentTypeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-document-type-request");
        try {
            const newDocument = await this.documentTypeService.createDocumentType(span, createDocumentTypeDto);
            return {
                document_type_id: newDocument.hashed_key,
                document_name: newDocument.name,
            };
        }
        finally {
            span.finish();
        }
    }
    async update(document_type_id, updateDocumentTypeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-document-type-request");
        try {
            await this.documentTypeService.updateDocumentType(span, document_type_id, updateDocumentTypeDto);
            return { message: "Document Type updated successfully" };
        }
        finally {
            span.finish();
        }
    }
    async delete(document_type_id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-document-type-request");
        try {
            await this.documentTypeService.deleteDocumentType(span, document_type_id);
            return { message: "Document Type deleted successfully" };
        }
        finally {
            span.finish();
        }
    }
};
exports.DocumentTypeController = DocumentTypeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new document type" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The document type has been successfully created.",
        type: documentType_model_1.DocumentType,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documentType_dto_1.CreateDocumentTypeDto]),
    __metadata("design:returntype", Promise)
], DocumentTypeController.prototype, "createDocumentType", null);
__decorate([
    (0, common_1.Put)(":document_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a document type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Document Type updated successfully.",
        type: documentType_model_1.DocumentType,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document Type not found." }),
    (0, swagger_1.ApiBody)({ type: documentType_dto_1.UpdateDocumentTypeDto }),
    __param(0, (0, common_1.Param)("document_type_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, documentType_dto_1.UpdateDocumentTypeDto]),
    __metadata("design:returntype", Promise)
], DocumentTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":document_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a document type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Document Type deleted successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document Type not found." }),
    __param(0, (0, common_1.Param)("document_type_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentTypeController.prototype, "delete", null);
exports.DocumentTypeController = DocumentTypeController = __decorate([
    (0, swagger_1.ApiTags)("DocumentTypes"),
    (0, common_1.Controller)("documentTypes"),
    __metadata("design:paramtypes", [documentType_service_1.DocumentTypeService])
], DocumentTypeController);
//# sourceMappingURL=documentType.controller.js.map