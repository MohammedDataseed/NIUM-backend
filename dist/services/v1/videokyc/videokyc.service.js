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
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
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
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadToS3(base64Data, fileType, folder) {
        if (!base64Data)
            return null;
        const buffer = Buffer.from(base64Data, "base64");
        const fileExtension = fileType.split("/")[1];
        const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: fileType,
        };
        try {
            await this.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
            return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        }
        catch (error) {
            console.error("Error uploading to S3:", error);
            return null;
        }
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
                    v_kyc_link: response.data.capture_link || null,
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        const token = process.env.API_KEY;
        if (!token) {
            throw new common_1.HttpException("Missing API key", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required field: partner_order_id", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing VKYC webhook for partner_order_id: ${partner_order_id}`);
        const order = await this.orderRepository.findOne({
            where: { partner_order_id },
            include: [{ model: vkyc_model_1.Vkyc, as: "vkycs" }],
        });
        if (!order) {
            this.logger.warn(`No order found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("Order not found", common_1.HttpStatus.NOT_FOUND);
        }
        if (!order.is_v_kyc_required) {
            this.logger.log(`VKYC not required for partner_order_id: ${partner_order_id}`);
            return { success: true, message: "VKYC not required", data: null };
        }
        const vkycRecords = ((_a = order === null || order === void 0 ? void 0 : order.dataValues) === null || _a === void 0 ? void 0 : _a.vkycs) || [];
        if (!vkycRecords.length) {
            this.logger.warn(`No VKYC records found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("No VKYC records found", common_1.HttpStatus.NOT_FOUND);
        }
        const v_kyc_profile_id = (_b = order === null || order === void 0 ? void 0 : order.dataValues) === null || _b === void 0 ? void 0 : _b.v_kyc_profile_id;
        if (!v_kyc_profile_id) {
            throw new common_1.HttpException("v_kyc_profile_id not available", common_1.HttpStatus.BAD_REQUEST);
        }
        const requestData = { request_id: v_kyc_profile_id };
        let responseData;
        try {
            responseData = await this.retrieveVideokycData(requestData);
        }
        catch (error) {
            this.logger.error(`Failed to retrieve VKYC data: ${error.message}`);
            throw new common_1.HttpException("Failed to retrieve VKYC data", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!responseData) {
            throw new common_1.HttpException("VKYC data retrieval returned empty response", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const resources = (responseData === null || responseData === void 0 ? void 0 : responseData.resources) || {};
        const vkycDocumentsProfileReport = ((_c = resources.documents) === null || _c === void 0 ? void 0 : _c.find(doc => doc.type === "profile_report")) || null;
        const vkycDocuments = (vkycDocumentsProfileReport === null || vkycDocumentsProfileReport === void 0 ? void 0 : vkycDocumentsProfileReport.value) || null;
        const vkycImagesDataSelfie = ((_d = resources.images) === null || _d === void 0 ? void 0 : _d.find(img => img.type === "selfie")) || null;
        const vkycImagesDataPan = ((_e = resources.images) === null || _e === void 0 ? void 0 : _e.find(img => img.type === "ind_pan")) || null;
        const vkycImagesDataOthers = ((_f = resources.images) === null || _f === void 0 ? void 0 : _f.filter(img => img.type === "others")) || [];
        const vkycVideosAgent = ((_g = resources.videos) === null || _g === void 0 ? void 0 : _g.find(video => video.attr === "agent")) || null;
        const vkycVideosCustomer = ((_h = resources.videos) === null || _h === void 0 ? void 0 : _h.find(video => video.attr === "customer")) || null;
        const vkycLocation = ((_k = (_j = resources.text) === null || _j === void 0 ? void 0 : _j.find(txt => txt.attr === "location")) === null || _k === void 0 ? void 0 : _k.value) || null;
        const vkycName = ((_o = (_m = (_l = resources.text) === null || _l === void 0 ? void 0 : _l.find(txt => txt.attr === "name")) === null || _m === void 0 ? void 0 : _m.value) === null || _o === void 0 ? void 0 : _o.first_name) || null;
        const vkycDob = ((_q = (_p = resources.text) === null || _p === void 0 ? void 0 : _p.find(txt => txt.attr === "dob")) === null || _q === void 0 ? void 0 : _q.value) || null;
        const vkycDataResources = {
            documents: vkycDocuments,
            images: {
                selfie: (vkycImagesDataSelfie === null || vkycImagesDataSelfie === void 0 ? void 0 : vkycImagesDataSelfie.value) || null,
                pan: (vkycImagesDataPan === null || vkycImagesDataPan === void 0 ? void 0 : vkycImagesDataPan.value) || null,
                others: vkycImagesDataOthers.map(img => img.value) || [],
            },
            videos: {
                agent: (vkycVideosAgent === null || vkycVideosAgent === void 0 ? void 0 : vkycVideosAgent.value) || null,
                customer: (vkycVideosCustomer === null || vkycVideosCustomer === void 0 ? void 0 : vkycVideosCustomer.value) || null,
            },
            text: {
                location: vkycLocation,
                name: vkycName,
                dob: vkycDob,
            }
        };
        console.log(vkycDataResources);
        const isCompleted = responseData.status === "completed";
        const v_kyc_status = isCompleted ? "completed" : "pending";
        const v_kyc_completed_by_customer = isCompleted;
        const v_kyc_customer_completion_date = ((_r = responseData.profile_data) === null || _r === void 0 ? void 0 : _r.completed_at)
            ? new Date(responseData.profile_data.completed_at)
            : null;
        if (v_kyc_customer_completion_date && isNaN(v_kyc_customer_completion_date.getTime())) {
            this.logger.error(`Invalid completed_at value: ${responseData.profile_data.completed_at}`);
            throw new common_1.HttpException("Invalid completed_at timestamp", common_1.HttpStatus.BAD_REQUEST);
        }
        const v_kyc_link_status = responseData.status === "completed" ? "completed" : "pending";
        const vkycData = {
            reference_id: responseData.reference_id || null,
            profile_id: v_kyc_profile_id,
            v_kyc_status,
            v_kyc_link_status,
            v_kyc_comments: ((_s = responseData.status_description) === null || _s === void 0 ? void 0 : _s.comments) || null,
            v_kyc_doc_completion_date: v_kyc_customer_completion_date,
            v_kyc_completed_by_customer,
            device_info: responseData.device_info || null,
            profile_data: responseData.profile_data || null,
            performed_by: ((_t = responseData.profile_data) === null || _t === void 0 ? void 0 : _t.performed_by) || null,
            resources_documents: ((_u = responseData.resources) === null || _u === void 0 ? void 0 : _u.documents) || null,
            resources_images: ((_v = responseData.resources) === null || _v === void 0 ? void 0 : _v.images) || null,
            resources_videos: ((_w = responseData.resources) === null || _w === void 0 ? void 0 : _w.videos) || null,
            resources_text: ((_x = responseData.resources) === null || _x === void 0 ? void 0 : _x.text) || null,
            location_info: ((_0 = (_z = (_y = responseData.resources) === null || _y === void 0 ? void 0 : _y.text) === null || _z === void 0 ? void 0 : _z.find((t) => t.attr === "location")) === null || _0 === void 0 ? void 0 : _0.value) || null,
            reviewer_action: responseData.reviewer_action || null,
            tasks: responseData.tasks || null,
            status: responseData.status || null,
            status_description: responseData.status_description || null,
            status_detail: responseData.status_detail || null,
        };
        console.log(vkycData);
        await vkyc_model_1.Vkyc.upsert(vkycData);
        await order.update({
            v_kyc_status,
            v_kyc_customer_completion_date,
            v_kyc_completed_by_customer,
        });
        this.logger.log(`Updated Order for partner_order_id: ${partner_order_id} with VKYC status: ${v_kyc_status}`);
        return { success: true, message: "Webhook processed successfully", data: responseData };
    }
    async processAndUploadVKYCFiles(resources) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const vkycDocumentsProfileReport = ((_a = resources.documents) === null || _a === void 0 ? void 0 : _a.find(doc => doc.type === "profile_report")) || null;
        const vkycDocuments = (vkycDocumentsProfileReport === null || vkycDocumentsProfileReport === void 0 ? void 0 : vkycDocumentsProfileReport.value) || null;
        const vkycImagesDataSelfie = ((_b = resources.images) === null || _b === void 0 ? void 0 : _b.find(img => img.type === "selfie")) || null;
        const vkycImagesDataPan = ((_c = resources.images) === null || _c === void 0 ? void 0 : _c.find(img => img.type === "ind_pan")) || null;
        const vkycImagesDataOthers = ((_d = resources.images) === null || _d === void 0 ? void 0 : _d.filter(img => img.type === "others")) || [];
        const vkycVideosAgent = ((_e = resources.videos) === null || _e === void 0 ? void 0 : _e.find(video => video.attr === "agent")) || null;
        const vkycVideosCustomer = ((_f = resources.videos) === null || _f === void 0 ? void 0 : _f.find(video => video.attr === "customer")) || null;
        const vkycLocation = ((_h = (_g = resources.text) === null || _g === void 0 ? void 0 : _g.find(txt => txt.attr === "location")) === null || _h === void 0 ? void 0 : _h.value) || null;
        const vkycName = ((_l = (_k = (_j = resources.text) === null || _j === void 0 ? void 0 : _j.find(txt => txt.attr === "name")) === null || _k === void 0 ? void 0 : _k.value) === null || _l === void 0 ? void 0 : _l.first_name) || null;
        const vkycDob = ((_o = (_m = resources.text) === null || _m === void 0 ? void 0 : _m.find(txt => txt.attr === "dob")) === null || _o === void 0 ? void 0 : _o.value) || null;
        const uploadedFiles = {
            documents: vkycDocuments ? await this.uploadToS3(vkycDocuments, "application/pdf", "documents") : null,
            images: {
                selfie: (vkycImagesDataSelfie === null || vkycImagesDataSelfie === void 0 ? void 0 : vkycImagesDataSelfie.value) ? await this.uploadToS3(vkycImagesDataSelfie.value, "image/jpeg", "images") : null,
                pan: (vkycImagesDataPan === null || vkycImagesDataPan === void 0 ? void 0 : vkycImagesDataPan.value) ? await this.uploadToS3(vkycImagesDataPan.value, "image/jpeg", "images") : null,
                others: await Promise.all(vkycImagesDataOthers.map(async (img) => img.value ? await this.uploadToS3(img.value, "image/jpeg", "images") : null)),
            },
            videos: {
                agent: (vkycVideosAgent === null || vkycVideosAgent === void 0 ? void 0 : vkycVideosAgent.value) ? await this.uploadToS3(vkycVideosAgent.value, "video/mp4", "videos") : null,
                customer: (vkycVideosCustomer === null || vkycVideosCustomer === void 0 ? void 0 : vkycVideosCustomer.value) ? await this.uploadToS3(vkycVideosCustomer.value, "video/mp4", "videos") : null,
            },
            text: {
                location: vkycLocation,
                name: vkycName,
                dob: vkycDob,
            }
        };
        console.log("Uploaded Files:", uploadedFiles);
        return uploadedFiles;
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
            console.log("VKYC API Response:", JSON.stringify(response.data, null, 2));
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