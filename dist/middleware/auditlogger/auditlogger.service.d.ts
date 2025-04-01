import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TracerService } from '../../shared/services/tracer/tracer.service';
export interface Response<T> {
    data: T;
}
export declare class AuditLoggerService<T> implements NestInterceptor<T, Response<T>> {
    private tracerService;
    constructor(tracerService: TracerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
