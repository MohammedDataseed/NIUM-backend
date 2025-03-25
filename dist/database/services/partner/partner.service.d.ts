import { Partner } from '../../models/partner.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
export declare class PartnerService {
    private readonly partnerRepository;
    private tracerService;
    constructor(partnerRepository: typeof Partner, tracerService: TracerService);
    findAll(parentSpan: opentracing.Span, params: object): Promise<Partner[]>;
}
