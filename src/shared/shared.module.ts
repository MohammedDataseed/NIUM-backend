import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from './services/logger/logger.service';
// import { RedisService } from './services/redis/redis.service';
import { HttpWrapperService } from './services/http-wrapper/http-wrapper.service';
import { RabbitProducerService } from './services/rabbit-producer/rabbit-producer.service';
import { TracerService } from './services/tracer/tracer.service';
import { RequestStorageService } from './services/request-storage/request-storage.service';
import { ConfigService } from '@nestjs/config';
import { RabbitProvider } from './providers/rabbitmq.provider';
import { PdfService } from './services/documents-consolidate/documents-consolidate.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    LoggerService,
    ConfigService,
    // RedisService,
    HttpWrapperService,
    RabbitProducerService,
    TracerService,
    RequestStorageService,
    RabbitProvider,
    PdfService, 
  ],
  exports: [
    LoggerService,
    // RedisService,
    HttpWrapperService,
    RabbitProducerService,
    TracerService,
    RequestStorageService,
    HttpModule,
    RabbitProvider,
    PdfService, 
  ],
})
export class SharedModule {}
