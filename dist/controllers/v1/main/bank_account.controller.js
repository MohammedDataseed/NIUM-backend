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
exports.BankAccountController = void 0;
const common_1 = require("@nestjs/common");
const bank_account_service_1 = require("../../../services/v1/bank_account/bank_account.service");
const bank_account_model_1 = require("../../../database/models/bank_account.model");
const opentracing = require("opentracing");
const bank_account_dto_1 = require("../../../dto/bank_account.dto");
const swagger_1 = require("@nestjs/swagger");
let BankAccountController = class BankAccountController {
    constructor(bankAccountService) {
        this.bankAccountService = bankAccountService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-bank-accounts-request");
        try {
            span.log({ event: "query-start", filters: params });
            const whereCondition = params;
            const accounts = await this.bankAccountService.findAll(span, whereCondition);
            span.log({ event: "query-success", count: accounts.length });
            return accounts;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "query-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async findOne(id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-bank-account-by-id-request");
        try {
            span.log({ event: "searching-bank-account", accountId: id });
            const account = await this.bankAccountService.findOne(span, id);
            span.log({ event: "bank-account-found", accountId: id });
            return account;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "bank-account-not-found", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async createBankAccount(createBankAccountDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-bank-account-request");
        try {
            span.log({
                event: "creating-bank-account",
                account_holder_name: createBankAccountDto.account_holder_name,
            });
            const account = await this.bankAccountService.createBankAccount(span, createBankAccountDto);
            span.log({ event: "bank-account-created", accountId: account.id });
            return account;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "creation-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async updateBankAccount(id, updateBankAccountDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-bank-account-request");
        try {
            span.log({ event: "updating-bank-account", accountId: id });
            const account = await this.bankAccountService.updateBankAccount(span, id, updateBankAccountDto);
            span.log({ event: "bank-account-updated", accountId: account.id });
            return account;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "update-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async deleteBankAccount(id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-bank-account-request");
        try {
            span.log({ event: "deleting-bank-account", accountId: id });
            await this.bankAccountService.deleteBankAccount(span, id);
            span.log({ event: "bank-account-deleted", accountId: id });
            return { message: "Bank account successfully deleted" };
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "delete-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
};
exports.BankAccountController = BankAccountController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all bank accounts with optional filtering" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of bank accounts",
        type: [bank_account_model_1.bank_account],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a bank account by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bank Account ID", type: "string" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Bank Account details",
        type: bank_account_model_1.bank_account,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bank Account not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new bank account" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Bank account successfully created",
        type: bank_account_model_1.bank_account,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid data provided" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account_dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "createBankAccount", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update an existing bank account" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bank Account ID", type: "string" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Bank account successfully updated",
        type: bank_account_model_1.bank_account,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bank account not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "updateBankAccount", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a bank account" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bank Account ID", type: "string" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Bank account successfully deleted",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bank account not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "deleteBankAccount", null);
exports.BankAccountController = BankAccountController = __decorate([
    (0, swagger_1.ApiTags)("Bank Accounts"),
    (0, common_1.Controller)("bank-accounts"),
    __metadata("design:paramtypes", [bank_account_service_1.BankAccountService])
], BankAccountController);
//# sourceMappingURL=bank_account.controller.js.map