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
exports.PartnerProducts = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const partner_model_1 = require("./partner.model");
const products_model_1 = require("./products.model");
const partner_products_log_model_1 = require("./partner_products_log.model");
let PartnerProducts = class PartnerProducts extends sequelize_typescript_1.Model {
    static async logInsert(instance, options) {
        var _a, _b, _c;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping insert log, transaction not committed yet.`);
            return;
        }
        const existingLog = await partner_products_log_model_1.PartnerProductsLog.findOne({
            where: { id: instance.id, dml_action: 'I' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔵 Logging INSERT for Partner: ${instance.partner_id}, Product: ${instance.product_id}`);
        await partner_products_log_model_1.PartnerProductsLog.create({
            dml_action: 'I',
            log_timestamp: new Date(),
            partner_id: instance.partner_id,
            product_id: instance.product_id,
            createdAt: instance.createdAt,
            updatedAt: (_b = instance.updatedAt) !== null && _b !== void 0 ? _b : new Date(),
        }, { transaction: (_c = options.transaction) !== null && _c !== void 0 ? _c : null });
    }
    static async logUpdate(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping update log, transaction not committed yet.`);
            return;
        }
        const existingLog = await partner_products_log_model_1.PartnerProductsLog.findOne({
            where: { id: instance.id, dml_action: 'U' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🟡 Logging UPDATE for Partner: ${instance.partner_id}, Product: ${instance.product_id}`);
        await partner_products_log_model_1.PartnerProductsLog.create({
            dml_action: 'U',
            log_timestamp: new Date(),
            partner_id: instance.partner_id,
            product_id: instance.product_id,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
    static async logDelete(instance, options) {
        var _a, _b;
        if (options.transaction && options.transaction.finished !== 'commit') {
            console.log(`⏳ Skipping delete log, transaction not committed yet.`);
            return;
        }
        const existingLog = await partner_products_log_model_1.PartnerProductsLog.findOne({
            where: { id: instance.id, dml_action: 'D' },
            transaction: (_a = options.transaction) !== null && _a !== void 0 ? _a : null,
        });
        if (existingLog) {
            console.log(`⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`);
            return;
        }
        console.log(`🔴 Logging DELETE for Partner: ${instance.partner_id}, Product: ${instance.product_id}`);
        await partner_products_log_model_1.PartnerProductsLog.create({
            dml_action: 'D',
            log_timestamp: new Date(),
            partner_id: instance.partner_id,
            product_id: instance.product_id,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        }, { transaction: (_b = options.transaction) !== null && _b !== void 0 ? _b : null });
    }
};
exports.PartnerProducts = PartnerProducts;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => partner_model_1.Partner),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'partner_id' }),
    __metadata("design:type", String)
], PartnerProducts.prototype, "partner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_model_1.Products),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'product_id' }),
    __metadata("design:type", String)
], PartnerProducts.prototype, "product_id", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PartnerProducts, Object]),
    __metadata("design:returntype", Promise)
], PartnerProducts, "logInsert", null);
__decorate([
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PartnerProducts, Object]),
    __metadata("design:returntype", Promise)
], PartnerProducts, "logUpdate", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PartnerProducts, Object]),
    __metadata("design:returntype", Promise)
], PartnerProducts, "logDelete", null);
exports.PartnerProducts = PartnerProducts = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'partner_products',
        timestamps: true,
    })
], PartnerProducts);
//# sourceMappingURL=partner_products.model.js.map