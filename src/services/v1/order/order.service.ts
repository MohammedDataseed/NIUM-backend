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
import { CreateOrderDto,CreateMinimalOrderDto } from '../../../dto/order.dto';
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

// New method for creating minimal order
async createOrder(
  span: opentracing.Span,
  createMinimalOrderDto: CreateMinimalOrderDto,
  partnerId: string,
): Promise<Order> {
  const childSpan = span.tracer().startSpan('create-minimal-order', { childOf: span });

  try {
    // Check for existing order with the same partner_order_id
    const existingOrder = await this.orderRepository.findOne({
      where: { order_id: createMinimalOrderDto.partner_order_id },
    });
    if (existingOrder) {
      throw new ConflictException('Order ID already exists');
    }

    // Validate partner_id exists
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });
    if (!partner) {
      throw new BadRequestException('Invalid partner ID');
    }

    const orderData = {
      partner_id: partnerId,
      order_id: createMinimalOrderDto.partner_order_id,
      transaction_type: createMinimalOrderDto.transaction_type_id,
      is_esign_required: createMinimalOrderDto.is_e_sign_required,
      is_v_kyc_required: createMinimalOrderDto.is_v_kyc_required,
      purpose_type: createMinimalOrderDto.purpose_type_id,
      customer_name: createMinimalOrderDto.customer_name,
      customer_email: createMinimalOrderDto.customer_email,
      customer_phone: createMinimalOrderDto.customer_phone,
      customer_pan: createMinimalOrderDto.customer_pan,
      aadhaar_dob: new Date(createMinimalOrderDto.customer_aadhaar_dob),
      order_status: 'pending', // Default value
      e_sign_status: 'not generated', // Default value
      v_kyc_status: 'not generated', // Default value
      created_by:partnerId,
      updated_by:partnerId
    };

    console.log('orderData:', JSON.stringify(orderData, null, 2));
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