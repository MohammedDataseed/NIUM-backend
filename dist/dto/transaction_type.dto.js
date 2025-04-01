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
exports.transaction_typeDto = exports.Updatetransaction_typeDto = exports.Createtransaction_typeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class Createtransaction_typeDto {
}
exports.Createtransaction_typeDto = Createtransaction_typeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the transaction type",
        example: "CARD LOAD",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Createtransaction_typeDto.prototype, "transaction_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the creator of the transaction type",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Createtransaction_typeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the transaction type",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Createtransaction_typeDto.prototype, "updated_by", void 0);
class Updatetransaction_typeDto {
}
exports.Updatetransaction_typeDto = Updatetransaction_typeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the Transaction Type",
        example: "CARD LOAD",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Updatetransaction_typeDto.prototype, "transaction_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Status of the transaction type (active/inactive)",
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], Updatetransaction_typeDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the transaction type",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Updatetransaction_typeDto.prototype, "updated_by", void 0);
class transaction_typeDto {
}
exports.transaction_typeDto = transaction_typeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique identifier of the transaction type",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], transaction_typeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the transaction Type",
        example: "CARD LOAD",
    }),
    __metadata("design:type", String)
], transaction_typeDto.prototype, "transaction_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Timestamp of when the transaction type was created",
        example: "2025-02-17T12:34:56Z",
    }),
    __metadata("design:type", Date)
], transaction_typeDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Timestamp of when the transaction type was last updated",
        example: "2025-02-17T12:34:56Z",
    }),
    __metadata("design:type", Date)
], transaction_typeDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the creator of the transaction type",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], transaction_typeDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the document type",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], transaction_typeDto.prototype, "updated_by", void 0);
//# sourceMappingURL=transaction_type.dto.js.map