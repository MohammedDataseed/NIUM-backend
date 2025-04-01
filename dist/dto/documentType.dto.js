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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeDto = exports.UpdateDocumentTypeDto = exports.CreateDocumentTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDocumentTypeDto {
}
exports.CreateDocumentTypeDto = CreateDocumentTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the document type',
        example: 'PAN',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDocumentTypeDto.prototype, "document_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the creator of the document type',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDocumentTypeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the document type',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDocumentTypeDto.prototype, "updated_by", void 0);
class UpdateDocumentTypeDto {
}
exports.UpdateDocumentTypeDto = UpdateDocumentTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the Document Type',
        example: 'PAN',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentTypeDto.prototype, "document_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the document type (active/inactive)',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDocumentTypeDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the document type',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateDocumentTypeDto.prototype, "updated_by", void 0);
class DocumentTypeDto {
}
exports.DocumentTypeDto = DocumentTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the document type',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DocumentTypeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the branch',
        example: 'Main Branch',
    }),
    __metadata("design:type", String)
], DocumentTypeDto.prototype, "document_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of when the document type was created',
        example: '2025-02-17T12:34:56Z',
    }),
    __metadata("design:type", Date)
], DocumentTypeDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of when the document type was last updated',
        example: '2025-02-17T12:34:56Z',
    }),
    __metadata("design:type", Date)
], DocumentTypeDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the creator of the document type',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DocumentTypeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the document type',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DocumentTypeDto.prototype, "updated_by", void 0);
//# sourceMappingURL=documentType.dto.js.map