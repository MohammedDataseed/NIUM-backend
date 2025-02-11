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
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    GracefulShutdownModule,
    MiddlewareModule,
    AuthModule, // ✅ Add Auth Module
    JwtModule.register({
      secret: process.env.JWT_SECRET || "123456", // ✅ Use environment variable
      signOptions: { expiresIn: "1h" }, // ✅ Token expiry
    }),
  ],
  controllers: [AppController, UserController, RoleController],
  providers: [
    AppService,
    UserService,
    RoleService,
    MailerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggerService,
    },
  ],
})
export class AppModule {}
