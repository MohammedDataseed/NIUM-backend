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
exports.PurposeLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const purpose_model_1 = require("./purpose.model");
const user_model_1 = require("./user.model");
let PurposeLog = class PurposeLog extends sequelize_typescript_1.Model {
};
exports.PurposeLog = PurposeLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], PurposeLog.prototype, "log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('I', 'D', 'U'),
        allowNull: false,
        field: 'dml_action',
    }),
    __metadata("design:type", String)
], PurposeLog.prototype, "dml_action", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(() => new Date()),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'log_timestamp' }),
    __metadata("design:type", Date)
], PurposeLog.prototype, "log_timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => purpose_model_1.Purpose),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'id' }),
    __metadata("design:type", String)
], PurposeLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'hashed_key' }),
    __metadata("design:type", String)
], PurposeLog.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'purpose_name' }),
    __metadata("design:type", String)
], PurposeLog.prototype, "purpose_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_active', defaultValue: true }),
    __metadata("design:type", Boolean)
], PurposeLog.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'created_at' }),
    __metadata("design:type", Date)
], PurposeLog.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'updated_at' }),
    __metadata("design:type", Date)
], PurposeLog.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'created_by' }),
    __metadata("design:type", String)
], PurposeLog.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: 'updated_by' }),
    __metadata("design:type", String)
], PurposeLog.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => purpose_model_1.Purpose, { foreignKey: 'id' }),
    __metadata("design:type", purpose_model_1.Purpose)
], PurposeLog.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'created_by' }),
    __metadata("design:type", user_model_1.User)
], PurposeLog.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: 'updated_by' }),
    __metadata("design:type", user_model_1.User)
], PurposeLog.prototype, "updater", void 0);
exports.PurposeLog = PurposeLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'purpose_logs',
        timestamps: false,
        underscored: true,
    })
], PurposeLog);
//# sourceMappingURL=purpose_log.model.js.map