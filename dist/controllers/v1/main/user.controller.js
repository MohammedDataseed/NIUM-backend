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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../../services/v1/user/user.service");
const user_model_1 = require("../../../database/models/user.model");
const opentracing = require("opentracing");
const user_dto_1 = require("../../../dto/user.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../../../auth/jwt.guard");
const login_dto_1 = require("../../../dto/login.dto");
const mailer_service_1 = require("../../../shared/services/mailer/mailer.service");
let UserController = class UserController {
    constructor(userService, mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-users-request");
        const whereCondition = params;
        const result = await this.userService.findAll(span, whereCondition);
        span.finish();
        return result;
    }
    async createUser(createUserDto, authHeader) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-user-request");
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace("Bearer ", "");
        if (!token) {
            throw new common_1.UnauthorizedException("Authorization token is missing or invalid");
        }
        try {
            return await this.userService.createUser(span, createUserDto, token);
        }
        finally {
            span.finish();
        }
    }
    async update(id, updateUserDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-user-request");
        try {
            return await this.userService.updateUser(span, id, updateUserDto);
        }
        finally {
            span.finish();
        }
    }
    async delete(id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-user-request");
        try {
            await this.userService.deleteUser(span, id);
            return { message: "User deleted successfully" };
        }
        finally {
            span.finish();
        }
    }
    async login(loginDto) {
        return this.userService.login(loginDto);
    }
    async findByEmail(email) {
        return await this.userService.findByEmail(email);
    }
    async refreshToken(refreshToken) {
        return await this.userService.refreshToken(refreshToken);
    }
    async forgotPassword(email) {
        return await this.userService.forgotPassword(email);
    }
    async resetPassword(token, newPassword, confirmPassword) {
        return await this.userService.resetPassword(token, newPassword, confirmPassword);
    }
    async sendEmail(body) {
        const { to, subject, text, html } = body;
        try {
            const result = await this.mailService.sendMail(to, subject, text, html);
            return { message: "Email sent successfully", result };
        }
        catch (error) {
            return { message: "Failed to send email", error: error.message };
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new user" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The user has been successfully created.",
        type: user_model_1.User,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a user" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The user has been successfully updated.",
        type: user_model_1.User,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    (0, swagger_1.ApiBody)({ type: user_dto_1.UpdateUserDto }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User successfully deleted." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "User login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User logged in successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)("email"),
    (0, swagger_1.ApiOperation)({ summary: "Find user by email" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User found", type: user_model_1.User }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Query)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)("refresh"),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                refresh_token: { type: "string", example: "your_refresh_token_here" },
            },
            required: ["refresh_token"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "New access token generated" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid or expired refresh token" }),
    __param(0, (0, common_1.Body)("refresh_token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, swagger_1.ApiOperation)({ summary: "Send password reset link" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "user@example.com" },
            },
            required: ["email"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset link sent" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, swagger_1.ApiOperation)({ summary: "Reset user password" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                token: { type: "string", example: "your_reset_token_here" },
                newPassword: { type: "string", example: "NewSecurePassword123!" },
                confirmPassword: { type: "string", example: "NewSecurePassword123!" },
            },
            required: ["token", "newPassword", "confirmPassword"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Passwords do not match" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid or expired token" }),
    __param(0, (0, common_1.Body)("token")),
    __param(1, (0, common_1.Body)("newPassword")),
    __param(2, (0, common_1.Body)("confirmPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)("send-email"),
    (0, swagger_1.ApiOperation)({
        summary: "Send an email",
        description: "Sends an email to the specified recipient.",
    }),
    (0, swagger_1.ApiBody)({
        type: user_dto_1.SendEmailDto,
        description: "Email details required to send an email",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Email sent successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid request data" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Failed to send email" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendEmail", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mailer_service_1.MailerService])
], UserController);
//# sourceMappingURL=user.controller.js.map