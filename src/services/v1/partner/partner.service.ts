import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Partner } from '../../../database/models/partner.model';
import { Products } from '../../../database/models/products.model';
import * as opentracing from 'opentracing';
import { CreatePartnerDto, UpdatePartnerDto, PartnerResponseDto, business_type } from '../../../dto/partner.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
    private readonly jwtService: JwtService
  ) {}

  async findAllPartners(span: opentracing.Span): Promise<PartnerResponseDto[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partners = await this.partnerRepository.findAll({
        include: [{ model: Products }],
      });
      return partners.map(partner => this.toResponseDto(partner));
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw new InternalServerErrorException('Failed to fetch partners');
    } finally {
      childSpan.finish();
    }
  }

  async findPartnerByHashedKey(span: opentracing.Span, hashed_key: string): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findOne({
        where: { hashed_key },
        include: [{ model: Products }],
      });

      if (!partner) throw new NotFoundException('Partner not found');
      return this.toResponseDto(partner);
    } finally {
      childSpan.finish();
    }
  }

  private async generateUniqueApiKey(transaction): Promise<string> {
    let apiKey: string;
    let exists = true;

    while (exists) {
      apiKey = uuidv4();
      const existingPartner = await this.partnerRepository.findOne({
        where: { api_key: apiKey },
        transaction,
      });
      exists = existingPartner !== null;
    }

    return apiKey;
  }

  async createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    const transaction = await this.partnerRepository.sequelize.transaction();

    try {
      createPartnerDto.api_key = await this.generateUniqueApiKey(transaction);
      createPartnerDto.password = await bcrypt.hash(createPartnerDto.password, 10);

      const partner = await this.partnerRepository.create(createPartnerDto, { transaction });

      if (createPartnerDto.productIds?.length) {
        await partner.$set('products', createPartnerDto.productIds, { transaction });
      }

      await transaction.commit();
      return this.toResponseDto(partner);
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating partner:', error);
      throw new InternalServerErrorException('Failed to create partner');
    } finally {
      childSpan.finish();
    }
  }

  async updatePartnerByHashedKey(
    span: opentracing.Span,
    hashed_key: string,
    updatePartnerDto: UpdatePartnerDto
  ): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    const transaction = await this.partnerRepository.sequelize.transaction();

    try {
      const partner = await this.partnerRepository.findOne({
        where: { hashed_key },
        include: [{ model: Products, as: 'products' }],
      });

      if (!partner) throw new NotFoundException('Partner not found');

      if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
        const existingPartner = await this.partnerRepository.findOne({
          where: { email: updatePartnerDto.email },
        });
        if (existingPartner) throw new ConflictException('Email is already in use');
      }

      if (updatePartnerDto.password) {
        updatePartnerDto.password = await bcrypt.hash(updatePartnerDto.password, 10);
      }

      await partner.update(updatePartnerDto, { transaction });

      if (updatePartnerDto.productIds) {
        await partner.$set('products', updatePartnerDto.productIds, { transaction });
      }

      await transaction.commit();
      return this.toResponseDto(partner);
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async deletePartnerByHashedKey(span: opentracing.Span, hashed_key: string): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findOne({ where: { hashed_key } });
      if (!partner) throw new NotFoundException('Partner not found');

      await partner.destroy();
      childSpan.log({ event: 'partner_deleted', hashed_key });
    } finally {
      childSpan.finish();
    }
  }

  private toResponseDto(partner: Partner): PartnerResponseDto {
    const businessTypeValue = partner.business_type as business_type;
    if (!Object.values(business_type).includes(businessTypeValue)) {
      throw new InternalServerErrorException(`Invalid business_type value: ${partner.business_type}`);
    }

    return {
      hashed_key: partner.hashed_key,
      role_id: partner.role_id,
      email: partner.email,
      first_name: partner.first_name,
      last_name: partner.last_name,
      api_key: partner.api_key,
      is_active: partner.is_active,
      business_type: businessTypeValue,
      created_at: partner.created_at,
      updated_at: partner.updated_at,
      created_by: partner.created_by,
      updated_by: partner.updated_by,
      productIds: partner.products?.map((product) => product.id) || [],
    };
  }
}