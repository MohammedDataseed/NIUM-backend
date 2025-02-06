import { Module } from '@nestjs/common';
import { AppController } from './controllers/v1/main/app.controller';
import { AppService } from './services/v1/app/app.service';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GracefulShutdownModule } from './graceful-shutdown/graceful-shutdown.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { AuditLoggerService } from './middleware/auditlogger/auditlogger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    GracefulShutdownModule,
    MiddlewareModule,
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
