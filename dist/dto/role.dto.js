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
exports.RoleResponseDto = exports.DeleteRoleDto = exports.UpdateRoleDto = exports.CreateRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRoleDto {
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Role name (must be one of the predefined roles)",
        example: "maker",
        enum: ["admin", "co-admin", "maker", "checker", "maker-checker"],
    }),
    (0, class_validator_1.IsEnum)(["admin", "co-admin", "maker", "checker", "maker-checker"]),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Status of the role (active or inactive)",
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRoleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "UUID of the user creating the role",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "created_by", void 0);
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique hashed key for the role",
        example: "a1b2c3d4e5f6...",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Role name (must be one of the predefined roles)",
        example: "checker",
        enum: ["admin", "co-admin", "maker", "checker", "maker-checker"],
    }),
    (0, class_validator_1.IsEnum)(["admin", "co-admin", "maker", "checker", "maker-checker"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Status of the role (active or inactive)",
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRoleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "UUID of the user updating the role",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "updated_by", void 0);
class DeleteRoleDto {
}
exports.DeleteRoleDto = DeleteRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Hashed key of the role to be deleted",
        example: "a1b2c3d4e5f6...",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteRoleDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "UUID of the user deleting the role",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DeleteRoleDto.prototype, "deleted_by", void 0);
class RoleResponseDto {
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique hashed key for the role",
        example: "a1b2c3d4e5f6...",
    }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Role name",
        example: "maker",
    }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Status of the role",
        example: true,
    }),
    __metadata("design:type", Boolean)
], RoleResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Created by user ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Updated by user ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "updated_by", void 0);
//# sourceMappingURL=role.dto.js.map