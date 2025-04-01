import * as opentracing from 'opentracing';
import { RequestStorageService } from '../request-storage/request-storage.service';
import { ConfigService } from '@nestjs/config';
export declare class TracerService {
    private readonly requestStorage;
    private readonly configService;
    tracer: any;
    constructor(requestStorage: RequestStorageService, configService: ConfigService);
    inject(span: opentracing.Span, headers: any): void;
    createRabbitSpan(parentSpan: any): any;
    initTracer(serviceName: string, host: string, port: number): any;
    createControllerSpan(controller: string, operation: string, headers: any): opentracing.Span;
    finishSpanWithResult(span: opentracing.Span, status: number, errorTag?: boolean): void;
    traceDBOperations(parentSpan: opentracing.Span | undefined, dbOperation: string, model: string): any;
    traceHttpRequest(parentSpan: opentracing.Span, uri: string, method: string): any;
}
