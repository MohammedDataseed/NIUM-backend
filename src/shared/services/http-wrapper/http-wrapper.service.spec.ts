import { Test, TestingModule } from '@nestjs/testing';
import { HttpWrapperService } from './http-wrapper.service';
import { TracerService } from '../tracer/tracer.service';
import { RequestStorageService } from '../request-storage/request-storage.service';
import { HttpService, HttpModule } from '@nestjs/axios';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared.module';
import { ShutdownService } from '../../../graceful-shutdown/services/shutdown/shutdown.service';
import { RedisService } from '../redis/redis.service';
import { RabbitProducerService } from '../rabbit-producer/rabbit-producer.service';

describe('HttpWrapperService', () => {
  let service: HttpWrapperService;
  let redis: RedisService;
  let rabbit: RabbitProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule],
      providers: [ConfigService],
    }).compile();

    service = module.get<HttpWrapperService>(HttpWrapperService);
    redis = module.get<RedisService>(RedisService);
    rabbit = module.get<RabbitProducerService>(RabbitProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await redis.closeConnection();
  });
});
