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
exports.Vkyc = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const order_model_1 = require("./order.model");
const vkyc_log_model_1 = require("./vkyc_log.model");
const crypto = require("crypto");
let Vkyc = class Vkyc extends sequelize_typescript_1.Model {
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
        const existingLog = await vkyc_log_model_1.VkycLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
        await vkyc_log_model_1.VkycLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            reference_id: instance.reference_id,
            profile_id: instance.profile_id,
            v_kyc_link: instance.v_kyc_link,
            v_kyc_link_expires: instance.v_kyc_link_expires,
            v_kyc_link_status: instance.v_kyc_link_status,
            v_kyc_comments: instance.v_kyc_comments,
            v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
            device_info: instance.device_info,
            profile_data: instance.profile_data,
            performed_by: instance.performed_by,
            resources_documents: instance.resources_documents,
            resources_documents_files: instance.resources_documents_files,
            resources_images: instance.resources_images,
            resources_images_files: instance.resources_images_files,
            resources_videos: instance.resources_videos,
            resources_videos_files: instance.resources_videos_files,
            resources_text: instance.resources_text,
            location_info: instance.location_info,
            first_name: instance.first_name,
            reviewer_action: instance.reviewer_action,
            tasks: instance.tasks,
            status: instance.status,
            status_description: instance.status_description,
            status_detail: instance.status_detail,
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
        const existingLog = await vkyc_log_model_1.VkycLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
        await vkyc_log_model_1.VkycLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            reference_id: instance.reference_id,
            profile_id: instance.profile_id,
            v_kyc_link: instance.v_kyc_link,
            v_kyc_link_expires: instance.v_kyc_link_expires,
            v_kyc_link_status: instance.v_kyc_link_status,
            v_kyc_comments: instance.v_kyc_comments,
            v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
            device_info: instance.device_info,
            profile_data: instance.profile_data,
            performed_by: instance.performed_by,
            resources_documents: instance.resources_documents,
            resources_documents_files: instance.resources_documents_files,
            resources_images: instance.resources_images,
            resources_images_files: instance.resources_images_files,
            resources_videos: instance.resources_videos,
            resources_videos_files: instance.resources_videos_files,
            resources_text: instance.resources_text,
            location_info: instance.location_info,
            first_name: instance.first_name,
            reviewer_action: instance.reviewer_action,
            tasks: instance.tasks,
            status: instance.status,
            status_description: instance.status_description,
            status_detail: instance.status_detail,
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
        const existingLog = await vkyc_log_model_1.VkycLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`);
            return;
        }
        await vkyc_log_model_1.VkycLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            partner_order_id: instance.partner_order_id,
            order_id: instance.order_id,
            attempt_number: instance.attempt_number,
            reference_id: instance.reference_id,
            profile_id: instance.profile_id,
            v_kyc_link: instance.v_kyc_link,
            v_kyc_link_expires: instance.v_kyc_link_expires,
            v_kyc_link_status: instance.v_kyc_link_status,
            v_kyc_comments: instance.v_kyc_comments,
            v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
            device_info: instance.device_info,
            profile_data: instance.profile_data,
            performed_by: instance.performed_by,
            resources_documents: instance.resources_documents,
            resources_documents_files: instance.resources_documents_files,
            resources_images: instance.resources_images,
            resources_images_files: instance.resources_images_files,
            resources_videos: instance.resources_videos,
            resources_videos_files: instance.resources_videos_files,
            resources_text: instance.resources_text,
            location_info: instance.location_info,
            first_name: instance.first_name,
            reviewer_action: instance.reviewer_action,
            tasks: instance.tasks,
            status: instance.status,
            status_description: instance.status_description,
            status_detail: instance.status_detail,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.Vkyc = Vkyc;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Vkyc.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], Vkyc.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Vkyc.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => order_model_1.Order),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Vkyc.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => order_model_1.Order, { foreignKey: 'order_id', targetKey: 'id' }),
    __metadata("design:type", order_model_1.Order)
], Vkyc.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Vkyc.prototype, "attempt_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Vkyc.prototype, "reference_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Vkyc.prototype, "profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Vkyc.prototype, "v_kyc_link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Vkyc.prototype, "v_kyc_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Vkyc.prototype, "v_kyc_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Vkyc.prototype, "v_kyc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], Vkyc.prototype, "v_kyc_doc_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], Vkyc.prototype, "device_info", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], Vkyc.prototype, "profile_data", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "performed_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_documents", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_documents_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_images", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_images_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_videos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_videos_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Array)
], Vkyc.prototype, "resources_text", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    __metadata("design:type", Object)
], Vkyc.prototype, "location_info", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Vkyc.prototype, "first_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Vkyc.prototype, "reviewer_action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Vkyc.prototype, "tasks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Vkyc.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Vkyc.prototype, "status_description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Vkyc.prototype, "status_detail", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true }),
    __metadata("design:type", String)
], Vkyc.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true }),
    __metadata("design:type", String)
], Vkyc.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vkyc]),
    __metadata("design:returntype", void 0)
], Vkyc, "generatehashed_key", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vkyc, Object]),
    __metadata("design:returntype", Promise)
], Vkyc, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vkyc, Object]),
    __metadata("design:returntype", Promise)
], Vkyc, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vkyc, Object]),
    __metadata("design:returntype", Promise)
], Vkyc, "logDelete", null);
exports.Vkyc = Vkyc = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vkycs',
        timestamps: true,
    })
], Vkyc);
//# sourceMappingURL=vkyc.model.js.map