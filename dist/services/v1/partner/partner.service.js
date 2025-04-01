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
const uuid_1 = require("uuid");
const products_model_1 = require("../../../database/models/products.model");
const partner_dto_1 = require("../../../dto/partner.dto");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const crypto = require("crypto");
let PartnerService = class PartnerService {
    constructor(partnerRepository, jwtService) {
        this.partnerRepository = partnerRepository;
        this.jwtService = jwtService;
    }
    async findAllPartners(span) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        try {
            const partners = await this.partnerRepository.findAll({
                include: [
                    {
                        model: products_model_1.Products,
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                    },
                ],
            });
            return partners.map((partner) => this.toResponseDto(partner));
        }
        catch (error) {
            console.error('Error fetching partners:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch partners');
        }
        finally {
            childSpan.finish();
        }
    }
    async findPartnerById(span, id) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        try {
            const partner = await this.partnerRepository.findByPk(id, {
                include: [{ model: products_model_1.Products }],
            });
            if (!partner)
                throw new common_1.NotFoundException('Partner not found');
            return this.toResponseDto(partner);
        }
        finally {
            childSpan.finish();
        }
    }
    async findPartnerByHashedKey(span, hashed_key) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        try {
            const partner = await this.partnerRepository.findOne({
                where: { hashed_key },
                include: [{ model: products_model_1.Products }],
            });
            if (!partner)
                throw new common_1.NotFoundException('Partner not found');
            return this.toResponseDto(partner);
        }
        finally {
            childSpan.finish();
        }
    }
    async generateUniqueApiKey(transaction) {
        let apiKey;
        let exists = true;
        while (exists) {
            apiKey = (0, uuid_1.v4)();
            const existingPartner = await this.partnerRepository.findOne({
                where: { api_key: apiKey },
                transaction,
            });
            exists = existingPartner !== null;
        }
        return apiKey;
    }
    generateHashedKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    async createPartner(span, createPartnerDto) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        const transaction = await this.partnerRepository.sequelize.transaction();
        try {
            const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
            const apiKey = await this.generateUniqueApiKey(transaction);
            const hashedKey = this.generateHashedKey();
            const partner = await this.partnerRepository.create(Object.assign(Object.assign({}, createPartnerDto), { password: hashedPassword, api_key: apiKey, hashed_key: hashedKey }), { transaction });
            if (createPartnerDto.product_ids && createPartnerDto.product_ids.length > 0) {
                const products = await products_model_1.Products.findAll({
                    where: {
                        id: createPartnerDto.product_ids,
                    },
                    transaction,
                });
                await partner.$set('products', products, { transaction });
            }
            await transaction.commit();
            return this.toResponseDto(partner);
        }
        catch (error) {
            console.error('Error creating partner:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new common_1.ConflictException('Email already exists');
            }
            if (transaction) {
                await transaction.rollback();
            }
            throw new common_1.InternalServerErrorException('Failed to create partner');
        }
        finally {
            childSpan.finish();
        }
    }
    async updatePartnerByHashedKey(span, hashed_key, updatePartnerDto) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        const transaction = await this.partnerRepository.sequelize.transaction();
        try {
            const partner = await this.partnerRepository.findOne({
                where: { hashed_key },
                include: [{ model: products_model_1.Products }],
                transaction,
            });
            if (!partner)
                throw new common_1.NotFoundException('Partner not found');
            if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
                const existingPartner = await this.partnerRepository.findOne({
                    where: { email: updatePartnerDto.email },
                    transaction,
                });
                if (existingPartner)
                    throw new common_1.ConflictException('Email is already in use');
            }
            if (updatePartnerDto.password) {
                updatePartnerDto.password = await bcrypt.hash(updatePartnerDto.password, 10);
            }
            await partner.update(updatePartnerDto, { transaction });
            if (updatePartnerDto.product_ids) {
                await partner.$set('products', updatePartnerDto.product_ids, { transaction });
            }
            await transaction.commit();
            return this.toResponseDto(partner);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async deletePartnerByHashedKey(span, hashed_key) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        try {
            const partner = await this.partnerRepository.findOne({ where: { hashed_key } });
            if (!partner)
                throw new common_1.NotFoundException('Partner not found');
            await partner.destroy();
            childSpan.log({ event: 'partner_deleted', hashed_key });
        }
        finally {
            childSpan.finish();
        }
    }
    async deletePartnerById(span, id) {
        const childSpan = span.tracer().startSpan('db-query', { childOf: span });
        try {
            const partner = await this.partnerRepository.findByPk(id);
            if (!partner)
                throw new common_1.NotFoundException('Partner not found');
            await partner.destroy();
            childSpan.log({ event: 'partner_deleted', id });
        }
        finally {
            childSpan.finish();
        }
    }
    toResponseDto(partner) {
        var _a;
        if (!Object.values(partner_dto_1.business_type).includes(partner.business_type)) {
            throw new common_1.InternalServerErrorException(`Invalid business_type value: ${partner.business_type}`);
        }
        return {
            partner_id: partner.id,
            hashed_key: partner.hashed_key,
            role_id: partner.role_id,
            email: partner.email,
            first_name: partner.first_name,
            last_name: partner.last_name,
            api_key: partner.api_key,
            is_active: partner.is_active,
            business_type: partner.business_type,
            created_by: partner.created_by,
            updated_by: partner.updated_by,
            products: ((_a = partner.products) === null || _a === void 0 ? void 0 : _a.map((product) => ({
                id: product.id,
                name: product.name,
            }))) || [],
        };
    }
};
exports.PartnerService = PartnerService;
exports.PartnerService = PartnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PARTNER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], PartnerService);
//# sourceMappingURL=partner.service.js.map