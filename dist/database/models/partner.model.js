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
exports.Partner = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const role_model_1 = require("./role.model");
const products_model_1 = require("./products.model");
const user_model_1 = require("./user.model");
const partner_products_model_1 = require("./partner_products.model");
const partner_log_model_1 = require("./partner_log.model");
const crypto = require("crypto");
let Partner = class Partner extends sequelize_typescript_1.Model {
    static generatePublicKey(instance) {
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
        await partner_log_model_1.PartnerLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            role_id: instance.role_id,
            email: instance.email,
            first_name: instance.first_name,
            last_name: instance.last_name,
            password: instance.password,
            api_key: instance.api_key,
            is_active: instance.is_active,
            business_type: instance.business_type,
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
        await partner_log_model_1.PartnerLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            role_id: instance.role_id,
            email: instance.email,
            first_name: instance.first_name,
            last_name: instance.last_name,
            password: instance.password,
            api_key: instance.api_key,
            is_active: instance.is_active,
            business_type: instance.business_type,
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
        await partner_log_model_1.PartnerLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            role_id: instance.role_id,
            email: instance.email,
            first_name: instance.first_name,
            last_name: instance.last_name,
            password: instance.password,
            api_key: instance.api_key,
            is_active: instance.is_active,
            business_type: instance.business_type,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
        }, { transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null });
    }
};
exports.Partner = Partner;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], Partner.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], Partner.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => role_model_1.Role),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'role_id' }),
    __metadata("design:type", String)
], Partner.prototype, "role_id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'email' }),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'first_name' }),
    __metadata("design:type", String)
], Partner.prototype, "first_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'last_name' }),
    __metadata("design:type", String)
], Partner.prototype, "last_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'password' }),
    __metadata("design:type", String)
], Partner.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ field: 'api_key', type: sequelize_typescript_1.DataType.STRING, unique: true }),
    __metadata("design:type", String)
], Partner.prototype, "api_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_active' }),
    __metadata("design:type", Boolean)
], Partner.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        field: 'business_type',
    }),
    __metadata("design:type", String)
], Partner.prototype, "business_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], Partner.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], Partner.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => role_model_1.Role),
    __metadata("design:type", role_model_1.Role)
], Partner.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'created_by' }),
    __metadata("design:type", user_model_1.User)
], Partner.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'updated_by' }),
    __metadata("design:type", user_model_1.User)
], Partner.prototype, "updater", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => products_model_1.Products, () => partner_products_model_1.PartnerProducts),
    __metadata("design:type", Array)
], Partner.prototype, "products", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Partner]),
    __metadata("design:returntype", void 0)
], Partner, "generatePublicKey", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Partner, Object]),
    __metadata("design:returntype", Promise)
], Partner, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Partner, Object]),
    __metadata("design:returntype", Promise)
], Partner, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Partner, Object]),
    __metadata("design:returntype", Promise)
], Partner, "logDelete", null);
exports.Partner = Partner = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'partners',
        timestamps: true,
    })
], Partner);
//# sourceMappingURL=partner.model.js.map