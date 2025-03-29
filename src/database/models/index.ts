import { bank_account } from './bank_account.model';
import { BankAccountLog } from './bank_account_log.model';
import { Branch } from './branch.model';
import { BranchLog } from './branch-log.model';
import { Documents } from './documents.model';
import { DocumentMaster } from './document_master.model';
import { DocumentRequirements } from './document_requirements.model';
import { Partner } from './partner.model';
import { PartnerLog } from './partner_log.model';
import { Products } from './products.model';
import { ProductsLog } from './products_log.model';
import { Purpose } from './purpose.model';
import { PurposeLog } from './purpose_log.model';
import { Role } from './role.model';
import { RoleLog } from './role_log.model';
import { User } from './user.model';
import { PartnerProducts } from './partner_products.model';
import { Order } from './order.model';
import { DocumentType } from './documentType.model';
import { DocumentTypeLog } from './document_type_log.model';
import { transaction_type } from './transaction_type.model';
import { TransactionTypeLog } from './transaction_type_log.model';
import { ESign } from './esign.model';
import { Vkyc } from './vkyc.model';

export const models = [
  Role,
  RoleLog,
  User,
  Partner,
  PartnerLog,
  Branch,
  BranchLog,
  bank_account,
  BankAccountLog,
  Documents,
  DocumentMaster,
  DocumentRequirements,
  Products,
  ProductsLog,
  Purpose,
  PurposeLog,
  PartnerProducts,
  DocumentType,
  DocumentTypeLog,
  transaction_type,
  TransactionTypeLog,
  Order,
  ESign,
  Vkyc,
];
