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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bank_account = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const bank_account_log_model_1 = require("./bank_account_log.model");
const crypto = require("crypto");
let bank_account = class bank_account extends sequelize_typescript_1.Model {
    static generatehashed_key(instance) {
        const randomPart = crypto.randomBytes(16).toString('hex');
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
    }
    static async logInsert(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
        const existingLog = await bank_account_log_model_1.BankAccountLog.findOne({
            where: { id: instance.id },
        });
        if (existingLog) {
            console.log(`⚠️ Log already exists for ID: ${instance.id}, skipping duplicate log.`);
            return;
        }
        await bank_account_log_model_1.BankAccountLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            account_holder_name: instance.account_holder_name,
            account_number: instance.account_number,
            bank_name: instance.bank_name,
            bank_branch: instance.bank_branch,
            ifsc_code: instance.ifsc_code,
            is_beneficiary: instance.is_beneficiary,
            createdAt: instance.createdAt,
            updatedAt: (_a = instance.updatedAt) !== null && _a !== void 0 ? _a : new Date(),
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logUpdate(instance, options) {
        var _a;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping update log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
        const existingLog = await bank_account_log_model_1.BankAccountLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
        });
        if (existingLog) {
            console.log(`⚠️ Update log already exists for ID: ${instance.id}, skipping duplicate.`);
            return;
        }
        await bank_account_log_model_1.BankAccountLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            account_holder_name: instance.account_holder_name,
            account_number: instance.account_number,
            bank_name: instance.bank_name,
            bank_branch: instance.bank_branch,
            ifsc_code: instance.ifsc_code,
            is_beneficiary: instance.is_beneficiary,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null });
    }
    static async logDelete(instance, options) {
        var _a;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        console.log(`🔴 Logging DELETE for ID: ${instance.id}`);
        const existingLog = await bank_account_log_model_1.BankAccountLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
        });
        if (existingLog) {
            console.log(`⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`);
            return;
        }
        await bank_account_log_model_1.BankAccountLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            account_holder_name: instance.account_holder_name,
            account_number: instance.account_number,
            bank_name: instance.bank_name,
            bank_branch: instance.bank_branch,
            ifsc_code: instance.ifsc_code,
            is_beneficiary: instance.is_beneficiary,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null });
    }
};
exports.bank_account = bank_account;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], bank_account.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], bank_account.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'account_holder_name' }),
    __metadata("design:type", String)
], bank_account.prototype, "account_holder_name", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'account_number' }),
    __metadata("design:type", String)
], bank_account.prototype, "account_number", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'bank_name' }),
    __metadata("design:type", String)
], bank_account.prototype, "bank_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'bank_branch' }),
    __metadata("design:type", String)
], bank_account.prototype, "bank_branch", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'ifsc_code' }),
    __metadata("design:type", String)
], bank_account.prototype, "ifsc_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: 'is_beneficiary',
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], bank_account.prototype, "is_beneficiary", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], bank_account.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], bank_account.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account]),
    __metadata("design:returntype", void 0)
], bank_account, "generatehashed_key", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account, Object]),
    __metadata("design:returntype", Promise)
], bank_account, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account, Object]),
    __metadata("design:returntype", Promise)
], bank_account, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account, Object]),
    __metadata("design:returntype", Promise)
], bank_account, "logDelete", null);
exports.bank_account = bank_account = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'bank_accounts',
        timestamps: true,
    })
], bank_account);
//# sourceMappingURL=bank_account.model.js.map