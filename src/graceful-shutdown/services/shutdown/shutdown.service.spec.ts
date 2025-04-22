import { Test, TestingModule } from '@nestjs/testing';
import { ShutdownService } from './shutdown.service';
import { SharedModule } from '../../../shared/shared.module';
import { DatabaseModule } from '../../../database/database.module';
import { RedisService } from '../../../shared/services/redis/redis.service';
import { databaseProviders } from '../../../database/providers/database.provider';
import { ConfigService, ConfigModule } from '@nestjs/config';

describe('ShutdownService', () => {
  let service: ShutdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        DatabaseModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [
        ShutdownService,
        // RedisService,
        ...databaseProviders,
        ConfigService,
      ],
    }).compile();

    service = module.get<ShutdownService>(ShutdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
