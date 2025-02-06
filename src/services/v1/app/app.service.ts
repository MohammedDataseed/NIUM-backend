// import { Injectable, Inject } from '@nestjs/common';
// import { HttpWrapperService } from '../../../shared/services/http-wrapper/http-wrapper.service';
// // import { Partner } from '../../../database/models/partner.model';
// // import { PartnerService } from '../../../database/services/partner/partner.service';
// import * as opentracing from 'opentracing';

// @Injectable()
// export class AppService {
//   getHello(span?: opentracing.Span): object {
//     return {
//       message: 'NestJS demo working!',
//     };
//   }
// }

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
