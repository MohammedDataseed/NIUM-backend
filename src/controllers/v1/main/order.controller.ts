// orders.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Headers, BadRequestException, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../../../services/v1/order/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../../../dto/order.dto';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import * as opentracing from 'opentracing';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiHeader({ name: 'partner_id', description: 'Partner ID', required: true })
  @ApiHeader({ name: 'api-key', description: 'API Key', required: true })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(
    @Headers('partner_id') partnerId: string,
    @Headers('api-key') apiKey: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createOrderDto: CreateOrderDto,
  ) {
    if (!partnerId || !apiKey) throw new BadRequestException('Partner ID and API Key are required');
    const span = opentracing.globalTracer().startSpan('create-order-controller');
    try {
      const order = await this.ordersService.createOrder(span, createOrderDto, partnerId);
      return { message: 'order created successful', bmf_order_id: order.order_id, nium_order_id: 'NIUMF789012' };
    } finally {
      span.finish();
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll() {
    const span = opentracing.globalTracer().startSpan('find-all-orders-controller');
    try {
      return await this.ordersService.findAll(span);
    } finally {
      span.finish();
    }
  }

  @Get(':orderId')
  @ApiResponse({ status: 200, description: 'Order details' })
  async findOne(@Param('orderId') orderId: string) {
    const span = opentracing.globalTracer().startSpan('find-one-order-controller');
    try {
      return await this.ordersService.findOne(span, orderId);
    } finally {
      span.finish();
    }
  }

  @Put(':orderId')
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateOrderDto: UpdateOrderDto,
  ) {
    const span = opentracing.globalTracer().startSpan('update-order-controller');
    try {
      return await this.ordersService.updateOrder(span, orderId, updateOrderDto);
    } finally {
      span.finish();
    }
  }

  @Delete(':orderId')
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  async deleteOrder(@Param('orderId') orderId: string) {
    const span = opentracing.globalTracer().startSpan('delete-order-controller');
    try {
      await this.ordersService.deleteOrder(span, orderId);
      return { message: 'Order deleted successfully' };
    } finally {
      span.finish();
    }
  }
}