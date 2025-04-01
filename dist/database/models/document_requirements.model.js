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
exports.DocumentRequirements = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const crypto = require("crypto");
const document_requirements_log_model_1 = require("./document-requirements-log.model");
let DocumentRequirements = class DocumentRequirements extends sequelize_typescript_1.Model {
    static generatehashed_key(instance) {
        const randomPart = crypto.randomBytes(16).toString('hex');
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
    }
    static async logInsert(instance, options) {
        var _a;
        if (!options.transaction)
            return;
        await document_requirements_log_model_1.DocumentRequirementsLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            is_required: instance.isRequired,
            createdAt: instance.createdAt,
            updatedAt: (_a = instance.updatedAt) !== null && _a !== void 0 ? _a : new Date(),
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: options.transaction });
    }
    static async logUpdate(instance, options) {
        if (!options.transaction)
            return;
        await document_requirements_log_model_1.DocumentRequirementsLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            is_required: instance.isRequired,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: options.transaction });
    }
    static async logDelete(instance, options) {
        if (!options.transaction)
            return;
        await document_requirements_log_model_1.DocumentRequirementsLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            document_type: instance.documentType,
            is_required: instance.isRequired,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: options.transaction });
    }
};
exports.DocumentRequirements = DocumentRequirements;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], DocumentRequirements.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], DocumentRequirements.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'document_type' }),
    __metadata("design:type", String)
], DocumentRequirements.prototype, "documentType", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_required' }),
    __metadata("design:type", Boolean)
], DocumentRequirements.prototype, "isRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], DocumentRequirements.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], DocumentRequirements.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentRequirements]),
    __metadata("design:returntype", void 0)
], DocumentRequirements, "generatehashed_key", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentRequirements, Object]),
    __metadata("design:returntype", Promise)
], DocumentRequirements, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentRequirements, Object]),
    __metadata("design:returntype", Promise)
], DocumentRequirements, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentRequirements, Object]),
    __metadata("design:returntype", Promise)
], DocumentRequirements, "logDelete", null);
exports.DocumentRequirements = DocumentRequirements = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'document_requirements',
        timestamps: true,
    })
], DocumentRequirements);
//# sourceMappingURL=document_requirements.model.js.map