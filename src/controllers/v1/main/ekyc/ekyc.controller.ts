import { HttpException, HttpStatus,Controller, Get,Post, Body, Headers ,Query} from '@nestjs/common';
import { EkycService } from '../../../../services/v1/ekyc/ekyc.service';
import { ApiTags, ApiOperation,ApiProperty, ApiHeader, ApiBody,ApiQuery,ApiResponse } from '@nestjs/swagger';
import { EkycRequestDto,EkycRetrieveRequestDto } from 'src/dto/ekyc-request.dto';


// DTO for request body
export class ConvertUrlsToBase64Dto {
  @ApiProperty({
    description: 'Array of file URLs to convert to Base64',
    type: [String],
    example: [
      'https://example.com/file1.pdf',
      'https://example.com/file2.jpg',
    ],
  })
  urls: string[];
}

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



  @Post('convert-urls-to-base64')
  @ApiOperation({
    summary: 'Convert multiple file URLs to Base64',
    description: 'Accepts an array of URLs, fetches the files, and returns their Base64-encoded content.',
  })
  @ApiBody({
    description: 'Array of URLs to convert',
    type: ConvertUrlsToBase64Dto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully converted URLs to Base64',
    schema: {
      example: {
        success: true,
        message: 'URLs processed successfully',
        data: [
          {
            url: 'https://example.com/file1.pdf',
            base64: 'JVBERi0xLjQKJb...==',
            mimeType: 'application/pdf',
          },
          {
            url: 'https://example.com/file2.jpg',
            base64: '/9j/4AAQSkZJRg...==',
            mimeType: 'image/jpeg',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input provided',
    schema: {
      example: {
        success: false,
        message: 'URLs must be a non-empty array',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error occurred',
    schema: {
      example: {
        success: false,
        message: 'An unexpected error occurred',
        details: 'Error details here',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  async convertUrlsToBase64(@Body() body: ConvertUrlsToBase64Dto) {
    if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
      throw new HttpException('URLs must be a non-empty array', HttpStatus.BAD_REQUEST);
    }
    return this.ekycService.convertUrlsToBase64(body.urls);
  }
  // @Post('convert-urls-to-base64')
  // async convertUrlsToBase64(@Body() body: { urls: string[] }) {
  //   if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
  //     throw new HttpException('URLs must be a non-empty array', HttpStatus.BAD_REQUEST);
  //   }
  //   return this.ekycService.convertUrlsToBase64(body.urls);
  // }
}
