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
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  PartnerResponseDto,
  bussiness_type,
} from '../../../dto/partner.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
  ) {}

  async findAllPartners(span: opentracing.Span): Promise<PartnerResponseDto[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    try {
      const partners = await this.partnerRepository.findAll({
        include: [
          {
            model: Products,
            attributes: ['id', 'name'], // Explicitly select product fields
            through: { attributes: [] }, // Exclude the junction table fields
          },
        ],
      });
      return partners.map((partner) => this.toResponseDto(partner));
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw new InternalServerErrorException('Failed to fetch partners');
    } finally {
      childSpan.finish();
    }
  }

  async findPartnerById(
    span: opentracing.Span,
    id: number,
  ): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id, {
        include: [{ model: Products }],
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }
      return this.toResponseDto(partner);
    } finally {
      childSpan.finish();
    }
  }

  async findPartnerByHashedKey(
    span: opentracing.Span,
    hashed_key: string,
  ): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findOne({
        where: { hashed_key },
        include: [{ model: Products }],
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }
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

  private generateHashedKey(): string {
    return crypto.randomBytes(32).toString('hex'); // Secure 256-bit hashed key
  }

  async createPartner(
    span: opentracing.Span,
    createPartnerDto: CreatePartnerDto,
  ): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    const transaction = await this.partnerRepository.sequelize.transaction();
    try {
      // Ensure password is hashed
      const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);

      // Generate unique API key
      const apiKey = await this.generateUniqueApiKey(transaction);

      // Generate hashed key
      const hashedKey = this.generateHashedKey();

      // Create the partner without products initially
      const partner = await this.partnerRepository.create(
        {
          ...createPartnerDto,
          password: hashedPassword,
          api_key: apiKey,
          hashed_key: hashedKey,
        },
        { transaction },
      );

      // If product_ids are provided, associate products with the partner
      if (
        createPartnerDto.product_ids &&
        createPartnerDto.product_ids.length > 0
      ) {
        const products = await Products.findAll({
          where: {
            id: createPartnerDto.product_ids,
          },
          transaction, // Ensures products are associated within the same transaction
        });

        // Associate the products with the partner
        await partner.$set('products', products, { transaction });
      }

      // Commit the transaction
      await transaction.commit();

      // Return the response DTO
      return this.toResponseDto(partner);
    } catch (error) {
      console.error('Error creating partner:', error);
      // If the error is a unique constraint violation (email already exists)
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Email already exists');
      }

      // If transaction exists, rollback in case of error
      if (transaction) {
        await transaction.rollback();
      }

      // Throw internal server error
      throw new InternalServerErrorException('Failed to create partner');
    } finally {
      childSpan.finish();
    }
  }

  async updatePartnerByHashedKey(
    span: opentracing.Span,
    hashed_key: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    const transaction = await this.partnerRepository.sequelize.transaction();

    try {
      const partner = await this.partnerRepository.findOne({
        where: { hashed_key },
        include: [{ model: Products }],
        transaction,
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
        const existingPartner = await this.partnerRepository.findOne({
          where: { email: updatePartnerDto.email },
          transaction,
        });
        if (existingPartner) {
          throw new ConflictException('Email is already in use');
        }
      }

      if (updatePartnerDto.password) {
        updatePartnerDto.password = await bcrypt.hash(
          updatePartnerDto.password,
          10,
        );
      }

      await partner.update(updatePartnerDto, { transaction });

      if (updatePartnerDto.product_ids) {
        await partner.$set('products', updatePartnerDto.product_ids, {
          transaction,
        });
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

  async deletePartnerByHashedKey(
    span: opentracing.Span,
    hashed_key: string,
  ): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findOne({
        where: { hashed_key },
      });
      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      await partner.destroy();
      childSpan.log({ event: 'partner_deleted', hashed_key });
    } finally {
      childSpan.finish();
    }
  }

  async deletePartnerById(span: opentracing.Span, id: number): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id);
      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      await partner.destroy();
      childSpan.log({ event: 'partner_deleted', id });
    } finally {
      childSpan.finish();
    }
  }

  private toResponseDto(partner: Partner): PartnerResponseDto {
    if (
      !Object.values(bussiness_type).includes(
        partner.bussiness_type as bussiness_type,
      )
    ) {
      throw new InternalServerErrorException(
        `Invalid bussiness_type value: ${partner.bussiness_type}`,
      );
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
      bussiness_type: partner.bussiness_type as bussiness_type,
      created_by: partner.created_by,
      updated_by: partner.updated_by,
      products:
        partner.products?.map((product) => ({
          id: product.id,
          name: product.name,
        })) || [],
    };
  }
}
