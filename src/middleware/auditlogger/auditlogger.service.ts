import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { RabbitProducerService } from '../../shared/services/rabbit-producer/rabbit-producer.service';
import { TracerService } from '../../shared/services/tracer/tracer.service';
import { AuditLogPayload } from '../../shared/dto/AuditLogPayload';

export interface Response<T> {
  data: T;
}

@Injectable()
export class AuditLoggerService<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private publisher: RabbitProducerService,
    private tracerService: TracerService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    const req = context.switchToHttp().getRequest();
    // create controller span
    const controllerSpan = this.tracerService.createControllerSpan(
      `${context.getHandler().name} : ${context.getClass().name}`,
      `${req.path}`,
      req.headers,
    );

    return next.handle().pipe(
      tap(data => {
        const loggingPayload: AuditLogPayload = {
          request: {
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
          },
          response: data && data.writable ? {} : data,
          success: true,
          method: req.method,
          latency: Date.now() - start,
        };
        const span = this.tracerService.createRabbitSpan(controllerSpan);
        this.publisher.sendServiceAuditLogToQueue(loggingPayload);
        this.tracerService.finishSpanWithResult(span, 200, false);
        this.tracerService.finishSpanWithResult(controllerSpan, 200, false);
      }),
      catchError(err => {
        const loggingPayload: AuditLogPayload = {
          request: {
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
          },
          response: err,
          success: false,
          method: req.method,
          latency: Date.now() - start,
        };
        const span = this.tracerService.createRabbitSpan(controllerSpan);
        this.publisher.sendServiceAuditLogToQueue(loggingPayload);
        span.log({ message: err.message });
        this.tracerService.finishSpanWithResult(span, 200, true);
        this.tracerService.finishSpanWithResult(controllerSpan, 200, true);
        return throwError(err);
      }),
    );
  }
}
