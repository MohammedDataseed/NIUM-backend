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
exports.DocumentUploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DocumentUploadDto {
}
exports.DocumentUploadDto = DocumentUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'BMF order ID',
        example: 'BMFORDERID4321',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentUploadDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document type ID from /config?type=document_type',
        example: '051d5bae-1826-4c67-8c51-2c5a8e3ee042',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DocumentUploadDto.prototype, "document_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64-encoded image (size < 1MB)',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1048576, { message: 'Base64 image must be less than 1MB' }),
    __metadata("design:type", String)
], DocumentUploadDto.prototype, "base64_image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to merge with existing documents (default: false)',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DocumentUploadDto.prototype, "merge_doc", void 0);
//# sourceMappingURL=document.dto.js.map