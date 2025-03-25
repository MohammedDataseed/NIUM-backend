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
var VideokycService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideokycService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const opentracing = require("opentracing");
const vkyc_model_1 = require("../../../database/models/vkyc.model");
const order_service_1 = require("../order/order.service");
let VideokycService = VideokycService_1 = class VideokycService {
    constructor(orderRepository, vkycRepository, orderService) {
        this.orderRepository = orderRepository;
        this.vkycRepository = vkycRepository;
        this.orderService = orderService;
        this.REQUEST_API_URL = "https://api.kyc.idfy.com/sync/profiles";
        this.REQUEST_TASK_API_URL = "https://eve.idfy.com/v3/tasks";
        this.RETRIEVE_API_URL = "https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve";
        this.CONFIG_ID = process.env.VKYC_CONFIG_ID;
        this.API_KEY = "fbb65739-9015-4d88-b2f5-5057e1b1f07e";
        this.ACCOUNT_ID = "e1628d9a6e50/7afd3aae-730e-41ff-aa4c-0914ef4dbbe0";
        this.logger = new common_1.Logger(VideokycService_1.name);
    }
    async sendVideokycRequest(orderId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.logger.log(`Processing v-KYC request for order: ${orderId}`);
        console.log("Event: Starting v-KYC request processing", { orderId });
        let orderDetails;
        let attemptNumber = 1;
        let currentOrderId;
        try {
            const span = opentracing.globalTracer().startSpan("fetch-order-details");
            console.log("Event: Fetching order details", {
                orderId,
                spanId: span.context().toSpanId(),
            });
            orderDetails = await this.orderService.findOne(span, orderId);
            span.finish();
            if (!orderDetails) {
                console.log("Event: Order not found", { orderId });
                throw new common_1.HttpException(`Order not found: ${orderId}`, common_1.HttpStatus.NOT_FOUND);
            }
            if (!orderDetails.dataValues.is_v_kyc_required) {
                console.log("Event: v-KYC not required, skipping request", { orderId });
                return {
                    success: false,
                    message: "v-KYC is not required for this order.",
                };
            }
            const previousAttempts = await vkyc_model_1.Vkyc.count({
                where: { partner_order_id: orderId },
            });
            attemptNumber = previousAttempts + 1;
            console.log("Event: Storing v-KYC attempt", { orderId, attemptNumber });
            const timestamp = Date.now();
            currentOrderId = `${orderId}-${timestamp}`;
            console.log("Event: Updated orderId for v-KYC", { currentOrderId });
            const requestData = {
                reference_id: currentOrderId,
                config: {
                    id: this.CONFIG_ID,
                    overrides: {},
                },
                data: {
                    name: {
                        first_name: (_a = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _a === void 0 ? void 0 : _a.customer_name,
                    },
                    dob: "",
                },
                payload: {
                    security_questions: [
                        {
                            question: "What is your name?",
                            answer: (_b = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _b === void 0 ? void 0 : _b.customer_name,
                        },
                        {
                            question: "What is your contact number ?",
                            answer: (_c = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _c === void 0 ? void 0 : _c.customer_phone,
                        },
                        {
                            question: "What is your email id?",
                            answer: (_d = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _d === void 0 ? void 0 : _d.customer_email,
                        },
                    ],
                },
            };
            console.log("Event: API Request Data", JSON.stringify(requestData, null, 2));
            let responseData;
            const response = await axios_1.default.post(this.REQUEST_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                },
            });
            responseData = response.data;
            console.log("Success Response:", JSON.stringify(responseData, null, 2));
            console.log("Event: API Response", JSON.stringify(response.data, null, 2));
            console.log("Event: v-KYC request sent successfully", {
                orderId,
                response: response.data,
            });
            const vkycData = {
                partner_order_id: orderId,
                reference_id: currentOrderId,
                profile_id: response.data.profile_id,
                v_kyc_status: "pending",
                v_kyc_link: response.data.capture_link,
                v_kyc_link_expires: new Date(response.data.capture_expires_at),
                v_kyc_link_status: "active",
                order_id: (_e = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _e === void 0 ? void 0 : _e.id,
                attempt_number: attemptNumber,
                created_by: (_f = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _f === void 0 ? void 0 : _f.partner_id,
                updated_by: (_g = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.dataValues) === null || _g === void 0 ? void 0 : _g.partner_id,
            };
            await vkyc_model_1.Vkyc.create(vkycData);
            console.log("Event: v-KYC data stored successfully", {
                orderId,
                vkycData,
            });
            let is_video_kyc_link_regenerated = false;
            let is_video_kyc_link_regenerated_details = [];
            if (attemptNumber > 1) {
                is_video_kyc_link_regenerated = true;
                const previousVkycRecords = await vkyc_model_1.Vkyc.findAll({
                    where: { partner_order_id: orderId },
                    attributes: [
                        "reference_id",
                        "profile_id",
                        "v_kyc_link",
                        "v_kyc_link_expires",
                        "v_kyc_link_status",
                        "attempt_number",
                    ],
                });
                is_video_kyc_link_regenerated_details = previousVkycRecords.map((record) => record.toJSON());
            }
            const span2 = opentracing
                .globalTracer()
                .startSpan("update-order-controller");
            const childSpan = span
                .tracer()
                .startSpan("update-v-kyc", { childOf: span2 });
            const v_kyc_link_status = responseData.status || "capture_pending";
            const v_kyc_completed_by_customer = response.data.v_kyc_link_status === "completed" ? true : false;
            try {
                console.log("Event: Updating order with v-kyc details", { orderId });
                await this.orderService.updateOrder(childSpan, orderId, {
                    v_kyc_link: response.data.capture_link,
                    v_kyc_link_expires: new Date(response.data.capture_expires_at).toISOString(),
                    v_kyc_status: "pending",
                    v_kyc_link_status: "active",
                    v_kyc_completed_by_customer,
                    v_kyc_reference_id: currentOrderId,
                    v_kyc_profile_id: response.data.profile_id,
                    is_video_kyc_link_regenerated,
                    is_video_kyc_link_regenerated_details,
                });
                this.logger.log(`updated order ${orderId} with v-kyc details`);
                console.log("Event: Order updated with v-kyc details", { orderId });
            }
            catch (error) {
                childSpan.log({ event: "error", message: error.message });
                this.logger.error(`Failed to update order ${orderId} with v-kyc details: ${error.message}`, error.stack);
                console.log("Event: Failed to update order", {
                    orderId,
                    error: error.message,
                });
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                    details: "Failed to update order with v-kyc details",
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            finally {
                childSpan.finish();
            }
            return {
                success: true,
                message: "v-KYC link generated successfully",
                v_kyc_link: ((_h = response.data) === null || _h === void 0 ? void 0 : _h.capture_link) || null,
                v_kyc_link_status: ((_j = response.data) === null || _j === void 0 ? void 0 : _j.status) || "capture_pending",
                v_kyc_link_expires: ((_k = response.data) === null || _k === void 0 ? void 0 : _k.capture_expires_at) || null,
                v_kyc_status: "pending",
            };
        }
        catch (error) {
            this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
            console.log("Event: Error fetching order details", { orderId, error: error.message });
            if (error.response) {
                console.error("Error Response:", error.response.data);
            }
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: "Failed to generate vkyc",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleEkycRetrieveWebhook(partner_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const token = process.env.API_KEY;
        if (!token || typeof token !== "string") {
            throw new common_1.HttpException("Invalid or missing API key in configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required field: partner_order_id", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing e-KYC retrieve webhook for partner_order_id: ${partner_order_id}`);
        const order = await this.orderRepository.findOne({
            where: { partner_order_id },
            include: [{ model: vkyc_model_1.Vkyc, as: "vkycs" }],
        });
        if (!order) {
            this.logger.warn(`No order found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("Order not found", common_1.HttpStatus.NOT_FOUND);
        }
        const vkycRecords = ((_a = order === null || order === void 0 ? void 0 : order.dataValues) === null || _a === void 0 ? void 0 : _a.vkycs) || [];
        if (!vkycRecords.length) {
            this.logger.warn(`No ESign records found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("No vkyc Records found", common_1.HttpStatus.NOT_FOUND);
        }
        const v_kyc_profile_id = (_b = order === null || order === void 0 ? void 0 : order.dataValues) === null || _b === void 0 ? void 0 : _b.v_kyc_profile_id;
        if (!v_kyc_profile_id) {
            this.logger.warn(`No v_kyc_profile_id found in order for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("v_kyc_profile_id not available", common_1.HttpStatus.BAD_REQUEST);
        }
        const requestData = { request_id: v_kyc_profile_id };
        const responseData = await this.retrieveVideokycData(requestData);
        if (!responseData) {
            throw new common_1.HttpException("Failed to retrieve VKYC data", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const v_kyc_link_status = responseData.status === "completed" ? "completed" : "pending";
        const v_kyc_completed_by_customer = v_kyc_link_status === "completed" ? "completed" : "pending";
        const esignDoc = (_d = (_c = responseData.resources) === null || _c === void 0 ? void 0 : _c.documents) === null || _d === void 0 ? void 0 : _d.find((doc) => doc.type === "profile_report");
        const v_kyc_link = esignDoc ? esignDoc.value : null;
        const vkycData = {
            reference_id: responseData.reference_id || null,
            profile_id: v_kyc_profile_id,
            v_kyc_status: v_kyc_completed_by_customer,
            v_kyc_link_status,
            v_kyc_comments: ((_e = responseData.status_description) === null || _e === void 0 ? void 0 : _e.comments) || null,
            v_kyc_doc_completion_date: ((_f = responseData.profile_data) === null || _f === void 0 ? void 0 : _f.completed_at)
                ? new Date(responseData.profile_data.completed_at)
                : null,
            device_info: responseData.device_info || null,
            profile_data: responseData.profile_data || null,
            performed_by: ((_g = responseData.profile_data) === null || _g === void 0 ? void 0 : _g.performed_by) || null,
            resources_documents: ((_h = responseData.resources) === null || _h === void 0 ? void 0 : _h.documents) || null,
            resources_images: ((_j = responseData.resources) === null || _j === void 0 ? void 0 : _j.images) || null,
            resources_videos: ((_k = responseData.resources) === null || _k === void 0 ? void 0 : _k.videos) || null,
            resources_text: ((_l = responseData.resources) === null || _l === void 0 ? void 0 : _l.text) || null,
            location_info: ((_p = (_o = (_m = responseData.resources) === null || _m === void 0 ? void 0 : _m.text) === null || _o === void 0 ? void 0 : _o.find((t) => t.attr === "location")) === null || _p === void 0 ? void 0 : _p.value) || null,
            reviewer_action: responseData.reviewer_action || null,
            tasks: responseData.tasks || null,
            status: responseData.status || null,
            status_description: responseData.status_description || null,
            status_detail: responseData.status_detail || null,
            v_kyc_completed_by_customer,
        };
        let vkycRecord = await vkyc_model_1.Vkyc.findOne({
            where: { profile_id: v_kyc_profile_id },
        });
        if (vkycRecord) {
            await vkycRecord.update(vkycData);
            this.logger.log(`Updated Vkyc record for profile_id: ${v_kyc_profile_id}`);
        }
        else {
            await vkyc_model_1.Vkyc.create(vkycData);
            this.logger.log(`Created new Vkyc record for profile_id: ${v_kyc_profile_id}`);
        }
        return {
            success: true,
            message: "Webhook processed successfully",
            data: responseData,
        };
    }
    async retrieveVideokycData(requestData) {
        try {
            const url = `https://api.kyc.idfy.com/profiles/${requestData.request_id}`;
            const response = await axios_1.default.get(url, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async sendVideokycRequestOld(token, referenceId) {
        try {
            const requestData = {
                reference_id: referenceId,
                config: {
                    id: this.CONFIG_ID,
                    overrides: {},
                },
                data: {
                    addresses: [],
                },
            };
            const response = await axios_1.default.post(this.REQUEST_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                    "X-API-Key": token,
                },
            });
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getTaskDetails(token, requestId) {
        try {
            if (!requestId) {
                throw new common_1.HttpException("request_id is required", common_1.HttpStatus.BAD_REQUEST);
            }
            const response = await axios_1.default.get(`${this.REQUEST_TASK_API_URL}?request_id=${requestId}`, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                    "X-API-Key": token,
                },
            });
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        var _a, _b;
        const errorMessage = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || "An error occurred during the request";
        const statusCode = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        throw new common_1.HttpException(errorMessage, statusCode);
    }
};
exports.VideokycService = VideokycService;
exports.VideokycService = VideokycService = VideokycService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ORDER_REPOSITORY")),
    __param(1, (0, common_1.Inject)("V_KYC_REPOSITORY")),
    __metadata("design:paramtypes", [Object, Object, order_service_1.OrdersService])
], VideokycService);
//# sourceMappingURL=videokyc.service.js.map