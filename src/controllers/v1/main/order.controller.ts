import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from '../../../services/v1/order/order.service';
import { CreateOrderDto } from '../../../dto/order.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':order_id')
  @ApiOperation({ summary: 'Get order details by order_id' })
  async getOrder(@Param('order_id') order_id: string) {
    return this.ordersService.findOrderByOrderId(order_id);
  }
}
