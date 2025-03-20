import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { TracerService } from '../tracer/tracer.service';
import { throwError } from 'rxjs';
import { RequestStorageService } from '../request-storage/request-storage.service';
import { AxiosRequestConfig } from 'axios';

import * as changeCase from 'change-object-case';
import * as opentracing from 'opentracing';

const FormData = require('form-data');

@Injectable()
export class HttpWrapperService {
  constructor(
    private http: HttpService,
    private tracerService: TracerService,
    private readonly requestStorage: RequestStorageService,
  ) {}

  private processResponse(traceSpan: opentracing.Span, response) {
    if (response.headers['content-type'] === 'application/octet-stream') {
      return response.data;
    }
    const result =
      response.data && response.data.data ? response.data.data : response.data;
    this.tracerService.finishSpanWithResult(traceSpan, 200, false);
    if (Array.isArray(result)) {
      return changeCase.camelArray(result, {
        recursive: true,
        arrayRecursive: true,
      });
    } else {
      return changeCase.camelKeys(result, {
        recursive: true,
        arrayRecursive: true,
      });
    }
  }

  private processAxiosError(err) {
    if (err.isAxiosError) {
      if (err.response) {
        return {
          status: err.response.status,
          response: {
            message: err.response.data.data.message,
            error: err.response.data.data.error,
            stackTrace: err.stack,
          },
        };
      } else {
        return {
          status: 500,
          response: {
            message: err.message,
            error: err.code,
            stackTrace: err.stack,
          },
        };
      }
    }
  }

  private processReqest(body, queryParmas) {
    return ([body, queryParmas] = [body, queryParmas].map((item) => {
      if (Array.isArray(item)) {
        return changeCase.snakeArray(item, {
          recursive: true,
          arrayRecursive: true,
        });
      } else {
        return changeCase.snakeKeys(item, {
          recursive: true,
          arrayRecursive: true,
        });
      }
    }));
  }
  get(
    url: string,
    queryParams: object,
    headers: object,
    responseType = 'json',
  ) {
    const traceSpan = this.tracerService.traceHttpRequest(
      this.requestStorage.get('active-span'),
      url,
      'GET',
    );
    let body = {};
    [body, queryParams] = this.processReqest(body, queryParams);
    // inject tracer
    this.tracerService.inject(traceSpan, headers);
    const options = {
      params: queryParams,
      headers,
      responseType,
    } as AxiosRequestConfig;
    return this.http.get(url, options).pipe(
      map((response) => {
        return this.processResponse(traceSpan, response);
      }),
      catchError((err) => {
        this.tracerService.finishSpanWithResult(traceSpan, 200, true);
        return throwError(this.processAxiosError(err));
      }),
    );
  }

  post(
    url: string,
    body: object,
    queryParams: object,
    headers: object,
    isCaseConversionRequired = true,
  ) {
    const traceSpan = this.tracerService.traceHttpRequest(
      this.requestStorage.get('active-span'),
      url,
      'POST',
    );
    if (isCaseConversionRequired) {
      [body, queryParams] = this.processReqest(body, queryParams);
    }
    // inject tracer
    this.tracerService.inject(traceSpan, headers);
    return this.http.post(url, body, { params: queryParams, headers }).pipe(
      map((response) => {
        return this.processResponse(traceSpan, response);
      }),
      catchError((err) => {
        this.tracerService.finishSpanWithResult(traceSpan, 200, true);
        return throwError(this.processAxiosError(err));
      }),
    );
  }

  patch(
    url: string,
    body: object,
    queryParams: object,
    headers: object,
    files?: any[],
    isMultipart = false,
  ) {
    const traceSpan = this.tracerService.traceHttpRequest(
      this.requestStorage.get('active-span'),
      url,
      'PATCH',
    );
    [body, queryParams] = this.processReqest(body, queryParams);
    // inject tracer
    this.tracerService.inject(traceSpan, headers);
    if (isMultipart) {
      const form = new FormData();
      files.forEach((file) => {
        form.append(file.fieldname, file.buffer, file.originalname);
      });
      Object.keys(body).forEach((item) => {
        form.append(item, body[item]);
      });
      body = form;
      headers = {
        ...form.getHeaders(),
        'x-api-key': headers['x-api-key'],
        'x-user-email': headers['x-user-email'],
      };
    }
    return this.http.patch(url, body, { params: queryParams, headers }).pipe(
      map((response) => {
        return this.processResponse(traceSpan, response);
      }),
      catchError((err) => {
        this.tracerService.finishSpanWithResult(traceSpan, 200, true);
        return throwError(this.processAxiosError(err));
      }),
    );
  }

  put(url: string, body: object, queryParams: object, headers: object) {
    const traceSpan = this.tracerService.traceHttpRequest(
      this.requestStorage.get('active-span'),
      url,
      'PUT',
    );

    // inject tracer
    this.tracerService.inject(traceSpan, headers);
    return this.http.put(url, body, { params: queryParams, headers }).pipe(
      map((response) => {
        return this.processResponse(traceSpan, response);
      }),
      catchError((err) => {
        this.tracerService.finishSpanWithResult(traceSpan, 200, true);
        return throwError(this.processAxiosError(err));
      }),
    );
  }
}
