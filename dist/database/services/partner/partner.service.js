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
exports.PartnerService = void 0;
const common_1 = require("@nestjs/common");
const partner_model_1 = require("../../models/partner.model");
const tracer_service_1 = require("../../../shared/services/tracer/tracer.service");
let PartnerService = class PartnerService {
    constructor(partnerRepository, tracerService) {
        this.partnerRepository = partnerRepository;
        this.tracerService = tracerService;
    }
    async findAll(parentSpan, params) {
        const span = this.tracerService.traceDBOperations(parentSpan, 'findall', partner_model_1.Partner.tableName);
        try {
            const result = await this.partnerRepository.findAll(params);
            this.tracerService.finishSpanWithResult(span, 200, null);
            return result;
        }
        catch (err) {
            console.error('Error in PartnerService.findAll:', err);
            this.tracerService.finishSpanWithResult(span, null, true);
            throw err;
        }
    }
};
exports.PartnerService = PartnerService;
exports.PartnerService = PartnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PARTNER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, tracer_service_1.TracerService])
], PartnerService);
//# sourceMappingURL=partner.service.js.map