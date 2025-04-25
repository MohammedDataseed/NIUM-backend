import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from './services/logger/logger.service';
import { RedisService } from './services/redis/redis.service';
import { HttpWrapperService } from './services/http-wrapper/http-wrapper.service';
import { TracerService } from './services/tracer/tracer.service';
import { RequestStorageService } from './services/request-storage/request-storage.service';
import { MailerService } from './services/mailer/mailer.service';
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    LoggerService,
    ConfigService,
    // RedisService,
    HttpWrapperService,
    TracerService,
    RequestStorageService,
    MailerService,
  ],
  exports: [
    LoggerService,
    // RedisService,
    HttpWrapperService,
    // RabbitProducerService,
    TracerService,
    RequestStorageService,
    HttpModule,
    // RabbitProvider,
    MailerService,
  ],
})
export class SharedModule {}
