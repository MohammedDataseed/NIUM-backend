import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EkycService {
  private readonly REQUEST_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_document';
  private readonly REQUEST_TASK_API_URL = 'https://eve.idfy.com/v3/tasks';
  private readonly RETRIEVE_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';
  private readonly API_KEY = '67163d36-d269-11ef-b1ca-feecce57f827';
  private readonly ACCOUNT_ID = '9d956848da98/b5d7ded1-218b-4c63-97ea-71ba70f038d3';

  async sendEkycRequest(token: string, requestData: any) {
    try {
      const response = await axios.post(this.REQUEST_API_URL, requestData, {
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
        error.response?.data || 'Failed to send e-KYC request',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
