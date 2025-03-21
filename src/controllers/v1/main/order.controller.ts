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
  Query,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { validate as isUUID } from 'uuid';

import { OrdersService } from '../../../services/v1/order/order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateCheckerDto,
  UnassignCheckerDto,
  GetCheckerOrdersDto,
  UpdateOrderDetailsDto,
  GetOrderDetailsDto,
} from '../../../dto/order.dto';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import * as opentracing from 'opentracing';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll() {
    const span = opentracing
      .globalTracer()
      .startSpan('find-all-orders-controller');
    try {
      return await this.ordersService.findAll(span);
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }

  @Post('generate-order')
  async createOrder(
    @Headers('api_key') api_key: string,
    @Headers('partner_id') partner_id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrderDto: CreateOrderDto,
  ) {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-order-controller');
    try {
      await this.ordersService.validatePartnerHeaders(partner_id, api_key);
      const order = await this.ordersService.createOrder(
        span,
        createOrderDto,
        partner_id,
      );
      return order;
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

  @Get(':partnerOrderId')
  @ApiResponse({ status: 200, description: 'Order details' })
  async findOneByOrderId(
    @Headers('api_key') apiKey: string,
    @Headers('partner_id') partnerId: string,
    @Param('partnerOrderId') orderId: string, // ✅ FIXED HERE
  ) {
    const span = opentracing
      .globalTracer()
      .startSpan('find-one-order-controller');
    try {
      await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
      return await this.ordersService.findOneByOrderId(span, orderId);
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

  @Get('unassigned-orders')
  @ApiResponse({ status: 200, description: 'List of orders without a checker' })
  async getUnassignedOrders() {
    return this.ordersService.getUnassignedOrders();
  }

  @Post('update-checker')
  @ApiResponse({ status: 200, description: 'Checker ID updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'Checker ID or Order IDs not found',
  })
  async updateChecker(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // 🔹 Enforce strict validation
    updateCheckerDto: UpdateCheckerDto,
  ) {
    return this.ordersService.updateChecker(updateCheckerDto);
  }

  @Post('unassign-checker')
  @ApiResponse({ status: 200, description: 'Checker unassigned successfully' })
  @ApiResponse({ status: 404, description: 'Checker ID or Order ID not found' })
  @ApiResponse({
    status: 400,
    description: 'Checker is not assigned to this order',
  })
  async unassignChecker(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
    unassignCheckerDto: UnassignCheckerDto,
  ) {
    return this.ordersService.unassignChecker(unassignCheckerDto);
  }

  @Post('get-checker-orders')
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Checker ID not found' })
  async getCheckerOrders(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
    getCheckerOrdersDto: GetCheckerOrdersDto,
  ) {
    return this.ordersService.getOrdersByChecker(getCheckerOrdersDto);
  }

  @Post('update-order-details')
  @ApiResponse({
    status: 200,
    description: 'Invoice number & status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Checker ID or Order ID not found' })
  async updateOrderDetails(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
    updateInvoiceStatusDto: UpdateOrderDetailsDto,
  ) {
    return this.ordersService.updateOrderDetails(updateInvoiceStatusDto);
  }

  @Post('fetch-order-details')
  @ApiResponse({
    status: 200,
    description: 'Order details fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Order or Checker ID not found' })
  async fetchOrderDetails(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
    getOrderDetailsDto: GetOrderDetailsDto,
  ) {
    return this.ordersService.getOrderDetails(getOrderDetailsDto);
  }

  @Get('order-status-counts')
  async getOrderStatusCounts() {
    return await this.ordersService.getOrderStatusCounts();
  }
}
