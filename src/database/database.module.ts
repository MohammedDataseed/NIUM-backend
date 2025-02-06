import { Module } from '@nestjs/common';
import { databaseProviders } from './providers/database.provider';
import { repositoryProviders } from './providers/model-repository.provider';
import { PartnerService } from './services/partner/partner.service';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SharedModule],
  providers: [
    ...databaseProviders,
    ...repositoryProviders,
    PartnerService,
    ConfigService,
  ],
  exports: [...databaseProviders, ...repositoryProviders, PartnerService],
})
export class DatabaseModule {}
