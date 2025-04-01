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
exports.SendEmailDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email (unique)", example: "maker@dataseedtech.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Password", example: "user@123#" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Role ID", example: "e89c53de-7d2e-4a10-bf75-24a6675f3f18" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Business type",
        example: "large_enterprise",
        enum: ["cash&carry", "large_enterprise"],
    }),
    (0, class_validator_1.IsEnum)(["cash&carry", "large_enterprise"]),
    __metadata("design:type", String)
], CreateUserDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Branch ID", example: "7cfa494d-ea85-496d-92ec-0a35a359e556" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "branch_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Bank Account ID", example: "d72a81fd-b897-4eb6-9e13-3e4b774a63d4" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "bank_account_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Is Active", example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "is_active", void 0);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "updatedemail@dataseedtech.com", required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "333cd780-af26-42f4-b9f5-0934fcf8936f", required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "cash&carry", required: false, enum: ["cash&carry", "large_enterprise"] }),
    (0, class_validator_1.IsEnum)(["cash&carry", "large_enterprise"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "7cfa494d-ea85-496d-92ec-0a35a359e556", required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "branch_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "bc7cb89f-56b0-4bc6-9e22-80c0d55dc754", required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "is_active", void 0);
class SendEmailDto {
}
exports.SendEmailDto = SendEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Recipient email address",
        example: "recipient@example.com",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Email subject",
        example: "Password Reset Request",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Plain text content of the email",
        example: "Click the link to reset your password.",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "HTML content of the email",
        example: '<p>Click <a href="http://example.com/reset-password">here</a> to reset your password.</p>',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "html", void 0);
//# sourceMappingURL=user.dto.js.map