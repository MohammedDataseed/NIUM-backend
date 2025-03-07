// videokyc.controller.ts
import { Controller, Post, Get, Body, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { VideokycService } from '../../../../services/v1/videokyc/videokyc.service';
import { ApiTags, ApiOperation, ApiProperty, ApiHeader, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AddressDto, SyncProfileDto } from 'src/dto/video-kyc.dto';

@ApiTags('V-KYC')
@Controller('videokyc')
export class VideokycController {
  constructor(private readonly videokycService: VideokycService) {}

@Post('sync-profiles')
@ApiOperation({ 
  summary: 'Sync profile data for video KYC',
  description: 'Creates or updates a profile with address information for video KYC verification'
})
@ApiHeader({
  name: 'X-API-Key',
  description: 'API authentication token',
  required: true,
})
@ApiBody({ 
  type: SyncProfileDto,
  description: 'Profile reference ID'
})
@ApiResponse({ 
  status: 201, 
  description: 'Profile successfully synced',
  type: Object,
  schema: {
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'object' }
    }
  }
})
@ApiResponse({ 
  status: 401, 
  description: 'Unauthorized - Missing or invalid X-API-Key'
})
@ApiResponse({ 
  status: 500, 
  description: 'Internal server error'
})
async syncProfiles(
  @Headers('X-API-Key') token: string,
  @Body() requestData: SyncProfileDto,
) {
  try {
    if (!token) {
      throw new HttpException('X-API-Key header is required', HttpStatus.UNAUTHORIZED);
    }
    
    // Extract just the reference_id from the DTO
    const result = await this.videokycService.sendVideokycRequest(token, requestData.reference_id);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw error instanceof HttpException 
      ? error 
      : new HttpException(
          'Failed to process sync profiles request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
  }
}

  @Get('task-details')
  @ApiOperation({ 
    summary: 'Get task details',
    description: 'Retrieves details of a specific KYC task by request ID'
  })
  @ApiHeader({
    name: 'X-API-Key',
    description: 'API authentication token',
    required: true,
  })
  @ApiQuery({
    name: 'request_id',
    required: true,
    description: 'Unique identifier of the KYC request',
    type: String,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task details retrieved successfully',
    type: Object,
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Missing request_id'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Missing or invalid X-API-Key'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async getTaskDetails(
    @Headers('X-API-Key') token: string,
    @Query('request_id') requestId: string,
  ) {
    try {
      if (!token) {
        throw new HttpException('X-API-Key header is required', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.videokycService.getTaskDetails(token, requestId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error instanceof HttpException 
        ? error 
        : new HttpException(
            'Failed to retrieve task details',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }

  @Post('retrieve')
  @ApiOperation({ 
    summary: 'Retrieve video KYC data',
    description: 'Retrieves completed video KYC verification data'
  })
  @ApiHeader({
    name: 'X-API-Key',
    description: 'API authentication token',
    required: true,
  })
  @ApiBody({ 
    type: Object,
    description: 'Request data containing request_id and other required fields',
    schema: {
      properties: {
        request_id: { type: 'string', example: '12345' }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'KYC data retrieved successfully',
    type: Object,
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Missing or invalid X-API-Key'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async retrieveVideokyc(
    @Headers('X-API-Key') token: string,
    @Body() requestData: any,
  ) {
    try {
      if (!token) {
        throw new HttpException('X-API-Key header is required', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.videokycService.retrieveVideokycData(token, requestData);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error instanceof HttpException 
        ? error 
        : new HttpException(
            'Failed to retrieve video KYC data',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }
}