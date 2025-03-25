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
exports.Order = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const partner_model_1 = require("./partner.model");
const esign_model_1 = require("./esign.model");
const vkyc_model_1 = require("./vkyc.model");
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let Order = class Order extends sequelize_typescript_1.Model {
    static generateHashedKey(instance) {
        console.log("Generating hashed_key...");
        const randomPart = crypto.randomBytes(16).toString("hex");
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
        console.log("Generated hashed_key:", instance.hashed_key);
    }
};
exports.Order = Order;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key", defaultValue: "" }),
    __metadata("design:type", String)
], Order.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "partner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "partner_hashed_api_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "partner_hashed_key", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Order.prototype, "transaction_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Order.prototype, "purpose_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_esign_required", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_v_kyc_required", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customer_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customer_email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customer_phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customer_pan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "order_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_link_doc_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_link_request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "e_sign_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], Order.prototype, "e_sign_completed_by_customer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "e_sign_customer_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "e_sign_doc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_reference_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "v_kyc_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], Order.prototype, "v_kyc_completed_by_customer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "v_kyc_customer_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "v_kyc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], Order.prototype, "incident_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "incident_checker_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "nium_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], Order.prototype, "nium_invoice_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "date_of_departure", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], Order.prototype, "incident_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true, defaultValue: false }),
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_esign_regenerated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Object)
], Order.prototype, "is_esign_regenerated_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true, defaultValue: false }),
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_video_kyc_link_regenerated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Object)
], Order.prototype, "is_video_kyc_link_regenerated_details", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => partner_model_1.Partner),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "created_by" }),
    __metadata("design:type", String)
], Order.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => partner_model_1.Partner),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "updated_by" }),
    __metadata("design:type", String)
], Order.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "checker_id" }),
    __metadata("design:type", String)
], Order.prototype, "checker_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => partner_model_1.Partner, { foreignKey: "created_by" }),
    __metadata("design:type", partner_model_1.Partner)
], Order.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => partner_model_1.Partner, { foreignKey: "updated_by" }),
    __metadata("design:type", partner_model_1.Partner)
], Order.prototype, "updater", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: "checker_id" }),
    __metadata("design:type", user_model_1.User)
], Order.prototype, "checker", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true }),
    (0, common_1.Optional)(),
    __metadata("design:type", Object)
], Order.prototype, "merged_document", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => esign_model_1.ESign, { foreignKey: "order_id", sourceKey: "id" }),
    __metadata("design:type", Array)
], Order.prototype, "esigns", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => vkyc_model_1.Vkyc, { foreignKey: "order_id", sourceKey: "id" }),
    __metadata("design:type", Array)
], Order.prototype, "vkycs", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Order]),
    __metadata("design:returntype", void 0)
], Order, "generateHashedKey", null);
exports.Order = Order = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "orders",
        timestamps: true,
    })
], Order);
//# sourceMappingURL=order.model.js.map