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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const esign_model_1 = require("../../../database/models/esign.model");
const vkyc_model_1 = require("../../../database/models/vkyc.model");
const sequelize_2 = require("sequelize");
let OrdersService = class OrdersService {
    constructor(orderRepository, partnerRepository, userRepository, purposeTypeRepository, transactionTypeRepository) {
        this.orderRepository = orderRepository;
        this.partnerRepository = partnerRepository;
        this.userRepository = userRepository;
        this.purposeTypeRepository = purposeTypeRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }
    async createOrder(span, createOrderDto, partnerId, api_key) {
        const childSpan = span
            .tracer()
            .startSpan('create-order', { childOf: span });
        try {
            const existingOrder = await this.orderRepository.findOne({
                where: { partner_order_id: createOrderDto.partner_order_id },
            });
            if (existingOrder) {
                throw new common_1.ConflictException('Order ID already exists');
            }
            const partner = await this.partnerRepository.findOne({
                where: { hashed_key: partnerId },
                attributes: ['id', 'api_key', 'hashed_key'],
            });
            console.log('parter_id', partner === null || partner === void 0 ? void 0 : partner.id);
            if (!partner) {
                throw new common_1.BadRequestException('Invalid partner ID');
            }
            const purposeType = await this.purposeTypeRepository.findOne({
                where: { hashed_key: createOrderDto.purpose_type_id, isActive: true },
            });
            if (!purposeType) {
                throw new common_1.BadRequestException('Invalid or inactive purpose_type_id');
            }
            const transactionType = await this.transactionTypeRepository.findOne({
                where: {
                    hashed_key: createOrderDto.transaction_type_id,
                    isActive: true,
                },
            });
            if (!transactionType) {
                throw new common_1.BadRequestException('Invalid or inactive transaction_type_id');
            }
            const orderData = {
                partner_id: partner === null || partner === void 0 ? void 0 : partner.id,
                partner_order_id: createOrderDto.partner_order_id,
                partner_hashed_api_key: partner === null || partner === void 0 ? void 0 : partner.api_key,
                partner_hashed_key: partner === null || partner === void 0 ? void 0 : partner.hashed_key,
                transaction_type: createOrderDto.transaction_type_id,
                is_esign_required: createOrderDto.is_e_sign_required,
                is_v_kyc_required: createOrderDto.is_v_kyc_required,
                purpose_type: createOrderDto.purpose_type_id,
                customer_name: createOrderDto.customer_name,
                customer_email: createOrderDto.customer_email,
                customer_phone: createOrderDto.customer_phone,
                customer_pan: createOrderDto.customer_pan,
                order_status: 'pending',
                e_sign_status: createOrderDto.is_e_sign_required ? 'pending' : 'not required',
                v_kyc_status: createOrderDto.is_v_kyc_required ? 'pending' : 'not required',
                created_by: partner === null || partner === void 0 ? void 0 : partner.id,
                updated_by: partner === null || partner === void 0 ? void 0 : partner.id,
            };
            console.log('orderData:', JSON.stringify(orderData, null, 2));
            const order = await this.orderRepository.create(orderData);
            return {
                message: 'Order created successfully',
                partner_order_id: order.partner_order_id,
                nium_forex_order_id: order.nium_order_id,
            };
        }
        catch (error) {
            childSpan.log({ event: 'error', message: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async findAll(span) {
        const childSpan = span
            .tracer()
            .startSpan('find-all-orders', { childOf: span });
        try {
            const orders = await this.orderRepository.findAll({
                include: [
                    {
                        model: esign_model_1.ESign,
                        as: 'esigns',
                        required: false,
                        where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.cast(sequelize_1.Sequelize.col('esigns.order_id'), 'uuid'), sequelize_2.Op.eq, sequelize_1.Sequelize.col('Order.id')),
                    },
                    {
                        model: vkyc_model_1.Vkyc,
                        as: 'vkycs',
                        required: false,
                        where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.cast(sequelize_1.Sequelize.col('vkycs.order_id'), 'uuid'), sequelize_2.Op.eq, sequelize_1.Sequelize.col('Order.id')),
                    },
                ],
            });
            return orders.length > 0 ? orders : [];
        }
        catch (error) {
            childSpan.log({ event: 'error', message: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async validatePartnerHeaders(partnerId, apiKey) {
        console.log(`Validating partnerId: ${partnerId}, apiKey: ${apiKey}`);
        const partner = await this.partnerRepository.findOne({
            where: { hashed_key: partnerId },
            attributes: ['id', 'api_key'],
        });
        console.log('parter_id', partner === null || partner === void 0 ? void 0 : partner.id);
        console.log('Partner found:', partner ? JSON.stringify(partner.toJSON()) : 'null');
        if (!partner) {
            throw new common_1.BadRequestException('Invalid partner ID');
        }
        if (!partner.api_key || partner.api_key !== apiKey) {
            throw new common_1.UnauthorizedException('Invalid API key for this partner');
        }
    }
    async findOne(span, orderId) {
        const childSpan = span
            .tracer()
            .startSpan('find-one-order', { childOf: span });
        try {
            const order = await this.orderRepository.findOne({
                where: { partner_order_id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            }
            const regeneratedVkycCount = order.is_video_kyc_link_regenerated_details
                ? order.is_video_kyc_link_regenerated_details.length
                : 0;
            const regeneratedEsignCount = order.is_esign_regenerated ? 1 : 0;
            const { is_video_kyc_link_regenerated_details } = order, orderWithoutVideoKyc = __rest(order, ["is_video_kyc_link_regenerated_details"]);
            return Object.assign(Object.assign({}, orderWithoutVideoKyc), { regenerated_v_kyc_count: regeneratedVkycCount, regenerated_e_sign_count: regeneratedEsignCount });
        }
        catch (error) {
            childSpan.log({ event: 'error', message: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async findOneByOrderId(span, orderId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const childSpan = span.tracer().startSpan('find-one-order', { childOf: span });
        try {
            const order = await this.orderRepository.findOne({
                where: { partner_order_id: orderId },
                include: [{ association: 'esigns' }, { association: 'vkycs' }],
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            }
            const [transactionTypes, purposeTypes] = await Promise.all([
                this.transactionTypeRepository.findAll({
                    attributes: ['id', 'hashed_key', 'name'],
                    raw: true,
                }),
                this.purposeTypeRepository.findAll({
                    attributes: ['id', 'hashed_key', 'purposeName'],
                    raw: true,
                }),
            ]);
            const transactionTypeMap = Object.fromEntries(transactionTypes.map(({ id, hashed_key, name }) => [hashed_key, { id, text: name }]));
            const purposeTypeMap = Object.fromEntries(purposeTypes.map(({ id, hashed_key, purposeName }) => [hashed_key, { id, text: purposeName }]));
            const latestEsign = (_a = order.esigns) === null || _a === void 0 ? void 0 : _a.reduce((latest, current) => current.attempt_number > latest.attempt_number ? current : latest, ((_b = order.esigns) === null || _b === void 0 ? void 0 : _b[0]) || null);
            console.log(latestEsign);
            const latestVkyc = (_c = order.vkycs) === null || _c === void 0 ? void 0 : _c.reduce((latest, current) => current.attempt_number > latest.attempt_number ? current : latest, ((_d = order.vkycs) === null || _d === void 0 ? void 0 : _d[0]) || null);
            const regeneratedVkycCount = ((_e = order.is_video_kyc_link_regenerated_details) === null || _e === void 0 ? void 0 : _e.length) || 0;
            const regeneratedEsignCount = Math.max((((_f = order.esigns) === null || _f === void 0 ? void 0 : _f.length) || 1) - 1, 0);
            const extractBaseUrl = (url) => (url === null || url === void 0 ? void 0 : url.split('?')[0]) || null;
            const latestEsignDetails = (_g = latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.esign_details) === null || _g === void 0 ? void 0 : _g[0];
            const requestDetail = {
                is_active: ((_j = (_h = latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.request_details) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.is_active) || false,
                is_signed: (latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.is_signed) || false,
                is_expired: (latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.esign_expiry) ? new Date(latestEsign.esign_expiry) < new Date() : false,
                is_rejected: ((_l = (_k = latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.request_details) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.is_rejected) || false,
            };
            const eSignStatus = order.is_esign_required
                ? requestDetail.is_signed
                    ? 'completed'
                    : requestDetail.is_expired
                        ? 'expired'
                        : requestDetail.is_rejected
                            ? 'rejected'
                            : 'pending'
                : 'not required';
            const vKycStatus = order.is_v_kyc_required
                ? (latestVkyc === null || latestVkyc === void 0 ? void 0 : latestVkyc.status) || order.v_kyc_status
                : 'not required';
            return Object.assign({ partner_order_id: order.partner_order_id, nium_order_id: order.nium_order_id, order_status: order.order_status, is_esign_required: order.is_esign_required, is_v_kyc_required: order.is_v_kyc_required, transaction_type: transactionTypeMap[order.transaction_type] || { id: null, text: order.transaction_type }, purpose_type: purposeTypeMap[order.purpose_type] || { id: null, text: order.purpose_type }, e_sign_status: eSignStatus, e_sign_link: (latestEsignDetails === null || latestEsignDetails === void 0 ? void 0 : latestEsignDetails.esign_url) || order.e_sign_link, e_sign_link_status: latestEsignDetails === null || latestEsignDetails === void 0 ? void 0 : latestEsignDetails.url_status, e_sign_link_expires: (latestEsignDetails === null || latestEsignDetails === void 0 ? void 0 : latestEsignDetails.esign_expiry) || order.e_sign_link_expires, e_sign_completed_by_customer: latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.is_signed, e_sign_customer_completion_date: (latestEsign === null || latestEsign === void 0 ? void 0 : latestEsign.is_signed) ? order.e_sign_customer_completion_date : null, e_sign_doc_comments: order.e_sign_doc_comments, is_e_sign_regenerated: regeneratedEsignCount > 1, e_sign_regenerated_count: regeneratedEsignCount, v_kyc_status: vKycStatus, v_kyc_link: (latestVkyc === null || latestVkyc === void 0 ? void 0 : latestVkyc.v_kyc_link) || order.v_kyc_link, v_kyc_link_status: (latestVkyc === null || latestVkyc === void 0 ? void 0 : latestVkyc.v_kyc_link_status) || order.v_kyc_link_status, v_kyc_link_expires: (latestVkyc === null || latestVkyc === void 0 ? void 0 : latestVkyc.v_kyc_link_expires) || order.v_kyc_link_expires, v_kyc_completed_by_customer: order.v_kyc_completed_by_customer, v_kyc_customer_completion_date: order.v_kyc_customer_completion_date, v_kyc_comments: order.v_kyc_comments, is_v_kyc_link_regenerated: order.is_video_kyc_link_regenerated, v_kyc_regenerated_count: regeneratedVkycCount }, (order.merged_document && { merged_document: extractBaseUrl((_m = order.merged_document) === null || _m === void 0 ? void 0 : _m.url) }));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async updateOrder(span, orderId, updateOrderDto) {
        const childSpan = span
            .tracer()
            .startSpan('update-order', { childOf: span });
        try {
            const order = await this.orderRepository.findOne({
                where: { partner_order_id: orderId },
            });
            if (!order)
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            Object.assign(order, Object.assign(Object.assign({}, updateOrderDto), { e_sign_link_expires: updateOrderDto.e_sign_link_expires
                    ? new Date(updateOrderDto.e_sign_link_expires)
                    : order.e_sign_link_expires, e_sign_customer_completion_date: updateOrderDto.e_sign_customer_completion_date
                    ? new Date(updateOrderDto.e_sign_customer_completion_date)
                    : order.e_sign_customer_completion_date, v_kyc_link_expires: updateOrderDto.v_kyc_link_expires
                    ? new Date(updateOrderDto.v_kyc_link_expires)
                    : order.v_kyc_link_expires, v_kyc_customer_completion_date: updateOrderDto.v_kyc_customer_completion_date
                    ? new Date(updateOrderDto.v_kyc_customer_completion_date)
                    : order.v_kyc_customer_completion_date, profile_id: updateOrderDto.v_kyc_profile_id || order.v_kyc_profile_id, reference_id: updateOrderDto.v_kyc_reference_id || order.v_kyc_reference_id }));
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
                    : 'pending';
            await order.save();
            return order;
        }
        catch (error) {
            childSpan.log({ event: 'error', message: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async deleteOrder(span, orderId) {
        const childSpan = span
            .tracer()
            .startSpan('delete-order', { childOf: span });
        try {
            const order = await this.orderRepository.findOne({
                where: { partner_order_id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            }
            await order.destroy();
        }
        catch (error) {
            childSpan.log({ event: 'error', message: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async updateChecker(dto) {
        const { orderIds, checkerId } = dto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checkerId },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checkerId} not found.`);
        }
        const orders = await this.orderRepository.findAll({
            where: { partner_order_id: orderIds },
            attributes: ['id', 'partner_order_id'],
        });
        const foundOrderIds = orders.map((order) => order.partner_order_id);
        const missingOrderIds = orderIds.filter((id) => !foundOrderIds.includes(id));
        if (missingOrderIds.length) {
            throw new common_1.NotFoundException(`Orders not found: ${missingOrderIds.join(', ')}`);
        }
        await this.orderRepository.update({ checker_id: checker.id }, { where: { partner_order_id: orderIds } });
        return {
            message: 'Checker ID updated successfully',
            updatedOrders: orderIds,
        };
    }
    async unassignChecker(dto) {
        const { orderId, checkerId } = dto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checkerId },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checkerId} not found.`);
        }
        const order = await this.orderRepository.findOne({
            where: { partner_order_id: orderId },
            attributes: ['id', 'partner_order_id', 'checker_id'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found.`);
        }
        if (order.checker_id !== checker.id) {
            throw new common_1.BadRequestException(`Checker is not assigned to the given order.`);
        }
        await this.orderRepository.update({ checker_id: null }, { where: { partner_order_id: orderId } });
        return {
            message: 'Checker unassigned successfully',
            unassignedOrder: orderId,
        };
    }
    async getOrdersByChecker(dto) {
        const { checkerId, transaction_type } = dto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checkerId },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checkerId} not found.`);
        }
        const whereCondition = { checker_id: checker.id };
        if (transaction_type === 'completed') {
            whereCondition.incident_status = true;
            whereCondition.e_sign_status = 'completed';
            whereCondition.v_kyc_status = 'completed';
        }
        const orders = await this.orderRepository.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            raw: true,
        });
        console.log('order-data', orders);
        const transactionTypes = await this.transactionTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'name'],
            raw: true,
        });
        const purposeTypes = await this.purposeTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'purposeName'],
            raw: true,
        });
        const transactionTypeMap = Object.fromEntries(transactionTypes.map(({ id, hashed_key, name }) => [
            hashed_key,
            { id, text: name },
        ]));
        const purposeTypeMap = Object.fromEntries(purposeTypes.map(({ id, hashed_key, purposeName }) => [
            hashed_key,
            { id, text: purposeName },
        ]));
        const mappedOrders = orders.map((order) => (Object.assign(Object.assign({}, order), { transaction_type: transactionTypeMap[order.transaction_type] || {
                id: null,
                text: order.transaction_type,
            }, purpose_type: purposeTypeMap[order.purpose_type] || {
                id: null,
                text: order.purpose_type,
            } })));
        return {
            message: `Orders assigned to checker ${checkerId}`,
            totalOrders: orders.length,
            filterApplied: transaction_type || 'all',
            orders: mappedOrders,
        };
    }
    async updateOrderDetails(dto) {
        const { partner_order_id, checker_id, nium_invoice_number, incident_checker_comments, incident_status, } = dto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checker_id },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checker_id} not found.`);
        }
        const order = await this.orderRepository.findOne({
            where: { partner_order_id: partner_order_id, checker_id: checker.id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${partner_order_id} not found or not assigned to this checker.`);
        }
        if (order.is_esign_required == true && order.e_sign_status != 'completed') {
            throw new common_1.NotFoundException(`Order ${partner_order_id} esign not completed`);
        }
        if (order.is_v_kyc_required == true && order.v_kyc_status != 'completed') {
            throw new common_1.NotFoundException(`Order ${partner_order_id} vkyc not completed`);
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
    async getOrderDetails(dto) {
        const { orderId, checkerId } = dto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checkerId },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checkerId} not found.`);
        }
        const order = await this.orderRepository.findOne({
            where: { partner_order_id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with hash key "${orderId}" not found.`);
        }
        if (order.checker_id !== checker.id) {
            throw new common_1.BadRequestException(`Checker ID "${checkerId}" is not assigned to this order.`);
        }
        const transactionTypes = await this.transactionTypeRepository.findAll({
            attributes: ['hashed_key', 'name'],
            raw: true,
        });
        const transactionTypeMap = transactionTypes.reduce((acc, type) => {
            acc[type.hashed_key] = type.name;
            return acc;
        }, {});
        const purposeTypes = await this.purposeTypeRepository.findAll({
            attributes: ['hashed_key', 'purpose_name'],
            raw: true,
        });
        const purposeTypeMap = purposeTypes.reduce((acc, type) => {
            acc[type.hashed_key] = type.purposeName;
            return acc;
        }, {});
        const sequelizeOrderInstance = this.orderRepository.build(order);
        sequelizeOrderInstance.transaction_type =
            transactionTypeMap[order.transaction_type] || null;
        sequelizeOrderInstance.purpose_type =
            purposeTypeMap[order.purpose_type] || null;
        return sequelizeOrderInstance;
    }
    async getUnassignedOrders() {
        const orders = await this.orderRepository.findAll({
            where: {
                checker_id: { [sequelize_2.Op.is]: null },
                merged_document: { [sequelize_2.Op.ne]: null },
            },
            raw: true,
        });
        const transactionTypes = await this.transactionTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'name'],
            raw: true,
        });
        const purposeTypes = await this.purposeTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'purposeName'],
            raw: true,
        });
        const transactionTypeMap = Object.fromEntries(transactionTypes
            .filter(({ hashed_key }) => hashed_key !== undefined && hashed_key !== null)
            .map(({ id, hashed_key, name }) => [hashed_key, { id, text: name }]));
        const purposeTypeMap = Object.fromEntries(purposeTypes
            .filter(({ hashed_key }) => hashed_key !== undefined && hashed_key !== null)
            .map(({ id, hashed_key, purposeName }) => [
            hashed_key,
            { id, text: purposeName },
        ]));
        return orders.map((order) => (Object.assign(Object.assign({}, order), { transaction_type: order.transaction_type
                ? transactionTypeMap[order.transaction_type] || {
                    id: null,
                    text: order.transaction_type,
                }
                : { id: null, text: null }, purpose_type: order.purpose_type
                ? purposeTypeMap[order.purpose_type] || {
                    id: null,
                    text: order.purpose_type,
                }
                : { id: null, text: null } })));
    }
    async getOrderStatusCounts() {
        try {
            const orderCounts = await this.orderRepository.findAll({
                attributes: [
                    [
                        this.orderRepository.sequelize.fn('COUNT', this.orderRepository.sequelize.col('id')),
                        'transactionReceived',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal('CASE WHEN incident_status = true THEN 1 ELSE 0 END')),
                        'transactionApproved',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal('CASE WHEN incident_status = false THEN 1 ELSE 0 END')),
                        'transactionRejected',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal('CASE WHEN incident_status IS NULL THEN 1 ELSE 0 END')),
                        'transactionPending',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN v_kyc_status = 'completed' THEN 1 ELSE 0 END")),
                        'vkycCompleted',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN v_kyc_status = 'pending' THEN 1 ELSE 0 END")),
                        'vkycPending',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN v_kyc_status = 'rejected' THEN 1 ELSE 0 END")),
                        'vkycRejected',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN e_sign_status = 'completed' THEN 1 ELSE 0 END")),
                        'esignCompleted',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN e_sign_status = 'pending' THEN 1 ELSE 0 END")),
                        'esignPending',
                    ],
                    [
                        this.orderRepository.sequelize.fn('SUM', this.orderRepository.sequelize.literal("CASE WHEN e_sign_status = 'rejected' THEN 1 ELSE 0 END")),
                        'esignRejected',
                    ],
                ],
                raw: true,
            });
            return orderCounts[0] || {};
        }
        catch (error) {
            console.error('Error fetching dashboard details:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch dashboard data.');
        }
    }
    async getFilteredOrders(filterDto) {
        const { checkerId, transaction_type_hashed_key, purpose_type_hashed_key, from, to, } = filterDto;
        const checker = await this.userRepository.findOne({
            where: { hashed_key: checkerId },
            attributes: ['id'],
        });
        if (!checker) {
            throw new common_1.NotFoundException(`Checker with ID ${checkerId} not found.`);
        }
        if (transaction_type_hashed_key) {
            const transactionExists = await this.transactionTypeRepository.findOne({
                where: { hashed_key: transaction_type_hashed_key },
                attributes: ['hashed_key'],
            });
            if (!transactionExists) {
                throw new common_1.BadRequestException(`Invalid Transaction Type ID: ${transaction_type_hashed_key}`);
            }
        }
        if (purpose_type_hashed_key) {
            const purposeExists = await this.purposeTypeRepository.findOne({
                where: { hashed_key: purpose_type_hashed_key },
                attributes: ['hashed_key'],
            });
            if (!purposeExists) {
                throw new common_1.BadRequestException(`Invalid Purpose Type ID: ${purpose_type_hashed_key}`);
            }
        }
        const whereCondition = { checker_id: checker.id };
        if (transaction_type_hashed_key)
            whereCondition.transaction_type = transaction_type_hashed_key;
        if (purpose_type_hashed_key)
            whereCondition.purpose_type = purpose_type_hashed_key;
        if (from || to) {
            whereCondition.createdAt = {};
            if (from)
                whereCondition.createdAt[sequelize_2.Op.gte] = new Date(from);
            if (to)
                whereCondition.createdAt[sequelize_2.Op.lte] = new Date(to);
        }
        const orders = await this.orderRepository.findAll({
            where: whereCondition,
            raw: true,
        });
        const transactionTypes = await this.transactionTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'name'],
            raw: true,
        });
        const purposeTypes = await this.purposeTypeRepository.findAll({
            attributes: ['id', 'hashed_key', 'purposeName'],
            raw: true,
        });
        const transactionTypeMap = Object.fromEntries(transactionTypes.map(({ id, hashed_key, name }) => [
            hashed_key,
            { id, text: name },
        ]));
        const purposeTypeMap = Object.fromEntries(purposeTypes.map(({ id, hashed_key, purposeName }) => [
            hashed_key,
            { id, text: purposeName },
        ]));
        return orders.map((order) => (Object.assign(Object.assign({}, order), { transaction_type: order.transaction_type
                ? transactionTypeMap[order.transaction_type] || {
                    id: null,
                    text: order.transaction_type,
                }
                : { id: null, text: null }, purpose_type: order.purpose_type
                ? purposeTypeMap[order.purpose_type] || {
                    id: null,
                    text: order.purpose_type,
                }
                : { id: null, text: null } })));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ORDER_REPOSITORY')),
    __param(1, (0, common_1.Inject)('PARTNER_REPOSITORY')),
    __param(2, (0, common_1.Inject)('USER_REPOSITORY')),
    __param(3, (0, common_1.Inject)('PURPOSE_REPOSITORY')),
    __param(4, (0, common_1.Inject)('TRANSACTION_TYPE_REPOSITORY')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], OrdersService);
//# sourceMappingURL=order.service.js.map