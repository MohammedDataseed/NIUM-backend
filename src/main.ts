// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { AppModule } from './app.module';
// import { GlobalExceptionFilter } from './filters/exception.filter';
// import { LoggerService } from './shared/services/logger/logger.service';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as morgan from 'morgan';
// import helmet from 'helmet';
// import { ConfigService } from '@nestjs/config';
// const contextService = require('request-context');

// async function bootstrap() {
//   // initiate express app
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   const logger = app.get<LoggerService>(LoggerService);
//   const config = app.get<ConfigService>(ConfigService);
//   app.useGlobalFilters(new GlobalExceptionFilter(logger));

//   // app use global middleware
//   app.use(
//     morgan(':method :url :status :res[content-length] - :response-time ms', {
//       stream: { write: message => logger.info(message) },
//     }),
//   );
//   app.use(helmet());
//   app.setGlobalPrefix('api');
//   app.use(contextService.middleware('request'));

//   // listen for kill signal
//   // app.enableShutdownHooks();

//   // Set Swagger Documentation
//   const options = new DocumentBuilder()
//     .setTitle(`InstaReM ${process.env.SERVICE_NAME}`)
//     .setDescription(process.env.SERVICE_NAME)
//     .setVersion('1.0')
//     .build();
//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup('v1/api-docs', app, document);

//   await app.listen(config.get('PORT') || 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/exception.filter';
import { LoggerService } from './shared/services/logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
const contextService = require('request-context');

async function bootstrap() {
  // initiate express app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get<LoggerService>(LoggerService);
  const config = app.get<ConfigService>(ConfigService);
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Global middleware
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: { write: message => logger.info(message) },
    }),
  );
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.use(contextService.middleware('request'));

  
  // Swagger documentation
  const options = new DocumentBuilder()
    .setTitle(`InstaReM ${process.env.SERVICE_NAME}`)
    .setDescription(process.env.SERVICE_NAME)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/api-docs', app, document);

  // Add shutdown hooks and listen for requests
  app.enableShutdownHooks();
  await app.listen(config.get('PORT') || 3000);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);  // Optional: exit the process to prevent further errors
});

bootstrap();
