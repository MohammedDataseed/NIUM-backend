"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../../services/v1/order/order.service");
const order_dto_1 = require("../../../dto/order.dto");
const swagger_1 = require("@nestjs/swagger");
const opentracing = require("opentracing");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async findAll() {
        const span = opentracing.globalTracer().startSpan('find-all-orders-controller');
        try {
            return await this.ordersService.findAll(span);
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async createOrder(api_key, partner_id, createOrderDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan('create-order-controller');
        try {
            await this.ordersService.validatePartnerHeaders(partner_id, api_key);
            const order = await this.ordersService.createOrder(span, createOrderDto, partner_id);
            return order;
        }
        catch (error) {
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async updateOrder(orderId, updateOrderDto) {
        const span = opentracing
            .globalTracer()
            .startSpan('update-order-controller');
        try {
            return await this.ordersService.updateOrder(span, orderId, updateOrderDto);
        }
        finally {
            span.finish();
        }
    }
    async deleteOrder(orderId) {
        const span = opentracing
            .globalTracer()
            .startSpan('delete-order-controller');
        try {
            await this.ordersService.deleteOrder(span, orderId);
            return { message: 'Order deleted successfully' };
        }
        finally {
            span.finish();
        }
    }
    async getUnassignedOrders() {
        return this.ordersService.getUnassignedOrders();
    }
    async updateChecker(updateCheckerDto) {
        return this.ordersService.updateChecker(updateCheckerDto);
    }
    async unassignChecker(unassignCheckerDto) {
        return this.ordersService.unassignChecker(unassignCheckerDto);
    }
    async getCheckerOrders(getCheckerOrdersDto) {
        return this.ordersService.getOrdersByChecker(getCheckerOrdersDto);
    }
    async updateOrderDetails(updateInvoiceStatusDto) {
        return this.ordersService.updateOrderDetails(updateInvoiceStatusDto);
    }
    async fetchOrderDetails(getOrderDetailsDto) {
        return this.ordersService.getOrderDetails(getOrderDetailsDto);
    }
    async getOrderStatusCounts() {
        return await this.ordersService.getOrderStatusCounts();
    }
    async getFilteredOrders(filterDto) {
        return this.ordersService.getFilteredOrders(filterDto);
    }
    async findOneByOrderId(apiKey, partnerId, orderId) {
        const span = opentracing
            .globalTracer()
            .startSpan('find-one-order-controller');
        try {
            await this.ordersService.validatePartnerHeaders(partnerId, apiKey);
            return await this.ordersService.findOneByOrderId(span, orderId);
        }
        finally {
            span.finish();
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of orders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('generate-order'),
    __param(0, (0, common_1.Headers)('api_key')),
    __param(1, (0, common_1.Headers)('partner_id')),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)(':orderId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Delete)(':orderId'),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Order deleted successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Get)('unassigned-orders'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of orders without a checker' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getUnassignedOrders", null);
__decorate([
    (0, common_1.Post)('update-checker'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checker ID updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Checker ID or Order IDs not found',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.UpdateCheckerDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateChecker", null);
__decorate([
    (0, common_1.Post)('unassign-checker'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checker unassigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Checker ID or Order ID not found' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Checker is not assigned to this order',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.UnassignCheckerDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "unassignChecker", null);
__decorate([
    (0, common_1.Post)('get-checker-orders'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Checker ID not found' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.GetCheckerOrdersDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getCheckerOrders", null);
__decorate([
    (0, common_1.Post)('update-order-details'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invoice number & status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Checker ID or Order ID not found' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.UpdateOrderDetailsDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderDetails", null);
__decorate([
    (0, common_1.Post)('fetch-order-details'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order details fetched successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order or Checker ID not found' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.GetOrderDetailsDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "fetchOrderDetails", null);
__decorate([
    (0, common_1.Get)('order-status-counts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderStatusCounts", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.FilterOrdersDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getFilteredOrders", null);
__decorate([
    (0, common_1.Get)(':partnerOrderId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order details' }),
    __param(0, (0, common_1.Headers)('api_key')),
    __param(1, (0, common_1.Headers)('partner_id')),
    __param(2, (0, common_1.Param)('partnerOrderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOneByOrderId", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=order.controller.js.map