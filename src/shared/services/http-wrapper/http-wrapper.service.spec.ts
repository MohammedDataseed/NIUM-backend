// src/shared/services/http-wrapper/http-wrapper.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpWrapperService } from './http-wrapper.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // Add this
import { TracerService } from '../tracer/tracer.service';
import { RequestStorageService } from '../request-storage/request-storage.service';

describe('HttpWrapperService', () => {
  let service: HttpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule, // Add this
      ],
      providers: [HttpWrapperService, TracerService, RequestStorageService],
    }).compile();

    service = module.get<HttpWrapperService>(HttpWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
