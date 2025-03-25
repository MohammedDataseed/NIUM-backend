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
exports.PartnerController = void 0;
const common_1 = require("@nestjs/common");
const partner_service_1 = require("../../../services/v1/partner/partner.service");
const opentracing = require("opentracing");
const partner_dto_1 = require("../../../dto/partner.dto");
const swagger_1 = require("@nestjs/swagger");
const mailer_service_1 = require("../../../shared/services/mailer/mailer.service");
let PartnerController = class PartnerController {
    constructor(partnerService, mailService) {
        this.partnerService = partnerService;
        this.mailService = mailService;
    }
    async findAll() {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("get-all-partners");
        try {
            return await this.partnerService.findAllPartners(span);
        }
        finally {
            span.finish();
        }
    }
    async findByHashedKey(hashed_key) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("get-partner-by-hashed-key");
        try {
            return await this.partnerService.findPartnerByHashedKey(span, hashed_key);
        }
        finally {
            span.finish();
        }
    }
    async create(createPartnerDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-partner-request");
        try {
            return await this.partnerService.createPartner(span, createPartnerDto);
        }
        finally {
            span.finish();
        }
    }
    async update(hashed_key, updatePartnerDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-partner-request");
        try {
            return await this.partnerService.updatePartnerByHashedKey(span, hashed_key, updatePartnerDto);
        }
        finally {
            span.finish();
        }
    }
    async delete(hashed_key) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-partner-request");
        try {
            await this.partnerService.deletePartnerByHashedKey(span, hashed_key);
            return { message: "Partner deleted successfully" };
        }
        finally {
            span.finish();
        }
    }
};
exports.PartnerController = PartnerController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all partners" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all partners",
        type: [partner_dto_1.PartnerResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":hashed_key"),
    (0, swagger_1.ApiOperation)({ summary: "Get a partner by hashed key" }),
    (0, swagger_1.ApiParam)({
        name: "hashed_key",
        description: "Unique hashed key of the partner",
        example: "a1b2c3d4e5f6...",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Partner details",
        type: partner_dto_1.PartnerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Partner not found",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized",
    }),
    __param(0, (0, common_1.Param)("hashed_key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "findByHashedKey", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new partner" }),
    (0, swagger_1.ApiBody)({ type: partner_dto_1.CreatePartnerDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Partner created successfully",
        type: partner_dto_1.PartnerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":hashed_key"),
    (0, swagger_1.ApiOperation)({ summary: "Update a partner by hashed key" }),
    (0, swagger_1.ApiParam)({
        name: "hashed_key",
        description: "Unique hashed key of the partner",
        example: "a1b2c3d4e5f6...",
    }),
    (0, swagger_1.ApiBody)({ type: partner_dto_1.UpdatePartnerDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Partner updated successfully",
        type: partner_dto_1.PartnerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided",
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Partner not found",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized",
    }),
    __param(0, (0, common_1.Param)("hashed_key")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, partner_dto_1.UpdatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":hashed_key"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a partner by hashed key" }),
    (0, swagger_1.ApiParam)({
        name: "hashed_key",
        description: "Unique hashed key of the partner",
        example: "a1b2c3d4e5f6...",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Partner deleted successfully",
        type: Object,
        example: { message: "Partner deleted successfully" },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Partner not found",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized",
    }),
    __param(0, (0, common_1.Param)("hashed_key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "delete", null);
exports.PartnerController = PartnerController = __decorate([
    (0, swagger_1.ApiTags)("Partners"),
    (0, common_1.Controller)("partners"),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [partner_service_1.PartnerService,
        mailer_service_1.MailerService])
], PartnerController);
//# sourceMappingURL=partner.controller.js.map