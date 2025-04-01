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
exports.Documents = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const documentType_model_1 = require("./documentType.model");
const purpose_model_1 = require("./purpose.model");
const documents_log_model_1 = require("./documents_log.model");
const crypto = require("crypto");
let Documents = class Documents extends sequelize_typescript_1.Model {
    static generatePublicKey(instance) {
        if (!instance.hashed_key) {
            const randomPart = crypto.randomBytes(16).toString('hex');
            const timestampPart = Date.now().toString(36);
            instance.hashed_key = `${randomPart}${timestampPart}`;
        }
    }
    static async logInsert(instance, options) {
        var _a, _b, _c;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        const existingLog = await documents_log_model_1.DocumentsLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.documentId}`);
        await documents_log_model_1.DocumentsLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.documentId,
            hashed_key: instance.hashed_key,
            entityId: instance.entityId,
            entityType: instance.entityType,
            purpose_id: instance.purposeId,
            document_type_id: instance.document_type_id,
            document_name: instance.document_name,
            documentUrl: instance.documentUrl,
            status: instance.status,
            documentExpiry: instance.documentExpiry,
            isDocFrontImage: instance.isDocFrontImage,
            isDocBackImage: instance.isDocBackImage,
            isUploaded: instance.isUploaded,
            isCustomer: instance.isCustomer,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: (_b = instance.updatedAt) !== null && _b !== void 0 ? _b : new Date(),
        }, { transaction: (_c = options.transaction) !== null && _c !== void 0 ? _c : null });
    }
    static async logUpdate(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping update log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        const existingLog = await documents_log_model_1.DocumentsLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.documentId}`);
        await documents_log_model_1.DocumentsLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.documentId,
            hashed_key: instance.hashed_key,
            entityId: instance.entityId,
            entityType: instance.entityType,
            purpose_id: instance.purposeId,
            document_type_id: instance.document_type_id,
            document_name: instance.document_name,
            documentUrl: instance.documentUrl,
            status: instance.status,
            documentExpiry: instance.documentExpiry,
            isDocFrontImage: instance.isDocFrontImage,
            isDocBackImage: instance.isDocBackImage,
            isUploaded: instance.isUploaded,
            isCustomer: instance.isCustomer,
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
        const existingLog = await documents_log_model_1.DocumentsLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`);
            return;
        }
        console.log(`🔴 Logging DELETE for ID: ${instance.documentId}`);
        await documents_log_model_1.DocumentsLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.documentId,
            hashed_key: instance.hashed_key,
            entityId: instance.entityId,
            entityType: instance.entityType,
            purpose_id: instance.purposeId,
            document_type_id: instance.document_type_id,
            document_name: instance.document_name,
            documentUrl: instance.documentUrl,
            status: instance.status,
            documentExpiry: instance.documentExpiry,
            isDocFrontImage: instance.isDocFrontImage,
            isDocBackImage: instance.isDocBackImage,
            isUploaded: instance.isUploaded,
            isCustomer: instance.isCustomer,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.Documents = Documents;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        field: 'id',
    }),
    __metadata("design:type", String)
], Documents.prototype, "documentId", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], Documents.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'entity_id' }),
    __metadata("design:type", String)
], Documents.prototype, "entityId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('user', 'customer'), field: 'entity_type' }),
    __metadata("design:type", String)
], Documents.prototype, "entityType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => purpose_model_1.Purpose),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'purpose_id' }),
    __metadata("design:type", String)
], Documents.prototype, "purposeId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => documentType_model_1.DocumentType),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'document_type_id' }),
    __metadata("design:type", String)
], Documents.prototype, "document_type_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'document_name' }),
    __metadata("design:type", String)
], Documents.prototype, "document_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        field: 'document_url',
        validate: {
            isObject(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('document_url must be a valid JSON object');
                }
            },
        },
    }),
    __metadata("design:type", Object)
], Documents.prototype, "documentUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('pending'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'approved', 'rejected'),
        field: 'status',
    }),
    __metadata("design:type", String)
], Documents.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'document_expiry' }),
    __metadata("design:type", Date)
], Documents.prototype, "documentExpiry", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_doc_front_image' }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isDocFrontImage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_doc_back_image' }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isDocBackImage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_uploaded' }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isUploaded", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_customer' }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isCustomer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], Documents.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], Documents.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Documents]),
    __metadata("design:returntype", void 0)
], Documents, "generatePublicKey", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Documents, Object]),
    __metadata("design:returntype", Promise)
], Documents, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Documents, Object]),
    __metadata("design:returntype", Promise)
], Documents, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Documents, Object]),
    __metadata("design:returntype", Promise)
], Documents, "logDelete", null);
exports.Documents = Documents = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'documents',
        timestamps: true,
    })
], Documents);
//# sourceMappingURL=documents.model.js.map