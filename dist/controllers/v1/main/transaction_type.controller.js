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
exports.transaction_typeController = void 0;
const common_1 = require("@nestjs/common");
const transaction_type_service_1 = require("../../../services/v1/transaction/transaction_type.service");
const transaction_type_model_1 = require("../../../database/models/transaction_type.model");
const opentracing = require("opentracing");
const transaction_type_dto_1 = require("../../../dto/transaction_type.dto");
const swagger_1 = require("@nestjs/swagger");
let transaction_typeController = class transaction_typeController {
    constructor(transaction_typeService) {
        this.transaction_typeService = transaction_typeService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-transaction-types-request");
        try {
            const whereCondition = params;
            const transaction_type = await this.transaction_typeService.findAll(span, whereCondition);
            return transaction_type.map((doc) => ({
                transaction_type_id: doc.hashed_key,
                transaction_name: doc.name,
            }));
        }
        finally {
            span.finish();
        }
    }
    async createtransaction_type(createtransaction_typeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-transaction-type-request");
        try {
            const newTransaction = await this.transaction_typeService.createtransaction_type(span, createtransaction_typeDto);
            return {
                transaction_type_id: newTransaction.hashed_key,
                transaction_name: newTransaction.name,
            };
        }
        finally {
            span.finish();
        }
    }
    async update(transaction_type_id, updatetransaction_typeDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-transaction-type-request");
        try {
            await this.transaction_typeService.updatetransaction_type(span, transaction_type_id, updatetransaction_typeDto);
            return { message: "Purpose Type updated successfully" };
        }
        finally {
            span.finish();
        }
    }
    async delete(transaction_type_id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-transaction-type-request");
        try {
            await this.transaction_typeService.deletetransaction_type(span, transaction_type_id);
            return { message: "Transaction Type deleted successfully" };
        }
        finally {
            span.finish();
        }
    }
};
exports.transaction_typeController = transaction_typeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], transaction_typeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new transaction type" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The transaction type has been successfully created.",
        type: transaction_type_model_1.transaction_type,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_type_dto_1.Createtransaction_typeDto]),
    __metadata("design:returntype", Promise)
], transaction_typeController.prototype, "createtransaction_type", null);
__decorate([
    (0, common_1.Put)(":transaction_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a transaction type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Transaction Type updated successfully.",
        type: transaction_type_model_1.transaction_type,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid data provided.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Transaction Type not found." }),
    (0, swagger_1.ApiBody)({ type: transaction_type_dto_1.Updatetransaction_typeDto }),
    __param(0, (0, common_1.Param)("transaction_type_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transaction_type_dto_1.Updatetransaction_typeDto]),
    __metadata("design:returntype", Promise)
], transaction_typeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":transaction_type_id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a Transaction type" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Transaction Type deleted successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Transaction Type not found." }),
    __param(0, (0, common_1.Param)("transaction_type_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], transaction_typeController.prototype, "delete", null);
exports.transaction_typeController = transaction_typeController = __decorate([
    (0, swagger_1.ApiTags)("transaction_type"),
    (0, common_1.Controller)("transaction_type"),
    __metadata("design:paramtypes", [transaction_type_service_1.transaction_typeService])
], transaction_typeController);
//# sourceMappingURL=transaction_type.controller.js.map