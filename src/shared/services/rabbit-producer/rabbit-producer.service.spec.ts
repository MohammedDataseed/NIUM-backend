import { Test, TestingModule } from '@nestjs/testing';
import { RabbitProducerService } from './rabbit-producer.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';

describe('RabbitProducerService', () => {
  let service: RabbitProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [RabbitProducerService, ConfigService, LoggerService],
    }).compile();

    service = module.get<RabbitProducerService>(RabbitProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
