import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Import Auth Module
import { DatabaseModule } from '../database/database.module';
import { UserController } from '../agent-portal/controllers/user.controller';
import { UserService } from '../agent-portal/services/user/user.service';
import { RoleService } from '../agent-portal/services/role/role.service';
import { RoleController } from '../agent-portal/controllers/role.controller';
import { MailerService } from '../shared/services/mailer/mailer.service';
import { BranchService } from '../agent-portal/services/branch/branch.service';
import { BranchController } from '../agent-portal/controllers/branch.controller';
import { ProductService } from '../agent-portal/services/product/product.service';
import { ProductController } from '../agent-portal/controllers/product.controller';
import { PartnerController } from '../agent-portal/controllers/partner.controller';
import { PartnerService } from '../agent-portal/services/partner/partner.service';
import { EkycController } from '../agent-portal/controllers/ekyc/ekyc.controller';
import { EkycService } from '../agent-portal/services/ekyc/ekyc.service';
import { PdfService } from '../agent-portal/services/document-consolidate/document-consolidate.service';
import { PdfController } from '../agent-portal/controllers/documents-consolidate.controller';
import { OrdersService } from '../agent-portal/services/order/order.service';
import { OrdersController } from '../agent-portal/controllers/order.controller';
import { VideokycService } from '../agent-portal/services/videokyc/videokyc.service';
import { VideokycController } from '../agent-portal/controllers/videokyc/videokyc.controller';
import { BankAccountController } from '../agent-portal/controllers/bank-account.controller';
import { BankAccountService } from '../agent-portal/services/bank_account/bank_account.service';
import { PurposeController } from '../agent-portal/controllers/purpose.controller';
import { PurposeService } from '../agent-portal/services/purpose/purpose.service';
import { DocumentTypeController } from '../agent-portal/controllers/document-type.controller';
import { DocumentTypeService } from '../agent-portal/services/document/document-type.service';
import { TransactionTypeController } from '../agent-portal/controllers/transaction-type.controller';
import { TransactionTypeService } from '../agent-portal/services/transaction/transaction-type.service';
import { ConfigController } from '../agent-portal/controllers/config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [
    ConfigController,
    RoleController,
    ProductController,
    UserController,
    PartnerController,
    OrdersController,
    PdfController,
    EkycController,
    VideokycController,
    BranchController,
    BankAccountController,
    PurposeController,
    DocumentTypeController,
    TransactionTypeController,
  ],
  providers: [
    PartnerService,
    UserService,
    RoleService,
    BankAccountService,
    MailerService,
    BranchService,
    ProductService,
    PdfService,
    EkycService,
    VideokycService,
    OrdersService,
    PurposeService,
    DocumentTypeService,
    TransactionTypeService,
  ],
  exports: [
    PartnerService,
    UserService,
    RoleService,
    BankAccountService,
    MailerService,
    BranchService,
    ProductService,
    PdfService,
    EkycService,
    VideokycService,
    OrdersService,
    PurposeService,
    DocumentTypeService,
    TransactionTypeService,
  ],
})
export class AgentPortalModule {}
