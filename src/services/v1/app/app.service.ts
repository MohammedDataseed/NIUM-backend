import { Injectable } from '@nestjs/common';
import { HttpWrapperService } from '../../../shared/services/http-wrapper/http-wrapper.service';
import * as opentracing from 'opentracing';

@Injectable()
export class AppService {
  getHello(span?: opentracing.Span): object {
    if (span) {
      span.setTag('custom.tag', 'health-check');
      span.log({ event: 'health-check' });
    }

    return {
      message: 'NestJS demo working!',
    };
  }
}
