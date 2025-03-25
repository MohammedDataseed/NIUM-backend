"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const bank_account_model_1 = require("./bank_account.model");
const branch_model_1 = require("./branch.model");
const documents_model_1 = require("./documents.model");
const document_master_model_1 = require("./document_master.model");
const document_requirements_model_1 = require("./document_requirements.model");
const partner_model_1 = require("./partner.model");
const products_model_1 = require("./products.model");
const purpose_model_1 = require("./purpose.model");
const role_model_1 = require("./role.model");
const user_model_1 = require("./user.model");
const partner_products_model_1 = require("./partner_products.model");
const order_model_1 = require("./order.model");
const documentType_model_1 = require("./documentType.model");
const transaction_type_model_1 = require("./transaction_type.model");
const esign_model_1 = require("./esign.model");
const vkyc_model_1 = require("./vkyc.model");
exports.models = [
    role_model_1.Role,
    user_model_1.User,
    partner_model_1.Partner,
    branch_model_1.Branch,
    bank_account_model_1.bank_account,
    documents_model_1.Documents,
    document_master_model_1.DocumentMaster,
    document_requirements_model_1.DocumentRequirements,
    products_model_1.Products,
    purpose_model_1.Purpose,
    partner_products_model_1.PartnerProducts,
    documentType_model_1.DocumentType,
    transaction_type_model_1.transaction_type,
    order_model_1.Order,
    esign_model_1.ESign,
    vkyc_model_1.Vkyc
];
//# sourceMappingURL=index.js.map