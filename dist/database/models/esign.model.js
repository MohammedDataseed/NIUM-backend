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
const crypto = require("crypto");
let ESign = class ESign extends sequelize_typescript_1.Model {
    static generatehashed_key(instance) {
        const randomPart = crypto.randomBytes(16).toString("hex");
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
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
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key" }),
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
    (0, sequelize_typescript_1.BelongsTo)(() => order_model_1.Order, { foreignKey: "order_id", targetKey: "id" }),
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
exports.ESign = ESign = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "esigns",
        timestamps: true,
    })
], ESign);
//# sourceMappingURL=esign.model.js.map