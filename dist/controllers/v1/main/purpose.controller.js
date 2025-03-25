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
exports.PurposeController = void 0;
const common_1 = require("@nestjs/common");
const purpose_service_1 = require("../../../services/v1/purpose/purpose.service");
const purpose_model_1 = require("../../../database/models/purpose.model");
const opentracing = require("opentracing");
const purpose_dto_1 = require("../../../dto/purpose.dto");
const swagger_1 = require("@nestjs/swagger");
let PurposeController = class PurposeController {
    constructor(purposeService) {
        this.purposeService = purposeService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-purpose-type-request");
        try {
            const whereCondition = params;
            const purposes = await this.purposeService.findAll(span, whereCondition);
            return purposes.map((purpose) => ({
                purpose_type_id: purpose.hashed_key,
                purpose_name: purpose.purposeName,
            }));
        }
        finally {
            span.finish();
        }
    }
    async createPurposeType(createPurposeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-purpose-type-request");
        try {
            const newPurpose = await this.purposeService.createPurpose(span, createPurposeDto);
            return {
                purpose_type_id: newPurpose.hashed_key,
                purpose_name: newPurpose.purposeName,
            };
        }
        finally {
            span.finish();
        }
    }
    async update(purpose_type_id, updatePurposeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-purpose-type-request");
        try {
            await this.purposeService.updatePurpose(span, purpose_type_id, updatePurposeDto);
            return { message: "Purpose Type updated successfully" };
        }
        finally {
            span.finish();
        }
    }
    async delete(purpose_type_id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-purpose-type-request");
        try {
            await this.purposeService.deletePurposeType(span, purpose_type_id);
            return { message: "Purpose Type deleted successfully" };
        }
        finally {
            span.finish();
        }
    }
};
exports.PurposeController = PurposeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurposeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new purpose type" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The Purpose type has been successfully created.",
        type: purpose_model_1.Purpose,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purpose_dto_1.CreatePurposeDto]),
    __metadata("design:returntype", Promise)
], PurposeController.prototype, "createPurposeType", null);
__decorate([
    (0, common_1.Put)(":purpose_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a purpose type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Purpose Type updated successfully.",
        type: purpose_model_1.Purpose,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Purpose Type not found." }),
    (0, swagger_1.ApiBody)({ type: purpose_dto_1.UpdatePurposeDto }),
    __param(0, (0, common_1.Param)("purpose_type_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, purpose_dto_1.UpdatePurposeDto]),
    __metadata("design:returntype", Promise)
], PurposeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":purpose_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a purpose type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Purpose Type deleted successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Purpose Type not found." }),
    __param(0, (0, common_1.Param)("purpose_type_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurposeController.prototype, "delete", null);
exports.PurposeController = PurposeController = __decorate([
    (0, swagger_1.ApiTags)("Purpose"),
    (0, common_1.Controller)("purpose"),
    __metadata("design:paramtypes", [purpose_service_1.PurposeService])
], PurposeController);
//# sourceMappingURL=purpose.controller.js.map