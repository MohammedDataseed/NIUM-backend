"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpWrapperService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const tracer_service_1 = require("../tracer/tracer.service");
const rxjs_1 = require("rxjs");
const request_storage_service_1 = require("../request-storage/request-storage.service");
const changeCase = require("change-object-case");
const FormData = require('form-data');
let HttpWrapperService = class HttpWrapperService {
    constructor(http, tracerService, requestStorage) {
        this.http = http;
        this.tracerService = tracerService;
        this.requestStorage = requestStorage;
    }
    processResponse(traceSpan, response) {
        if (response.headers['content-type'] === 'application/octet-stream') {
            return response.data;
        }
        const result = response.data && response.data.data ? response.data.data : response.data;
        this.tracerService.finishSpanWithResult(traceSpan, 200, false);
        if (Array.isArray(result)) {
            return changeCase.camelArray(result, {
                recursive: true,
                arrayRecursive: true,
            });
        }
        else {
            return changeCase.camelKeys(result, {
                recursive: true,
                arrayRecursive: true,
            });
        }
    }
    processAxiosError(err) {
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
            }
            else {
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
    processReqest(body, queryParmas) {
        return ([body, queryParmas] = [body, queryParmas].map(item => {
            if (Array.isArray(item)) {
                return changeCase.snakeArray(item, {
                    recursive: true,
                    arrayRecursive: true,
                });
            }
            else {
                return changeCase.snakeKeys(item, {
                    recursive: true,
                    arrayRecursive: true,
                });
            }
        }));
    }
    get(url, queryParams, headers, responseType = 'json') {
        const traceSpan = this.tracerService.traceHttpRequest(this.requestStorage.get('active-span'), url, 'GET');
        let body = {};
        [body, queryParams] = this.processReqest(body, queryParams);
        this.tracerService.inject(traceSpan, headers);
        const options = {
            params: queryParams,
            headers,
            responseType,
        };
        return this.http.get(url, options).pipe((0, operators_1.map)(response => {
            return this.processResponse(traceSpan, response);
        }), (0, operators_1.catchError)(err => {
            this.tracerService.finishSpanWithResult(traceSpan, 200, true);
            return (0, rxjs_1.throwError)(this.processAxiosError(err));
        }));
    }
    post(url, body, queryParams, headers, isCaseConversionRequired = true) {
        const traceSpan = this.tracerService.traceHttpRequest(this.requestStorage.get('active-span'), url, 'POST');
        if (isCaseConversionRequired) {
            [body, queryParams] = this.processReqest(body, queryParams);
        }
        this.tracerService.inject(traceSpan, headers);
        return this.http.post(url, body, { params: queryParams, headers }).pipe((0, operators_1.map)(response => {
            return this.processResponse(traceSpan, response);
        }), (0, operators_1.catchError)(err => {
            this.tracerService.finishSpanWithResult(traceSpan, 200, true);
            return (0, rxjs_1.throwError)(this.processAxiosError(err));
        }));
    }
    patch(url, body, queryParams, headers, files, isMultipart = false) {
        const traceSpan = this.tracerService.traceHttpRequest(this.requestStorage.get('active-span'), url, 'PATCH');
        [body, queryParams] = this.processReqest(body, queryParams);
        this.tracerService.inject(traceSpan, headers);
        if (isMultipart) {
            const form = new FormData();
            files.forEach(file => {
                form.append(file.fieldname, file.buffer, file.originalname);
            });
            Object.keys(body).forEach(item => {
                form.append(item, body[item]);
            });
            body = form;
            headers = Object.assign(Object.assign({}, form.getHeaders()), { 'x-api-key': headers['x-api-key'], 'x-user-email': headers['x-user-email'] });
        }
        return this.http.patch(url, body, { params: queryParams, headers }).pipe((0, operators_1.map)(response => {
            return this.processResponse(traceSpan, response);
        }), (0, operators_1.catchError)(err => {
            this.tracerService.finishSpanWithResult(traceSpan, 200, true);
            return (0, rxjs_1.throwError)(this.processAxiosError(err));
        }));
    }
    put(url, body, queryParams, headers) {
        const traceSpan = this.tracerService.traceHttpRequest(this.requestStorage.get('active-span'), url, 'PUT');
        this.tracerService.inject(traceSpan, headers);
        return this.http.put(url, body, { params: queryParams, headers }).pipe((0, operators_1.map)(response => {
            return this.processResponse(traceSpan, response);
        }), (0, operators_1.catchError)(err => {
            this.tracerService.finishSpanWithResult(traceSpan, 200, true);
            return (0, rxjs_1.throwError)(this.processAxiosError(err));
        }));
    }
};
exports.HttpWrapperService = HttpWrapperService;
exports.HttpWrapperService = HttpWrapperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        tracer_service_1.TracerService,
        request_storage_service_1.RequestStorageService])
], HttpWrapperService);
//# sourceMappingURL=http-wrapper.service.js.map