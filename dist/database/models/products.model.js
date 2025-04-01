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
exports.Products = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const partner_model_1 = require("./partner.model");
const partner_products_model_1 = require("./partner_products.model");
const products_log_model_1 = require("./products_log.model");
const crypto = require("crypto");
let Products = class Products extends sequelize_typescript_1.Model {
    static generatePublicKey(instance) {
        const randomPart = crypto.randomBytes(16).toString('hex');
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
    }
    static async logInsert(instance, options) {
        var _a, _b, _c;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping log for ${instance.id}, transaction not committed yet.`);
            return;
        }
        const existingLog = await products_log_model_1.ProductsLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
        await products_log_model_1.ProductsLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            name: instance.name,
            description: instance.description,
            is_active: instance.is_active,
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
        const existingLog = await products_log_model_1.ProductsLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
        await products_log_model_1.ProductsLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            name: instance.name,
            description: instance.description,
            is_active: instance.is_active,
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
        const existingLog = await products_log_model_1.ProductsLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔴 Logging DELETE for ID: ${instance.id}`);
        await products_log_model_1.ProductsLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            id: instance.id,
            hashed_key: instance.hashed_key,
            name: instance.name,
            description: instance.description,
            is_active: instance.is_active,
            created_by: instance.created_by,
            updated_by: instance.updated_by,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.Products = Products;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], Products.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], Products.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'name' }),
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, field: 'description' }),
    __metadata("design:type", String)
], Products.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_active' }),
    __metadata("design:type", Boolean)
], Products.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], Products.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], Products.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => partner_model_1.Partner, () => partner_products_model_1.PartnerProducts),
    __metadata("design:type", Array)
], Products.prototype, "partners", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'created_by' }),
    __metadata("design:type", user_model_1.User)
], Products.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'updated_by' }),
    __metadata("design:type", user_model_1.User)
], Products.prototype, "updater", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Products]),
    __metadata("design:returntype", void 0)
], Products, "generatePublicKey", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Products, Object]),
    __metadata("design:returntype", Promise)
], Products, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Products, Object]),
    __metadata("design:returntype", Promise)
], Products, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Products, Object]),
    __metadata("design:returntype", Promise)
], Products, "logDelete", null);
exports.Products = Products = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'products',
        timestamps: true,
    })
], Products);
//# sourceMappingURL=products.model.js.map