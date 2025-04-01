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
exports.ESign = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const order_model_1 = require("./order.model");
const esign_log_model_1 = require("./esign_log.model");
const crypto = require("crypto");
let ESign = class ESign extends sequelize_typescript_1.Model {
    static generatehashed_key(instance) {
        const randomPart = crypto.randomBytes(16).toString('hex');
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
    }
    static async logInsert(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit')
            return;
        const existingLog = await esign_log_model_1.ESignLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
        await esign_log_model_1.ESignLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            task_id: instance.task_id,
            group_id: instance.group_id,
            esign_file_details: instance.esign_file_details,
            esign_stamp_details: instance.esign_stamp_details,
            esign_invitees: instance.esign_invitees,
            esign_details: instance.esign_details,
            esign_doc_id: instance.esign_doc_id,
            status: instance.status,
            request_id: instance.request_id,
            completed_at: instance.completed_at,
            esign_expiry: instance.esign_expiry,
            active: instance.active,
            expired: instance.expired,
            rejected: instance.rejected,
            result: instance.result,
            esigners: instance.esigners,
            file_details: instance.file_details,
            request_details: instance.request_details,
            esign_irn: instance.esign_irn,
            esign_folder: instance.esign_folder,
            esign_type: instance.esign_type,
            esign_url: instance.esign_url,
            esigner_email: instance.esigner_email,
            esigner_phone: instance.esigner_phone,
            is_signed: instance.is_signed,
            type: instance.type,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logUpdate(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit')
            return;
        const existingLog = await esign_log_model_1.ESignLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
        await esign_log_model_1.ESignLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            task_id: instance.task_id,
            group_id: instance.group_id,
            esign_file_details: instance.esign_file_details,
            esign_stamp_details: instance.esign_stamp_details,
            esign_invitees: instance.esign_invitees,
            esign_details: instance.esign_details,
            esign_doc_id: instance.esign_doc_id,
            status: instance.status,
            request_id: instance.request_id,
            completed_at: instance.completed_at,
            esign_expiry: instance.esign_expiry,
            active: instance.active,
            expired: instance.expired,
            rejected: instance.rejected,
            result: instance.result,
            esigners: instance.esigners,
            file_details: instance.file_details,
            request_details: instance.request_details,
            esign_irn: instance.esign_irn,
            esign_folder: instance.esign_folder,
            esign_type: instance.esign_type,
            esign_url: instance.esign_url,
            esigner_email: instance.esigner_email,
            esigner_phone: instance.esigner_phone,
            is_signed: instance.is_signed,
            type: instance.type,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logDelete(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit')
            return;
        const existingLog = await esign_log_model_1.ESignLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔴 Logging DELETE for ID: ${instance.id}`);
        await esign_log_model_1.ESignLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            task_id: instance.task_id,
            group_id: instance.group_id,
            esign_file_details: instance.esign_file_details,
            esign_stamp_details: instance.esign_stamp_details,
            esign_invitees: instance.esign_invitees,
            esign_details: instance.esign_details,
            esign_doc_id: instance.esign_doc_id,
            status: instance.status,
            request_id: instance.request_id,
            completed_at: instance.completed_at,
            esign_expiry: instance.esign_expiry,
            active: instance.active,
            expired: instance.expired,
            rejected: instance.rejected,
            result: instance.result,
            esigners: instance.esigners,
            file_details: instance.file_details,
            request_details: instance.request_details,
            esign_irn: instance.esign_irn,
            esign_folder: instance.esign_folder,
            esign_type: instance.esign_type,
            esign_url: instance.esign_url,
            esigner_email: instance.esigner_email,
            esigner_phone: instance.esigner_phone,
            is_signed: instance.is_signed,
            type: instance.type,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.ESign = ESign;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ESign.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], ESign.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ESign.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => order_model_1.Order),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], ESign.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => order_model_1.Order, { foreignKey: 'order_id', targetKey: 'id' }),
    __metadata("design:type", order_model_1.Order)
], ESign.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ESign.prototype, "attempt_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ESign.prototype, "task_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ESign.prototype, "group_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false }),
    __metadata("design:type", Object)
], ESign.prototype, "esign_file_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false }),
    __metadata("design:type", Object)
], ESign.prototype, "esign_stamp_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false }),
    __metadata("design:type", Object)
], ESign.prototype, "esign_invitees", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], ESign.prototype, "esign_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esign_doc_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], ESign.prototype, "completed_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], ESign.prototype, "esign_expiry", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], ESign.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], ESign.prototype, "expired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], ESign.prototype, "rejected", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], ESign.prototype, "result", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], ESign.prototype, "esigners", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], ESign.prototype, "file_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], ESign.prototype, "request_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esign_irn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esign_folder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esign_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esign_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esigner_email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "esigner_phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], ESign.prototype, "is_signed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], ESign.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ESign]),
    __metadata("design:returntype", void 0)
], ESign, "generatehashed_key", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ESign, Object]),
    __metadata("design:returntype", Promise)
], ESign, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ESign, Object]),
    __metadata("design:returntype", Promise)
], ESign, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ESign, Object]),
    __metadata("design:returntype", Promise)
], ESign, "logDelete", null);
exports.ESign = ESign = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'esigns',
        timestamps: true,
    })
], ESign);
//# sourceMappingURL=esign.model.js.map