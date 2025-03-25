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
exports.Documents = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const documentType_model_1 = require("./documentType.model");
const purpose_model_1 = require("./purpose.model");
const crypto = require("crypto");
let Documents = class Documents extends sequelize_typescript_1.Model {
    static generatePublicKey(instance) {
        if (!instance.hashed_key) {
            const randomPart = crypto.randomBytes(16).toString("hex");
            const timestampPart = Date.now().toString(36);
            instance.hashed_key = `${randomPart}${timestampPart}`;
        }
    }
};
exports.Documents = Documents;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        field: "id",
    }),
    __metadata("design:type", String)
], Documents.prototype, "documentId", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "hashed_key" }),
    __metadata("design:type", String)
], Documents.prototype, "hashed_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "entity_id" }),
    __metadata("design:type", String)
], Documents.prototype, "entityId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM("user", "customer"), field: "entity_type" }),
    __metadata("design:type", String)
], Documents.prototype, "entityType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => purpose_model_1.Purpose),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "purpose_id" }),
    __metadata("design:type", String)
], Documents.prototype, "purposeId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => documentType_model_1.DocumentType),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "document_type_id" }),
    __metadata("design:type", String)
], Documents.prototype, "document_type_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: "document_name" }),
    __metadata("design:type", String)
], Documents.prototype, "document_name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        field: "document_url",
        validate: {
            isObject(value) {
                if (typeof value !== "object" || value === null) {
                    throw new Error("document_url must be a valid JSON object");
                }
            },
        },
    }),
    __metadata("design:type", Object)
], Documents.prototype, "documentUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)("pending"),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("pending", "approved", "rejected"),
        field: "status",
    }),
    __metadata("design:type", String)
], Documents.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: "document_expiry" }),
    __metadata("design:type", Date)
], Documents.prototype, "documentExpiry", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: "is_doc_front_image" }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isDocFrontImage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: "is_doc_back_image" }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isDocBackImage", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: "is_uploaded" }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isUploaded", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: "is_customer" }),
    __metadata("design:type", Boolean)
], Documents.prototype, "isCustomer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "created_by" }),
    __metadata("design:type", String)
], Documents.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, field: "updated_by" }),
    __metadata("design:type", String)
], Documents.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Documents]),
    __metadata("design:returntype", void 0)
], Documents, "generatePublicKey", null);
exports.Documents = Documents = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "documents",
        timestamps: true,
    })
], Documents);
//# sourceMappingURL=documents.model.js.map