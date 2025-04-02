import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../../services/v1/app/app.service';

@Controller('/v1/public')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  async getHello(): Promise<object> {
    return this.appService.getHello();
  }
}
