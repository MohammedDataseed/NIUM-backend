import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoggerService } from '../src/shared/services/logger/logger.service';
import { ShutdownService } from '../src/graceful-shutdown/services/shutdown/shutdown.service';
import { GlobalExceptionFilter } from '../src/filters/exception.filter';

const contextService = require('request-context');
describe('AppController (e2e)', () => {
  let app;
  let shutdown: ShutdownService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const logger = app.get(LoggerService);
    shutdown = app.get(ShutdownService); // Uncommented to use ShutdownService
    app.useGlobalFilters(new GlobalExceptionFilter(logger));
    app.setGlobalPrefix('');
    app.use(contextService.middleware('request'));
    await app.init();
  });

  it('Health-Check (GET)', async () => {
    await request(app.getHttpServer())
      .get('/public/health-check')
      .expect(200)
      .expect({ message: 'NestJS demo working!' });
  });

  afterAll(async () => {
    await shutdown.gracefulShutdown();
    await app.close();
  });
});
