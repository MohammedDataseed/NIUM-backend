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
exports.VkycLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let VkycLog = class VkycLog extends sequelize_typescript_1.Model {
};
exports.VkycLog = VkycLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], VkycLog.prototype, "log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('I', 'U', 'D'), field: 'dml_action' }),
    __metadata("design:type", String)
], VkycLog.prototype, "dml_action", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'log_timestamp',
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], VkycLog.prototype, "log_timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], VkycLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], VkycLog.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partner_order_id' }),
    __metadata("design:type", String)
], VkycLog.prototype, "partner_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'order_id' }),
    __metadata("design:type", String)
], VkycLog.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'attempt_number' }),
    __metadata("design:type", Number)
], VkycLog.prototype, "attempt_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'reference_id' }),
    __metadata("design:type", String)
], VkycLog.prototype, "reference_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'profile_id' }),
    __metadata("design:type", String)
], VkycLog.prototype, "profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_link' }),
    __metadata("design:type", String)
], VkycLog.prototype, "v_kyc_link", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'v_kyc_link_expires' }),
    __metadata("design:type", Date)
], VkycLog.prototype, "v_kyc_link_expires", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_link_status' }),
    __metadata("design:type", String)
], VkycLog.prototype, "v_kyc_link_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'v_kyc_comments' }),
    __metadata("design:type", String)
], VkycLog.prototype, "v_kyc_comments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'v_kyc_doc_completion_date' }),
    __metadata("design:type", Date)
], VkycLog.prototype, "v_kyc_doc_completion_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'device_info' }),
    __metadata("design:type", Object)
], VkycLog.prototype, "device_info", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'profile_data' }),
    __metadata("design:type", Object)
], VkycLog.prototype, "profile_data", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'performed_by' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "performed_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_documents' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_documents", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_documents_files' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_documents_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_images' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_images", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_images_files' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_images_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_videos' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_videos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_videos_files' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_videos_files", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'resources_text' }),
    __metadata("design:type", Array)
], VkycLog.prototype, "resources_text", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'location_info' }),
    __metadata("design:type", Object)
], VkycLog.prototype, "location_info", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'first_name' }),
    __metadata("design:type", String)
], VkycLog.prototype, "first_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'reviewer_action' }),
    __metadata("design:type", String)
], VkycLog.prototype, "reviewer_action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'tasks' }),
    __metadata("design:type", Object)
], VkycLog.prototype, "tasks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'status' }),
    __metadata("design:type", String)
], VkycLog.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'status_description' }),
    __metadata("design:type", Object)
], VkycLog.prototype, "status_description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'status_detail' }),
    __metadata("design:type", String)
], VkycLog.prototype, "status_detail", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], VkycLog.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], VkycLog.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'createdAt' }),
    __metadata("design:type", Date)
], VkycLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'updatedAt' }),
    __metadata("design:type", Date)
], VkycLog.prototype, "updatedAt", void 0);
exports.VkycLog = VkycLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vkyc_log',
        timestamps: false,
    })
], VkycLog);
//# sourceMappingURL=vkyc_log.model.js.map