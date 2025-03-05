import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { Order } from "../../../database/models/order.model";
import { CreateOrderDto } from "../../../dto/order.dto";

@Injectable()
export class OrdersService {
  constructor(
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    try {
      const {
        partner_id,
        order_id,
        transaction_type,
        purpose_type,
        isEsignRequired,
        isVkycRequired,
        customer_details
      } = dto;

      if (!customer_details || !Array.isArray(customer_details) || customer_details.length === 0) {
        throw new BadRequestException("customer_details is required and must be a non-empty array.");
      }

      // Extract customer details (assuming only one customer per order)
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_pan,
        customer_aadhaar_details
      } = customer_details[0];

      const { aadhaar_pincode, aadhaar_yob, aadhaar_gender } = customer_aadhaar_details;

      // Check if order with the same `order_id` exists
      const existingOrder = await this.orderRepository.findOne({ where: { order_id } });
      if (existingOrder) {
        throw new ConflictException(`Order with ID ${order_id} already exists.`);
      }

      // Create order in the database
      const newOrder = await this.orderRepository.create({
        partner_id,
        order_id,
        transaction_type,
        purpose_type,
        isEsignRequired,
        isVkycRequired,
        customer_name,
        customer_email,
        customer_phone,
        customer_pan,
        aadhaar_pincode,
        aadhaar_yob,
        aadhaar_gender
      });

      return newOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOrderByOrderId(order_id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { order_id } });
    if (!order) throw new NotFoundException(`Order with ID ${order_id} not found`);
    return order;
  }
}
