import { Injectable, Inject } from '@nestjs/common';
import { Partner } from '../../models/partner.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
    private tracerService: TracerService,
  ) {}

  async findAll(
    parentSpan: opentracing.Span,
    params: object,
  ): Promise<Partner[]> {
    const span = this.tracerService.traceDBOperations(
      parentSpan,
      'findall',
      Partner.tableName,
    );
    try {
      const result = await this.partnerRepository.findAll(params);
      this.tracerService.finishSpanWithResult(span, 200, null);
      return result;
    } catch (err) {
      this.tracerService.finishSpanWithResult(span, null, true);
      throw err;
    }
  }
}
