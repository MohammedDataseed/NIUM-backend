import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService, ConfigModule } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [RedisService, LoggerService, ConfigService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
