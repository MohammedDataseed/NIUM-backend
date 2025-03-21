import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from '../../../services/v1/app/app.service';
import * as opentracing from 'opentracing';

@Controller('/v1/public')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  async getHello(): Promise<object> {
    return this.appService.getHello();
  }
}
