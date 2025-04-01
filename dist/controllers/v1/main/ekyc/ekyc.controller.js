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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EkycController = exports.ConvertUrlsToBase64Dto = void 0;
const common_1 = require("@nestjs/common");
const ekyc_service_1 = require("../../../../services/v1/ekyc/ekyc.service");
const swagger_1 = require("@nestjs/swagger");
const ekyc_request_dto_1 = require("../../../../dto/ekyc-request.dto");
const order_service_1 = require("../../../../services/v1/order/order.service");
const opentracing = require("opentracing");
class ConvertUrlsToBase64Dto {
}
exports.ConvertUrlsToBase64Dto = ConvertUrlsToBase64Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Array of file URLs to convert to Base64",
        type: [String],
        example: ["https://example.com/file1.pdf", "https://example.com/file2.jpg"],
    }),
    __metadata("design:type", Array)
], ConvertUrlsToBase64Dto.prototype, "urls", void 0);
let EkycController = class EkycController {
    constructor(ekycService, ordersService) {
        this.ekycService = ekycService;
        this.ordersService = ordersService;
        this.logger = new common_1.Logger(ekyc_service_1.EkycService.name);
    }
    async sendEkycLink(apiKey, partnerId, partner_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required partner_order_id in request data", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing e-KYC request for order: ${partner_order_id}`);
        const span = opentracing
            .globalTracer()
            .startSpan("find-one-order-controller");
        try {
            await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
            const response = await this.ekycService.sendEkycRequest(partner_order_id, apiKey, partnerId);
            if (response.success) {
                return {
                    success: true,
                    message: "E-sign link generated successfully",
                    e_sign_link: ((_e = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.source_output) === null || _c === void 0 ? void 0 : _c.esign_details) === null || _d === void 0 ? void 0 : _d.find((esign) => esign.url_status === true)) === null || _e === void 0 ? void 0 : _e.esign_url) || null,
                    e_sign_link_status: ((_j = (_h = (_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f.result) === null || _g === void 0 ? void 0 : _g.source_output) === null || _h === void 0 ? void 0 : _h.esign_details) === null || _j === void 0 ? void 0 : _j.some((esign) => esign.url_status === true))
                        ? "active"
                        : "inactive",
                    e_sign_link_expires: ((_p = (_o = (_m = (_l = (_k = response.data) === null || _k === void 0 ? void 0 : _k.result) === null || _l === void 0 ? void 0 : _l.source_output) === null || _m === void 0 ? void 0 : _m.esign_details) === null || _o === void 0 ? void 0 : _o.find((esign) => esign.url_status === true)) === null || _p === void 0 ? void 0 : _p.esign_expiry) || null,
                    e_sign_status: "pending",
                };
            }
            return response;
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async sendEkycLinkChecker(apiKey, partnerId, partner_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required partner_order_id in request data", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing e-KYC request for order: ${partner_order_id}`);
        const span = opentracing
            .globalTracer()
            .startSpan("find-one-order-controller");
        try {
            await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
            const response = await this.ekycService.sendEkycRequestChecker(partner_order_id);
            if (response.success) {
                return {
                    success: true,
                    message: "E-sign link generated successfully",
                    e_sign_link: ((_e = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.source_output) === null || _c === void 0 ? void 0 : _c.esign_details) === null || _d === void 0 ? void 0 : _d.find((esign) => esign.url_status === true)) === null || _e === void 0 ? void 0 : _e.esign_url) || null,
                    e_sign_link_status: ((_j = (_h = (_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f.result) === null || _g === void 0 ? void 0 : _g.source_output) === null || _h === void 0 ? void 0 : _h.esign_details) === null || _j === void 0 ? void 0 : _j.some((esign) => esign.url_status === true))
                        ? "active"
                        : "inactive",
                    e_sign_link_expires: ((_p = (_o = (_m = (_l = (_k = response.data) === null || _k === void 0 ? void 0 : _k.result) === null || _l === void 0 ? void 0 : _l.source_output) === null || _m === void 0 ? void 0 : _m.esign_details) === null || _o === void 0 ? void 0 : _o.find((esign) => esign.url_status === true)) === null || _p === void 0 ? void 0 : _p.esign_expiry) || null,
                    e_sign_status: "pending",
                };
            }
            return response;
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async retrieveEkycWebhook(partner_order_id) {
        try {
            return await this.ekycService.handleEkycRetrieveWebhook(partner_order_id);
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async retrieveEkyc(requestData) {
        return this.ekycService.retrieveEkycData(requestData);
    }
    async getTaskDetails(token, requestId) {
        return this.ekycService.getTaskDetails(token, requestId);
    }
    async getMergedPdf(orderId) {
        try {
            const mergedPdfBase64 = await this.ekycService.getMergedPdfBase64(orderId);
            return {
                success: true,
                data: mergedPdfBase64.base64,
                message: "Merged PDF Base64 retrieved successfully",
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: error.details || error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EkycController = EkycController;
__decorate([
    (0, common_1.Post)("generate-e-sign"),
    (0, swagger_1.ApiOperation)({ summary: "Send an e-KYC request to IDfy" }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                partner_order_id: { type: "string", example: "BMFORDERID001" },
            },
        },
    }),
    __param(0, (0, common_1.Headers)("api_key")),
    __param(1, (0, common_1.Headers)("partner_id")),
    __param(2, (0, common_1.Body)("partner_order_id", new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "sendEkycLink", null);
__decorate([
    (0, common_1.Post)("generate-e-sign-with-checker"),
    (0, swagger_1.ApiOperation)({ summary: "Send an e-KYC request to IDfy via checker" }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                partner_order_id: { type: "string", example: "BMFORDERID001" },
            },
        },
    }),
    __param(0, (0, common_1.Headers)("api_key")),
    __param(1, (0, common_1.Headers)("partner_id")),
    __param(2, (0, common_1.Body)("partner_order_id", new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "sendEkycLinkChecker", null);
__decorate([
    (0, common_1.Post)("retrieve-webhook"),
    (0, swagger_1.ApiOperation)({ summary: "Retrieve e-KYC data via webhook" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Webhook processed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid request data" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    __param(0, (0, common_1.Query)("partner_order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "retrieveEkycWebhook", null);
__decorate([
    (0, common_1.Post)("retrieve-working-idfy"),
    (0, swagger_1.ApiOperation)({ summary: "Retrieve e-KYC data from IDfy" }),
    (0, swagger_1.ApiBody)({ type: ekyc_request_dto_1.EkycRetrieveRequestDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ekyc_request_dto_1.EkycRetrieveRequestDto]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "retrieveEkyc", null);
__decorate([
    (0, common_1.Get)("tasks"),
    (0, swagger_1.ApiOperation)({ summary: "Retrieve task details from IDfy" }),
    (0, swagger_1.ApiHeader)({
        name: "X-API-Key",
        description: "Authentication token",
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: "request_id",
        description: "Request ID to fetch task details",
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Task details retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Task not found" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    __param(0, (0, common_1.Headers)("X-API-Key")),
    __param(1, (0, common_1.Query)("request_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "getTaskDetails", null);
__decorate([
    (0, common_1.Get)("merged-pdf"),
    (0, swagger_1.ApiOperation)({ summary: "Get Base64 of merged PDF for an order" }),
    (0, swagger_1.ApiQuery)({
        name: "orderId",
        required: true,
        description: "The ID of the order to fetch or merge PDFs for",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Base64 string of the merged PDF" }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid request data or no PDFs found",
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    __param(0, (0, common_1.Query)("orderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EkycController.prototype, "getMergedPdf", null);
exports.EkycController = EkycController = __decorate([
    (0, swagger_1.ApiTags)("E-KYC"),
    (0, common_1.Controller)("ekyc"),
    __metadata("design:paramtypes", [ekyc_service_1.EkycService,
        order_service_1.OrdersService])
], EkycController);
//# sourceMappingURL=ekyc.controller.js.map