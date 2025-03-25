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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const role_model_1 = require("../../../database/models/role.model");
const branch_model_1 = require("../../../database/models/branch.model");
const bank_account_model_1 = require("../../../database/models/bank_account.model");
const tracer_service_1 = require("../../../shared/services/tracer/tracer.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const mailer_service_1 = require("../../../shared/services/mailer/mailer.service");
const jsonwebtoken_1 = require("jsonwebtoken");
let UserService = class UserService {
    constructor(userRepository, branchRepository, roleRepository, bankAccountRepository, tracerService, jwtService, mailService) {
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.roleRepository = roleRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.tracerService = tracerService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async createUser(span, createUserDto, jwt) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        let decodedToken;
        try {
            decodedToken = this.jwtService.verify(jwt);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const userRole = decodedToken.role;
        if (!(userRole === 'admin' || userRole === 'co-admin')) {
            throw new common_1.HttpException('Unauthorized to create user', common_1.HttpStatus.FORBIDDEN);
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
        }
        try {
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
            const hashedKey = crypto.createHash("sha256").update(createUserDto.email).digest("hex");
            const user = await this.userRepository.create(Object.assign(Object.assign({}, createUserDto), { hashed_key: hashedKey, role_id: createUserDto.role_id, branch_id: createUserDto.branch_id, bank_account_id: createUserDto.bank_account_id }));
            return {
                message: "User added successfully",
                user,
            };
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            childSpan.finish();
        }
    }
    isValidUUID(uuid) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
    }
    async updateUser(span, id, updateUserDto) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            const user = await this.userRepository.findByPk(id);
            if (!user)
                throw new common_1.NotFoundException("User not found");
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: updateUserDto.email },
                });
                if (existingUser)
                    throw new common_1.UnauthorizedException("Email is already in use");
            }
            await user.update(updateUserDto);
            return user;
        }
        finally {
            childSpan.finish();
        }
    }
    async deleteUser(span, id) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            const user = await this.userRepository.findByPk(id);
            if (!user)
                throw new common_1.NotFoundException("User not found");
            await user.destroy();
            childSpan.log({ event: "user_deleted", userId: id });
        }
        finally {
            childSpan.finish();
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email },
            attributes: { exclude: ["role_id", "branch_id", "bank_account_id"] },
            include: [
                { model: role_model_1.Role, as: "role", attributes: ["id", "name"] },
                { model: branch_model_1.Branch, as: "branch", attributes: ["id", "name"] },
                {
                    model: bank_account_model_1.bank_account,
                    as: "bank_account",
                    attributes: [
                        "id",
                        "account_number",
                        "ifsc_code",
                        "bank_name",
                        "bank_branch",
                    ],
                },
            ],
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role.name
        };
        const safeUser = user.get({ plain: true });
        delete safeUser.password;
        return {
            user: safeUser,
            access_token: this.jwtService.sign(payload, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
            }),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d",
            }),
        };
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.userRepository.findAll({
                where: params,
                attributes: { exclude: ["password"] },
                include: [
                    { model: role_model_1.Role, as: "role", attributes: ["id", "name"] },
                    { model: branch_model_1.Branch, as: "branch", attributes: ["id", "name"] },
                    {
                        model: bank_account_model_1.bank_account,
                        as: "bank_account",
                        attributes: ["id", "account_number", "ifsc_code", "bank_name", "bank_branch"],
                    },
                ],
            });
        }
        finally {
            childSpan.finish();
        }
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return user;
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            return {
                access_token: this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: "1h" }),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid or expired refresh token");
        }
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const resetToken = this.jwtService.sign({ email, type: "reset" }, { expiresIn: "15m" });
        const resetUrl = `https://nium-forex-agent-portal.vercel.app/reset-password?token=${resetToken}`;
        try {
            await this.mailService.sendMail(email, "Password Reset Request", `Click the link to reset your password: ${resetUrl}`, `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`);
            return { message: "Password reset link sent to your email." };
        }
        catch (error) {
            console.error("Error sending reset email:", error);
            throw new common_1.InternalServerErrorException("Failed to send password reset email");
        }
    }
    async resetPassword(token, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword)
            throw new common_1.UnauthorizedException("Passwords do not match");
        let payload;
        try {
            payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            if (payload.type !== "reset")
                throw new common_1.UnauthorizedException("Invalid token type");
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid or expired token");
        }
        const user = await this.userRepository.findOne({
            where: { email: payload.email },
        });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return { message: "Password reset successfully." };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("USER_REPOSITORY")),
    __param(1, (0, common_1.Inject)("BRANCH_REPOSITORY")),
    __param(2, (0, common_1.Inject)("ROLE_REPOSITORY")),
    __param(3, (0, common_1.Inject)("BANK_ACCOUNT_REPOSITORY")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, tracer_service_1.TracerService,
        jwt_1.JwtService,
        mailer_service_1.MailerService])
], UserService);
//# sourceMappingURL=user.service.js.map