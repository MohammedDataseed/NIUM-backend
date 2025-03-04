import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

// Define interfaces for the API response structure
interface EkycApiResponse {
  action: string;
  completed_at: string;
  created_at: string;
  group_id: string;
  request_id: string;
  status: 'completed' | 'failed';
  task_id: string;
  type: string;
  result?: {
    source_output: {
      esign_details: Array<{
        esign_expiry: string | null;
        esign_url: string | null;
        esigner_email: string | null;
        esigner_name: string | null;
        esigner_phone: string | null;
        url_status: boolean;
      }>;
      esign_doc_id: string;
      esigner_details: any | null;
      status: 'Success' | string;
    };
  };
  error?: string; // Present in error responses
  message?: string; // Present in error responses
}

@Injectable()
export class EkycService {
  private readonly REQUEST_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_document';
  private readonly REQUEST_TASK_API_URL = 'https://eve.idfy.com/v3/tasks';
  private readonly RETRIEVE_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';
  private readonly API_KEY = '67163d36-d269-11ef-b1ca-feecce57f827';
  private readonly ACCOUNT_ID = '9d956848da98/b5d7ded1-218b-4c63-97ea-71ba70f038d3';
  private readonly logger = new Logger(EkycService.name);

  // Existing convertUrlsToBase64 method (unchanged)
  async convertUrlsToBase64(urls: string[]): Promise<any> {
    const results = [];
    const errors = [];

    await Promise.all(
      urls.map(async (url, index) => {
        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data);
          const base64 = buffer.toString('base64');
          
          results.push({
            url,
            base64,
            mimeType: response.headers['content-type'] || 'application/octet-stream',
          });
          this.logger.log(`Converted ${url} to Base64 successfully`);
        } catch (error) {
          const errorMessage = error.message || 'Unknown error';
          errors.push({ url, error: `Failed to process URL: ${errorMessage}` });
          this.logger.error(`Error converting ${url}: ${errorMessage}`, error.stack);
        }
      }),
    );

    if (errors.length === urls.length) {
      throw new HttpException(
        {
          success: false,
          message: 'All URL conversions failed',
          details: errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      message: 'URLs processed successfully',
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async sendEkycRequest(token: string, requestData: any): Promise<any> {
    if (!token || typeof token !== 'string') {
      throw new HttpException(
        'Invalid or missing X-API-Key token',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!requestData || typeof requestData !== 'object') {
      throw new HttpException(
        'Request data must be a valid JSON object',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!requestData.data?.esign_file_details?.esign_file) {
      throw new HttpException(
        'Missing required esign_file in request data',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if esign_file is a URL and convert it to Base64 if needed
    let esignFile = requestData.data.esign_file_details.esign_file;
    if (typeof esignFile === 'string' && esignFile.startsWith('http')) {
      this.logger.log(`Detected URL in esign_file: ${esignFile}. Converting to Base64...`);
      const conversionResult = await this.convertUrlsToBase64([esignFile]);
      
      if (!conversionResult.success || conversionResult.data.length === 0) {
        throw new HttpException(
          {
            success: false,
            message: 'Failed to convert URL to Base64',
            details: conversionResult.errors,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Replace the URL with the Base64 string in the request data
      esignFile = conversionResult.data[0].base64;
      requestData.data.esign_file_details.esign_file = esignFile;
    }

    try {
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
        headers: {
          'api-key': this.API_KEY,
          'account-id': this.ACCOUNT_ID,
          'Content-Type': 'application/json',
          'X-API-Key': token,
        },
      });

      const responseData = response.data as EkycApiResponse;
      if (responseData.status === 'completed' && responseData.result?.source_output?.status === 'Success') {
        this.logger.log(`e-KYC request succeeded: ${responseData.request_id}`);
        return {
          success: true,
          data: responseData,
          message: 'e-KYC document generation completed successfully',
        };
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Error in sendEkycRequest: ${axiosError.message}`, axiosError.stack);

      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const apiResponse = data as EkycApiResponse;
        const apiMessage = apiResponse.message || 'Unknown error';
        let errorMessage = 'Failed to generate e-KYC document';

        if (status === HttpStatus.BAD_REQUEST) {
          if (apiMessage.includes('Base64')) {
            errorMessage = 'Invalid Base64 PDF data provided';
          } else if (apiMessage.includes('Malformed Request')) {
            errorMessage = 'Malformed request: Check JSON structure or required fields';
          } else {
            errorMessage = apiMessage;
          }
        } else if (status === HttpStatus.UNAUTHORIZED) {
          errorMessage = 'Invalid or expired X-API-Key token';
        } else if (status === HttpStatus.FORBIDDEN) {
          errorMessage = 'Access denied: Check API key or account permissions';
        } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
          errorMessage = 'e-KYC service encountered an internal error';
        }

        throw new HttpException(
          {
            success: false,
            message: errorMessage,
            details: apiResponse,
            request_id: apiResponse.request_id,
          },
          status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: axiosError.request
            ? 'Network error: Unable to reach e-KYC service'
            : 'An unexpected error occurred',
          details: axiosError.message,
        },
        axiosError.request ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  // async convertUrlsToBase64(urls: string[]): Promise<any> {
  //   const results = [];
  //   const errors = [];

  //   // Process URLs concurrently with Promise.all
  //   await Promise.all(
  //     urls.map(async (url, index) => {
  //       try {
  //         // Fetch file as a buffer
  //         const response = await axios.get(url, { responseType: 'arraybuffer' });
  //         const buffer = Buffer.from(response.data);
          
  //         // Convert buffer to Base64
  //         const base64 = buffer.toString('base64');
          
  //         results.push({
  //           url,
  //           base64,
  //           mimeType: response.headers['content-type'] || 'application/octet-stream',
  //         });
  //         this.logger.log(`Converted ${url} to Base64 successfully`);
  //       } catch (error) {
  //         const errorMessage = error.message || 'Unknown error';
  //         errors.push({ url, error: `Failed to process URL: ${errorMessage}` });
  //         this.logger.error(`Error converting ${url}: ${errorMessage}`, error.stack);
  //       }
  //     }),
  //   );

  //   if (errors.length === urls.length) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: 'All URL conversions failed',
  //         details: errors,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return {
  //     success: true,
  //     message: 'URLs processed successfully',
  //     data: results,
  //     errors: errors.length > 0 ? errors : undefined,
  //   };
  // }

  // async sendEkycRequest(token: string, requestData: any): Promise<any> {
  //   if (!token || typeof token !== 'string') {
  //     throw new HttpException(
  //       'Invalid or missing X-API-Key token',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   if (!requestData || typeof requestData !== 'object') {
  //     throw new HttpException(
  //       'Request data must be a valid JSON object',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   if (!requestData.data?.esign_file_details?.esign_file) {
  //     throw new HttpException(
  //       'Missing required esign_file in request data',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   try {
  //     const response = await axios.post(this.REQUEST_API_URL, requestData, {
  //       headers: {
  //         'api-key': this.API_KEY,
  //         'account-id': this.ACCOUNT_ID,
  //         'Content-Type': 'application/json',
  //         'X-API-Key': token,
  //       },
  //     });

  //     const responseData = response.data as EkycApiResponse;
  //     if (responseData.status === 'completed' && responseData.result?.source_output?.status === 'Success') {
  //       this.logger.log(`e-KYC request succeeded: ${responseData.request_id}`);
  //       return {
  //         success: true,
  //         data: responseData,
  //         message: 'e-KYC document generation completed successfully',
  //       };
  //     } else {
  //       throw new Error('Unexpected response status');
  //     }
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     this.logger.error(`Error in sendEkycRequest: ${axiosError.message}`, axiosError.stack);

  //     if (axiosError.response) {
  //       const { status, data } = axiosError.response;
  //       const apiResponse = data as EkycApiResponse; // Type the response data
  //       const apiMessage = apiResponse.message || 'Unknown error';
  //       let errorMessage = 'Failed to generate e-KYC document';

  //       if (status === HttpStatus.BAD_REQUEST) {
  //         if (apiMessage.includes('Base64')) {
  //           errorMessage = 'Invalid Base64 PDF data provided';
  //         } else if (apiMessage.includes('Malformed Request')) {
  //           errorMessage = 'Malformed request: Check JSON structure or required fields';
  //         } else {
  //           errorMessage = apiMessage;
  //         }
  //       } else if (status === HttpStatus.UNAUTHORIZED) {
  //         errorMessage = 'Invalid or expired X-API-Key token';
  //       } else if (status === HttpStatus.FORBIDDEN) {
  //         errorMessage = 'Access denied: Check API key or account permissions';
  //       } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
  //         errorMessage = 'e-KYC service encountered an internal error';
  //       }

  //       throw new HttpException(
  //         {
  //           success: false,
  //           message: errorMessage,
  //           details: apiResponse,
  //           request_id: apiResponse.request_id,
  //         },
  //         status || HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: axiosError.request
  //           ? 'Network error: Unable to reach e-KYC service'
  //           : 'An unexpected error occurred',
  //         details: axiosError.message,
  //       },
  //       axiosError.request ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }


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
      throw new HttpException(
        error.response?.data || 'Failed to retrieve task details',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retrieveEkycData(token: string, requestData: any) {
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
      throw new HttpException(
        error.response?.data || 'Failed to retrieve e-KYC data',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
