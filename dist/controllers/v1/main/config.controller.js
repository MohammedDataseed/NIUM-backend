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
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const purpose_service_1 = require("../../../services/v1/purpose/purpose.service");
const documentType_service_1 = require("../../../services/v1/document/documentType.service");
const transaction_type_service_1 = require("../../../services/v1/transaction/transaction_type.service");
const order_service_1 = require("../../../services/v1/order/order.service");
const swagger_1 = require("@nestjs/swagger");
const opentracing = require("opentracing");
let ConfigController = class ConfigController {
    constructor(purposeService, documentTypeService, transactionTypeService, ordersService) {
        this.purposeService = purposeService;
        this.documentTypeService = documentTypeService;
        this.transactionTypeService = transactionTypeService;
        this.ordersService = ordersService;
    }
    async getConfigDetails(apiKey, partnerId, type) {
        if (!type) {
            throw new common_1.BadRequestException("Type parameter is required");
        }
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("get-master-details");
        try {
            await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
            switch (type.toLowerCase()) {
                case "purpose_type":
                    return this.purposeService.findAllConfig();
                case "document_type":
                    return this.documentTypeService.findAllConfig();
                case "transaction_type":
                    return this.transactionTypeService.findAllConfig();
                default:
                    throw new common_1.BadRequestException("Invalid type provided. Allowed values: purpose_type, document_type, transaction_type");
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Fetch configuration details by type",
        description: "Retrieve details for purpose types, document types, or transaction types using a query parameter.",
    }),
    (0, swagger_1.ApiQuery)({
        name: "type",
        enum: ["purpose_type", "document_type", "transaction_type"],
        required: true,
        description: "The type of configuration data to retrieve.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Configuration details retrieved successfully.",
        schema: { example: [{ hashed_key: "a1b2c3d4", purposeName: "Business" }] },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid type provided. Allowed values: purpose_type, document_type, transaction_type",
    }),
    __param(0, (0, common_1.Headers)("api_key")),
    __param(1, (0, common_1.Headers)("partner_id")),
    __param(2, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getConfigDetails", null);
exports.ConfigController = ConfigController = __decorate([
    (0, swagger_1.ApiTags)("Config"),
    (0, common_1.Controller)("config"),
    __metadata("design:paramtypes", [purpose_service_1.PurposeService,
        documentType_service_1.DocumentTypeService,
        transaction_type_service_1.transaction_typeService,
        order_service_1.OrdersService])
], ConfigController);
//# sourceMappingURL=config.controller.js.map