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
exports.DocumentTypeLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let DocumentTypeLog = class DocumentTypeLog extends sequelize_typescript_1.Model {
};
exports.DocumentTypeLog = DocumentTypeLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: "log_id" }),
    __metadata("design:type", Number)
], DocumentTypeLog.prototype, "log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("I", "D", "U"),
        allowNull: false,
        field: "dml_action",
    }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "dml_action", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(() => new Date()),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: "log_timestamp" }),
    __metadata("design:type", Date)
], DocumentTypeLog.prototype, "log_timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "id" }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key" }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "name" }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true, field: "is_active" }),
    __metadata("design:type", Boolean)
], DocumentTypeLog.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], DocumentTypeLog.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], DocumentTypeLog.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "created_by" }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "updated_by" }),
    __metadata("design:type", String)
], DocumentTypeLog.prototype, "updated_by", void 0);
exports.DocumentTypeLog = DocumentTypeLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "document_type_log",
        timestamps: false,
        underscored: true,
    })
], DocumentTypeLog);
//# sourceMappingURL=document_type_log.model.js.map