import { Inject,Injectable, HttpException, HttpStatus,Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as opentracing from 'opentracing';
import { Vkyc } from 'src/database/models/vkyc.model';
  import { OrdersService } from "../order/order.service";
  import { Order } from "src/database/models/order.model";

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
  success: boolean;  // Add this field
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
  private readonly RETRIEVE_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';

  // private readonly API_URL = process.env.VKYC_REQUEST_API_URL;  // Get from .env
  // private readonly API_KEY=process.env.VKYC_REQUEST_API_KEY
  // private readonly ACCOUNT_ID = process.env.VKYC_ACCOUNT_ID; // Get from .env
  private readonly CONFIG_ID = process.env.VKYC_CONFIG_ID; // Get from .env
    private readonly API_KEY = 'fbb65739-9015-4d88-b2f5-5057e1b1f07e';
  private readonly ACCOUNT_ID = 'e1628d9a6e50/7afd3aae-730e-41ff-aa4c-0914ef4dbbe0';
  private readonly logger = new Logger(VideokycService.name);

    constructor(
      @Inject('ORDER_REPOSITORY')
      private readonly orderRepository: typeof Order,
      @Inject('V_KYC_REPOSITORY')
      private readonly vkycRepository: typeof Vkyc,
      private readonly orderService: OrdersService,
    ) {} 

   // Send Video KYC request
   // Send Video KYC request
async sendVideokycRequest(token: string, orderId: string): Promise<any> {
  if (!token || typeof token !== "string") {
    console.log("Token Validation Failed:", { token, message: "Invalid or missing X-API-Key token" });
    throw new HttpException("Invalid or missing X-API-Key token", HttpStatus.BAD_REQUEST);
  }

  this.logger.log(`Processing v-KYC request for order: ${orderId}`);
  console.log("Event: Starting v-KYC request processing", { orderId });

  let orderDetails: any;
  let attemptNumber: number = 1; // Default to first-time attempt
  let currentOrderId: string;

  try {
   const span = opentracing.globalTracer().startSpan("fetch-order-details");
           console.log("Event: Fetching order details", { orderId, spanId: span.context().toSpanId() });
           orderDetails = await this.orderService.findOne(span, orderId);
           span.finish();
       
           if (!orderDetails) {
             console.log("Event: Order not found", { orderId });
             throw new HttpException(`Order not found: ${orderId}`, HttpStatus.NOT_FOUND);
           }
          //  console.log("order",orderDetails);
           

    // ✅ **Check if v-KYC is required** ✅
    if (!orderDetails.is_v_kyc_required) {
      console.log("Event: v-KYC not required, skipping request", { orderId });
      return { success: false, message: "v-KYC is not required for this order." };
    }

    // ✅ **Check how many times the v-KYC has been attempted** ✅
    const previousAttempts = await Vkyc.count({ where: { partner_order_id: orderId } });
    attemptNumber = previousAttempts + 1; // Increment attempt count

    // Log the attempt number
    console.log("Event: Storing v-KYC attempt", { orderId, attemptNumber });

    // Update the currentOrderId with the attempt number (e.g., orderId-1, orderId-2)
    // currentOrderId = `${orderId}-${attemptNumber}`;
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
currentOrderId = `${orderId}-${timestamp}`; // Append the timestamp to the original orderId
console.log("Event: Updated orderId for v-KYC", { currentOrderId });

    // Prepare the API request data
    const requestData = {
      reference_id: currentOrderId, // Use the updated orderId with attempt number
      config: {
        id: this.CONFIG_ID,
        overrides: {}
      },
      data: {
        name: {
          first_name: "Mohammed Tayibulla", // Populate with the actual name from the orderDetails if needed
        },
        dob: "" // Populate with actual date of birth if available
      },
      payload: {
        security_questions: [
          {
            question: "What is the State of your current Address?",
            answer: "Karnataka"
          },
          {
            question: "What is the City of your current Address?",
            answer: "Bengaluru"
          },
          {
            question: "What is the District of your current Address?",
            answer: "Bengaluru"
          }
        ]
      }
    };

    
    // Log the request data before sending the request
    console.log("Event: API Request Data", JSON.stringify(requestData, null, 2));

 // **Step 1: Make v-KYC request first**
 let responseData: any;
     const response = await axios.post(this.REQUEST_API_URL, requestData, {
              headers: {
                "api-key": this.API_KEY,
                "account-id": this.ACCOUNT_ID,
                "Content-Type": "application/json",
                // "X-API-Key": token,
              },
            });
            responseData = response.data;
            console.log("Success Response:", JSON.stringify(responseData, null, 2)); // Log to verify
// Log the response after receiving it
console.log("Event: API Response", JSON.stringify(response.data, null, 2));

    console.log("Event: v-KYC request sent successfully", { orderId, response: response.data });

    // ✅ **Store the successful v-KYC response in the database** ✅
    // const vkycData = {
    //   partner_order_id: orderId,
    //   reference_id: currentOrderId, // store updated orderId
    //   profile_id: response.data.profile_id,
    //   v_kyc_link: response.data.capture_link,
    //   v_kyc_link_expires: new Date(response.data.capture_expires_at), // Convert to Date
    //   v_kyc_link_status: "active" ,
    //   order_id: orderDetails.id,  // Ensure this is passed correctly
    //   attempt_number: attemptNumber,
    // };
    const vkycData = {
      partner_order_id: orderId,  // The partner's order ID
      reference_id: currentOrderId,  // Updated order ID
      profile_id: response.data.profile_id,  // Profile ID from response
      v_kyc_link: response.data.capture_link,  // v-KYC link from response
      v_kyc_link_expires: new Date(response.data.capture_expires_at),  // Convert expiration time to Date
      v_kyc_link_status: "active",  // Set the status as active
      order_id: orderDetails.id,  // Ensure the correct order ID from orderDetails
      attempt_number: attemptNumber,  // The attempt number for the request
      created_by: orderDetails.partner_id,  // Use created_by from orderDetails
      updated_by: orderDetails.partner_id,  // Use updated_by from orderDetails
    };

    // Save to vkycs table
    await Vkyc.create(vkycData);
    console.log("Event: v-KYC data stored successfully", { orderId, vkycData });

    // return { success: true, message: "v-KYC request successfully processed", data: response.data };
  } catch (error) {
    this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
    console.log("Event: Error fetching order details", { orderId, error: error.message });

    if (error.response) {
      // Handle specific response errors (like 404)
      console.error("Error Response:", error.response.data);
    }

    throw new HttpException(
      { success: false, message: "Failed to generate vkyc", details: error.message },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}


  async sendVideokycRequestOld(token: string, referenceId: string): Promise<any> {
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

      const response = await axios.post<VideoKycResponseOld>(this.REQUEST_API_URL, requestData, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
          'X-API-Key': token,
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get Task details for the given request ID
  async getTaskDetails(token: string, requestId: string) {
    try {
      if (!requestId) {
        throw new HttpException('request_id is required', HttpStatus.BAD_REQUEST);
      }

      const response = await axios.get(`${this.REQUEST_TASK_API_URL}?request_id=${requestId}`, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
          'X-API-Key': token,
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Retrieve Video KYC data
  async retrieveVideokycData(token: string, requestData: any) {
    try {
      const response = await axios.post(this.RETRIEVE_API_URL, requestData, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
          'X-API-Key': token,
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // General Error Handler
  private handleError(error: AxiosError) {
    const errorMessage = error.response?.data || 'An error occurred during the request';
    const statusCode = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(errorMessage, statusCode);
  }
}
