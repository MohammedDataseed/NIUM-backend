import { bank_account } from "../models/bank_account.model";
import { Branch } from "../models/branch.model";
import { Documents } from "../models/documents.model";
import { DocumentMaster } from "../models/document_master.model";
import { DocumentRequirements } from "../models/document_requirements.model";
import { Partner } from "../models/partner.model";
import { Products } from "../models/products.model";
import { Purpose } from "../models/purpose.model";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";
import { DocumentType } from "../models/documentType.model";
import { transaction_type } from "../models/transaction_type.model";
import { ESign } from "../models/esign.model";
import { Vkyc } from "../models/vkyc.model";

export const repositoryProviders = [
  {
    provide: "USER_REPOSITORY",
    useValue: User,
  },
  {
    provide: "ROLE_REPOSITORY",
    useValue: Role,
  },
  {
    provide: "BANK_ACCOUNT_REPOSITORY",
    useValue: bank_account,
  },
  {
    provide: "BRANCH_REPOSITORY",
    useValue: Branch,
  },
  {
    provide: "DOCUMENTS_REPOSITORY",
    useValue: Documents,
  },
  {
    provide: "DOCUMENT_MASTER_REPOSITORY",
    useValue: DocumentMaster,
  },
  {
    provide: "DOCUMENT_REQUIREMENTS_REPOSITORY",
    useValue: DocumentRequirements,
  },
  {
    provide: "PARTNER_REPOSITORY",
    useValue: Partner,
  },
  {
    provide: "PRODUCTS_REPOSITORY",
    useValue: Products,
  },
  {
    provide: "PURPOSE_REPOSITORY",
    useValue: Purpose,
  },
  {
    provide: "DOCUMENT_TYPE_REPOSITORY",
    useValue: DocumentType,
  },
  {
    provide: "TRANSACTION_TYPE_REPOSITORY",
    useValue: transaction_type,
  },
  {
    provide: "ORDER_REPOSITORY",
    useValue: Order,
  },
  {
    provide: "E_SIGN_REPOSITORY",
    useValue: ESign,
  },
  {
    provide: "V_KYC_REPOSITORY",
    useValue: Vkyc,
  },
];
