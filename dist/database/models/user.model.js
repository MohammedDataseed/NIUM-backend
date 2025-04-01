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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const role_model_1 = require("./role.model");
const branch_model_1 = require("./branch.model");
const bank_account_model_1 = require("./bank_account.model");
const crypto = require("crypto");
let User = class User extends sequelize_typescript_1.Model {
    static generatePublicKey(instance) {
        const randomPart = crypto.randomBytes(16).toString("hex");
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
    }
};
exports.User = User;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "id" }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "email" }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "password" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key" }),
    __metadata("design:type", String)
], User.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => role_model_1.Role),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "role_id" }),
    __metadata("design:type", String)
], User.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => branch_model_1.Branch),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "branch_id" }),
    __metadata("design:type", String)
], User.prototype, "branch_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => bank_account_model_1.bank_account),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "bank_account_id" }),
    __metadata("design:type", String)
], User.prototype, "bank_account_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("cash&carry", "large_enterprise"),
        field: "business_type",
    }),
    __metadata("design:type", String)
], User.prototype, "business_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "created_by" }),
    __metadata("design:type", String)
], User.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "updated_by" }),
    __metadata("design:type", String)
], User.prototype, "updated_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => role_model_1.Role),
    __metadata("design:type", role_model_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => branch_model_1.Branch),
    __metadata("design:type", branch_model_1.Branch)
], User.prototype, "branch", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => bank_account_model_1.bank_account),
    __metadata("design:type", bank_account_model_1.bank_account)
], User.prototype, "bank_account", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User, { foreignKey: "created_by", as: "creator" }),
    __metadata("design:type", User)
], User.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User, { foreignKey: "updated_by", as: "updater" }),
    __metadata("design:type", User)
], User.prototype, "updater", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "generatePublicKey", null);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "users",
        timestamps: true,
    })
], User);
//# sourceMappingURL=user.model.js.map