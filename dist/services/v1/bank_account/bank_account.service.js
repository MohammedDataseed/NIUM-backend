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
exports.BankAccountService = void 0;
const common_1 = require("@nestjs/common");
let BankAccountService = class BankAccountService {
    constructor(bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("find-all-bank-accounts", { childOf: span });
        try {
            return await this.bankAccountRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async findOne(span, id) {
        const childSpan = span.tracer().startSpan("find-bank-account", { childOf: span });
        try {
            const account = await this.bankAccountRepository.findByPk(id);
            if (!account) {
                throw new common_1.NotFoundException("Bank account not found");
            }
            return account;
        }
        finally {
            childSpan.finish();
        }
    }
    async createBankAccount(span, createBankAccountDto) {
        const childSpan = span.tracer().startSpan("create-bank-account", { childOf: span });
        try {
            const existingAccount = await this.bankAccountRepository.findOne({
                where: { account_number: createBankAccountDto.account_number },
            });
            if (existingAccount) {
                throw new common_1.ConflictException("Bank account already exists");
            }
            const account = this.bankAccountRepository.build(Object.assign(Object.assign({}, createBankAccountDto), { hashed_key: this.generateHashedKey(createBankAccountDto.account_number) }));
            await account.save();
            return account;
        }
        finally {
            childSpan.finish();
        }
    }
    async updateBankAccount(span, id, updateBankAccountDto) {
        const childSpan = span.tracer().startSpan("update-bank-account", { childOf: span });
        try {
            const account = await this.bankAccountRepository.findByPk(id);
            if (!account) {
                throw new common_1.NotFoundException("Bank account not found");
            }
            await account.update(updateBankAccountDto);
            return account;
        }
        finally {
            childSpan.finish();
        }
    }
    async deleteBankAccount(span, id) {
        const childSpan = span.tracer().startSpan("delete-bank-account", { childOf: span });
        try {
            const account = await this.bankAccountRepository.findByPk(id);
            if (!account) {
                throw new common_1.NotFoundException("Bank account not found");
            }
            await account.destroy();
        }
        finally {
            childSpan.finish();
        }
    }
    generateHashedKey(accountNumber) {
        const crypto = require("crypto");
        return crypto.createHash("sha256").update(accountNumber).digest("hex");
    }
};
exports.BankAccountService = BankAccountService;
exports.BankAccountService = BankAccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("BANK_ACCOUNT_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], BankAccountService);
//# sourceMappingURL=bank_account.service.js.map