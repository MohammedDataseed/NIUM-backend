// orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from '../../../services/v1/order/order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateCheckerDto,
} from '../../../dto/order.dto';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import * as opentracing from 'opentracing';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  async createOrder(
    @Headers('partner-id-00eb04d0-646c-41d5-a69e-197b2b504f01')
    partnerId: string,
    @Headers('api-key-c1c9773f-49be-4f31-b37a-a853dc2b2981') apiKey: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-order-controller');

    try {
      await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
      const order = await this.ordersService.createOrder(
        span,
        createOrderDto,
        partnerId,
      );
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }

  @Put(':orderId')
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateOrderDto: UpdateOrderDto,
  ) {
    const span = opentracing
      .globalTracer()
      .startSpan('update-order-controller');
    try {
      return await this.ordersService.updateOrder(
        span,
        orderId,
        updateOrderDto,
      );
    } finally {
      span.finish();
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll() {
    const span = opentracing
      .globalTracer()
      .startSpan('find-all-orders-controller');
    try {
      return await this.ordersService.findAll(span);
    } finally {
      span.finish();
    }
  }

  @Get(':orderId')
  @ApiResponse({ status: 200, description: 'Order details' })
  async findOne(@Param('orderId') orderId: string) {
    const span = opentracing
      .globalTracer()
      .startSpan('find-one-order-controller');
    try {
      return await this.ordersService.findOne(span, orderId);
    } finally {
      span.finish();
    }
  }

  @Delete(':orderId')
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  async deleteOrder(@Param('orderId') orderId: string) {
    const span = opentracing
      .globalTracer()
      .startSpan('delete-order-controller');
    try {
      await this.ordersService.deleteOrder(span, orderId);
      return { message: 'Order deleted successfully' };
    } finally {
      span.finish();
    }
  }

  @Put('update-checker')
  @ApiResponse({ status: 200, description: 'Checker ID updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'Checker ID or Order IDs not found',
  })
  async updateChecker(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
    updateCheckerDto: UpdateCheckerDto,
  ) {
    return this.ordersService.updateChecker(updateCheckerDto);
  }
}
