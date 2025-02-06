// import { Controller, Get, Headers } from '@nestjs/common';
// import { AppService } from '../../../services/v1/app/app.service';
// import * as opentracing from 'opentracing';

// @Controller('/v1/public')
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get('/health-check')
//   async getHello(): Promise<object> {
//     return this.appService.getHello();
//   }

// }

import { Controller, Get } from "@nestjs/common";
import { AppService } from "../../../services/v1/app/app.service";
import * as opentracing from "opentracing";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health-check")
  async getHello(): Promise<object> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("health-check-request");
    const result = this.appService.getHello(span);
    span.finish();
    return result;
  }
}
