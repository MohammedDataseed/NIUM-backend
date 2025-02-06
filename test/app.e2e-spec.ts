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
    shutdown = app.get(ShutdownService);
    app.useGlobalFilters(new GlobalExceptionFilter(logger));
    // app use global middleware
    app.setGlobalPrefix('api');
    app.use(contextService.middleware('request'));
    await app.init();
  });

  it('Health-Check (GET)', done => {
    return request(app.getHttpServer())
      .get('/api/v1/public/health-check')
      .expect(200)
      .expect({ message: 'NestJS demo working!' }, done);
  });

  afterAll(async () => {
    await shutdown.gracefulShutdown();
    await app.close();
  });
});
