import { BankAccount } from './bankAccount.model';
import { Branch } from './branch.model';
import { Documents } from './documents.model';
import { DocumentMaster } from './document_master.model';
import { DocumentRequirements } from './document_requirements.model';
import { Partner } from './partner.model';
import { Products } from './products.model';
import { Purpose } from './purpose.model';
import { Role } from './role.model';
import { User } from './user.model';
import { PartnerProducts } from './partner_products.model'; // ✅ Import it

export const models = [
  BankAccount,
  Branch,
  Documents,
  DocumentMaster,
  DocumentRequirements,
  Partner,
  Products,
  Purpose,
  Role,
  User,
  PartnerProducts, // ✅ Add it here
];
