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
exports.OrderLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let OrderLog = class OrderLog extends sequelize_typescript_1.Model {
};
exports.OrderLog = OrderLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], OrderLog.prototype, "log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('I', 'D', 'U'), field: 'dml_action' }),
    __metadata("design:type", String)
], OrderLog.prototype, "dml_action", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'log_timestamp' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "log_timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'serial_number' }),
    __metadata("design:type", Number)
], OrderLog.prototype, "serial_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'nium_order_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "nium_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], OrderLog.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "partner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_hashed_api_key' }),
    __metadata("design:type", String)
], OrderLog.prototype, "partner_hashed_api_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_hashed_key' }),
    __metadata("design:type", String)
], OrderLog.prototype, "partner_hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_order_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'transaction_type' }),
    __metadata("design:type", String)
], OrderLog.prototype, "transaction_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'purpose_type' }),
    __metadata("design:type", String)
], OrderLog.prototype, "purpose_type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_esign_required' }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "is_esign_required", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_v_kyc_required' }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "is_v_kyc_required", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'customer_name' }),
    __metadata("design:type", String)
], OrderLog.prototype, "customer_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'customer_email' }),
    __metadata("design:type", String)
], OrderLog.prototype, "customer_email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'customer_phone' }),
    __metadata("design:type", String)
], OrderLog.prototype, "customer_phone", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'customer_pan' }),
    __metadata("design:type", String)
], OrderLog.prototype, "customer_pan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'order_status' }),
    __metadata("design:type", String)
], OrderLog.prototype, "order_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_status' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_link' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_link_status' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_link_doc_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_link_doc_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_link_request_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_link_request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'e_sign_link_expires' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "e_sign_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'e_sign_completed_by_customer' }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "e_sign_completed_by_customer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'e_sign_customer_completion_date' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "e_sign_customer_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'e_sign_doc_comments' }),
    __metadata("design:type", String)
], OrderLog.prototype, "e_sign_doc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_reference_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_reference_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_profile_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_status' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_link' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_link_status' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'v_kyc_link_expires' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "v_kyc_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'v_kyc_completed_by_customer' }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "v_kyc_completed_by_customer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'v_kyc_customer_completion_date' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "v_kyc_customer_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_comments' }),
    __metadata("design:type", String)
], OrderLog.prototype, "v_kyc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'incident_checker_comments' }),
    __metadata("design:type", String)
], OrderLog.prototype, "incident_checker_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'nium_invoice_number' }),
    __metadata("design:type", String)
], OrderLog.prototype, "nium_invoice_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'date_of_departure' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "date_of_departure", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'incident_completion_date' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "incident_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: 'is_esign_regenerated',
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "is_esign_regenerated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'is_esign_regenerated_details' }),
    __metadata("design:type", Object)
], OrderLog.prototype, "is_esign_regenerated_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: 'is_video_kyc_link_regenerated',
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "is_video_kyc_link_regenerated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        field: 'is_video_kyc_link_regenerated_details',
    }),
    __metadata("design:type", Object)
], OrderLog.prototype, "is_video_kyc_link_regenerated_details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'incident_status' }),
    __metadata("design:type", Boolean)
], OrderLog.prototype, "incident_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], OrderLog.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], OrderLog.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'checker_id' }),
    __metadata("design:type", String)
], OrderLog.prototype, "checker_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'merged_document' }),
    __metadata("design:type", Object)
], OrderLog.prototype, "merged_document", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'createdAt' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'updatedAt' }),
    __metadata("design:type", Date)
], OrderLog.prototype, "updatedAt", void 0);
exports.OrderLog = OrderLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'order_log',
        timestamps: false,
    })
], OrderLog);
//# sourceMappingURL=order_log.model.js.map