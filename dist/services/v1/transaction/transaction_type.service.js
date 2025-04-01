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
exports.transaction_typeService = void 0;
const common_1 = require("@nestjs/common");
let transaction_typeService = class transaction_typeService {
    constructor(transaction_typeRepository) {
        this.transaction_typeRepository = transaction_typeRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.transaction_typeRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async createtransaction_type(span, createtransaction_typeDto) {
        const childSpan = span
            .tracer()
            .startSpan("create-transaction-type", { childOf: span });
        try {
            const existingtransaction_type = await this.transaction_typeRepository.findOne({
                where: { name: createtransaction_typeDto.transaction_name },
            });
            if (existingtransaction_type) {
                throw new common_1.ConflictException("Transaction Type already exists");
            }
            console.log("Received DTO:", createtransaction_typeDto);
            return await this.transaction_typeRepository.create({
                name: createtransaction_typeDto.transaction_name,
                created_by: createtransaction_typeDto.created_by,
                updated_by: createtransaction_typeDto.updated_by,
            });
        }
        finally {
            childSpan.finish();
        }
    }
    async updatetransaction_type(span, hashed_key, updatetransaction_typeDto) {
        var _a, _b, _c;
        const childSpan = span
            .tracer()
            .startSpan("update-transaction-type", { childOf: span });
        try {
            const transaction_type = await this.transaction_typeRepository.findOne({
                where: { hashed_key },
            });
            if (!transaction_type) {
                throw new common_1.NotFoundException("Transaction Type not found");
            }
            if (updatetransaction_typeDto.transaction_name) {
                const existingtransaction_type = await this.transaction_typeRepository.findOne({
                    where: { name: updatetransaction_typeDto.transaction_name },
                });
                if (existingtransaction_type &&
                    existingtransaction_type.id !== hashed_key) {
                    throw new common_1.ConflictException("Another Transaction Type with the same name already exists");
                }
            }
            await transaction_type.update({
                name: (_a = updatetransaction_typeDto.transaction_name) !== null && _a !== void 0 ? _a : transaction_type.name,
                isActive: (_b = updatetransaction_typeDto.is_active) !== null && _b !== void 0 ? _b : transaction_type.isActive,
                updated_by: (_c = updatetransaction_typeDto.updated_by) !== null && _c !== void 0 ? _c : transaction_type.updated_by,
            });
            return transaction_type;
        }
        finally {
            childSpan.finish();
        }
    }
    async findAllConfig() {
        const transaction = await this.transaction_typeRepository.findAll({
            where: { isActive: true },
        });
        return transaction.map((transaction) => ({
            id: transaction.hashed_key,
            text: transaction.name,
        }));
    }
    async deletetransaction_type(span, hashed_key) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            const transaction_type = await this.transaction_typeRepository.findOne({
                where: { hashed_key },
            });
            if (!transaction_type)
                throw new common_1.NotFoundException("Transaction Type not found");
            await transaction_type.destroy();
            childSpan.log({
                event: "transaction_type_deleted",
                transaction_type_id: hashed_key,
            });
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.transaction_typeService = transaction_typeService;
exports.transaction_typeService = transaction_typeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("TRANSACTION_TYPE_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], transaction_typeService);
//# sourceMappingURL=transaction_type.service.js.map