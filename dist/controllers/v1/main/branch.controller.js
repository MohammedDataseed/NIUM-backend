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
exports.BranchController = void 0;
const common_1 = require("@nestjs/common");
const branch_service_1 = require("../../../services/v1/branch/branch.service");
const branch_model_1 = require("../../../database/models/branch.model");
const opentracing = require("opentracing");
const branch_dto_1 = require("../../../dto/branch.dto");
const swagger_1 = require("@nestjs/swagger");
let BranchController = class BranchController {
    constructor(branchService) {
        this.branchService = branchService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-branches-request");
        const whereCondition = params;
        const result = await this.branchService.findAll(span, whereCondition);
        span.finish();
        return result;
    }
    async createBranch(createBranchDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-branch-request");
        try {
            return await this.branchService.createBranch(span, createBranchDto);
        }
        finally {
            span.finish();
        }
    }
};
exports.BranchController = BranchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new branch" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The branch has been successfully created.",
        type: branch_model_1.Branch,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_dto_1.CreateBranchDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "createBranch", null);
exports.BranchController = BranchController = __decorate([
    (0, swagger_1.ApiTags)("Branches"),
    (0, common_1.Controller)("branches"),
    __metadata("design:paramtypes", [branch_service_1.BranchService])
], BranchController);
//# sourceMappingURL=branch.controller.js.map