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
var EkycService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EkycService = void 0;
const common_1 = require("@nestjs/common");
const opentracing = require("opentracing");
const axios_1 = require("axios");
const document_consolidate_service_1 = require("../document-consolidate/document-consolidate.service");
const order_service_1 = require("../order/order.service");
const esign_model_1 = require("../../../database/models/esign.model");
const sequelize_1 = require("sequelize");
let EkycService = EkycService_1 = class EkycService {
    constructor(orderRepository, esignRepository, pdfService, orderService) {
        this.orderRepository = orderRepository;
        this.esignRepository = esignRepository;
        this.pdfService = pdfService;
        this.orderService = orderService;
        this.REQUEST_API_URL = "https://eve.idfy.com/v3/tasks/sync/generate/esign_document";
        this.REQUEST_TASK_API_URL = "https://eve.idfy.com/v3/tasks";
        this.RETRIEVE_API_URL = "https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve";
        this.API_KEY = "67163d36-d269-11ef-b1ca-feecce57f827";
        this.ACCOUNT_ID = "9d956848da98/b5d7ded1-218b-4c63-97ea-71ba70f038d3";
        this.USER_KEY = "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv";
        this.PROFILE_ID = process.env.E_ESIGN_PROFILE_ID;
        this.logger = new common_1.Logger(EkycService_1.name);
    }
    async getMergedPdfBase64(orderId) {
        var _a;
        this.logger.log(`Processing e-KYC request for order: ${orderId}`);
        try {
            const fileList = await this.pdfService.listFilesByFolder(orderId);
            const files = ((_a = fileList.files) === null || _a === void 0 ? void 0 : _a.filter((file) => file.name.endsWith(".pdf"))) || [];
            if (files.length === 0) {
                throw new common_1.HttpException(`No valid PDFs found in folder: ${orderId}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const mergedFile = files.find((file) => file.name.startsWith("merged_document_"));
            if (!mergedFile) {
                throw new common_1.HttpException(`No merged document found for order: ${orderId}`, common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`Found merged document: ${mergedFile.name}`);
            this.logger.log(`Signed URL: ${mergedFile.signed_url}`);
            const response = await axios_1.default.get(mergedFile.signed_url, {
                responseType: "arraybuffer",
            });
            const pdfBuffer = Buffer.from(response.data);
            return {
                base64: pdfBuffer.toString("base64"),
                signedUrl: mergedFile.signed_url,
            };
        }
        catch (error) {
            this.logger.error(`Failed to process PDFs: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: `Failed to process PDFs for order: ${orderId}`,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMergedPdfBase64W(orderId) {
        var _a;
        this.logger.log(`Processing e-KYC request for order: ${orderId}`);
        try {
            const fileList = await this.pdfService.listFilesByFolder(orderId);
            const files = ((_a = fileList.files) === null || _a === void 0 ? void 0 : _a.filter((file) => file.name.endsWith(".pdf"))) || [];
            if (files.length === 0) {
                throw new common_1.HttpException(`No valid PDFs found in folder: ${orderId}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const mergedFile = files.find((file) => file.name.startsWith("merge_"));
            if (!mergedFile) {
                throw new common_1.HttpException(`No merged document found for order: ${orderId}`, common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`Found merged document: ${mergedFile.name}`);
            this.logger.log(`Found merged document: ${mergedFile.signed_url}`);
            const response = await axios_1.default.get(mergedFile.signed_url, {
                responseType: "arraybuffer",
            });
            const pdfBuffer = Buffer.from(response.data);
            return pdfBuffer.toString("base64");
        }
        catch (error) {
            this.logger.error(`Failed to process PDFs: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: `Failed to process PDFs for order: ${orderId}`,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendEkycRequest(orderId, partnerHashedApiKey, partnerHashedKey) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        console.log("Received Headers:", {
            partnerHashedApiKey,
            partnerHashedKey,
        });
        this.logger.log(`Processing e-KYC request for order: ${orderId}`);
        console.log("Event: Starting e-KYC request processing", { orderId });
        let orderDetails;
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
            if (!orderDetails.dataValues.is_esign_required) {
                console.log("Event: e-Sign not required, skipping request", {
                    orderId,
                });
                return {
                    success: false,
                    message: "e-Sign is not required for this order.",
                };
            }
            this.logger.log(`Fetched order details successfully for ${orderId}`);
            console.log("Event: Order details fetched", { orderId, orderDetails });
        }
        catch (error) {
            this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
            console.log("Event: Error fetching order details", {
                orderId,
                error: error.message,
            });
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: "Failed to fetch order details",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log("Event: Generating merged PDF", { orderId });
        const { base64: mergedPdfBase64, signedUrl } = await this.getMergedPdfBase64(orderId);
        console.log("Event: Merged PDF generated", {
            orderId,
            mergedPdfLength: mergedPdfBase64.length,
        });
        const requestData = {
            task_id: orderDetails.dataValues.partner_order_id,
            group_id: orderDetails.dataValues.partner_id,
            order_id: orderId,
            data: {
                flow_type: "PDF",
                user_key: this.USER_KEY,
                verify_aadhaar_details: false,
                esign_file_details: {
                    esign_profile_id: this.PROFILE_ID,
                    file_name: `${orderDetails.dataValues.partner_order_id}`,
                    esign_file: mergedPdfBase64,
                    esign_fields: {
                        esign_fields: orderDetails.dataValues.esign_fields || {},
                    },
                    esign_additional_files: orderDetails.dataValues.esign_additional_files || [],
                    esign_allow_fill: orderDetails.dataValues.esign_allow_fill || false,
                },
                esign_stamp_details: {
                    esign_stamp_series: "",
                    esign_series_group: "",
                    esign_stamp_value: "",
                },
                esign_invitees: [
                    {
                        esigner_name: orderDetails.dataValues.customer_name,
                        esigner_email: orderDetails.dataValues.customer_email,
                        esigner_phone: orderDetails.dataValues.customer_phone,
                        aadhaar_esign_verification: {
                            aadhaar_pincode: "",
                            aadhaar_yob: "",
                            aadhaar_gender: "",
                        },
                    },
                ],
            },
        };
        const logData = Object.assign({}, requestData);
        this.logger.log("Final Request Payload:");
        console.log("Request Data:", JSON.stringify(logData, null, 2));
        let responseData;
        try {
            console.log("Event: Sending e-KYC request", {
                orderId,
                url: this.REQUEST_API_URL,
            });
            const response = await axios_1.default.post(this.REQUEST_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                },
            });
            responseData = response.data;
            console.log("Success Response:", JSON.stringify(responseData, null, 2));
            this.logger.log(`e-KYC API request completed for order: ${orderId}`);
            console.log("Success Response:", JSON.stringify(responseData, null, 2));
        }
        catch (error) {
            this.logger.error(`e-KYC API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            this.logger.error(`Error in e-KYC API request: ${error.message}`, error.stack);
            let errorMessage = error.message;
            let errorDetails = null;
            let httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (error.response) {
                const { status, data } = error.response;
                errorMessage = data.message || "e-KYC request failed";
                errorDetails = data;
                httpStatus = status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            }
            else {
                errorMessage = "Network error: Unable to reach e-KYC service";
                errorDetails = error.message;
                httpStatus = common_1.HttpStatus.SERVICE_UNAVAILABLE;
            }
            console.log("Failure Response:", {
                errorMessage,
                errorDetails: errorDetails || { error: errorMessage },
                httpStatus,
            });
            const previousAttempts = await esign_model_1.ESign.count({
                where: { partner_order_id: orderId },
            });
            const attemptNumber = previousAttempts + 1;
            console.log("Event: Storing failed e-KYC attempt", {
                orderId,
                attemptNumber,
            });
            await esign_model_1.ESign.create({
                partner_order_id: orderId,
                attempt_number: attemptNumber,
                task_id: requestData.task_id,
                group_id: requestData.group_id,
                esign_file_details: Object.assign({}, requestData.data.esign_file_details),
                esign_stamp_details: requestData.data.esign_stamp_details,
                esign_invitees: requestData.data.esign_invitees,
                status: responseData.status === "completed" &&
                    ((_b = (_a = responseData.result) === null || _a === void 0 ? void 0 : _a.source_output) === null || _b === void 0 ? void 0 : _b.status) === "Success"
                    ? "completed"
                    : "failed",
                esign_details: ((_c = responseData.result) === null || _c === void 0 ? void 0 : _c.source_output) || responseData,
                esign_doc_id: ((_e = (_d = responseData.result) === null || _d === void 0 ? void 0 : _d.source_output) === null || _e === void 0 ? void 0 : _e.esign_doc_id) || null,
                request_id: responseData.request_id || null,
                completed_at: responseData.status == "completed" ? new Date() : null,
                esign_expiry: ((_g = (_f = responseData.result) === null || _f === void 0 ? void 0 : _f.source_output) === null || _g === void 0 ? void 0 : _g.expiry) || null,
                active: responseData.status === "completed" &&
                    ((_j = (_h = responseData.result) === null || _h === void 0 ? void 0 : _h.source_output) === null || _j === void 0 ? void 0 : _j.status) === "Success",
                expired: false,
                rejected: false,
            });
            throw new common_1.HttpException({ success: false, message: errorMessage, details: errorDetails }, httpStatus);
        }
        const previousAttempts = await esign_model_1.ESign.count({
            where: { partner_order_id: orderId },
        });
        const attemptNumber = previousAttempts + 1;
        console.log("Event: Calculated attempt number", { orderId, attemptNumber });
        let esignRecord;
        try {
            console.log("Event: Storing e-KYC data in ESign", { orderId });
            esignRecord = await esign_model_1.ESign.create({
                order_id: orderDetails.dataValues.id,
                partner_order_id: orderId,
                attempt_number: attemptNumber,
                task_id: requestData.task_id,
                group_id: requestData.group_id,
                esign_file_details: Object.assign(Object.assign({}, requestData.data.esign_file_details), { esign_file: signedUrl }),
                esign_stamp_details: requestData.data.esign_stamp_details,
                esign_invitees: requestData.data.esign_invitees,
                status: responseData.status === "completed" &&
                    ((_l = (_k = responseData.result) === null || _k === void 0 ? void 0 : _k.source_output) === null || _l === void 0 ? void 0 : _l.status) === "Success"
                    ? "completed"
                    : "failed",
                esign_details: ((_m = responseData.result) === null || _m === void 0 ? void 0 : _m.source_output) || responseData,
                esign_doc_id: ((_p = (_o = responseData.result) === null || _o === void 0 ? void 0 : _o.source_output) === null || _p === void 0 ? void 0 : _p.document_id) || null,
                request_id: responseData.request_id || null,
                completed_at: responseData.status === "completed" ? new Date() : null,
                esign_expiry: ((_r = (_q = responseData.result) === null || _q === void 0 ? void 0 : _q.source_output) === null || _r === void 0 ? void 0 : _r.expiry) || null,
                active: responseData.status === "completed" &&
                    ((_t = (_s = responseData.result) === null || _s === void 0 ? void 0 : _s.source_output) === null || _t === void 0 ? void 0 : _t.status) === "Success",
                expired: false,
                rejected: false,
            });
            this.logger.log(`Saved e-KYC request and response data to ESign model for order: ${orderId}`);
            console.log("Event: ESign record saved", {
                orderId,
                esignRecord: esignRecord.toJSON(),
            });
        }
        catch (error) {
            this.logger.error(`Failed to save e-KYC request and response data: ${error.message}`, error.stack);
            console.log("Event: Failed to save ESign record", {
                orderId,
                error: error.message,
            });
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: "Failed to save e-KYC request and response data",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const esignDetails = ((_v = (_u = responseData.result) === null || _u === void 0 ? void 0 : _u.source_output) === null || _v === void 0 ? void 0 : _v.esign_details) || [];
        const validEsign = esignDetails.find((esign) => esign.url_status === true);
        console.log("Event: Extracted e-sign details", { orderId, validEsign });
        if (validEsign) {
            const span = opentracing
                .globalTracer()
                .startSpan("update-order-controller");
            const childSpan = span
                .tracer()
                .startSpan("update-e-sign", { childOf: span });
            try {
                console.log("Event: Updating order with e-sign details", { orderId });
                const requestDetail = {
                    is_active: validEsign.url_status,
                    is_signed: false,
                    is_expired: validEsign.esign_expiry
                        ? new Date(validEsign.esign_expiry) < new Date()
                        : false,
                    is_rejected: false,
                };
                let eSignStatus;
                const { is_active, is_signed, is_expired, is_rejected } = requestDetail;
                if (is_active && is_signed) {
                    eSignStatus = "completed";
                }
                else if (is_active && !is_expired && !is_rejected && !is_signed) {
                    eSignStatus = "pending";
                }
                else if (is_expired && !is_rejected) {
                    eSignStatus = "expired";
                }
                else if (is_rejected || (is_active && is_expired)) {
                    eSignStatus = "rejected";
                }
                else {
                    eSignStatus = "pending";
                }
                await this.orderService.updateOrder(childSpan, orderId, {
                    e_sign_status: eSignStatus,
                    e_sign_link: validEsign.esign_url,
                    e_sign_link_status: "active",
                    e_sign_link_expires: validEsign.esign_expiry
                        ? new Date(validEsign.esign_expiry).toISOString()
                        : null,
                    e_sign_completed_by_customer: is_signed ? true : false,
                    e_sign_customer_completion_date: is_signed ? new Date().toISOString() : null,
                    e_sign_link_doc_id: (_x = (_w = responseData.result) === null || _w === void 0 ? void 0 : _w.source_output) === null || _x === void 0 ? void 0 : _x.esign_doc_id,
                    e_sign_link_request_id: responseData === null || responseData === void 0 ? void 0 : responseData.request_id,
                    partner_hashed_api_key: partnerHashedApiKey,
                    partner_hashed_key: partnerHashedKey,
                });
                this.logger.log(`updated order ${orderId} with e-sign details`);
                console.log("Event: Order updated with e-sign details", { orderId });
            }
            catch (error) {
                childSpan.log({ event: "error", message: error.message });
                this.logger.error(`Failed to update order ${orderId} with e-sign details: ${error.message}`, error.stack);
                console.log("Event: Failed to update order", {
                    orderId,
                    error: error.message,
                });
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                    details: "Failed to update order with e-sign details",
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            finally {
                childSpan.finish();
            }
        }
        if (responseData.status === "completed" &&
            ((_z = (_y = responseData.result) === null || _y === void 0 ? void 0 : _y.source_output) === null || _z === void 0 ? void 0 : _z.status) === "Success") {
            this.logger.log(`e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`);
            console.log("Event: e-KYC request succeeded", {
                orderId,
                requestId: responseData.request_id,
            });
            return {
                success: true,
                data: responseData,
                message: "e-KYC document generation completed successfully",
            };
        }
        else {
            this.logger.warn(`e-KYC request completed with unexpected status for order: ${orderId}`, responseData);
            console.log("Event: Unexpected e-KYC response", {
                orderId,
                responseData,
            });
            throw new common_1.HttpException({
                success: false,
                message: responseData,
                details: "Unexpected e-KYC response",
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendEkycRequestChecker(orderId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        this.logger.log(`Processing e-KYC request for order: ${orderId}`);
        console.log("Event: Starting e-KYC request processing", { orderId });
        let orderDetails;
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
            if (!orderDetails.dataValues.is_esign_required) {
                console.log("Event: e-Sign not required, skipping request", {
                    orderId,
                });
                return {
                    success: false,
                    message: "e-Sign is not required for this order.",
                };
            }
            this.logger.log(`Fetched order details successfully for ${orderId}`);
            console.log("Event: Order details fetched", { orderId, orderDetails });
        }
        catch (error) {
            this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
            console.log("Event: Error fetching order details", {
                orderId,
                error: error.message,
            });
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: "Failed to fetch order details",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log("Event: Generating merged PDF", { orderId });
        const { base64: mergedPdfBase64, signedUrl } = await this.getMergedPdfBase64(orderId);
        console.log("Event: Merged PDF generated", {
            orderId,
            mergedPdfLength: mergedPdfBase64.length,
        });
        const requestData = {
            task_id: orderDetails.dataValues.partner_order_id,
            group_id: orderDetails.dataValues.partner_id,
            order_id: orderId,
            data: {
                flow_type: "PDF",
                user_key: this.USER_KEY,
                verify_aadhaar_details: false,
                esign_file_details: {
                    esign_profile_id: this.PROFILE_ID,
                    file_name: `${orderDetails.dataValues.partner_order_id}`,
                    esign_file: mergedPdfBase64,
                    esign_fields: {
                        esign_fields: orderDetails.dataValues.esign_fields || {},
                    },
                    esign_additional_files: orderDetails.dataValues.esign_additional_files || [],
                    esign_allow_fill: orderDetails.dataValues.esign_allow_fill || false,
                },
                esign_stamp_details: {
                    esign_stamp_series: "",
                    esign_series_group: "",
                    esign_stamp_value: "",
                },
                esign_invitees: [
                    {
                        esigner_name: orderDetails.dataValues.customer_name,
                        esigner_email: orderDetails.dataValues.customer_email,
                        esigner_phone: orderDetails.dataValues.customer_phone,
                        aadhaar_esign_verification: {
                            aadhaar_pincode: "",
                            aadhaar_yob: "",
                            aadhaar_gender: "",
                        },
                    },
                ],
            },
        };
        const logData = Object.assign({}, requestData);
        this.logger.log("Final Request Payload:");
        console.log("Request Data:", JSON.stringify(logData, null, 2));
        let responseData;
        try {
            console.log("Event: Sending e-KYC request", {
                orderId,
                url: this.REQUEST_API_URL,
            });
            const response = await axios_1.default.post(this.REQUEST_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                },
            });
            responseData = response.data;
            console.log("Success Response:", JSON.stringify(responseData, null, 2));
            this.logger.log(`e-KYC API request completed for order: ${orderId}`);
            console.log("Success Response:", JSON.stringify(responseData, null, 2));
        }
        catch (error) {
            this.logger.error(`e-KYC API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            this.logger.error(`Error in e-KYC API request: ${error.message}`, error.stack);
            let errorMessage = error.message;
            let errorDetails = null;
            let httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (error.response) {
                const { status, data } = error.response;
                errorMessage = data.message || "e-KYC request failed";
                errorDetails = data;
                httpStatus = status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            }
            else {
                errorMessage = "Network error: Unable to reach e-KYC service";
                errorDetails = error.message;
                httpStatus = common_1.HttpStatus.SERVICE_UNAVAILABLE;
            }
            console.log("Failure Response:", {
                errorMessage,
                errorDetails: errorDetails || { error: errorMessage },
                httpStatus,
            });
            const previousAttempts = await esign_model_1.ESign.count({
                where: { partner_order_id: orderId },
            });
            const attemptNumber = previousAttempts + 1;
            console.log("Event: Storing failed e-KYC attempt", {
                orderId,
                attemptNumber,
            });
            await esign_model_1.ESign.create({
                partner_order_id: orderId,
                attempt_number: attemptNumber,
                task_id: requestData.task_id,
                group_id: requestData.group_id,
                esign_file_details: Object.assign({}, requestData.data.esign_file_details),
                esign_stamp_details: requestData.data.esign_stamp_details,
                esign_invitees: requestData.data.esign_invitees,
                status: responseData.status === "completed" &&
                    ((_b = (_a = responseData.result) === null || _a === void 0 ? void 0 : _a.source_output) === null || _b === void 0 ? void 0 : _b.status) === "Success"
                    ? "completed"
                    : "failed",
                esign_details: ((_c = responseData.result) === null || _c === void 0 ? void 0 : _c.source_output) || responseData,
                esign_doc_id: ((_e = (_d = responseData.result) === null || _d === void 0 ? void 0 : _d.source_output) === null || _e === void 0 ? void 0 : _e.esign_doc_id) || null,
                request_id: responseData.request_id || null,
                completed_at: responseData.status === "completed" ? new Date() : null,
                esign_expiry: ((_g = (_f = responseData.result) === null || _f === void 0 ? void 0 : _f.source_output) === null || _g === void 0 ? void 0 : _g.expiry) || null,
                active: responseData.status === "completed" &&
                    ((_j = (_h = responseData.result) === null || _h === void 0 ? void 0 : _h.source_output) === null || _j === void 0 ? void 0 : _j.status) === "Success",
                expired: false,
                rejected: false,
            });
            throw new common_1.HttpException({ success: false, message: errorMessage, details: errorDetails }, httpStatus);
        }
        const previousAttempts = await esign_model_1.ESign.count({
            where: { partner_order_id: orderId },
        });
        const attemptNumber = previousAttempts + 1;
        console.log("Event: Calculated attempt number", { orderId, attemptNumber });
        let esignRecord;
        try {
            console.log("Event: Storing e-KYC data in ESign", { orderId });
            esignRecord = await esign_model_1.ESign.create({
                order_id: orderDetails.dataValues.id,
                partner_order_id: orderId,
                attempt_number: attemptNumber,
                task_id: requestData.task_id,
                group_id: requestData.group_id,
                esign_file_details: Object.assign(Object.assign({}, requestData.data.esign_file_details), { esign_file: signedUrl }),
                esign_stamp_details: requestData.data.esign_stamp_details,
                esign_invitees: requestData.data.esign_invitees,
                status: responseData.status === "completed" &&
                    ((_l = (_k = responseData.result) === null || _k === void 0 ? void 0 : _k.source_output) === null || _l === void 0 ? void 0 : _l.status) === "Success"
                    ? "completed"
                    : "failed",
                esign_details: ((_m = responseData.result) === null || _m === void 0 ? void 0 : _m.source_output) || responseData,
                esign_doc_id: ((_p = (_o = responseData.result) === null || _o === void 0 ? void 0 : _o.source_output) === null || _p === void 0 ? void 0 : _p.document_id) || null,
                request_id: responseData.request_id || null,
                completed_at: responseData.status === "completed" ? new Date() : null,
                esign_expiry: ((_r = (_q = responseData.result) === null || _q === void 0 ? void 0 : _q.source_output) === null || _r === void 0 ? void 0 : _r.expiry) || null,
                active: responseData.status === "completed" &&
                    ((_t = (_s = responseData.result) === null || _s === void 0 ? void 0 : _s.source_output) === null || _t === void 0 ? void 0 : _t.status) === "Success",
                expired: false,
                rejected: false,
            });
            this.logger.log(`Saved e-KYC request and response data to ESign model for order: ${orderId}`);
            console.log("Event: ESign record saved", {
                orderId,
                esignRecord: esignRecord.toJSON(),
            });
        }
        catch (error) {
            this.logger.error(`Failed to save e-KYC request and response data: ${error.message}`, error.stack);
            console.log("Event: Failed to save ESign record", {
                orderId,
                error: error.message,
            });
            throw new common_1.HttpException({
                success: false,
                message: error.message,
                details: "Failed to save e-KYC request and response data",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const esignDetails = ((_v = (_u = responseData.result) === null || _u === void 0 ? void 0 : _u.source_output) === null || _v === void 0 ? void 0 : _v.esign_details) || [];
        const validEsign = esignDetails.find((esign) => esign.url_status === true);
        console.log("Event: Extracted e-sign details", { orderId, validEsign });
        if (validEsign) {
            const span = opentracing
                .globalTracer()
                .startSpan("update-order-controller");
            const childSpan = span
                .tracer()
                .startSpan("update-e-sign", { childOf: span });
            try {
                console.log("Event: Updating order with e-sign details", { orderId });
                const requestDetail = {
                    is_active: validEsign.url_status,
                    is_signed: false,
                    is_expired: validEsign.esign_expiry
                        ? new Date(validEsign.esign_expiry) < new Date()
                        : false,
                    is_rejected: false,
                };
                let eSignStatus;
                const { is_active, is_signed, is_expired, is_rejected } = requestDetail;
                if (is_active && is_signed) {
                    eSignStatus = "completed";
                }
                else if (is_active && !is_expired && !is_rejected && !is_signed) {
                    eSignStatus = "pending";
                }
                else if (is_expired && !is_rejected) {
                    eSignStatus = "expired";
                }
                else if (is_rejected || (is_active && is_expired)) {
                    eSignStatus = "rejected";
                }
                else {
                    eSignStatus = "pending";
                }
                await this.orderService.updateOrder(childSpan, orderId, {
                    e_sign_status: eSignStatus,
                    e_sign_link: validEsign.esign_url,
                    e_sign_link_status: "active",
                    e_sign_link_expires: validEsign.esign_expiry
                        ? new Date(validEsign.esign_expiry).toISOString()
                        : null,
                    e_sign_link_doc_id: (_x = (_w = responseData.result) === null || _w === void 0 ? void 0 : _w.source_output) === null || _x === void 0 ? void 0 : _x.esign_doc_id,
                    e_sign_link_request_id: responseData === null || responseData === void 0 ? void 0 : responseData.request_id,
                });
                this.logger.log(`updated order ${orderId} with e-sign details`);
                console.log("Event: Order updated with e-sign details", { orderId });
            }
            catch (error) {
                childSpan.log({ event: "error", message: error.message });
                this.logger.error(`Failed to update order ${orderId} with e-sign details: ${error.message}`, error.stack);
                console.log("Event: Failed to update order", {
                    orderId,
                    error: error.message,
                });
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                    details: "Failed to update order with e-sign details",
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            finally {
                childSpan.finish();
            }
        }
        if (responseData.status === "completed" &&
            ((_z = (_y = responseData.result) === null || _y === void 0 ? void 0 : _y.source_output) === null || _z === void 0 ? void 0 : _z.status) === "Success") {
            this.logger.log(`e-KYC request succeeded for order: ${orderId}, request ID: ${responseData.request_id}`);
            console.log("Event: e-KYC request succeeded", {
                orderId,
                requestId: responseData.request_id,
            });
            return {
                success: true,
                data: responseData,
                message: "e-KYC document generation completed successfully",
            };
        }
        else {
            this.logger.warn(`e-KYC request completed with unexpected status for order: ${orderId}`, responseData);
            console.log("Event: Unexpected e-KYC response", {
                orderId,
                responseData,
            });
            throw new common_1.HttpException({
                success: false,
                message: responseData,
                details: "Unexpected e-KYC response",
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTaskDetails(token, requestId) {
        var _a, _b;
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
            throw new common_1.HttpException(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || "Failed to retrieve task details", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleEkycRetrieveWebhook(partner_order_id) {
        var _a, _b, _c;
        const token = process.env.API_KEY;
        if (!token || typeof token !== "string") {
            throw new common_1.HttpException("Invalid or missing API key in configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!partner_order_id) {
            throw new common_1.HttpException("Missing required field: partner_order_id", common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Processing e-KYC retrieve webhook for partner_order_id: ${partner_order_id}`);
        const orderData = await this.orderRepository.findOne({
            where: { partner_order_id: partner_order_id },
            include: [{ model: esign_model_1.ESign, as: "esigns" }],
        });
        if (!orderData) {
            this.logger.warn(`No order found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("Order not found", common_1.HttpStatus.NOT_FOUND);
        }
        const task_id = partner_order_id;
        const group_id = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.dataValues) === null || _a === void 0 ? void 0 : _a.partner_id;
        if (!group_id) {
            this.logger.warn(`No partner_id (group_id) found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("group_id not available in order", common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(orderData === null || orderData === void 0 ? void 0 : orderData.dataValues);
        const esignRecords = ((_b = orderData === null || orderData === void 0 ? void 0 : orderData.dataValues) === null || _b === void 0 ? void 0 : _b.esigns) || [];
        if (!esignRecords.length) {
            this.logger.warn(`No ESign records found for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("No ESign records found", common_1.HttpStatus.NOT_FOUND);
        }
        const esign_doc_id = (_c = orderData === null || orderData === void 0 ? void 0 : orderData.dataValues) === null || _c === void 0 ? void 0 : _c.e_sign_link_doc_id;
        if (!esign_doc_id) {
            this.logger.warn(`No esign_doc_id found in order for partner_order_id: ${partner_order_id}`);
            throw new common_1.HttpException("esign_doc_id not available", common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(esign_doc_id);
        const requestData = {
            task_id,
            group_id,
            data: {
                user_key: "N0N0M8nTyzD3UghN6qehC9HTfwneEZJv",
                esign_doc_id,
            },
        };
        const responseData = await this.retrieveEkycData(requestData);
        console.log(responseData);
        const esignRecord = await this.esignRepository.findOne({
            where: {
                partner_order_id,
                [sequelize_1.Op.or]: [
                    { esign_doc_id },
                    sequelize_1.Sequelize.where(sequelize_1.Sequelize.literal("esign_details->>'esign_doc_id'"), sequelize_1.Op.eq, esign_doc_id),
                ],
            },
            logging: console.log,
        });
        if (!esignRecord) {
            this.logger.warn(`No ESign record found for task_id: ${task_id} and esign_doc_id: ${esign_doc_id}`);
            throw new common_1.HttpException("ESign record not found", common_1.HttpStatus.NOT_FOUND);
        }
        const { source_output } = responseData.result;
        const requestDetail = source_output.request_details[0];
        console.log("responseData:", responseData === null || responseData === void 0 ? void 0 : responseData.completed_at);
        const ESigncompletedAt = (responseData === null || responseData === void 0 ? void 0 : responseData.completed_at)
            ? new Date(responseData.completed_at).toISOString()
            : null;
        console.log("ESigncompletedAt:", ESigncompletedAt);
        let esignExpiry = esignRecord.esign_expiry;
        if (requestDetail.expiry_date) {
            const rawExpiry = requestDetail.expiry_date;
            const [day, month, year, hours, minutes, seconds] = rawExpiry.split(/[-\s:]/);
            const formattedExpiry = `${year}-${month}-${day}T${hours || "00"}:${minutes || "00"}:${seconds || "00"}Z`;
            esignExpiry = new Date(formattedExpiry);
        }
        if (ESigncompletedAt && isNaN(new Date(ESigncompletedAt).getTime())) {
            this.logger.error(`Invalid completed_at value: ${responseData.completed_at}`);
            throw new common_1.HttpException("Invalid completed_at timestamp", common_1.HttpStatus.BAD_REQUEST);
        }
        if (esignExpiry && isNaN(esignExpiry.getTime())) {
            this.logger.error(`Invalid esign_expiry value: ${requestDetail.expiry_date}`);
            throw new common_1.HttpException("Invalid esign_expiry timestamp", common_1.HttpStatus.BAD_REQUEST);
        }
        let eSignStatus;
        const { is_active, is_signed, is_expired, is_rejected } = requestDetail;
        if (orderData.e_sign_status === "not required") {
            eSignStatus = "not required";
        }
        else if (is_active && is_signed) {
            eSignStatus = "completed";
        }
        else if (is_active && !is_expired && !is_rejected && !is_signed) {
            eSignStatus = "pending";
        }
        else if (is_expired && !is_rejected) {
            eSignStatus = "expired";
        }
        else if (is_rejected || (is_active && is_expired)) {
            eSignStatus = "rejected";
        }
        else {
            eSignStatus = "pending";
        }
        await esignRecord.update({
            status: responseData.status,
            request_id: responseData.request_id,
            active: is_active,
            expired: is_expired,
            rejected: is_rejected,
            is_signed: is_signed,
            esign_url: requestDetail.esign_url,
            esigner_email: requestDetail.esigner_email,
            esigner_phone: requestDetail.esigner_phone,
            esign_type: requestDetail.esign_type,
            esign_folder: source_output.esign_folder,
            esign_irn: source_output.esign_irn,
            esigners: source_output.esigners,
            file_details: source_output.file_details,
            request_details: source_output.request_details,
            esign_details: Object.assign(Object.assign({}, esignRecord.esign_details), { status: source_output.status }),
        });
        console.log('updating order', {
            e_sign_status: eSignStatus,
            e_sign_customer_completion_date: ESigncompletedAt
        });
        await orderData.update({
            e_sign_status: eSignStatus,
            e_sign_customer_completion_date: ESigncompletedAt ? new Date(ESigncompletedAt) : null
        });
        this.logger.log(`Updated Order record for task_id: ${task_id}, e_sign_status: ${eSignStatus}`);
        this.logger.log(`Updated ESign record for task_id: ${task_id}, esign_doc_id: ${esign_doc_id}`);
        return {
            success: true,
            message: "Webhook processed successfully",
            data: responseData,
        };
    }
    async retrieveEkycData(requestData) {
        var _a, _b;
        try {
            const response = await axios_1.default.post(this.RETRIEVE_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to retrieve e-KYC data: ${error.message}`, error.stack);
            throw new common_1.HttpException(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || "Failed to retrieve e-KYC data", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async convertUrlsToBase64(urls) {
        const results = [];
        const errors = [];
        await Promise.all(urls.map(async (url, index) => {
            try {
                const response = await axios_1.default.get(url, {
                    responseType: "arraybuffer",
                });
                const buffer = Buffer.from(response.data);
                const base64 = buffer.toString("base64");
                results.push({
                    url,
                    base64,
                    mimeType: response.headers["content-type"] || "application/octet-stream",
                });
                this.logger.log(`Converted ${url} to Base64 successfully`);
            }
            catch (error) {
                const errorMessage = error.message || "Unknown error";
                errors.push({ url, error: `Failed to process URL: ${errorMessage}` });
                this.logger.error(`Error converting ${url}: ${errorMessage}`, error.stack);
            }
        }));
        if (errors.length === urls.length) {
            throw new common_1.HttpException({
                success: false,
                message: errors,
                details: "All URL conversions failed",
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            success: true,
            message: "URLs processed successfully",
            data: results,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    async sendEkycRequestBase64(token, requestData) {
        var _a, _b, _c, _d;
        if (!token || typeof token !== "string") {
            throw new common_1.HttpException("Invalid or missing X-API-Key token", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!requestData || typeof requestData !== "object") {
            throw new common_1.HttpException("Request data must be a valid JSON object", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!((_b = (_a = requestData.data) === null || _a === void 0 ? void 0 : _a.esign_file_details) === null || _b === void 0 ? void 0 : _b.esign_file)) {
            throw new common_1.HttpException("Missing required esign_file in request data", common_1.HttpStatus.BAD_REQUEST);
        }
        let esignFile = requestData.data.esign_file_details.esign_file;
        if (typeof esignFile === "string") {
            if (esignFile.startsWith("http")) {
                this.logger.log(`Detected URL in esign_file: ${esignFile}. Converting to Base64...`);
                console.log(`Detected URL in esign_file: ${esignFile}. Converting to Base64...`);
                const conversionResult = await this.convertUrlsToBase64([esignFile]);
                if (!conversionResult.success || conversionResult.data.length === 0) {
                    throw new common_1.HttpException({
                        success: false,
                        message: conversionResult.errors,
                        details: "Failed to convert URL to Base64",
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                esignFile = conversionResult.data[0].base64;
                this.logger.log("URL converted to Base64 successfully");
            }
            else {
                this.logger.log("Detected potential Base64 string in esign_file. Validating...");
                const trimmedEsignFile = esignFile.trim();
                if (!trimmedEsignFile.startsWith("JVBERi0x")) {
                    try {
                        const decoded = Buffer.from(trimmedEsignFile, "base64");
                        const reEncoded = decoded.toString("base64");
                        if (reEncoded !== trimmedEsignFile) {
                            throw new Error("Invalid Base64 format");
                        }
                    }
                    catch (error) {
                        throw new common_1.HttpException({
                            success: false,
                            message: error.message,
                            details: "Invalid Base64 string provided for esign_file",
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                esignFile = trimmedEsignFile;
                this.logger.log("Base64 string validated successfully");
            }
        }
        else {
            throw new common_1.HttpException("esign_file must be a string (URL or Base64)", common_1.HttpStatus.BAD_REQUEST);
        }
        requestData.data.esign_file_details.esign_file = esignFile;
        try {
            const response = await axios_1.default.post(this.REQUEST_API_URL, requestData, {
                headers: {
                    "api-key": this.API_KEY,
                    "account-id": this.ACCOUNT_ID,
                    "Content-Type": "application/json",
                    "X-API-Key": token,
                },
            });
            const responseData = response.data;
            if (responseData.status === "completed" &&
                ((_d = (_c = responseData.result) === null || _c === void 0 ? void 0 : _c.source_output) === null || _d === void 0 ? void 0 : _d.status) === "Success") {
                this.logger.log(`e-KYC request succeeded: ${responseData.request_id}`);
                return {
                    success: true,
                    data: responseData,
                    message: "e-KYC document generation completed successfully",
                };
            }
            else {
                throw new Error("Unexpected response status");
            }
        }
        catch (error) {
            const axiosError = error;
            this.logger.error(`Error in sendEkycRequest: ${axiosError.message}`, axiosError.stack);
            if (axiosError.response) {
                const { status, data } = axiosError.response;
                const apiResponse = data;
                const apiMessage = apiResponse.message || "Unknown error";
                let errorMessage = "Failed to generate e-KYC document";
                if (status === common_1.HttpStatus.BAD_REQUEST) {
                    if (apiMessage.includes("Base64")) {
                        errorMessage = "Invalid Base64 PDF data provided";
                    }
                    else if (apiMessage.includes("Malformed Request")) {
                        errorMessage =
                            "Malformed request: Check JSON structure or required fields";
                    }
                    else {
                        errorMessage = apiMessage;
                    }
                }
                else if (status === common_1.HttpStatus.UNAUTHORIZED) {
                    errorMessage = "Invalid or expired X-API-Key token";
                }
                else if (status === common_1.HttpStatus.FORBIDDEN) {
                    errorMessage = "Access denied: Check API key or account permissions";
                }
                else if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                    errorMessage = "e-KYC service encountered an internal error";
                }
                throw new common_1.HttpException({
                    success: false,
                    message: apiResponse,
                    details: errorMessage,
                    request_id: apiResponse.request_id,
                }, status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            throw new common_1.HttpException({
                success: false,
                message: axiosError.message,
                details: axiosError.request
                    ? "Network error: Unable to reach e-KYC service"
                    : "An unexpected error occurred",
            }, axiosError.request
                ? common_1.HttpStatus.SERVICE_UNAVAILABLE
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EkycService = EkycService;
exports.EkycService = EkycService = EkycService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ORDER_REPOSITORY")),
    __param(1, (0, common_1.Inject)("E_SIGN_REPOSITORY")),
    __metadata("design:paramtypes", [Object, Object, document_consolidate_service_1.PdfService,
        order_service_1.OrdersService])
], EkycService);
//# sourceMappingURL=ekyc.service.js.map