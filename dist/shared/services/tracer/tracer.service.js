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
exports.TracerService = void 0;
const common_1 = require("@nestjs/common");
const opentracing = require("opentracing");
const initJaegerTracer = require('jaeger-client').initTracer;
const request_storage_service_1 = require("../request-storage/request-storage.service");
const config_1 = require("@nestjs/config");
let TracerService = class TracerService {
    constructor(requestStorage, configService) {
        this.requestStorage = requestStorage;
        this.configService = configService;
        this.tracer = this.initTracer(this.configService.get('SERVICE_NAME'), this.configService.get('JAEGER_HOST'), this.configService.get('JAEGER_PORT'));
    }
    inject(span, headers) {
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
    initTracer(serviceName, host, port) {
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
            },
        };
        const options = {
            logger: {
                info: function logInfo(msg) {
                    console.log('INFO  ', msg);
                },
                error: function logError(msg) {
                    console.log('ERROR ', msg);
                },
            },
        };
        return initJaegerTracer(config, options);
    }
    createControllerSpan(controller, operation, headers) {
        let traceSpan;
        const parentSpanContext = this.tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
        if (parentSpanContext) {
            traceSpan = this.tracer.startSpan(operation, {
                childOf: parentSpanContext,
                tags: {
                    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
                    [opentracing.Tags.COMPONENT]: controller,
                },
            });
        }
        else {
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
    finishSpanWithResult(span, status, errorTag) {
        span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
        if (errorTag) {
            span.setTag(opentracing.Tags.ERROR, true);
        }
        span.finish();
    }
    traceDBOperations(parentSpan, dbOperation, model) {
        if (!(parentSpan instanceof opentracing.Span)) {
            console.warn('Invalid parent span detected, starting a new root span.');
            parentSpan = undefined;
        }
        const span = this.tracer.startSpan('database', {
            childOf: parentSpan || undefined,
            tags: {
                [opentracing.Tags.SPAN_KIND]: opentracing.Tags.DB_STATEMENT,
                [opentracing.Tags.COMPONENT]: model,
                [opentracing.Tags.DB_STATEMENT]: dbOperation,
            },
        });
        this.requestStorage.set(`active-span`, span);
        return span;
    }
    traceHttpRequest(parentSpan, uri, method) {
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
};
exports.TracerService = TracerService;
exports.TracerService = TracerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_storage_service_1.RequestStorageService,
        config_1.ConfigService])
], TracerService);
//# sourceMappingURL=tracer.service.js.map