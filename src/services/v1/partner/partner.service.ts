// import {
//   Injectable,
//   Inject,
//   NotFoundException,
//   ConflictException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';

// import { Partner } from '../../../database/models/partner.model';
// import { Products } from '../../../database/models/products.model';
// import * as opentracing from 'opentracing';
// import { CreatePartnerDto, UpdatePartnerDto } from '../../../dto/partner.dto';
// import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class PartnerService {
//   constructor(
//     @Inject('PARTNER_REPOSITORY')
//     private readonly partnerRepository: typeof Partner,
//     private readonly jwtService: JwtService
//   ) {}


//   async findAllPartners(span: opentracing.Span): Promise<Partner[]> {
//     const childSpan = span.tracer().startSpan('db-query', { childOf: span });
  
//     try {
//       return await this.partnerRepository.findAll({
//         include: [{ model: Products }], // Include associated products
//       });
//     } catch (error) {
//       console.error('Error fetching partners:', error);
//       throw new InternalServerErrorException('Failed to fetch partners');
//     } finally {
//       childSpan.finish();
//     }
//   }
  
//   async findPartnerById(span: opentracing.Span, id: string): Promise<Partner> {
//     const childSpan = span.tracer().startSpan('db-query', { childOf: span });
  
//     try {
//       const partner = await this.partnerRepository.findByPk(id, {
//         include: [{ model: Products }], // Include associated products
//       });
  
//       if (!partner) throw new NotFoundException('Partner not found');
//       return partner;
//     } finally {
//       childSpan.finish();
//     }
//   }
//   private async generateUniqueApiKey(): Promise<string> {
//     let apiKey;
//     let exists = true;
  
//     while (exists) {
//       apiKey = uuidv4(); // Generate a random UUID as the API key
//       exists = await this.partnerRepository.findOne({ where: { api_key: apiKey } });
//     }
  
//     return apiKey;
//   }
  
      
//   async createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<Partner> {
//     const childSpan = span.tracer().startSpan('db-query', { childOf: span });
//     const transaction = await this.partnerRepository.sequelize.transaction();
  
//     try {
//       // Ensure api_key is auto-generated and unique
//       createPartnerDto.api_key = await this.generateUniqueApiKey();
  
//       // Hash password before saving
//       createPartnerDto.password = await bcrypt.hash(createPartnerDto.password, 10);
  
//       // Create Partner
//       const partner = await this.partnerRepository.create(createPartnerDto, { transaction });
  
//       // Associate products if provided
//       if (createPartnerDto.productIds?.length) {
//         await partner.$set('products', createPartnerDto.productIds, { transaction });
//       }
  
//       await transaction.commit();
//       return partner;
//     } catch (error) {
//       await transaction.rollback();
//       console.error('Error creating partner:', error);
//       throw new InternalServerErrorException('Failed to create partner');
//     } finally {
//       childSpan.finish();
//     }
//   }
//       async updatePartner(span: opentracing.Span, id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
//         const childSpan = span.tracer().startSpan('db-query', { childOf: span });
//         const transaction = await this.partnerRepository.sequelize.transaction();
      
//         try {
//           const partner = await this.partnerRepository.findByPk(id, { include: [{ model: Products, as: 'products' }], transaction });
//           if (!partner) throw new NotFoundException('Partner not found');
      
//           if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
//             const existingPartner = await this.partnerRepository.findOne({ where: { email: updatePartnerDto.email } });
//             if (existingPartner) throw new ConflictException('Email is already in use');
//           }
      
//           if (updatePartnerDto.password) {
//             updatePartnerDto.password = await bcrypt.hash(updatePartnerDto.password, 10);
//           }
      
//           await partner.update(updatePartnerDto, { transaction });
      
//           if (updatePartnerDto.productIds) {
//             await partner.$set('products', updatePartnerDto.productIds, { transaction });
//           }
      
//           await transaction.commit();
//           return partner;
//         } catch (error) {
//           await transaction.rollback();
//           throw error;
//         } finally {
//           childSpan.finish();
//         }
//       }
      

//   async deletePartner(span: opentracing.Span, id: string): Promise<void> {
//     const childSpan = span.tracer().startSpan('db-query', { childOf: span });

//     try {
//       const partner = await this.partnerRepository.findByPk(id);
//       if (!partner) throw new NotFoundException('Partner not found');

//       await partner.destroy();
//       childSpan.log({ event: 'partner_deleted', partnerId: id });
//     } finally {
//       childSpan.finish();
//     }
//   }
// }

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
import { CreatePartnerDto, UpdatePartnerDto } from '../../../dto/partner.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('PARTNER_REPOSITORY')
    private readonly partnerRepository: typeof Partner,
    private readonly jwtService: JwtService
  ) {}

  async findAllPartners(span: opentracing.Span): Promise<Partner[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.partnerRepository.findAll({
        include: [{ model: Products }],
      });
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw new InternalServerErrorException('Failed to fetch partners');
    } finally {
      childSpan.finish();
    }
  }

  async findPartnerById(span: opentracing.Span, id: string): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const partner = await this.partnerRepository.findByPk(id, {
        include: [{ model: Products }],
      });

      if (!partner) throw new NotFoundException('Partner not found');
      return partner;
    } finally {
      childSpan.finish();
    }
  }

  /**
   * Generates a unique API key
   */
  private async generateUniqueApiKey(transaction): Promise<string> {
    let apiKey: string;
    let exists = true;

    while (exists) {
      apiKey = uuidv4();
      const existingPartner = await this.partnerRepository.findOne({
        where: { api_key: apiKey },
        transaction, // Use the transaction
      });
      exists = existingPartner !== null; // Ensure proper check
    }

    return apiKey;
  }

  async createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    const transaction = await this.partnerRepository.sequelize.transaction();

    try {
      // Ensure api_key is auto-generated and unique
      createPartnerDto.api_key = await this.generateUniqueApiKey(transaction);

      // Hash password before saving
      createPartnerDto.password = await bcrypt.hash(createPartnerDto.password, 10);

      // Create Partner
      const partner = await this.partnerRepository.create(createPartnerDto, { transaction });

      // Associate products if provided
      if (createPartnerDto.productIds?.length) {
        await partner.$set('products', createPartnerDto.productIds, { transaction });
      }

      await transaction.commit();
      return partner;
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating partner:', error);
      throw new InternalServerErrorException('Failed to create partner');
    } finally {
      childSpan.finish();
    }
  }

  async updatePartner(span: opentracing.Span, id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    const transaction = await this.partnerRepository.sequelize.transaction();

    try {
      // Fetch partner first (without transaction)
      const partner = await this.partnerRepository.findByPk(id, { include: [{ model: Products, as: 'products' }] });

      if (!partner) throw new NotFoundException('Partner not found');

      // Check if email is being updated and is already in use
      if (updatePartnerDto.email && updatePartnerDto.email !== partner.email) {
        const existingPartner = await this.partnerRepository.findOne({ where: { email: updatePartnerDto.email } });
        if (existingPartner) throw new ConflictException('Email is already in use');
      }

      if (updatePartnerDto.password) {
        updatePartnerDto.password = await bcrypt.hash(updatePartnerDto.password, 10);
      }

      // Update partner inside transaction
      await partner.update(updatePartnerDto, { transaction });

      if (updatePartnerDto.productIds) {
        await partner.$set('products', updatePartnerDto.productIds, { transaction });
      }

      await transaction.commit();
      return partner;
    } catch (error) {
      await transaction.rollback();
      throw error;
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
