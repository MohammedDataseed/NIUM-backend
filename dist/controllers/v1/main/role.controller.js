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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("../../../services/v1/role/role.service");
const role_model_1 = require("../../../database/models/role.model");
const opentracing = require("opentracing");
const role_dto_1 = require("../../../dto/role.dto");
const swagger_1 = require("@nestjs/swagger");
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-roles-request");
        try {
            const whereCondition = params;
            return await this.roleService.findAll(span, whereCondition);
        }
        finally {
            span.finish();
        }
    }
    async createRole(createRoleDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-role-request");
        try {
            return await this.roleService.createRole(span, createRoleDto);
        }
        finally {
            span.finish();
        }
    }
    async updateStatus(body) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-role-status");
        try {
            return await this.roleService.updateRole(span, body.hashed_key, body);
        }
        finally {
            span.finish();
        }
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all roles with optional filters" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Roles retrieved successfully",
        type: [role_model_1.Role],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new role" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Role created successfully",
        type: role_model_1.Role,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request - Invalid data" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)("status"),
    (0, swagger_1.ApiOperation)({ summary: "Update role status using hashed_key" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Role status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Role not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "updateStatus", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)("Roles"),
    (0, common_1.Controller)("roles"),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map