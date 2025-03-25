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
exports.VideokycController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../../../services/v1/order/order.service");
const opentracing = require("opentracing");
const videokyc_service_1 = require("../../../../services/v1/videokyc/videokyc.service");
const swagger_1 = require("@nestjs/swagger");
const video_kyc_dto_1 = require("../../../../dto/video-kyc.dto");
let VideokycController = class VideokycController {
    constructor(videokycService, ordersService) {
        this.videokycService = videokycService;
        this.ordersService = ordersService;
        this.logger = new common_1.Logger(videokyc_service_1.VideokycService.name);
    }
    async generateVkyc(apiKey, partnerId, partner_order_id) {
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required partner_order_id in request data", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing V-KYC request for order: ${partner_order_id}`);
        const span = opentracing
            .globalTracer()
            .startSpan("find-one-order-controller");
        try {
            await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
            const result = await this.videokycService.sendVideokycRequest(partner_order_id);
            return {
                success: true,
                data: result,
            };
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
            return await this.videokycService.handleEkycRetrieveWebhook(partner_order_id);
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async syncProfiles(token, requestData) {
        try {
            if (!token) {
                throw new common_1.HttpException("X-API-Key header is required", common_1.HttpStatus.UNAUTHORIZED);
            }
            const result = await this.videokycService.sendVideokycRequest(requestData.reference_id);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException("Failed to process sync profiles request", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTaskDetails(token, requestId) {
        try {
            if (!token) {
                throw new common_1.HttpException("X-API-Key header is required", common_1.HttpStatus.UNAUTHORIZED);
            }
            const result = await this.videokycService.getTaskDetails(token, requestId);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException("Failed to retrieve task details", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async retrieveVideokyc(token, profileId) {
        try {
            const requestData = { request_id: profileId };
            const result = await this.videokycService.retrieveVideokycData(requestData);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException("Failed to retrieve video KYC data", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.VideokycController = VideokycController;
__decorate([
    (0, common_1.Post)("generate-v-kyc"),
    (0, swagger_1.ApiOperation)({ summary: "Send an v-kyc request to IDfy" }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                partner_order_id: { type: "string", example: "BMFORDERID001" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Profile successfully synced",
        type: Object,
        schema: {
            properties: {
                success: { type: "boolean", example: true },
                data: { type: "object" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized - Missing or invalid X-API-Key",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Headers)("api_key")),
    __param(1, (0, common_1.Headers)("partner_id")),
    __param(2, (0, common_1.Body)("partner_order_id", new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VideokycController.prototype, "generateVkyc", null);
__decorate([
    (0, common_1.Post)("retrieve-webhook"),
    (0, swagger_1.ApiOperation)({ summary: "Retrieve V-KYC data via webhook" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Webhook processed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid request data" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    __param(0, (0, common_1.Query)("partner_order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideokycController.prototype, "retrieveEkycWebhook", null);
__decorate([
    (0, common_1.Post)("sync-profiles"),
    (0, swagger_1.ApiOperation)({
        summary: "Sync profile data for video KYC",
        description: "Creates or updates a profile with address information for video KYC verification",
    }),
    (0, swagger_1.ApiHeader)({
        name: "X-API-Key",
        description: "API authentication token",
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        type: video_kyc_dto_1.SyncProfileDto,
        description: "Profile reference ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Profile successfully synced",
        type: Object,
        schema: {
            properties: {
                success: { type: "boolean", example: true },
                data: { type: "object" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized - Missing or invalid X-API-Key",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Headers)("X-API-Key")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, video_kyc_dto_1.SyncProfileDto]),
    __metadata("design:returntype", Promise)
], VideokycController.prototype, "syncProfiles", null);
__decorate([
    (0, common_1.Get)("task-details"),
    (0, swagger_1.ApiOperation)({
        summary: "Get task details",
        description: "Retrieves details of a specific KYC task by request ID",
    }),
    (0, swagger_1.ApiHeader)({
        name: "X-API-Key",
        description: "API authentication token",
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: "request_id",
        required: true,
        description: "Unique identifier of the KYC request",
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Task details retrieved successfully",
        type: Object,
        schema: {
            properties: {
                success: { type: "boolean", example: true },
                data: { type: "object" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Missing request_id",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized - Missing or invalid X-API-Key",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Headers)("X-API-Key")),
    __param(1, (0, common_1.Query)("request_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideokycController.prototype, "getTaskDetails", null);
__decorate([
    (0, common_1.Get)("retrieve/:profile_id"),
    (0, swagger_1.ApiOperation)({
        summary: "Retrieve video KYC data",
        description: "Retrieves completed video KYC verification data",
    }),
    (0, swagger_1.ApiHeader)({
        name: "X-API-Key",
        description: "API authentication token",
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "KYC data retrieved successfully",
        type: Object,
        schema: {
            properties: {
                success: { type: "boolean", example: true },
                data: { type: "object" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized - Missing or invalid X-API-Key",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Headers)("X-API-Key")),
    __param(1, (0, common_1.Param)("profile_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideokycController.prototype, "retrieveVideokyc", null);
exports.VideokycController = VideokycController = __decorate([
    (0, swagger_1.ApiTags)("V-KYC"),
    (0, common_1.Controller)("videokyc"),
    __metadata("design:paramtypes", [videokyc_service_1.VideokycService,
        order_service_1.OrdersService])
], VideokycController);
//# sourceMappingURL=videokyc.controller.js.map