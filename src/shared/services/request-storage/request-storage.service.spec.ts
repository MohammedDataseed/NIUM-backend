import { Test, TestingModule } from '@nestjs/testing';
import { RequestStorageService } from './request-storage.service';
import { ConfigModule } from '@nestjs/config';

describe('RequestStorageService', () => {
  let service: RequestStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestStorageService],
    }).compile();

    service = module.get<RequestStorageService>(RequestStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
