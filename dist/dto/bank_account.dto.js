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
exports.UpdateBankAccountDto = exports.CreateBankAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBankAccountDto {
}
exports.CreateBankAccountDto = CreateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Account holder's full name",
        example: "John Doe",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "account_holder_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique bank account number",
        example: "123456789012",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "account_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the bank",
        example: "State Bank of India",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bank_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Branch of the bank",
        example: "MG Road Branch",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bank_branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "IFSC code of the bank branch",
        example: "SBIN0001234",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "ifsc_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the account is a beneficiary",
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "is_beneficiary", void 0);
class UpdateBankAccountDto {
}
exports.UpdateBankAccountDto = UpdateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Account holder's full name",
        example: "John Doe",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "account_holder_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique bank account number",
        example: "123456789012",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "account_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the bank",
        example: "State Bank of India",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "bank_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Branch of the bank",
        example: "MG Road Branch",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "bank_branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "IFSC code of the bank branch",
        example: "SBIN0001234",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "ifsc_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the account is a beneficiary",
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBankAccountDto.prototype, "is_beneficiary", void 0);
//# sourceMappingURL=bank_account.dto.js.map