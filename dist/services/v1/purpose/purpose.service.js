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
exports.PurposeService = void 0;
const common_1 = require("@nestjs/common");
let PurposeService = class PurposeService {
    constructor(purposeRepository) {
        this.purposeRepository = purposeRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.purposeRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async createPurpose(span, createPurposeDto) {
        const childSpan = span
            .tracer()
            .startSpan("create-purpose", { childOf: span });
        try {
            const existingPurposeType = await this.purposeRepository.findOne({
                where: { purposeName: createPurposeDto.purpose_name },
            });
            if (existingPurposeType) {
                throw new common_1.ConflictException("Purpose Type already exists");
            }
            console.log("Received DTO:", createPurposeDto);
            const newPurpose = await this.purposeRepository.create({
                purposeName: createPurposeDto.purpose_name,
                created_by: createPurposeDto.created_by,
                updated_by: createPurposeDto.updated_by,
            });
            return newPurpose;
        }
        finally {
            childSpan.finish();
        }
    }
    async updatePurpose(span, hashed_key, updatePurposeDto) {
        var _a, _b, _c;
        const childSpan = span
            .tracer()
            .startSpan("update-purpose-type", { childOf: span });
        try {
            const purpose = await this.purposeRepository.findOne({
                where: { hashed_key },
            });
            if (!purpose) {
                throw new common_1.NotFoundException("Purpose Type not found");
            }
            if (updatePurposeDto.purpose_name) {
                const existingPurpose = await this.purposeRepository.findOne({
                    where: { purposeName: updatePurposeDto.purpose_name },
                });
                if (existingPurpose && existingPurpose.hashed_key !== hashed_key) {
                    throw new common_1.ConflictException("Another Purpose Type with the same name already exists");
                }
            }
            await purpose.update({
                purposeName: (_a = updatePurposeDto.purpose_name) !== null && _a !== void 0 ? _a : purpose.purposeName,
                isActive: (_b = updatePurposeDto.is_active) !== null && _b !== void 0 ? _b : purpose.isActive,
                updated_by: (_c = updatePurposeDto.updated_by) !== null && _c !== void 0 ? _c : purpose.updated_by,
            });
            return purpose;
        }
        finally {
            childSpan.finish();
        }
    }
    async findAllConfig() {
        const purposes = await this.purposeRepository.findAll({
            where: { isActive: true },
        });
        return purposes.map((purpose) => ({
            id: purpose.hashed_key,
            text: purpose.purposeName,
        }));
    }
    async deletePurposeType(span, hashed_key) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            const purpose = await this.purposeRepository.findOne({
                where: { hashed_key },
            });
            if (!purpose)
                throw new common_1.NotFoundException("Purpose Type not found");
            await purpose.destroy();
            childSpan.log({ event: "purpose_deleted", hashed_key });
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.PurposeService = PurposeService;
exports.PurposeService = PurposeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("PURPOSE_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], PurposeService);
//# sourceMappingURL=purpose.service.js.map