import { Test, TestingModule } from '@nestjs/testing';
import { TracerService } from './tracer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestStorageService } from '../request-storage/request-storage.service';

describe('TracerService', () => {
  let service: TracerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [TracerService, RequestStorageService, ConfigService],
    }).compile();

    service = module.get<TracerService>(TracerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
