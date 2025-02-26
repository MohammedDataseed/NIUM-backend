import { Controller, Get,Post, Body, Headers ,Query} from '@nestjs/common';
import { EkycService } from '../../../../services/v1/ekyc/ekyc.service';
import { ApiTags, ApiOperation, ApiHeader, ApiBody,ApiQuery,ApiResponse } from '@nestjs/swagger';
import { EkycRequestDto,EkycRetrieveRequestDto } from 'src/dto/ekyc-request.dto';

@ApiTags('E-KYC')
@Controller('ekyc')
export class EkycController {
  constructor(private readonly ekycService: EkycService) {}

  @Post('request')
  @ApiOperation({ summary: 'Send an e-KYC request to IDfy' })
  @ApiHeader({ name: 'X-API-Key', description: 'Authentication token', required: true })
  @ApiBody({ type: EkycRequestDto })
  async sendEkyc(
    @Headers('X-API-Key') token: string,
    @Body() requestData: EkycRequestDto,
  ) {
    return this.ekycService.sendEkycRequest(token, requestData);
  }


  @Get('tasks')
  @ApiOperation({ summary: 'Retrieve task details from IDfy' })
  @ApiHeader({ name: 'X-API-Key', description: 'Authentication token', required: true })
  @ApiQuery({ name: 'request_id', description: 'Request ID to fetch task details', required: true })
  @ApiResponse({ status: 200, description: 'Task details retrieved successfully'})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTaskDetails(
    @Headers('X-API-Key') token: string,
    @Query('request_id') requestId: string,
  ) {
    return this.ekycService.getTaskDetails(token, requestId);
  }


  @Post('retrieve')
  @ApiOperation({ summary: 'Retrieve e-KYC data from IDfy' })
  @ApiHeader({ name: 'X-API-Key', description: 'Authentication token', required: true })
  @ApiBody({ type: EkycRetrieveRequestDto })
  async retrieveEkyc(
    @Headers('X-API-Key') token: string,
    @Body() requestData: EkycRetrieveRequestDto,
  ) {
    return this.ekycService.retrieveEkycData(token, requestData);
  }
}
