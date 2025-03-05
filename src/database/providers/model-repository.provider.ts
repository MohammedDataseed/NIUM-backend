import { BankAccount } from '../models/bankAccount.model';
import { Branch } from '../models/branch.model';
import { Documents } from '../models/documents.model';
import { DocumentMaster } from '../models/document_master.model';
import { DocumentRequirements } from '../models/document_requirements.model';
import { Partner } from '../models/partner.model';
import { Products } from '../models/products.model';
import { Purpose } from '../models/purpose.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

export const repositoryProviders = [
  {
    provide: 'BANK_ACCOUNT_REPOSITORY',
    useValue: BankAccount,
  },
  {
    provide: 'BRANCH_REPOSITORY',
    useValue: Branch,
  },
  {
    provide: 'DOCUMENTS_REPOSITORY',
    useValue: Documents,
  },
  {
    provide: 'DOCUMENT_MASTER_REPOSITORY',
    useValue: DocumentMaster,
  },
  {
    provide: 'DOCUMENT_REQUIREMENTS_REPOSITORY',
    useValue: DocumentRequirements,
  },
  {
    provide: 'PARTNER_REPOSITORY',
    useValue: Partner,
  },
  {
    provide: 'PRODUCTS_REPOSITORY',
    useValue: Products,
  },
  {
    provide: 'PURPOSE_REPOSITORY',
    useValue: Purpose,
  },
  {
    provide: 'ROLE_REPOSITORY',
    useValue: Role,
  },
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
  {
    provide: 'ORDER_REPOSITORY',
    useValue: Order,
  },
];
