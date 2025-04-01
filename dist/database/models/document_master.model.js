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
exports.DocumentMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const crypto = require("crypto");
const user_model_1 = require("./user.model");
const purpose_model_1 = require("./purpose.model");
const document_master_log_model_1 = require("./document_master_log.model");
let DocumentMaster = class DocumentMaster extends sequelize_typescript_1.Model {
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
        const existingLog = await document_master_log_model_1.DocumentMasterLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
        await document_master_log_model_1.DocumentMasterLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            purpose_id: instance.purposeId,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logUpdate(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping update log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        const existingLog = await document_master_log_model_1.DocumentMasterLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
        await document_master_log_model_1.DocumentMasterLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            purpose_id: instance.purposeId,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logDelete(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        console.log(`🔴 Logging DELETE for ID: ${instance.id}`);
        const existingLog = await document_master_log_model_1.DocumentMasterLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`);
            return;
        }
        await document_master_log_model_1.DocumentMasterLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            purpose_id: instance.purposeId,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.DocumentMaster = DocumentMaster;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'document_type' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "documentType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => purpose_model_1.Purpose),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'purpose_id' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "purposeId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], DocumentMaster.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentMaster]),
    __metadata("design:returntype", void 0)
], DocumentMaster, "generatehashed_key", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentMaster, Object]),
    __metadata("design:returntype", Promise)
], DocumentMaster, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentMaster, Object]),
    __metadata("design:returntype", Promise)
], DocumentMaster, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentMaster, Object]),
    __metadata("design:returntype", Promise)
], DocumentMaster, "logDelete", null);
exports.DocumentMaster = DocumentMaster = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'document_master',
        timestamps: true,
    })
], DocumentMaster);
//# sourceMappingURL=document_master.model.js.map