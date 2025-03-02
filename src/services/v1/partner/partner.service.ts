import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Partner } from '../../../database/models/partner.model';
import { Role } from '../../../database/models/role.model';
import { Products } from '../../../database/models/products.model';
import { PartnerProducts } from '../../../database/models/partner_products.model';
import { User } from '../../../database/models/user.model';
import * as opentracing from 'opentracing';
import { CreatePartnerDto, UpdatePartnerDto } from "../../../dto/partner.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../../dto/login.dto';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<{ partner: Partial<Partner>; access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;
    
    const partner = await this.partnerRepository.findOne({
      where: { email },
      attributes: { exclude: ["role_id"] },
      include: [
        { model: Role, attributes: ["id", "name"] },
        
          {
            model: Products,
            through: { attributes: [] }, // ✅ Corrected: No `model` property
            attributes: ["id", "name"],
          },
        ],
      
    });

    if (!partner || !partner.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, partner.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: partner.email, sub: partner.id };

    // Convert Sequelize instance to plain object and remove password
    const safePartner = partner.get({ plain: true });
    delete safePartner.password;

    return {
      partner: safePartner,
      access_token: this.jwtService.sign(payload, { expiresIn: "1h" }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: "1d" }),
    };
  }

  async findAll(span: opentracing.Span, params: WhereOptions<Partner>): Promise<Partner[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.partnerRepository.findAll({
        where: params,
        attributes: { exclude: ['password'] },
        include: [
          { model: Role, attributes: ["id", "name"] },
          { model: User, as: "creator", attributes: ["id", "email"] },
          { model: User, as: "updater", attributes: ["id", "email"] },
          {
            model: Products,
            through: { attributes: [] }, // ✅ Corrected: No `model` property
            attributes: ["id", "name"],
          },
        ],
      });
    } finally {
      childSpan.finish();
    }
  }

  async findByEmail(email: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({
      where: { email },
      include: [
        { model: Role, attributes: ["id", "name"] },
        {
          model: Products,
          through: { attributes: [] }, // ✅ Corrected: No `model` property
          attributes: ["id", "name"],
        },
      ],
    });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });
  
    try {
      // Hash the password before saving
      createPartnerDto.password = await bcrypt.hash(createPartnerDto.password, 10);
  
      // Create the partner
      const partner = await this.partnerRepository.create(createPartnerDto);
  
      // Associate partner with products if productIds are provided
      if (createPartnerDto.productIds?.length) {
        await partner.$set("products", createPartnerDto.productIds);
      }
  
      return partner;
    } catch (error) {
      console.error("Error creating partner:", error);
      throw new InternalServerErrorException("Failed to create partner");
    } finally {
      childSpan.finish();
    }
  }
  

  async updatePartner(span: opentracing.Span, id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id, { include: [Products] });
      if (!partner) throw new NotFoundException('Partner not found');

      if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
        const existingPartner = await this.partnerRepository.findOne({ where: { email: updatePartnerDto.email } });
        if (existingPartner) throw new ConflictException('Email is already in use');
      }

      if (updatePartnerDto.password) {
        updatePartnerDto.password = await bcrypt.hash(updatePartnerDto.password, 10);
      }

      await partner.update(updatePartnerDto);

      if (updatePartnerDto.productIds) {
        await partner.$set('products', updatePartnerDto.productIds);
      }

      return partner;
    } finally {
      childSpan.finish();
    }
  }

  async deletePartner(span: opentracing.Span, id: string): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id);
      if (!partner) throw new NotFoundException('Partner not found');

      await partner.destroy();
      childSpan.log({ event: 'partner_deleted', partnerId: id });
    } finally {
      childSpan.finish();
    }
  }
  
}
