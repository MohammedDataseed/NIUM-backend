// orders.service.ts
import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { Order } from '../../../database/models/order.model';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateCheckerDto,
  UnassignCheckerDto,
  GetCheckerOrdersDto,
  UpdateOrderDetailsDto,
  GetOrderDetailsDto,
} from '../../../dto/order.dto';
// import { CreateOrderDto, UpdateOrderDto,UpdateCheckerDto,UnassignCheckerDto } from "../../../dto/order.dto";
import * as opentracing from 'opentracing';
import { User } from '../../../database/models/user.model';
import { ESign } from '../../../database/models/esign.model';
import { Vkyc } from '../../../database/models/vkyc.model';
import { Partner } from '../../../database/models/partner.model';
import { Purpose } from '../../../database/models/purpose.model';
import { transaction_type } from '../../../database/models/transaction_type.model';
import { Op } from 'sequelize';

// Define a new interface for the filtered order data
export interface FilteredOrder {
  partner_order_id: string;
  nium_order_id: string;
  order_status: string;
  is_esign_required: boolean;
  is_v_kyc_required: boolean;
  e_sign_status: string;
  e_sign_link: string;
  e_sign_link_status: string;
  e_sign_link_expires: Date;
  e_sign_completed_by_customer: boolean;
  e_sign_customer_completion_date: Date;
  e_sign_doc_comments: string;
  is_e_sign_regenerated: boolean;
  e_sign_regenerated_count: number;
  v_kyc_link_status: string;
  v_kyc_link: string;
  v_kyc_link_expires: Date;
  v_kyc_completed_by_customer: boolean;
  v_kyc_customer_completion_date: Date;
  v_kyc_comments: string;
  v_kyc_status: string;
  is_v_kyc_link_regenerated: boolean;
  v_kyc_regenerated_count: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    @Inject('PARTNER_REPOSITORY') // Change to Partner repository
    private readonly partnerRepository: typeof Partner,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
    @Inject('PURPOSE_REPOSITORY') // Change to Partner repository
    private readonly purposeTypeRepository: typeof Purpose,
    @Inject('TRANSACTION_TYPE_REPOSITORY')
    private readonly transactionTypeRepository: typeof transaction_type,
  ) {}

  // CREATE: Create a new order
  async createOrder(
    span: opentracing.Span,
    createOrderDto: CreateOrderDto,
    partnerId: string,
  ): Promise<{
    message: string;
    partner_order_id: string;
    nium_forex_order_id: string;
  }> {
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

      const partner = await this.partnerRepository.findOne({
        where: { hashed_key: partnerId },
        attributes: ['id', 'api_key'], // Fetch only necessary fields
      });

      console.log('parter_id', partner?.id);
      if (!partner) {
        throw new BadRequestException('Invalid partner ID');
      }

      // Validate purpose_type_id exists and is active
      const purposeType = await this.purposeTypeRepository.findOne({
        where: { hashed_key: createOrderDto.purpose_type_id, isActive: true },
      });
      if (!purposeType) {
        throw new BadRequestException('Invalid or inactive purpose_type_id');
      }

      // Validate transaction_type_id exists and is active
      const transactionType = await this.transactionTypeRepository.findOne({
        where: {
          hashed_key: createOrderDto.transaction_type_id,
          isActive: true,
        },
      });
      if (!transactionType) {
        throw new BadRequestException(
          'Invalid or inactive transaction_type_id',
        );
      }

      // Generate a unique nium_order_id
      const niumOrderId = `NIUMF${Math.floor(100000 + Math.random() * 900000)}`; // Example: NIUMF789012

      const orderData = {
        partner_id: partner?.id,
        partner_order_id: createOrderDto.partner_order_id,
        transaction_type: createOrderDto.transaction_type_id,
        is_esign_required: createOrderDto.is_e_sign_required,
        is_v_kyc_required: createOrderDto.is_v_kyc_required,
        purpose_type: createOrderDto.purpose_type_id,
        customer_name: createOrderDto.customer_name,
        customer_email: createOrderDto.customer_email,
        customer_phone: createOrderDto.customer_phone,
        customer_pan: createOrderDto.customer_pan,
        nium_order_id: niumOrderId, // Assigning the generated nium_order_id
        order_status: 'pending', // Default value
        e_sign_status: 'pending', // Default value
        v_kyc_status: 'pending', // Default value
        created_by: partner?.id,
        updated_by: partner?.id,
      };

      console.log('orderData:', JSON.stringify(orderData, null, 2));
      const order = await this.orderRepository.create(orderData);
      // Return structured response
      return {
        message: 'Order created successfully',
        partner_order_id: order.partner_order_id,
        nium_forex_order_id: order.nium_order_id, // Return generated nium_order_id
      };
      // return order;
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async findAll(span: opentracing.Span): Promise<Order[] | null> {
    const childSpan = span
      .tracer()
      .startSpan('find-all-orders', { childOf: span });

    try {
      // const orders = await this.orderRepository.findAll({

      // });
      const orders = await this.orderRepository.findAll({
        include: [
          {
            model: ESign,
            as: 'esigns',
            required: false,
            where: Sequelize.where(
              Sequelize.cast(Sequelize.col('esigns.order_id'), 'uuid'), // Cast as UUID
              Op.eq,
              Sequelize.col('Order.id'),
            ),
          },
          {
            model: Vkyc,
            as: 'vkycs',
            required: false,
            where: Sequelize.where(
              Sequelize.cast(Sequelize.col('vkycs.order_id'), 'uuid'), // Cast as UUID
              Op.eq,
              Sequelize.col('Order.id'),
            ),
          },
        ],
      });

      return orders.length > 0 ? orders : [];
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }
  async validatePartnerHeaders(
    partnerId: string,
    apiKey: string,
  ): Promise<void> {
    console.log(`Validating partnerId: ${partnerId}, apiKey: ${apiKey}`); // Debug log
    const partner = await this.partnerRepository.findOne({
      where: { hashed_key: partnerId },
      attributes: ['id', 'api_key'], // Fetch only necessary fields
    });

    console.log('parter_id', partner?.id);

    console.log(
      'Partner found:',
      partner ? JSON.stringify(partner.toJSON()) : 'null',
    ); // Debug log

    if (!partner) {
      throw new BadRequestException('Invalid partner ID');
    }

    // Check if the api-key matches the partner's api_key
    if (!partner.api_key || partner.api_key !== apiKey) {
      throw new UnauthorizedException('Invalid API key for this partner');
    }
  }

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
      // Add the count of regenerated video KYC links and e-sign links
      const regeneratedVkycCount = order.is_video_kyc_link_regenerated_details
        ? order.is_video_kyc_link_regenerated_details.length
        : 0;
      const regeneratedEsignCount = order.is_esign_regenerated ? 1 : 0;

      // Create a new object excluding the 'is_video_kyc_link_regenerated_details' field
      const { is_video_kyc_link_regenerated_details, ...orderWithoutVideoKyc } =
        order;

      // Return the order with the regenerated counts
      return {
        ...(orderWithoutVideoKyc as any), // Type assertion to 'any' to avoid TypeScript errors
        regenerated_v_kyc_count: regeneratedVkycCount,
        regenerated_e_sign_count: regeneratedEsignCount,
      };
    } catch (error) {
      childSpan.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async findOneByOrderId(
    span: opentracing.Span,
    orderId: string,
  ): Promise<FilteredOrder> {
    const childSpan = span
      .tracer()
      .startSpan('find-one-order', { childOf: span });

    try {
      const order = await this.orderRepository.findOne({
        where: { partner_order_id: orderId },
        include: [{ association: 'esigns' }, { association: 'vkycs' }],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Determine the latest eSign attempt (highest attempt_number)
      const latestEsign =
        order.esigns?.sort(
          (a, b) => b.attempt_number - a.attempt_number,
        )?.[0] || null;
      console.log(latestEsign);
      // Determine the latest vKYC attempt (highest attempt_number)
      const latestVkyc =
        order.vkycs?.sort((a, b) => b.attempt_number - a.attempt_number)?.[0] ||
        null;

      const regeneratedVkycCount = order.is_video_kyc_link_regenerated_details
        ? order.is_video_kyc_link_regenerated_details.length
        : 0;
      // const regeneratedEsignCount = order.esigns?.length || 0;
      const regeneratedEsignCount =
        order.esigns?.length > 1 ? order.esigns.length - 1 : 0;

      const result: FilteredOrder = {
        partner_order_id: order.partner_order_id,
        nium_order_id: order.nium_order_id,
        order_status: order.order_status,
        is_esign_required: order.is_esign_required,
        is_v_kyc_required: order.is_v_kyc_required,
        // eSign details
        e_sign_status:
          latestEsign?.status == 'completed' ? 'completed' : 'pending',
        e_sign_link:
          latestEsign?.esign_details?.[0]?.esign_url || order.e_sign_link,
        e_sign_link_status: latestEsign?.esign_details?.[0]?.url_status,
        e_sign_link_expires:
          latestEsign?.esign_details?.[0]?.esign_expiry ||
          order.e_sign_link_expires,
        e_sign_completed_by_customer: latestEsign?.is_signed,
        e_sign_customer_completion_date: order.e_sign_customer_completion_date,
        e_sign_doc_comments: order.e_sign_doc_comments,
        is_e_sign_regenerated: regeneratedEsignCount > 1,
        e_sign_regenerated_count: regeneratedEsignCount,
        // vKYC details
        v_kyc_status: latestVkyc?.status || order.v_kyc_status,
        v_kyc_link: latestVkyc?.v_kyc_link || order.v_kyc_link,
        v_kyc_link_status:
          latestVkyc?.v_kyc_link_status || order.v_kyc_link_status,
        v_kyc_link_expires:
          latestVkyc?.v_kyc_link_expires || order.v_kyc_link_expires,
        v_kyc_completed_by_customer: order.v_kyc_completed_by_customer,
        v_kyc_customer_completion_date: order.v_kyc_customer_completion_date,
        v_kyc_comments: order.v_kyc_comments,
        is_v_kyc_link_regenerated: order.is_video_kyc_link_regenerated,
        v_kyc_regenerated_count: regeneratedVkycCount,
      };

      return result;
    } catch (error) {
      throw error;
    } finally {
      childSpan.finish();
    }
  }

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
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

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

        // Update v-KYC related fields if they exist in updateOrderDto
        profile_id: updateOrderDto.v_kyc_profile_id || order.v_kyc_profile_id, // Ensure we only update if profile_id is provided
        reference_id:
          updateOrderDto.v_kyc_reference_id || order.v_kyc_reference_id, // Ensure we only update if reference_id is provided
      });

      // Check the conditions and set order_status to "completed" or "pending"
      order.order_status =
        (order.is_esign_required &&
          order.is_v_kyc_required &&
          order.e_sign_status === 'completed' &&
          order.v_kyc_status === 'completed') ||
        (!order.is_esign_required &&
          order.is_v_kyc_required &&
          !order.e_sign_status &&
          order.v_kyc_status === 'completed') ||
        (order.is_esign_required &&
          !order.is_v_kyc_required &&
          order.e_sign_status === 'completed' &&
          !order.v_kyc_status) ||
        (!order.is_esign_required &&
          order.is_v_kyc_required &&
          !order.e_sign_status &&
          order.v_kyc_status === 'completed')
          ? 'completed'
          : 'pending'; // If any of the conditions is true, set to "completed", else "pending"

      // Save the updated order

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

  async getOrdersByChecker(dto: GetCheckerOrdersDto) {
    const { checkerId, transaction_type } = dto;

    const checker = await this.userRepository.findOne({
      where: { hashed_key: checkerId },
      attributes: ['id'],
    });

    if (!checker) {
      throw new NotFoundException(`Checker with ID ${checkerId} not found.`);
    }

    const whereCondition: any = { checker_id: checker.id };

    if (transaction_type === 'all') {
      whereCondition.order_status != 'Completed';
    } else if (transaction_type === 'completed') {
      whereCondition.order_status = 'Completed';
    } else {
      whereCondition.order_status = {
        [Op.or]: ['Pending', null],
      };
    }

    const orders = await this.orderRepository.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
    });

    return {
      message: `Orders assigned to checker ${checkerId}`,
      totalOrders: orders.length,
      filterApplied: transaction_type || 'all',
      orders,
    };
  }

  async updateOrderDetails(dto: UpdateOrderDetailsDto) {
    const {
      partner_order_id,
      checker_id,
      nium_invoice_number,
      incident_checker_comments,
      incident_status,
    } = dto;

    const checker = await this.userRepository.findOne({
      where: { hashed_key: checker_id },
      attributes: ['id'],
    });

    if (!checker) {
      throw new NotFoundException(`Checker with ID ${checker_id} not found.`);
    }

    const order = await this.orderRepository.findOne({
      where: { partner_order_id, checker_id: checker.id },
    });

    if (!order) {
      throw new NotFoundException(
        `Order ${partner_order_id} not found or not assigned to this checker.`,
      );
    }

    order.nium_invoice_number = nium_invoice_number;
    order.incident_status = incident_status;
    order.incident_checker_comments = incident_checker_comments;
    await order.save();

    return {
      message: 'Order details has updated successfully',
      updatedOrder: order,
    };
  }

  async getOrderDetails(dto: GetOrderDetailsDto) {
    const { orderId, checkerId } = dto;

    const checker = await this.userRepository.findOne({
      where: { hashed_key: checkerId },
      attributes: ['id'],
    });

    if (!checker) {
      throw new NotFoundException(`Checker with ID ${checkerId} not found.`);
    }

    // 🔹 Validate if order exists
    const order = await this.orderRepository.findOne({
      where: { hashed_key: orderId, checker_id: checker.id },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with hash key "${checkerId}" not found.`,
      );
    }

    if (order.checker_id !== checker.id) {
      throw new BadRequestException(
        `Checker ID "${checkerId}" is not assigned to this order.`,
      );
    }

    return order;
  }

  async getUnassignedOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.findAll({
      where: { checker_id: { [Op.or]: [null, ''] } },
      raw: true,
    });

    const transactionTypes = await this.transactionTypeRepository.findAll({
      attributes: ['hashed_key', 'name'],
      raw: true,
    });

    const transactionTypeMap = transactionTypes.reduce(
      (acc, type) => {
        acc[type.hashed_key] = type.name;
        return acc;
      },
      {} as Record<string, string>,
    );

    const purposeTypes = await this.purposeTypeRepository.findAll({
      attributes: ['hashed_key', 'purpose_name'],
      raw: true,
    });

    const purposeTypeMap = purposeTypes.reduce(
      (acc, type) => {
        acc[type.hashed_key] = type.purposeName;
        return acc;
      },
      {} as Record<string, string>,
    );

    return orders.map((order) => {
      const sequelizeOrderInstance = this.orderRepository.build(order); // Convert plain object to Sequelize instance
      sequelizeOrderInstance.transaction_type =
        transactionTypeMap[order.transaction_type] || null;
      sequelizeOrderInstance.purpose_type =
        purposeTypeMap[order.purpose_type] || null;
      return sequelizeOrderInstance;
    });
  }

  async getOrderStatusCounts() {
    try {
      const orderCounts = await this.orderRepository.findAll({
        attributes: [
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.col('id'),
            ),
            'transactionReceived',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                'CASE WHEN incident_status = true THEN 1 END',
              ),
            ),
            'transactionApproved',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                'CASE WHEN incident_status = false THEN 1 END',
              ),
            ),
            'transactionRejected',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                'CASE WHEN incident_status IS NULL THEN 1 END',
              ),
            ),
            'transactionPending',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN v_kyc_status = 'completed' THEN 1 END",
              ),
            ),
            'vkycCompleted',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN v_kyc_status = 'pending' THEN 1 END",
              ),
            ),
            'vkycPending',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN v_kyc_status = 'rejected' THEN 1 END",
              ),
            ),
            'vkycRejected',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN e_sign_status = 'completed' THEN 1 END",
              ),
            ),
            'esignCompleted',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN e_sign_status = 'pending' THEN 1 END",
              ),
            ),
            'esignPending',
          ],
          [
            this.orderRepository.sequelize.fn(
              'COUNT',
              this.orderRepository.sequelize.literal(
                "CASE WHEN e_sign_status = 'rejected' THEN 1 END",
              ),
            ),
            'esignRejected',
          ],
        ],
        raw: true,
      });

      return orderCounts[0] || {};
    } catch (error) {
      console.error('Error fetching dashboard details:', error);
      throw new Error('Failed to fetch dashboard data.');
    }
  }
}
