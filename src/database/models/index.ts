import { bank_account } from "./bank_account.model";
import { Branch } from "./branch.model";
import { Documents } from "./documents.model";
import { DocumentMaster } from "./document_master.model";
import { DocumentRequirements } from "./document_requirements.model";
import { Partner } from "./partner.model";
import { Products } from "./products.model";
import { Purpose } from "./purpose.model";
import { Role } from "./role.model";
import { User } from "./user.model";
import { PartnerProducts } from "./partner_products.model";
import { Order } from "./order.model";
import { DocumentType } from "./documentType.model";
import { transaction_type } from "./transaction_type.model";
import { ESign } from "./esign.model";

export const models = [
  Role,
  User,
  Partner,
  Branch,
  bank_account,
  Documents,
  DocumentMaster,
  DocumentRequirements,
  Products,
  Purpose,
  PartnerProducts,
  DocumentType,
  transaction_type,
  Order,
  ESign,
];
