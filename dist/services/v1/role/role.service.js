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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let RoleService = class RoleService {
    constructor(roleRepository, userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    async findAll(span, params) {
        const childSpan = span.tracer().startSpan("db-query", { childOf: span });
        try {
            return await this.roleRepository.findAll({ where: params });
        }
        finally {
            childSpan.finish();
        }
    }
    async findOne(span, id) {
        const childSpan = span.tracer().startSpan("find-role", { childOf: span });
        try {
            const role = await this.roleRepository.findOne({
                where: { hashed_key: id },
            });
            if (!role) {
                throw new common_1.NotFoundException("Role not found");
            }
            return role;
        }
        finally {
            childSpan.finish();
        }
    }
    async createRole(span, createRoleDto) {
        var _a;
        const childSpan = span.tracer().startSpan("create-role", { childOf: span });
        try {
            const existingRole = await this.roleRepository.findOne({
                where: { name: createRoleDto.name },
            });
            if (existingRole) {
                throw new common_1.ConflictException("Role already exists");
            }
            let createdById = null;
            if (createRoleDto.created_by) {
                const creatorUser = await this.userRepository.findOne({
                    where: { id: createRoleDto.created_by },
                });
                if (!creatorUser) {
                    throw new common_1.NotFoundException("Creator user not found");
                }
                createdById = creatorUser.id;
            }
            const role = this.roleRepository.build({
                name: createRoleDto.name,
                status: (_a = createRoleDto.status) !== null && _a !== void 0 ? _a : true,
                created_by: createdById
            });
            if (!role.hashed_key) {
                role.hashed_key = crypto.randomBytes(16).toString("hex") + Date.now().toString(36);
            }
            await role.save();
            return role;
        }
        finally {
            childSpan.finish();
        }
    }
    async updateRole(span, hashedKey, updateRoleDto) {
        var _a, _b;
        const childSpan = span.tracer().startSpan("update-role", { childOf: span });
        try {
            const role = await this.roleRepository.findOne({ where: { hashed_key: hashedKey } });
            if (!role) {
                throw new common_1.NotFoundException("Role not found");
            }
            let updatedById = role.updated_by;
            if (updateRoleDto.updated_by) {
                const updaterRole = await this.roleRepository.findOne({
                    where: { hashed_key: updateRoleDto.updated_by },
                });
                if (!updaterRole) {
                    throw new common_1.NotFoundException("Updater role not found");
                }
                updatedById = updaterRole.id;
            }
            await role.update({
                name: (_a = updateRoleDto.name) !== null && _a !== void 0 ? _a : role.name,
                status: (_b = updateRoleDto.status) !== null && _b !== void 0 ? _b : role.status,
                updated_by: updatedById,
            });
            return role;
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ROLE_REPOSITORY")),
    __param(1, (0, common_1.Inject)("USER_REPOSITORY")),
    __metadata("design:paramtypes", [Object, Object])
], RoleService);
//# sourceMappingURL=role.service.js.map