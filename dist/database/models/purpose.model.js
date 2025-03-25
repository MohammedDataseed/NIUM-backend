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
exports.Purpose = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const crypto = require("crypto");
let Purpose = class Purpose extends sequelize_typescript_1.Model {
    static ensureHashedKey(instance) {
        if (!instance.hashed_key) {
            const randomPart = crypto.randomBytes(16).toString("hex");
            const timestampPart = Date.now().toString(36);
            instance.hashed_key = `${randomPart}${timestampPart}`;
        }
    }
};
exports.Purpose = Purpose;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "id" }),
    __metadata("design:type", String)
], Purpose.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key" }),
    __metadata("design:type", String)
], Purpose.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "purpose_name" }),
    __metadata("design:type", String)
], Purpose.prototype, "purposeName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: "is_active" }),
    __metadata("design:type", Boolean)
], Purpose.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: "created_at" }),
    __metadata("design:type", Date)
], Purpose.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: "updated_at" }),
    __metadata("design:type", Date)
], Purpose.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "created_by" }),
    __metadata("design:type", String)
], Purpose.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "updated_by" }),
    __metadata("design:type", String)
], Purpose.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: "created_by" }),
    __metadata("design:type", user_model_1.User)
], Purpose.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { foreignKey: "updated_by" }),
    __metadata("design:type", user_model_1.User)
], Purpose.prototype, "updater", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Purpose]),
    __metadata("design:returntype", void 0)
], Purpose, "ensureHashedKey", null);
exports.Purpose = Purpose = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "purposes",
        timestamps: true,
        underscored: true,
    })
], Purpose);
//# sourceMappingURL=purpose.model.js.map