"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const bank_account_model_1 = require("./bank_account.model");
const bank_account_log_model_1 = require("./bank_account_log.model");
const branch_model_1 = require("./branch.model");
const branch_log_model_1 = require("./branch-log.model");
const documents_model_1 = require("./documents.model");
const documents_log_model_1 = require("./documents_log.model");
const document_master_model_1 = require("./document_master.model");
const document_master_log_model_1 = require("./document_master_log.model");
const document_requirements_model_1 = require("./document_requirements.model");
const document_requirements_log_model_1 = require("./document-requirements-log.model");
const partner_model_1 = require("./partner.model");
const partner_log_model_1 = require("./partner_log.model");
const products_model_1 = require("./products.model");
const products_log_model_1 = require("./products_log.model");
const purpose_model_1 = require("./purpose.model");
const purpose_log_model_1 = require("./purpose_log.model");
const role_model_1 = require("./role.model");
const role_log_model_1 = require("./role_log.model");
const user_model_1 = require("./user.model");
const users_log_model_1 = require("./users_log.model");
const partner_products_model_1 = require("./partner_products.model");
const partner_products_log_model_1 = require("./partner_products_log.model");
const order_model_1 = require("./order.model");
const order_log_model_1 = require("./order_log.model");
const documentType_model_1 = require("./documentType.model");
const document_type_log_model_1 = require("./document_type_log.model");
const transaction_type_model_1 = require("./transaction_type.model");
const transaction_type_log_model_1 = require("./transaction_type_log.model");
const esign_model_1 = require("./esign.model");
const esign_log_model_1 = require("./esign_log.model");
const vkyc_model_1 = require("./vkyc.model");
const vkyc_log_model_1 = require("./vkyc_log.model");
exports.models = [
    role_model_1.Role,
    role_log_model_1.RoleLog,
    user_model_1.User,
    users_log_model_1.UsersLog,
    partner_model_1.Partner,
    partner_log_model_1.PartnerLog,
    branch_model_1.Branch,
    branch_log_model_1.BranchLog,
    bank_account_model_1.bank_account,
    bank_account_log_model_1.BankAccountLog,
    documents_model_1.Documents,
    documents_log_model_1.DocumentsLog,
    document_master_model_1.DocumentMaster,
    document_master_log_model_1.DocumentMasterLog,
    document_requirements_model_1.DocumentRequirements,
    document_requirements_log_model_1.DocumentRequirementsLog,
    products_model_1.Products,
    products_log_model_1.ProductsLog,
    purpose_model_1.Purpose,
    purpose_log_model_1.PurposeLog,
    partner_products_model_1.PartnerProducts,
    partner_products_log_model_1.PartnerProductsLog,
    documentType_model_1.DocumentType,
    document_type_log_model_1.DocumentTypeLog,
    transaction_type_model_1.transaction_type,
    transaction_type_log_model_1.TransactionTypeLog,
    order_model_1.Order,
    order_log_model_1.OrderLog,
    esign_model_1.ESign,
    esign_log_model_1.ESignLog,
    vkyc_model_1.Vkyc,
    vkyc_log_model_1.VkycLog,
];
//# sourceMappingURL=index.js.map