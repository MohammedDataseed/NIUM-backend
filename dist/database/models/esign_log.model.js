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
exports.ESignLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let ESignLog = class ESignLog extends sequelize_typescript_1.Model {
};
exports.ESignLog = ESignLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ESignLog.prototype, "log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('I', 'U', 'D'), field: 'dml_action' }),
    __metadata("design:type", String)
], ESignLog.prototype, "dml_action", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'log_timestamp',
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], ESignLog.prototype, "log_timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], ESignLog.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_order_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'order_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'attempt_number' }),
    __metadata("design:type", Number)
], ESignLog.prototype, "attempt_number", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'task_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "task_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'group_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "group_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'esign_file_details' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "esign_file_details", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'esign_stamp_details' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "esign_stamp_details", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'esign_invitees' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "esign_invitees", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true, field: 'esign_details' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "esign_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esign_doc_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esign_doc_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'status' }),
    __metadata("design:type", String)
], ESignLog.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'request_id' }),
    __metadata("design:type", String)
], ESignLog.prototype, "request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'completed_at' }),
    __metadata("design:type", Date)
], ESignLog.prototype, "completed_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'esign_expiry' }),
    __metadata("design:type", Date)
], ESignLog.prototype, "esign_expiry", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'active' }),
    __metadata("design:type", Boolean)
], ESignLog.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'expired' }),
    __metadata("design:type", Boolean)
], ESignLog.prototype, "expired", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'rejected' }),
    __metadata("design:type", Boolean)
], ESignLog.prototype, "rejected", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true, field: 'result' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "result", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true, field: 'esigners' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "esigners", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true, field: 'file_details' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "file_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: true, field: 'request_details' }),
    __metadata("design:type", Object)
], ESignLog.prototype, "request_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esign_irn' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esign_irn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esign_folder' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esign_folder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esign_type' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esign_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esign_url' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esign_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esigner_email' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esigner_email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'esigner_phone' }),
    __metadata("design:type", String)
], ESignLog.prototype, "esigner_phone", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_signed' }),
    __metadata("design:type", Boolean)
], ESignLog.prototype, "is_signed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true, field: 'type' }),
    __metadata("design:type", String)
], ESignLog.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'createdAt' }),
    __metadata("design:type", Date)
], ESignLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'updatedAt' }),
    __metadata("design:type", Date)
], ESignLog.prototype, "updatedAt", void 0);
exports.ESignLog = ESignLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'esign_log',
        timestamps: false,
    })
], ESignLog);
//# sourceMappingURL=esign_log.model.js.map