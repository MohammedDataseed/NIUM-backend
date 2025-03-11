import { Module } from "@nestjs/common";
import { AppController } from "./controllers/v1/main/app.controller";
import { AppService } from "./services/v1/app/app.service";
import { SharedModule } from "./shared/shared.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { GracefulShutdownModule } from "./graceful-shutdown/graceful-shutdown.module";
import { MiddlewareModule } from "./middleware/middleware.module";
import { AuditLoggerService } from "./middleware/auditlogger/auditlogger.service";
import { UserController } from "./controllers/v1/main/user.controller";
import { UserService } from "./services/v1/user/user.service";
import { RoleService } from "./services/v1/role/role.service";
import { RoleController } from "./controllers/v1/main/role.controller";
import { AuthModule } from "./auth/auth.module"; // ✅ Import Auth Module
import { JwtModule } from "@nestjs/jwt"; // ✅ Import JWT Module
import { MailerService } from "./shared/services/mailer/mailer.service";
import { BranchService } from "./services/v1/branch/branch.service";
import { BranchController } from "./controllers/v1/main/branch.controller";
import { ProductService } from "./services/v1/product/product.service";
import { ProductController } from "./controllers/v1/main/product.controller";
import { PartnerController } from "./controllers/v1/main/partner.controller";
import { PartnerService } from "./services/v1/partner/partner.service";
import { EkycController } from "./controllers/v1/main/ekyc/ekyc.controller";
import { EkycService } from "./services/v1/ekyc/ekyc.service";
import { PdfService } from "./services/v1/document-consolidate/document-consolidate.service";
import { PdfController } from "./controllers/v1/main/documents-consolidate.controller";
import { OrdersService } from "./services/v1/order/order.service";
import { OrdersController } from "./controllers/v1/main/order.controller";
import { VideokycService } from "./services/v1/videokyc/videokyc.service";
import { VideokycController } from "./controllers/v1/main/videokyc/videokyc.controller";
import { BankAccountController } from "./controllers/v1/main/bank_account.controller";
import { BankAccountService } from "./services/v1/bank_account/bank_account.service";
import { PurposeController } from "./controllers/v1/main/purpose.controller";
import { PurposeService } from "./services/v1/purpose/purpose.service";
import { DocumentTypeController } from "./controllers/v1/main/documentType.controller";
import { DocumentTypeService } from "./services/v1/document/documentType.service";
import { transaction_typeController } from "./controllers/v1/main/transaction_type.controller";
import { transaction_typeService } from "./services/v1/transaction/transaction_type.service";
import { ConfigController } from "./controllers/v1/main/config.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    GracefulShutdownModule,
    MiddlewareModule,
    AuthModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || "123456", // ✅ Use environment variable
      signOptions: { expiresIn: "1h" }, // ✅ Token expiry
    }),
  ],
  controllers: [
    AppController,
    PartnerController,
    UserController,
    RoleController,
    BranchController,
    BankAccountController,
    ProductController,
    OrdersController,
    EkycController,
    VideokycController,
    PdfController,
    PurposeController,
    DocumentTypeController,
    transaction_typeController,
    ConfigController,
  ],
  providers: [
    AppService,
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
    transaction_typeService,

    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggerService,
    },
  ],
})
export class AppModule {}
