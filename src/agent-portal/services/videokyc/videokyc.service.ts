import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as opentracing from 'opentracing';
import { Vkyc } from '../../../database/models/vkyc.model';
import { OrdersService } from '../order/order.service';
import { Order } from '../../../database/models/order.model';

// Define interfaces for request and response payloads
interface VideoKycRequestPayload {
  reference_id: string;
  config: {
    id: string;
    overrides: Record<string, any>;
  };
  data: {
    addresses: any[];
  };
}

interface VideoKycResponse {
  success: boolean; // Add this field
  status: string;
  message: string;
  data: any;
}

interface VideoKycResponseOld {
  // Define the expected structure of the response data
  status: string;
  data: any;
}

@Injectable()
export class VideokycService {
  private readonly REQUEST_API_URL = 'https://api.kyc.idfy.com/sync/profiles';
  private readonly REQUEST_TASK_API_URL = 'https://eve.idfy.com/v3/tasks';
  private readonly RETRIEVE_API_URL =
    'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';

  // private readonly API_URL = process.env.VKYC_REQUEST_API_URL;  // Get from .env
  // private readonly API_KEY=process.env.VKYC_REQUEST_API_KEY
  // private readonly ACCOUNT_ID = process.env.VKYC_ACCOUNT_ID; // Get from .env
  private readonly CONFIG_ID = process.env.VKYC_CONFIG_ID; // Get from .env
  private readonly API_KEY = 'fbb65739-9015-4d88-b2f5-5057e1b1f07e';
  private readonly ACCOUNT_ID =
    'e1628d9a6e50/7afd3aae-730e-41ff-aa4c-0914ef4dbbe0';
  private readonly logger = new Logger(VideokycService.name);

  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: typeof Order,
    @Inject('V_KYC_REPOSITORY')
    private readonly vkycRepository: typeof Vkyc,
    private readonly orderService: OrdersService,
  ) {}

  // Send Video KYC request
  async sendVideokycRequest(orderId: string): Promise<any> {
    // if (!token || typeof token !== "string") {
    //   console.log("Token Validation Failed:", {
    //     token,
    //     message: "Invalid or missing X-API-Key token",
    //   });
    //   throw new HttpException(
    //     "Invalid or missing X-API-Key token",
    //     HttpStatus.BAD_REQUEST
    //   );
    // }

    this.logger.log(`Processing v-KYC request for order: ${orderId}`);
    console.log('Event: Starting v-KYC request processing', { orderId });

    let orderDetails: any;
    let attemptNumber: number = 1; // Default to first-time attempt
    let currentOrderId: string;

    try {
      const span = opentracing.globalTracer().startSpan('fetch-order-details');
      console.log('Event: Fetching order details', {
        orderId,
        spanId: span.context().toSpanId(),
      });
      orderDetails = await this.orderService.findOne(span, orderId);
      span.finish();

      if (!orderDetails) {
        console.log('Event: Order not found', { orderId });
        throw new HttpException(
          `Order not found: ${orderId}`,
          HttpStatus.NOT_FOUND,
        );
      }
      //  console.log("order",orderDetails);

      // ✅ **Check if v-KYC is required** ✅
      if (!orderDetails.dataValues.is_v_kyc_required) {
        console.log('Event: v-KYC not required, skipping request', { orderId });
        return {
          success: false,
          message: 'v-KYC is not required for this order.',
        };
      }

      // ✅ **Check how many times the v-KYC has been attempted** ✅
      const previousAttempts = await Vkyc.count({
        where: { partner_order_id: orderId },
      });
      attemptNumber = previousAttempts + 1; // Increment attempt count

      // Log the attempt number
      console.log('Event: Storing v-KYC attempt', { orderId, attemptNumber });

      // Update the currentOrderId with the attempt number (e.g., orderId-1, orderId-2)
      // currentOrderId = `${orderId}-${attemptNumber}`;
      const timestamp = Date.now(); // Get the current timestamp in milliseconds
      currentOrderId = `${orderId}-${timestamp}`; // Append the timestamp to the original orderId
      console.log('Event: Updated orderId for v-KYC', { currentOrderId });

      // Prepare the API request data
      const requestData = {
        reference_id: currentOrderId, // Use the updated orderId with attempt number
        config: {
          id: this.CONFIG_ID,
          overrides: {},
        },
        data: {
          name: {
            first_name: orderDetails?.dataValues?.customer_name, // Populate with the actual name from the orderDetails if needed
          },
          dob: '', // Populate with actual date of birth if available
        },
        payload: {
          security_questions: [
            {
              question: 'What is your name?',
              answer: orderDetails?.dataValues?.customer_name,
            },
            {
              question: 'What is your contact number ?',
              answer: orderDetails?.dataValues?.customer_phone,
            },
            {
              question: 'What is your email id?',
              answer: orderDetails?.dataValues?.customer_email,
            },
          ],
        },
      };

      // Log the request data before sending the request
      console.log(
        'Event: API Request Data',
        JSON.stringify(requestData, null, 2),
      );

      // **Step 1: Make v-KYC request first**
      let responseData: any;
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
        },
      });
      responseData = response.data;
      console.log('Success Response:', JSON.stringify(responseData, null, 2)); // Log to verify
      // Log the response after receiving it
      console.log(
        'Event: API Response',
        JSON.stringify(response.data, null, 2),
      );

      console.log('Event: v-KYC request sent successfully', {
        orderId,
        response: response.data,
      });

      // ✅ **Store the successful v-KYC response in the database** ✅

      const vkycData = {
        partner_order_id: orderId, // The partner's order ID
        reference_id: currentOrderId, // Updated order ID
        profile_id: response.data.profile_id, // Profile ID from response
        v_kyc_status: 'pending', // Set the status as active
        v_kyc_link: response.data.capture_link, // v-KYC link from response
        v_kyc_link_expires: new Date(response.data.capture_expires_at), // Convert expiration time to Date
        v_kyc_link_status: 'active', // Set the status as active
        order_id: orderDetails?.dataValues?.id, // Ensure the correct order ID from orderDetails
        attempt_number: attemptNumber, // The attempt number for the request
        created_by: orderDetails?.dataValues?.partner_id, // Use created_by from orderDetails
        updated_by: orderDetails?.dataValues?.partner_id, // Use updated_by from orderDetails
      };

      // Save to vkycs table
      await Vkyc.create(vkycData);
      console.log('Event: v-KYC data stored successfully', {
        orderId,
        vkycData,
      });

      // ✅ **Update the 'orders' table with reference_id and profile_id** ✅

      let is_video_kyc_link_regenerated = false;
      let is_video_kyc_link_regenerated_details: any[] = [];
      if (attemptNumber > 1) {
        is_video_kyc_link_regenerated = true;
        const previousVkycRecords = await Vkyc.findAll({
          where: { partner_order_id: orderId },
          attributes: [
            'reference_id',
            'profile_id',
            'v_kyc_link',
            'v_kyc_link_expires',
            'v_kyc_link_status',
            'attempt_number',
          ],
        });
        is_video_kyc_link_regenerated_details = previousVkycRecords.map(
          (record) => record.toJSON(),
        );
      }
      const span2 = opentracing
        .globalTracer()
        .startSpan('update-order-controller');
      const childSpan = span
        .tracer()
        .startSpan('update-v-kyc', { childOf: span2 });
      // Determine v_kyc_link_status and v_kyc_completed_by_customer
      const v_kyc_link_status = responseData.status || 'capture_pending'; // Default to capture_pending if missing
      // const v_kyc_completed_by_customer = v_kyc_link_status === "completed" ? "completed" : "pending";
      const v_kyc_completed_by_customer =
        response.data.v_kyc_link_status === 'completed' ? true : false;

      try {
        console.log('Event: Updating order with v-kyc details', { orderId });
        await this.orderService.updateOrder(childSpan, orderId, {
          v_kyc_link: response.data.capture_link, // v-KYC link from response
          v_kyc_link_expires: new Date(
            response.data.capture_expires_at,
          ).toISOString(), // Convert expiration time to Date
          v_kyc_status: 'pending', // Set the status as active
          v_kyc_link_status: 'active',
          v_kyc_completed_by_customer,
          v_kyc_reference_id: currentOrderId, // Updated reference ID
          v_kyc_profile_id: response.data.profile_id, // Profile ID from response
          is_video_kyc_link_regenerated, // true if attemptNumber > 1
          is_video_kyc_link_regenerated_details, // Array of previous VKYC records
        });

        this.logger.log(`updated order ${orderId} with v-kyc details`);
        console.log('Event: Order updated with v-kyc details', { orderId });
      } catch (error) {
        childSpan.log({ event: 'error', message: error.message });
        this.logger.error(
          `Failed to update order ${orderId} with v-kyc details: ${error.message}`,
          error.stack,
        );
        console.log('Event: Failed to update order', {
          orderId,
          error: error.message,
        });
        throw new HttpException(
          {
            success: false,
            message: error.message,
            details: 'Failed to update order with v-kyc details',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        childSpan.finish();
      }

      // ✅ **Return Response in the Expected Format**
      return {
        success: true,
        message: 'v-KYC link generated successfully',
        v_kyc_link: response.data?.capture_link || null,
        v_kyc_link_status: response.data?.status || 'capture_pending',
        v_kyc_link_expires: response.data?.capture_expires_at || null,
        v_kyc_status: 'pending',
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order details: ${error.message}`,
        error.stack,
      );
      console.log('Event: Error fetching order details', {
        orderId,
        error: error.message,
      });

      if (error.response) {
        console.error('Error Response:', error.response.data);
      }

      throw new HttpException(
        {
          success: false,
          message: error.message,
          details: 'Failed to generate vkyc',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async handleEkycRetrieveWebhook(partner_order_id: string): Promise<any> {
    const token = process.env.API_KEY; // Fetch from .env
    if (!token || typeof token !== 'string') {
      throw new HttpException(
        'Invalid or missing API key in configuration',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!partner_order_id) {
      throw new HttpException(
        'Missing required field: partner_order_id',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(
      `Processing e-KYC retrieve webhook for partner_order_id: ${partner_order_id}`,
    );
    // Fetch order details including partner_id and esign_doc_id
    const order = await this.orderRepository.findOne({
      where: { partner_order_id },
      include: [{ model: Vkyc, as: 'vkycs' }],
    });

    if (!order) {
      this.logger.warn(
        `No order found for partner_order_id: ${partner_order_id}`,
      );
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const vkycRecords = order?.dataValues?.vkycs || [];

    if (!vkycRecords.length) {
      this.logger.warn(
        `No ESign records found for partner_order_id: ${partner_order_id}`,
      );
      throw new HttpException('No vkyc Records found', HttpStatus.NOT_FOUND);
    }
    // console.log(order)
    // console.log(order?.dataValues)
    const v_kyc_profile_id = order?.dataValues?.v_kyc_profile_id; // Adjust field name if different

    if (!v_kyc_profile_id) {
      this.logger.warn(
        `No v_kyc_profile_id found in order for partner_order_id: ${partner_order_id}`,
      );
      throw new HttpException(
        'v_kyc_profile_id not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Prepare request payload
    const requestData = { request_id: v_kyc_profile_id }; // Creating requestData object with profile_id

    const responseData = await this.retrieveVideokycData(requestData); // Call the function to retrieve data

    if (!responseData) {
      throw new HttpException(
        'Failed to retrieve VKYC data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Extract eSign URL from resources.documents if available (post-VKYC)
    // const v_kyc_link_status = responseData.status || 'pending';
    // Set v_kyc_link_status to 'completed' if present, otherwise 'pending'
    const v_kyc_link_status =
      responseData.status === 'completed' ? 'completed' : 'pending';
    const v_kyc_completed_by_customer =
      v_kyc_link_status === 'completed' ? 'completed' : 'pending';
    const esignDoc = responseData.resources?.documents?.find(
      (doc) => doc.type === 'profile_report',
    );
    const v_kyc_link = esignDoc ? esignDoc.value : null;

    // Map response data to vkycData, setting null for unavailable fields
    const vkycData = {
      reference_id: responseData.reference_id || null,
      profile_id: v_kyc_profile_id,
      v_kyc_status: v_kyc_completed_by_customer,
      v_kyc_link_status,
      v_kyc_comments: responseData.status_description?.comments || null,
      v_kyc_doc_completion_date: responseData.profile_data?.completed_at
        ? new Date(responseData.profile_data.completed_at)
        : null,
      device_info: responseData.device_info || null,
      profile_data: responseData.profile_data || null,
      performed_by: responseData.profile_data?.performed_by || null,
      resources_documents: responseData.resources?.documents || null,
      resources_images: responseData.resources?.images || null,
      resources_videos: responseData.resources?.videos || null,
      resources_text: responseData.resources?.text || null,
      location_info:
        responseData.resources?.text?.find((t) => t.attr === 'location')
          ?.value || null,
      reviewer_action: responseData.reviewer_action || null,
      tasks: responseData.tasks || null,
      status: responseData.status || null,
      status_description: responseData.status_description || null,
      status_detail: responseData.status_detail || null,
      v_kyc_completed_by_customer,
    };

    // Check if Vkyc already exists for the same profile_id
    const vkycRecord = await Vkyc.findOne({
      where: { profile_id: v_kyc_profile_id },
    });

    if (vkycRecord) {
      await vkycRecord.update(vkycData);
      this.logger.log(
        `Updated Vkyc record for profile_id: ${v_kyc_profile_id}`,
      );
    } else {
      await Vkyc.create(vkycData);
      this.logger.log(
        `Created new Vkyc record for profile_id: ${v_kyc_profile_id}`,
      );
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
      data: responseData,
    };
  }
  // Retrieve Video KYC data
  async retrieveVideokycData(requestData: any) {
    try {
      // Construct the URL with the request_id
      const url = `https://api.kyc.idfy.com/profiles/${requestData.request_id}`;

      // Make a GET request with the required headers
      const response = await axios.get(url, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
          // 'X-API-Key': token,
        },
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendVideokycRequestOld(
    token: string,
    referenceId: string,
  ): Promise<any> {
    try {
      const requestData: VideoKycRequestPayload = {
        reference_id: referenceId,
        config: {
          id: this.CONFIG_ID,
          overrides: {},
        },
        data: {
          addresses: [],
        },
      };

      const response = await axios.post<VideoKycResponseOld>(
        this.REQUEST_API_URL,
        requestData,
        {
          headers: {
            'api-key': this.API_KEY,
            'account-id': this.ACCOUNT_ID,
            'Content-Type': 'application/json',
            'X-API-Key': token,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get Task details for the given request ID
  async getTaskDetails(token: string, requestId: string) {
    try {
      if (!requestId) {
        throw new HttpException(
          'request_id is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await axios.get(
        `${this.REQUEST_TASK_API_URL}?request_id=${requestId}`,
        {
          headers: {
            'api-key': this.API_KEY,
            'account-id': this.ACCOUNT_ID,
            'Content-Type': 'application/json',
            'X-API-Key': token,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // General Error Handler
  private handleError(error: AxiosError) {
    const errorMessage =
      error.response?.data || 'An error occurred during the request';
    const statusCode =
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(errorMessage, statusCode);
  }
}
