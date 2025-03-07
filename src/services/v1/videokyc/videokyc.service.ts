import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VideokycService {

  private readonly REQUEST_API_URL = 'https://api.kyc.idfy.com/sync/profiles';
  private readonly REQUEST_TASK_API_URL = 'https://eve.idfy.com/v3/tasks';
  private readonly RETRIEVE_API_URL = 'https://eve.idfy.com/v3/tasks/sync/generate/esign_retrieve';

  private readonly API_KEY = 'fbb65739-9015-4d88-b2f5-5057e1b1f07e';
  private readonly ACCOUNT_ID = 'e1628d9a6e50/7afd3aae-730e-41ff-aa4c-0914ef4dbbe0';
  private readonly CONFIG_ID = 'c480f12f-c209-4d88-ad7c-c1c70a783149'

 async sendVideokycRequest(token: string, referenceId: string) {
    try {
      const requestData = {
        reference_id: referenceId,
        config: {
          id: this.CONFIG_ID,
          overrides: {}
        },
        data: {
          addresses: []
        }
      };

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
      throw new HttpException(
        error.response?.data || 'Failed to retrieve e-KYC data',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
