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
exports.FilterOrdersDto = exports.GetOrderDetailsDto = exports.UpdateOrderDetailsDto = exports.GetCheckerOrdersDto = exports.UnassignCheckerDto = exports.UpdateCheckerDto = exports.UpdateOrderDto = exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Partner Order ID",
        example: "BMFORDERID4321",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "partner_order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Transaction Type ID",
        example: "a8712d83154b960b9d3803d30b1112cam84dhj1k",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "transaction_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: "Indicates if e-signature is required",
        example: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "is_e_sign_required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "is_v_kyc_required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Purpose Type ID",
        example: "378dcac6a3a4c406cc11e112b91a99e8m84dbjsa",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "purpose_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Customer Name",
        example: "John Doe",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Customer Email",
        example: "john@gmail.com",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Customer Phone",
        example: "9912345678",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)("IN"),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Customer PAN",
        example: "ACTPAN123",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: "Invalid PAN format",
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer_pan", void 0);
class UpdateOrderDto {
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "BMFORDERID432" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "a8712d83154b960b9d3803d30b1112cam84dhj1k" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "transaction_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "378dcac6a3a4c406cc11e112b91a99e8m84dbjsa" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "purpose_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "is_e_sign_required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "is_v_kyc_required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "customer_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "joh@gmail.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "customer_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "9950895486" }),
    (0, class_validator_1.IsPhoneNumber)("IN"),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "customer_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "CAIPT0799K" }),
    (0, class_validator_1.Matches)(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "customer_pan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "pending" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "order_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Pending" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "https://esign-link.com" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "active" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_link_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "6ae8a7a6-55fa-457b-932f-a4ba271f8eee" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_link_request_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "01JP0H1M86CDW8HA4WF7V3X7HA" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_link_doc_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-03-30T12:00:00.000Z" }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_link_expires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "e_sign_completed_by_customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-03-13T08:40:53.328Z" }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_customer_completion_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Signed successfully" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "e_sign_doc_comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "93849" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_profile_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "787678" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_reference_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Pending" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "https://vkyc-link.com" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "active" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_link_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-03-30T12:00:00.000Z" }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_link_expires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "v_kyc_completed_by_customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-03-13T08:40:53.328Z" }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_customer_completion_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "KYC verified" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "v_kyc_comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "is_esign_regenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { reason: "expired" } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateOrderDto.prototype, "is_esign_regenerated_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDto.prototype, "is_video_kyc_link_regenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { reason: "expired" } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateOrderDto.prototype, "is_video_kyc_link_regenerated_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "00eb04d0-646c-41d5-a69e-197b2b504f01" }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "00eb04d0-646c-41d5-a69e-197b2b504f01" }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "49592f43-c59f-4084-bf3a-79a7ba6f182e" }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "checker_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "msddfheiuroifsnjd" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "partner_hashed_api_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uweyrfjdswiewd" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "partner_hashed_key", void 0);
class UpdateCheckerDto {
}
exports.UpdateCheckerDto = UpdateCheckerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: "Array of Order IDs",
        example: ["BMFORDERID432"],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateCheckerDto.prototype, "orderIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Checker ID (Hashed Key)",
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckerDto.prototype, "checkerId", void 0);
class UnassignCheckerDto {
}
exports.UnassignCheckerDto = UnassignCheckerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Order ID",
        example: "BMFORDERID432",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnassignCheckerDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Checker ID (Hashed Key)",
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnassignCheckerDto.prototype, "checkerId", void 0);
class GetCheckerOrdersDto {
}
exports.GetCheckerOrdersDto = GetCheckerOrdersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Checker ID (Hashed Key)",
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCheckerOrdersDto.prototype, "checkerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Filter orders by transaction type (all/completed)",
        example: "all",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["all", "completed"], {
        message: "filter must be either 'all' or 'completed'",
    }),
    __metadata("design:type", String)
], GetCheckerOrdersDto.prototype, "transaction_type", void 0);
class UpdateOrderDetailsDto {
}
exports.UpdateOrderDetailsDto = UpdateOrderDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "BMFORDERID432", description: "Order ID" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateOrderDetailsDto.prototype, "partner_order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
        description: "Checker ID (Hashed Key)",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateOrderDetailsDto.prototype, "checker_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "INV-20240304001",
        description: "Nium Invoice Number",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDetailsDto.prototype, "nium_invoice_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doc unavailable", description: "Checker Remarks" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDetailsDto.prototype, "incident_checker_comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Incident Status" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrderDetailsDto.prototype, "incident_status", void 0);
class GetOrderDetailsDto {
}
exports.GetOrderDetailsDto = GetOrderDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Order Hash Key",
        example: "BMFORDERID4321",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOrderDetailsDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Checker ID",
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOrderDetailsDto.prototype, "checkerId", void 0);
class FilterOrdersDto {
}
exports.FilterOrdersDto = FilterOrdersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Checker ID",
        example: "aab26dd990e49d40cf5bc80774ef7e0bm87gffio",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOrdersDto.prototype, "checkerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: "Transaction Type ID",
        example: "c1df6ce6482c14031bf438801c973229m87au2un",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOrdersDto.prototype, "transaction_type_hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: "Purpose Type ID",
        example: "e93925ccc85eabc70827bca643802572m87aut5j",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOrdersDto.prototype, "purpose_type_hashed_key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: "From Date YYYY-MM-DD",
        example: "2025-01-01",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FilterOrdersDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: "To Date YYYY-MM-DD",
        example: "2025-03-01",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FilterOrdersDto.prototype, "to", void 0);
//# sourceMappingURL=order.dto.js.map