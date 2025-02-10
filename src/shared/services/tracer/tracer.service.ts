import { Injectable } from '@nestjs/common';
import * as opentracing from 'opentracing';
const initJaegerTracer = require('jaeger-client').initTracer;
import { RequestStorageService } from '../request-storage/request-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TracerService {
  tracer;
  constructor(
    private readonly requestStorage: RequestStorageService,
    private readonly configService: ConfigService,
  ) {
    this.tracer = this.initTracer(
      this.configService.get('SERVICE_NAME'),
      this.configService.get('JAEGER_HOST'),
      this.configService.get('JAEGER_PORT'),
    );
  }

  inject(span: opentracing.Span, headers) {
    this.tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
  }

  createRabbitSpan(parentSpan) {
    const span = this.tracer.startSpan('rabbit', {
      childOf: parentSpan,
      tags: {
        [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
        [opentracing.Tags.SPAN_KIND_MESSAGING_PRODUCER]: 'RabbitMQ',
      },
    });
    this.requestStorage.set(`active-span`, span);
    return span;
  }

  initTracer(serviceName: string, host: string, port: number) {
    const config = {
      serviceName,
      sampler: {
        type: 'const',
        param: 1,
      },
      reporter: {
        logSpans: true,
        agentHost: host,
        agentPort: port,
        // this logs whenever we send a span
      },
    };
    const options = {
      logger: {
        info: function logInfo(msg: string) {
          console.log('INFO  ', msg);
        },
        error: function logError(msg: string) {
          console.log('ERROR ', msg);
        },
      },
    };
    return initJaegerTracer(config, options);
  }

  createControllerSpan(controller: string, operation: string, headers: any) {
    let traceSpan: opentracing.Span;
    // NOTE: OpenTracing type definitions at
    // <https://github.com/opentracing/opentracing-javascript/blob/master/src/tracer.ts>
    const parentSpanContext = this.tracer.extract(
      opentracing.FORMAT_HTTP_HEADERS,
      headers,
    );
    if (parentSpanContext) {
      traceSpan = this.tracer.startSpan(operation, {
        childOf: parentSpanContext,
        tags: {
          [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
          [opentracing.Tags.COMPONENT]: controller,
        },
      });
    } else {
      traceSpan = this.tracer.startSpan(operation, {
        tags: {
          [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
          [opentracing.Tags.COMPONENT]: controller,
        },
      });
    }
    this.requestStorage.set(`active-span`, traceSpan);
    return traceSpan;
  }

  finishSpanWithResult(
    span: opentracing.Span,
    status: number,
    errorTag?: boolean,
  ) {
    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
    if (errorTag) {
      span.setTag(opentracing.Tags.ERROR, true);
    }
    span.finish();
  }

  // traceDBOperations(
  //   parentSpan: opentracing.Span,
  //   dbOperation: string,
  //   model: string,
  // ) {
  //   const span = this.tracer.startSpan('database', {
  //     childOf: parentSpan,
  //     tags: {
  //       [opentracing.Tags.SPAN_KIND]: opentracing.Tags.DB_STATEMENT,
  //       [opentracing.Tags.COMPONENT]: model,
  //       [opentracing.Tags.DB_STATEMENT]: dbOperation,
  //     },
  //   });
  //   this.requestStorage.set(`active-span`, span);
  //   return span;
  // }

  traceDBOperations(
    parentSpan: opentracing.Span | undefined,
    dbOperation: string,
    model: string,
  ) {
    // Ensure parentSpan is a valid OpenTracing span
    if (!(parentSpan instanceof opentracing.Span)) {
      console.warn('Invalid parent span detected, starting a new root span.');
      parentSpan = undefined; // If invalid, create a new root span
    }
  
    const span = this.tracer.startSpan('database', {
      childOf: parentSpan || undefined, // Avoid passing invalid parentSpan
      tags: {
        [opentracing.Tags.SPAN_KIND]: opentracing.Tags.DB_STATEMENT,
        [opentracing.Tags.COMPONENT]: model,
        [opentracing.Tags.DB_STATEMENT]: dbOperation,
      },
    });
  
    this.requestStorage.set(`active-span`, span);
    return span;
  }
  

  traceHttpRequest(parentSpan: opentracing.Span, uri: string, method: string) {
    const span = this.tracer.startSpan(`http: ${uri}`, {
      childOf: parentSpan,
      tags: {
        [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
        [opentracing.Tags.HTTP_METHOD]: method,
        [opentracing.Tags.HTTP_URL]: uri,
      },
    });
    this.requestStorage.set(`active-span`, span);
    return span;
  }
}
