import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/v1/main/app.controller';
import { AppService } from './services/v1/app/app.service';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { GracefulShutdownModule } from './graceful-shutdown/graceful-shutdown.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { AuditLoggerService } from './middleware/auditlogger/auditlogger.service';
import { AuthModule } from './auth/auth.module'; // ✅ Import Auth Module
import { AgentPortalModule } from './agent-portal/agent-portal.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    GracefulShutdownModule,
    MiddlewareModule,
    AuthModule,
    AgentPortalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggerService,
    },
  ],
})
export class AppModule {}
