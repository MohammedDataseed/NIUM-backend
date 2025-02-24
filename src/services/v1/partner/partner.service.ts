import { Injectable, Inject, NotFoundException, UnauthorizedException,InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Partner } from '../../../database/models/partner.model';
import { Role } from 'src/database/models/role.model';
import { Branch } from 'src/database/models/branch.model';
import { BankAccount } from 'src/database/models/bankAccount.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
import { CreatePartnerDto, UpdatePartnerDto } from "../../../dto/partner.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { MailerService } from 'src/shared/services/mailer/mailer.service';
import { verify } from 'jsonwebtoken';
@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
    private readonly tracerService: TracerService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) {}
  async login(
    loginDto: LoginDto
  ): Promise<{ partner: Partial<Partner>; access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;
  
    const partner = await this.partnerRepository.findOne({
      where: { email },
      attributes: { exclude: ["role_id", "branch_id", "bank_account_id"] }, // Do NOT exclude password
      include: [
        { model: Role, as: "role", attributes: ["id", "name"] },
        { model: Branch, as: "branch", attributes: ["id", "name"] },
        { model: BankAccount, as: "bankAccount", attributes: ["id", "account_number", "ifsc_code", "bank_name", "bank_branch"] },
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
  
    // 🔹 Convert Sequelize instance to plain object and remove password
    const safePartner = partner.get({ plain: true });
    delete safePartner.password;
  
    return {
      partner: safePartner, // Return partner object without password
      access_token: this.jwtService.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d" }),
    };
  }
  

  async findAll(span: opentracing.Span, params: WhereOptions<Partner>): Promise<Partner[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.partnerRepository.findAll({ where: params, attributes: { exclude: ['password'] } });
    } finally {
      childSpan.finish();
    }
  }

  async findByEmail(email: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { email } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      createPartnerDto.password = await bcrypt.hash(createPartnerDto.password, 10);
      return await this.partnerRepository.create(createPartnerDto);
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async updatePartner(span: opentracing.Span, id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id);
      if (!partner) throw new NotFoundException('Partner not found');

      if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
        const existingPartner = await this.partnerRepository.findOne({ where: { email: updatePartnerDto.email } });
        if (existingPartner) throw new UnauthorizedException('Email is already in use');
      }

      await partner.update(updatePartnerDto);
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


  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return {
        access_token: this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: '1h' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

}
