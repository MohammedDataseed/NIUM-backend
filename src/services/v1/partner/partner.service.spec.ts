import { Test, TestingModule } from '@nestjs/testing';
import { PartnerService } from './partner.service';
import { SharedModule } from '../../../shared/shared.module';
import { repositoryProviders } from '../../../database/providers/model-repository.provider';
import { databaseProviders } from '../../../database/providers/database.provider';
import { ConfigService, ConfigModule } from '@nestjs/config';

describe('PartnerService', () => {
  let service: PartnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        PartnerService,
        ...repositoryProviders,
        ...databaseProviders,
        ConfigService,
      ],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
