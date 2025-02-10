import { Module } from '@nestjs/common';
import { databaseProviders } from './providers/database.provider';
import { repositoryProviders } from './providers/model-repository.provider';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SharedModule],
  providers: [
    ...databaseProviders,
    ...repositoryProviders,
    ConfigService,
  ],
  exports: [...databaseProviders, ...repositoryProviders],
})
export class DatabaseModule {}
