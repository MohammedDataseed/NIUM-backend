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
exports.AuditLoggerService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tracer_service_1 = require("../../shared/services/tracer/tracer.service");
let AuditLoggerService = class AuditLoggerService {
    constructor(tracerService) {
        this.tracerService = tracerService;
    }
    intercept(context, next) {
        const start = Date.now();
        const req = context.switchToHttp().getRequest();
        const controllerSpan = this.tracerService.createControllerSpan(`${context.getHandler().name} : ${context.getClass().name}`, `${req.path}`, req.headers);
        return next.handle().pipe((0, operators_1.tap)(data => {
            const loggingPayload = {
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
            this.tracerService.finishSpanWithResult(span, 200, false);
            this.tracerService.finishSpanWithResult(controllerSpan, 200, false);
        }), (0, operators_1.catchError)(err => {
            const loggingPayload = {
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
            span.log({ message: err.message });
            this.tracerService.finishSpanWithResult(span, 200, true);
            this.tracerService.finishSpanWithResult(controllerSpan, 200, true);
            return (0, rxjs_1.throwError)(err);
        }));
    }
};
exports.AuditLoggerService = AuditLoggerService;
exports.AuditLoggerService = AuditLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tracer_service_1.TracerService])
], AuditLoggerService);
//# sourceMappingURL=auditlogger.service.js.map