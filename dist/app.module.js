"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./controllers/v1/main/app.controller");
const app_service_1 = require("./services/v1/app/app.service");
const shared_module_1 = require("./shared/shared.module");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const graceful_shutdown_module_1 = require("./graceful-shutdown/graceful-shutdown.module");
const middleware_module_1 = require("./middleware/middleware.module");
const auditlogger_service_1 = require("./middleware/auditlogger/auditlogger.service");
const user_controller_1 = require("./controllers/v1/main/user.controller");
const user_service_1 = require("./services/v1/user/user.service");
const role_service_1 = require("./services/v1/role/role.service");
const role_controller_1 = require("./controllers/v1/main/role.controller");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const mailer_service_1 = require("./shared/services/mailer/mailer.service");
const branch_service_1 = require("./services/v1/branch/branch.service");
const branch_controller_1 = require("./controllers/v1/main/branch.controller");
const product_service_1 = require("./services/v1/product/product.service");
const product_controller_1 = require("./controllers/v1/main/product.controller");
const partner_controller_1 = require("./controllers/v1/main/partner.controller");
const partner_service_1 = require("./services/v1/partner/partner.service");
const ekyc_controller_1 = require("./controllers/v1/main/ekyc/ekyc.controller");
const ekyc_service_1 = require("./services/v1/ekyc/ekyc.service");
const document_consolidate_service_1 = require("./services/v1/document-consolidate/document-consolidate.service");
const documents_consolidate_controller_1 = require("./controllers/v1/main/documents-consolidate.controller");
const order_service_1 = require("./services/v1/order/order.service");
const order_controller_1 = require("./controllers/v1/main/order.controller");
const videokyc_service_1 = require("./services/v1/videokyc/videokyc.service");
const videokyc_controller_1 = require("./controllers/v1/main/videokyc/videokyc.controller");
const bank_account_controller_1 = require("./controllers/v1/main/bank_account.controller");
const bank_account_service_1 = require("./services/v1/bank_account/bank_account.service");
const purpose_controller_1 = require("./controllers/v1/main/purpose.controller");
const purpose_service_1 = require("./services/v1/purpose/purpose.service");
const documentType_controller_1 = require("./controllers/v1/main/documentType.controller");
const documentType_service_1 = require("./services/v1/document/documentType.service");
const transaction_type_controller_1 = require("./controllers/v1/main/transaction_type.controller");
const transaction_type_service_1 = require("./services/v1/transaction/transaction_type.service");
const config_controller_1 = require("./controllers/v1/main/config.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            shared_module_1.SharedModule,
            database_module_1.DatabaseModule,
            graceful_shutdown_module_1.GracefulShutdownModule,
            middleware_module_1.MiddlewareModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || "123456",
                signOptions: { expiresIn: "1h" },
            }),
        ],
        controllers: [
            app_controller_1.AppController,
            config_controller_1.ConfigController,
            role_controller_1.RoleController,
            product_controller_1.ProductController,
            user_controller_1.UserController,
            partner_controller_1.PartnerController,
            order_controller_1.OrdersController,
            documents_consolidate_controller_1.PdfController,
            ekyc_controller_1.EkycController,
            videokyc_controller_1.VideokycController,
            branch_controller_1.BranchController,
            bank_account_controller_1.BankAccountController,
            purpose_controller_1.PurposeController,
            documentType_controller_1.DocumentTypeController,
            transaction_type_controller_1.transaction_typeController,
        ],
        providers: [
            app_service_1.AppService,
            partner_service_1.PartnerService,
            user_service_1.UserService,
            role_service_1.RoleService,
            bank_account_service_1.BankAccountService,
            mailer_service_1.MailerService,
            branch_service_1.BranchService,
            product_service_1.ProductService,
            document_consolidate_service_1.PdfService,
            ekyc_service_1.EkycService,
            videokyc_service_1.VideokycService,
            order_service_1.OrdersService,
            purpose_service_1.PurposeService,
            documentType_service_1.DocumentTypeService,
            transaction_type_service_1.transaction_typeService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: auditlogger_service_1.AuditLoggerService,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map