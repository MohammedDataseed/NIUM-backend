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
exports.PartnerResponseDto = exports.UpdatePartnerDto = exports.CreatePartnerDto = exports.business_type = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var business_type;
(function (business_type) {
    business_type["LARGE_ENTERPRISE"] = "large_enterprise";
    business_type["CASH_CARRY"] = "cash&carry";
})(business_type || (exports.business_type = business_type = {}));
class CreatePartnerDto {
}
exports.CreatePartnerDto = CreatePartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Role ID (UUID)",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "partner@example.com",
        description: "Partner's email address",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John", description: "First name of the partner" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doe", description: "Last name of the partner" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "hashedpassword123",
        description: "Partner's hashed password",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: "Whether the partner is active",
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePartnerDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "hashed_key",
        description: "hashed_key for saving",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "apikey-12345",
        description: "API Key for authentication",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "api_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "large_enterprise",
        enum: business_type,
        description: "Business type",
    }),
    (0, class_validator_1.IsEnum)(business_type),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "Created by user ID (UUID)",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440002",
        description: "Updated by user ID (UUID)",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [
            "550e8400-e29b-41d4-a716-446655440003",
            "550e8400-e29b-41d4-a716-446655440004",
        ],
        description: "Array of product IDs (UUIDs)",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)("4", { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePartnerDto.prototype, "product_ids", void 0);
class UpdatePartnerDto {
}
exports.UpdatePartnerDto = UpdatePartnerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Role ID (UUID)",
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "partner@example.com",
        description: "Partner's email address",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "John",
        description: "First name of the partner",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Doe",
        description: "Last name of the partner",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "hashedpassword123",
        description: "Partner's hashed password",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "apikey-12345",
        description: "API Key for authentication",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "api_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: "Whether the partner is active",
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePartnerDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "large_enterprise",
        enum: business_type,
        description: "Business type",
    }),
    (0, class_validator_1.IsEnum)(business_type),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "hashed_key",
        description: "hashed_key for saving",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "550e8400-e29b-41d4-a716-446655440002",
        description: "Updated by user ID (UUID)",
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePartnerDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ["550e8400-e29b-41d4-a716-446655440003"],
        description: "List of associated product IDs",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)("4", { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdatePartnerDto.prototype, "product_ids", void 0);
class ProductResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "550e8400-e29b-41d4-a716-446655440003", description: "Product ID (UUID)" }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Product A", description: "Product Name" }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "name", void 0);
class PartnerResponseDto {
}
exports.PartnerResponseDto = PartnerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "uuid",
        description: "Unique primary key for the partner",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "partner_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "a1b2c3d4e5f6...",
        description: "Unique hashed key for the partner",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Role ID (UUID)",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "partner@example.com",
        description: "Partner's email address",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John", description: "First name of the partner" }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doe", description: "Last name of the partner" }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "apikey-12345",
        description: "API Key for authentication",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "api_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Whether the partner is active" }),
    __metadata("design:type", Boolean)
], PartnerResponseDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "large_enterprise",
        enum: business_type,
        description: "Business type",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "Created by user ID (UUID)",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440002",
        description: "Updated by user ID (UUID)",
    }),
    __metadata("design:type", String)
], PartnerResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ProductResponseDto],
        description: "Array of associated products",
    }),
    __metadata("design:type", Array)
], PartnerResponseDto.prototype, "products", void 0);
//# sourceMappingURL=partner.dto.js.map