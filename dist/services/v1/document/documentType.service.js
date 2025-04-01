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
exports.DocumentTypeService = void 0;
const common_1 = require("@nestjs/common");
let DocumentTypeService = class DocumentTypeService {
    constructor(documentTypeRepository) {
        this.documentTypeRepository = documentTypeRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.documentTypeRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async createDocumentType(span, createDocumentTypeDto) {
        const childSpan = span
            .tracer()
            .startSpan("create-document-type", { childOf: span });
        try {
            const existingDocumentType = await this.documentTypeRepository.findOne({
                where: { name: createDocumentTypeDto.document_name },
            });
            if (existingDocumentType) {
                throw new common_1.ConflictException("Document Type already exists");
            }
            console.log("Received DTO:", createDocumentTypeDto);
            return await this.documentTypeRepository.create({
                name: createDocumentTypeDto.document_name,
                created_by: createDocumentTypeDto.created_by,
                updated_by: createDocumentTypeDto.updated_by,
            });
        }
        finally {
            childSpan.finish();
        }
    }
    async updateDocumentType(span, hashed_key, updateDocumentTypeDto) {
        var _a, _b, _c;
        const childSpan = span
            .tracer()
            .startSpan("update-document-type", { childOf: span });
        try {
            const documentType = await this.documentTypeRepository.findOne({
                where: { hashed_key },
            });
            if (!documentType) {
                throw new common_1.NotFoundException("Document Type not found");
            }
            if (updateDocumentTypeDto.document_name) {
                const existingDocumentType = await this.documentTypeRepository.findOne({
                    where: { name: updateDocumentTypeDto.document_name },
                });
                if (existingDocumentType &&
                    existingDocumentType.hashed_key !== hashed_key) {
                    throw new common_1.ConflictException("Another Document Type with the same name already exists");
                }
            }
            await documentType.update({
                name: (_a = updateDocumentTypeDto.document_name) !== null && _a !== void 0 ? _a : documentType.name,
                isActive: (_b = updateDocumentTypeDto.is_active) !== null && _b !== void 0 ? _b : documentType.isActive,
                updated_by: (_c = updateDocumentTypeDto.updated_by) !== null && _c !== void 0 ? _c : documentType.updated_by,
            });
            return documentType;
        }
        finally {
            childSpan.finish();
        }
    }
    async findAllConfig() {
        const document = await this.documentTypeRepository.findAll({
            where: { isActive: true },
        });
        return document.map((document) => ({
            id: document.hashed_key,
            text: document.name,
        }));
    }
    async deleteDocumentType(span, hashed_key) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            const documentType = await this.documentTypeRepository.findOne({
                where: { hashed_key },
            });
            if (!documentType)
                throw new common_1.NotFoundException("Document Type not found");
            await documentType.destroy();
            childSpan.log({
                event: "documentType_deleted",
                document_type_id: hashed_key,
            });
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.DocumentTypeService = DocumentTypeService;
exports.DocumentTypeService = DocumentTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DOCUMENT_TYPE_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], DocumentTypeService);
//# sourceMappingURL=documentType.service.js.map