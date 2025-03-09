// orders.service.ts
import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Order } from '../../../database/models/order.model';
import { CreateOrderDto } from '../../../dto/order.dto';
import * as opentracing from 'opentracing';
import { User } from '../../../database/models/user.model';
import { Partner } from '../../../database/models/partner.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    @Inject('PARTNER_REPOSITORY') // Change to Partner repository
    private readonly partnerRepository: typeof Partner,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
  ) {}

  // CREATE: Create a new order
  
 // New method to validate headers
 async validatePartnerHeaders(partnerId: string, apiKey: string): Promise<void> {
  console.log(`Validating partnerId: ${partnerId}, apiKey: ${apiKey}`); // Debug log
  const partner = await this.partnerRepository.findOne({
    where: { id: partnerId },
  });

  console.log('Partner found:', partner ? JSON.stringify(partner.toJSON()) : 'null'); // Debug log

  if (!partner) {
    throw new BadRequestException('Invalid partner ID');
  }

  // // Check if the partner has the "maker" role
  // if (!partner.role 
  //   // || 
  //   // partner.role_id == "a141eecb-19bc-4807-ba90-1b8edd407608" 
  //   // || partner.role.name !== 'maker'
  // ) {
  //   console.log("partner",partner);
  //   throw new UnauthorizedException('Partner does not have the maker role');
  // }

  // Check if the api-key matches the partner's api_key
  if (!partner.api_key || partner.api_key !== apiKey) {
    throw new UnauthorizedException('Invalid API key for this partner');
  }
}
  async createOrder(
    span: opentracing.Span,
    createOrderDto: CreateOrderDto,
    partnerId: string,
  ): Promise<Order> {
    const childSpan = span.tracer().startSpan('create-order', { childOf: span });
  
    try {
      // Check for existing order with the same order_id
      const existingOrder = await this.orderRepository.findOne({
        where: { order_id: createOrderDto.order_id },
      });
      if (existingOrder) {
        throw new ConflictException('Order ID already exists');
      }
  
      // Validate partner_id exists in the partners table
      const partner = await this.partnerRepository.findOne({
        where: { id: partnerId },
      });
      if (!partner) {
        throw new BadRequestException('Invalid partner ID');
      }
  
      // Use all data from the DTO directly
      const orderData = {
        partner_id: partnerId, // Still from header for consistency
        order_id: createOrderDto.order_id,
        is_esign_required: createOrderDto.is_e_sign_required,
        is_v_kyc_required: createOrderDto.is_v_kyc_required,
        customer_name: createOrderDto.customer_name,
        customer_email: createOrderDto.customer_email,
        customer_phone: createOrderDto.customer_phone,
        customer_pan: createOrderDto.customer_pan,
        aadhaar_pincode: createOrderDto.customer_aadhaar_pincode,
        aadhaar_yob: createOrderDto.customer_aadhaar_yob,
        aadhaar_gender: createOrderDto.customer_gender,
        order_status: createOrderDto.order_status,
        e_sign_status: createOrderDto.e_sign_status,
        e_sign_link_status: createOrderDto.e_sign_link_status,
        e_sign_link_expires: new Date(createOrderDto.e_sign_link_expires), // Convert string to Date
        e_sign_completed_by_customer: createOrderDto.e_sign_completed_by_customer,
        v_kyc_status: createOrderDto.v_kyc_status,
        v_kyc_link_status: createOrderDto.v_kyc_link_status,
        v_kyc_link_expires: new Date(createOrderDto.v_kyc_link_expires), // Convert string to Date
        v_kyc_completed_by_customer: createOrderDto.v_kyc_completed_by_customer,
        is_esign_regenerated: createOrderDto.is_esign_regenerated,
        is_video_kyc_link_regenerated: createOrderDto.is_video_kyc_link_regenerated,
        created_by: createOrderDto.created_by,
        updated_by: createOrderDto.updated_by,
        checker_id: createOrderDto.checker_id,
      };
  
      console.log('orderData:', JSON.stringify(orderData, null, 2)); // Debug log
      const order = await this.orderRepository.create(orderData);
      return order;
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async findAll(span: opentracing.Span, filters: WhereOptions<Order> = {}): Promise<Order[]> {
    const childSpan = span.tracer().startSpan('find-all-orders', { childOf: span });

    try {
      return await this.orderRepository.findAll({ where: filters });
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  // READ: Fetch a single order by order_id
  async findOne(span: opentracing.Span, orderId: string): Promise<Order> {
    const childSpan = span.tracer().startSpan('find-one-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { order_id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  // UPDATE: Update an existing order by order_id
  async updateOrder(
    span: opentracing.Span,
    orderId: string,
    updateOrderDto: Partial<CreateOrderDto>,
  ): Promise<Order> {
    const childSpan = span.tracer().startSpan('update-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { order_id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

     
      // Update only provided fields
      const updateData = {
        // ...(updateOrderDto.transaction_type_id && { transaction_type: updateOrderDto.transaction_type_id }),
        // ...(updateOrderDto.purpose_type_id && { purpose_type: updateOrderDto.purpose_type_id }),
        ...(updateOrderDto.is_e_sign_required !== undefined && { is_esign_required: updateOrderDto.is_e_sign_required }),
        ...(updateOrderDto.is_v_kyc_required !== undefined && { is_v_kyc_required: updateOrderDto.is_v_kyc_required }),
        ...(updateOrderDto.customer_name && { customer_name: updateOrderDto.customer_name }),
        ...(updateOrderDto.customer_email && { customer_email: updateOrderDto.customer_email }),
        ...(updateOrderDto.customer_phone && { customer_phone: updateOrderDto.customer_phone }),
        ...(updateOrderDto.customer_pan && { customer_pan: updateOrderDto.customer_pan }),
        ...(updateOrderDto.customer_aadhaar_pincode && { aadhaar_pincode: updateOrderDto.customer_aadhaar_pincode }),
        ...(updateOrderDto.customer_aadhaar_yob && { aadhaar_yob: updateOrderDto.customer_aadhaar_yob }),
        ...(updateOrderDto.customer_gender && { aadhaar_gender: updateOrderDto.customer_gender }),
     
      };

      await order.update(updateData);
      return order;
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  // DELETE: Delete an order by order_id
  async deleteOrder(span: opentracing.Span, orderId: string): Promise<void> {
    const childSpan = span.tracer().startSpan('delete-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { order_id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      await order.destroy();
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }
}