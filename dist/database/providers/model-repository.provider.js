"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryProviders = void 0;
const bank_account_model_1 = require("../models/bank_account.model");
const branch_model_1 = require("../models/branch.model");
const documents_model_1 = require("../models/documents.model");
const document_master_model_1 = require("../models/document_master.model");
const document_requirements_model_1 = require("../models/document_requirements.model");
const partner_model_1 = require("../models/partner.model");
const products_model_1 = require("../models/products.model");
const purpose_model_1 = require("../models/purpose.model");
const role_model_1 = require("../models/role.model");
const user_model_1 = require("../models/user.model");
const order_model_1 = require("../models/order.model");
const documentType_model_1 = require("../models/documentType.model");
const transaction_type_model_1 = require("../models/transaction_type.model");
const esign_model_1 = require("../models/esign.model");
const vkyc_model_1 = require("../models/vkyc.model");
exports.repositoryProviders = [
    {
        provide: "USER_REPOSITORY",
        useValue: user_model_1.User,
    },
    {
        provide: "ROLE_REPOSITORY",
        useValue: role_model_1.Role,
    },
    {
        provide: "BANK_ACCOUNT_REPOSITORY",
        useValue: bank_account_model_1.bank_account,
    },
    {
        provide: "BRANCH_REPOSITORY",
        useValue: branch_model_1.Branch,
    },
    {
        provide: "DOCUMENTS_REPOSITORY",
        useValue: documents_model_1.Documents,
    },
    {
        provide: "DOCUMENT_MASTER_REPOSITORY",
        useValue: document_master_model_1.DocumentMaster,
    },
    {
        provide: "DOCUMENT_REQUIREMENTS_REPOSITORY",
        useValue: document_requirements_model_1.DocumentRequirements,
    },
    {
        provide: "PARTNER_REPOSITORY",
        useValue: partner_model_1.Partner,
    },
    {
        provide: "PRODUCTS_REPOSITORY",
        useValue: products_model_1.Products,
    },
    {
        provide: "PURPOSE_REPOSITORY",
        useValue: purpose_model_1.Purpose,
    },
    {
        provide: "DOCUMENT_TYPE_REPOSITORY",
        useValue: documentType_model_1.DocumentType,
    },
    {
        provide: "TRANSACTION_TYPE_REPOSITORY",
        useValue: transaction_type_model_1.transaction_type,
    },
    {
        provide: "ORDER_REPOSITORY",
        useValue: order_model_1.Order,
    },
    {
        provide: "E_SIGN_REPOSITORY",
        useValue: esign_model_1.ESign,
    },
    {
        provide: "V_KYC_REPOSITORY",
        useValue: vkyc_model_1.Vkyc,
    },
];
//# sourceMappingURL=model-repository.provider.js.map