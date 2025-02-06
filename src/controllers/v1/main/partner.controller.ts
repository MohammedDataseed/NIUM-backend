import { Controller, Get, Query } from '@nestjs/common';
import { PartnerService } from '../../../database/services/partner/partner.service';
import { Partner } from '../../../database/models/partner.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';


@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  async findAll(@Query() params: object): Promise<Partner[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-partners-request');
    const result = await this.partnerService.findAll(span, params);
    span.finish();
    return result;
  }
}

