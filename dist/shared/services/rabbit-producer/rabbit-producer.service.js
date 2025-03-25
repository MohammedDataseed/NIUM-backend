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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitProducerService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const general_constants_1 = require("../../../constants/general.constants");
let RabbitProducerService = class RabbitProducerService {
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        await this.client.connect();
    }
    onModuleDestroy() {
        this.client.close();
    }
    sendServiceAuditLogToQueue(payload) {
        return this.client.emit({ cmd: general_constants_1.RMQ_PATTERNS.SERVICE_AUDIT_LOGS }, payload);
    }
};
exports.RabbitProducerService = RabbitProducerService;
exports.RabbitProducerService = RabbitProducerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RABBIT_CLIENT_LOG_QUEUE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], RabbitProducerService);
//# sourceMappingURL=rabbit-producer.service.js.map