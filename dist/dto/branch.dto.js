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
exports.BranchDto = exports.UpdateBranchDto = exports.CreateBranchDto = exports.BusinessType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BusinessType;
(function (BusinessType) {
    BusinessType["CASH_AND_CARRY"] = "cash&carry";
    BusinessType["LARGE_ENTERPRISE"] = "large_enterprise";
})(BusinessType || (exports.BusinessType = BusinessType = {}));
class CreateBranchDto {
}
exports.CreateBranchDto = CreateBranchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the branch",
        example: "Main Branch",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Location of the branch",
        example: "Bengaluru",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "City where the branch is located",
        example: "Bengaluru",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "State where the branch is located",
        example: "Karnataka",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of business for the branch",
        example: "cash&carry",
        enum: BusinessType,
    }),
    (0, class_validator_1.IsEnum)(BusinessType),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the creator of the branch",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the branch",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBranchDto.prototype, "updated_by", void 0);
class UpdateBranchDto {
}
exports.UpdateBranchDto = UpdateBranchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the branch",
        example: "Main Branch",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Location of the branch",
        example: "Bengaluru",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "City where the branch is located",
        example: "Bengaluru",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "State where the branch is located",
        example: "Karnataka",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of business for the branch",
        example: "cash&carry",
        enum: BusinessType,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(BusinessType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the branch",
        example: "123e4567-e89b-12d3-a456-426614174001",
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBranchDto.prototype, "updated_by", void 0);
class BranchDto {
}
exports.BranchDto = BranchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique identifier of the branch",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BranchDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the branch",
        example: "Main Branch",
    }),
    __metadata("design:type", String)
], BranchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Location of the branch",
        example: "Bengaluru",
    }),
    __metadata("design:type", String)
], BranchDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "City where the branch is located",
        example: "Bengaluru",
    }),
    __metadata("design:type", String)
], BranchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "State where the branch is located",
        example: "Karnataka",
    }),
    __metadata("design:type", String)
], BranchDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of business for the branch",
        example: "cash&carry",
        enum: BusinessType,
    }),
    __metadata("design:type", String)
], BranchDto.prototype, "business_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Timestamp of when the branch was created",
        example: "2025-02-17T12:34:56Z",
    }),
    __metadata("design:type", Date)
], BranchDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Timestamp of when the branch was last updated",
        example: "2025-02-17T12:34:56Z",
    }),
    __metadata("design:type", Date)
], BranchDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the creator of the branch",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BranchDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the last user who updated the branch",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BranchDto.prototype, "updated_by", void 0);
//# sourceMappingURL=branch.dto.js.map