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
let PartnerProducts = class PartnerProducts extends sequelize_typescript_1.Model {
};
exports.PartnerProducts = PartnerProducts;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => partner_model_1.Partner),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "partner_id" }),
    __metadata("design:type", String)
], PartnerProducts.prototype, "partner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_model_1.Products),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "product_id" }),
    __metadata("design:type", String)
], PartnerProducts.prototype, "product_id", void 0);
exports.PartnerProducts = PartnerProducts = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "partner_products",
        timestamps: true,
    })
], PartnerProducts);
//# sourceMappingURL=partner_products.model.js.map