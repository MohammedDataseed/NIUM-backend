import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { DatabaseModule } from '../database/database.module';
import { AuditLoggerService } from './auditlogger/auditlogger.service';

@Module({
  imports: [SharedModule, DatabaseModule],
  providers: [AuditLoggerService],
  exports: [AuditLoggerService],
})
export class MiddlewareModule {}
