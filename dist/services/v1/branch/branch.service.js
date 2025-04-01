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
exports.BranchService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let BranchService = class BranchService {
    constructor(branchRepository) {
        this.branchRepository = branchRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.branchRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async createBranch(span, createBranchDto) {
        const childSpan = span
            .tracer()
            .startSpan("create-branch", { childOf: span });
        try {
            const existingBranch = await this.branchRepository.findOne({
                where: { name: createBranchDto.name },
            });
            if (existingBranch) {
                throw new common_1.ConflictException("Branch already exists");
            }
            console.log("Received DTO:", createBranchDto);
            const branch = this.branchRepository.build({
                name: createBranchDto.name,
                location: createBranchDto.location,
                city: createBranchDto.city,
                state: createBranchDto.state,
                business_type: createBranchDto.business_type,
            });
            if (!branch.hashed_key) {
                branch.hashed_key =
                    crypto.randomBytes(16).toString("hex") + Date.now().toString(36);
            }
            await branch.save();
            return branch;
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.BranchService = BranchService;
exports.BranchService = BranchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("BRANCH_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], BranchService);
//# sourceMappingURL=branch.service.js.map