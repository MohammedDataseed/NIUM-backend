import { Module } from '@nestjs/common';
import { ShutdownService } from './services/shutdown/shutdown.service';
import { DatabaseModule } from '../database/database.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class GracefulShutdownModule {}
