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
exports.EkycRetrieveRequestDto = exports.EkycRetrieveDataDto = exports.EkycRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class EsignFieldsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: {} }),
    __metadata("design:type", Object)
], EsignFieldsDto.prototype, "esign_fields", void 0);
class EsignFileDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SWRN1iH" }),
    __metadata("design:type", String)
], EsignFileDetailsDto.prototype, "esign_profile_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Tayib" }),
    __metadata("design:type", String)
], EsignFileDetailsDto.prototype, "file_name", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.order_id),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ example: "base64_file starting with JVBERi0xL" }),
    __metadata("design:type", String)
], EsignFileDetailsDto.prototype, "esign_file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EsignFieldsDto }),
    __metadata("design:type", EsignFieldsDto)
], EsignFileDetailsDto.prototype, "esign_fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], type: [String] }),
    __metadata("design:type", Array)
], EsignFileDetailsDto.prototype, "esign_additional_files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], EsignFileDetailsDto.prototype, "esign_allow_fill", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "ORDER123" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EsignFileDetailsDto.prototype, "order_id", void 0);
class EsignStampDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    __metadata("design:type", String)
], EsignStampDetailsDto.prototype, "esign_stamp_series", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    __metadata("design:type", String)
], EsignStampDetailsDto.prototype, "esign_series_group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    __metadata("design:type", String)
], EsignStampDetailsDto.prototype, "esign_stamp_value", void 0);
class AadhaarEsignVerificationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AadhaarEsignVerificationDto.prototype, "aadhaar_pincode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AadhaarEsignVerificationDto.prototype, "aadhaar_yob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AadhaarEsignVerificationDto.prototype, "aadhaar_gender", void 0);
class EsignInviteeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Mohammed Tayibulla" }),
    __metadata("design:type", String)
], EsignInviteeDto.prototype, "esigner_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "contact2tayib@gmail.com" }),
    __metadata("design:type", String)
], EsignInviteeDto.prototype, "esigner_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "8550895486" }),
    __metadata("design:type", String)
], EsignInviteeDto.prototype, "esigner_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AadhaarEsignVerificationDto }),
    __metadata("design:type", AadhaarEsignVerificationDto)
], EsignInviteeDto.prototype, "aadhaar_esign_verification", void 0);
class EkycDataDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "PDF" }),
    __metadata("design:type", String)
], EkycDataDto.prototype, "flow_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv" }),
    __metadata("design:type", String)
], EkycDataDto.prototype, "user_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], EkycDataDto.prototype, "verify_aadhaar_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EsignFileDetailsDto }),
    __metadata("design:type", EsignFileDetailsDto)
], EkycDataDto.prototype, "esign_file_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EsignStampDetailsDto }),
    __metadata("design:type", EsignStampDetailsDto)
], EkycDataDto.prototype, "esign_stamp_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EsignInviteeDto] }),
    __metadata("design:type", Array)
], EkycDataDto.prototype, "esign_invitees", void 0);
class EkycRequestDto {
}
exports.EkycRequestDto = EkycRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "234" }),
    __metadata("design:type", String)
], EkycRequestDto.prototype, "task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1234" }),
    __metadata("design:type", String)
], EkycRequestDto.prototype, "group_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ORDER123" }),
    __metadata("design:type", String)
], EkycRequestDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EkycDataDto }),
    __metadata("design:type", EkycDataDto)
], EkycRequestDto.prototype, "data", void 0);
class EkycRetrieveDataDto {
}
exports.EkycRetrieveDataDto = EkycRetrieveDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'N0N0M8nTyzD3UghN6qehC9HTfwneEZJv',
        description: 'User key for authentication',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EkycRetrieveDataDto.prototype, "user_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'MMtdWgP',
        description: 'eSign document ID (optional, fetched dynamically if not provided)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EkycRetrieveDataDto.prototype, "esign_doc_id", void 0);
class EkycRetrieveRequestDto {
}
exports.EkycRetrieveRequestDto = EkycRetrieveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TAYIB1', description: 'Task ID for the e-KYC request' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EkycRetrieveRequestDto.prototype, "task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234',
        description: 'Group ID associated with the e-KYC request',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EkycRetrieveRequestDto.prototype, "group_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            user_key: 'N0N0M8nTyzD3UghN6qehC9HTfwneEZJv',
            esign_doc_id: '01JPN6FMTRB4YQ4BX0T1J4673Y',
        },
        description: 'Additional data for the request',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EkycRetrieveDataDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", EkycRetrieveDataDto)
], EkycRetrieveRequestDto.prototype, "data", void 0);
//# sourceMappingURL=ekyc-request.dto.js.map