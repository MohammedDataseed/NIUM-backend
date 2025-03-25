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
exports.PurposeDto = exports.UpdatePurposeDto = exports.CreatePurposeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePurposeDto {
}
exports.CreatePurposeDto = CreatePurposeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the purpose',
        example: 'BTQ',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurposeDto.prototype, "purpose_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the creator of the purpose',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurposeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the purpose',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurposeDto.prototype, "updated_by", void 0);
class UpdatePurposeDto {
}
exports.UpdatePurposeDto = UpdatePurposeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the Purpose',
        example: 'BTQ',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePurposeDto.prototype, "purpose_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the purpose type (active/inactive)',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePurposeDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the purpose',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdatePurposeDto.prototype, "updated_by", void 0);
class PurposeDto {
}
exports.PurposeDto = PurposeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the purpose',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurposeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the purpose',
        example: 'BTQ',
    }),
    __metadata("design:type", String)
], PurposeDto.prototype, "purposeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of when the purpose was created',
        example: '2025-02-17T12:34:56Z',
    }),
    __metadata("design:type", Date)
], PurposeDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of when the purpose was last updated',
        example: '2025-02-17T12:34:56Z',
    }),
    __metadata("design:type", Date)
], PurposeDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the creator of the purpose',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurposeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the last user who updated the purpose',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurposeDto.prototype, "updated_by", void 0);
//# sourceMappingURL=purpose.dto.js.map