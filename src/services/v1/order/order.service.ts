// orders.service.ts
import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Order } from '../../../database/models/order.model';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateCheckerDto,
  UnassignCheckerDto,
} from '../../../dto/order.dto';
import * as opentracing from 'opentracing';
import { User } from '../../../database/models/user.model';
import { ESign } from 'src/database/models/esign.model';
import { Partner } from '../../../database/models/partner.model';
import { WhereOptions, Op } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    @Inject('PARTNER_REPOSITORY') // Change to Partner repository
    private readonly partnerRepository: typeof Partner,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
    @Inject('E_SIGN_REPOSITORY')
    private readonly esignRepository: typeof ESign,
  ) {}

  // CREATE: Create a new order
  async createOrder(
    span: opentracing.Span,
    createOrderDto: CreateOrderDto,
    partnerId: string,
  ): Promise<Order> {
    const childSpan = span
      .tracer()
      .startSpan('create-order', { childOf: span });

    try {
      // Check for existing order with the same partner_order_id
      const existingOrder = await this.orderRepository.findOne({
        where: { partner_order_id: createOrderDto.partner_order_id },
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
        partner_order_id: createOrderDto.partner_order_id,
        transaction_type: createOrderDto.transaction_type_id,
        is_esign_required: createOrderDto.is_e_sign_required,
        is_v_kyc_required: createOrderDto.is_v_kyc_required,
        purpose_type: createOrderDto.purpose_type_id,
        customer_name: createOrderDto.customer_name,
        customer_email: createOrderDto.customer_email,
        customer_phone: createOrderDto.customer_phone,
        customer_pan: createOrderDto.customer_pan,
        order_status: 'pending', // Default value
        e_sign_status: 'not generated', // Default value
        v_kyc_status: 'not generated', // Default value
        created_by: partnerId,
        updated_by: partnerId,
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

  async findAll(
    span: opentracing.Span,
    filters: WhereOptions<Order> = {},
  ): Promise<Order[]> {
    const childSpan = span
      .tracer()
      .startSpan('find-all-orders', { childOf: span });
    try {
      return await this.orderRepository.findAll({
        where: filters,
        include: [{ model: ESign, as: 'esigns' }], // Ensure the alias matches your association
      });
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  // New method to validate headers
  async validatePartnerHeaders(
    partnerId: string,
    apiKey: string,
  ): Promise<void> {
    console.log(`Validating partnerId: ${partnerId}, apiKey: ${apiKey}`); // Debug log
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    console.log(
      'Partner found:',
      partner ? JSON.stringify(partner.toJSON()) : 'null',
    ); // Debug log

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

  // async findAll(span: opentracing.Span, filters: WhereOptions<Order> = {}): Promise<Order[]> {
  //   const childSpan = span.tracer().startSpan('find-all-orders', { childOf: span });

  //   try {
  //     return await this.orderRepository.findAll({ where: filters });
  //   } catch (error) {
  //     childSpan.log({ event: 'error', message: error.message });
  //     throw error;
  //   } finally {
  //     childSpan.finish();
  //   }
  // }

  // READ: Fetch a single order by order_id
  async findOne(span: opentracing.Span, orderId: string): Promise<Order> {
    const childSpan = span
      .tracer()
      .startSpan('find-one-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { partner_order_id: orderId },
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

  //UPDATE: Update an existing order by order_id
  async updateOrder(
    span: opentracing.Span,
    orderId: string,
    updateOrderDto: Partial<UpdateOrderDto>,
  ): Promise<Order> {
    const childSpan = span
      .tracer()
      .startSpan('update-order', { childOf: span });
    try {
      const order = await this.orderRepository.findOne({
        where: { partner_order_id: orderId },
      });
      if (!order)
        throw new NotFoundException(`Order with ID ${orderId} not found`);

      // Update all provided fields
      Object.assign(order, {
        ...updateOrderDto,
        e_sign_link_expires: updateOrderDto.e_sign_link_expires
          ? new Date(updateOrderDto.e_sign_link_expires)
          : order.e_sign_link_expires,
        e_sign_customer_completion_date:
          updateOrderDto.e_sign_customer_completion_date
            ? new Date(updateOrderDto.e_sign_customer_completion_date)
            : order.e_sign_customer_completion_date,
        v_kyc_link_expires: updateOrderDto.v_kyc_link_expires
          ? new Date(updateOrderDto.v_kyc_link_expires)
          : order.v_kyc_link_expires,
        v_kyc_customer_completion_date:
          updateOrderDto.v_kyc_customer_completion_date
            ? new Date(updateOrderDto.v_kyc_customer_completion_date)
            : order.v_kyc_customer_completion_date,
      });

      await order.save();
      return order;
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async deleteOrder(span: opentracing.Span, orderId: string): Promise<void> {
    const childSpan = span
      .tracer()
      .startSpan('delete-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { partner_order_id: orderId },
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

  async updateChecker(dto: UpdateCheckerDto) {
    const { orderIds, checkerId } = dto;

    const checker = await this.userRepository.findOne({
      where: { hashed_key: checkerId },
      attributes: ['id'],
    });

    if (!checker) {
      throw new NotFoundException(`Checker with ID ${checkerId} not found.`);
    }

    const orders = await this.orderRepository.findAll({
      where: { partner_order_id: orderIds },
      attributes: ['id', 'partner_order_id'],
    });

    const foundOrderIds = orders.map((order) => order.partner_order_id);
    const missingOrderIds = orderIds.filter(
      (id) => !foundOrderIds.includes(id),
    );

    if (missingOrderIds.length) {
      throw new NotFoundException(
        `Orders not found: ${missingOrderIds.join(', ')}`,
      );
    }

    await this.orderRepository.update(
      { checker_id: checker.id },
      { where: { partner_order_id: orderIds } },
    );

    return {
      message: 'Checker ID updated successfully',
      updatedOrders: orderIds,
    };
  }

  async unassignChecker(dto: UnassignCheckerDto) {
    const { orderId, checkerId } = dto;

    const checker = await this.userRepository.findOne({
      where: { hashed_key: checkerId },
      attributes: ['id'], // ✅ Get actual UUID
    });

    if (!checker) {
      throw new NotFoundException(`Checker with ID ${checkerId} not found.`);
    }

    const order = await this.orderRepository.findOne({
      where: { partner_order_id: orderId },
      attributes: ['id', 'partner_order_id', 'checker_id'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (order.checker_id !== checker.id) {
      throw new BadRequestException(
        `Checker is not assigned to the given order.`,
      );
    }

    await this.orderRepository.update(
      { checker_id: null },
      { where: { partner_order_id: orderId } },
    );

    return {
      message: 'Checker unassigned successfully',
      unassignedOrder: orderId,
    };
  }
}
