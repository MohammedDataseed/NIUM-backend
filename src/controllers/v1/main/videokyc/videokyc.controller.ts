// videokyc.controller.ts
import {
  HttpException,
  HttpStatus,
  Logger,
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Headers,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from '../../../../services/v1/order/order.service';
import * as opentracing from 'opentracing';

import { VideokycService } from '../../../../services/v1/videokyc/videokyc.service';
import {
  ApiTags,
  ApiOperation,
  ApiProperty,
  ApiHeader,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AddressDto,
  SyncProfileDto,
  VkycResourcesDto,
} from 'src/dto/video-kyc.dto';

@ApiTags('V-KYC')
@Controller('videokyc')
export class VideokycController {
  private readonly logger = new Logger(VideokycService.name);

  constructor(
    private readonly videokycService: VideokycService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('generate-v-kyc')
  @ApiOperation({ summary: 'Send an v-kyc request to IDfy' })
  @ApiBody({
    schema: {
      properties: {
        partner_order_id: { type: 'string', example: 'BMFORDERID001' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully synced',
    type: Object,
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid X-API-Key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async generateVkyc(
    @Headers('api_key') apiKey: string,
    @Headers('partner_id') partnerId: string,
    @Body(
      'partner_order_id',
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    partner_order_id: string,
  ) {
    // try {
    if (!partner_order_id) {
      throw new HttpException(
        'Missing required partner_order_id in request data',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(`Processing V-KYC request for order: ${partner_order_id}`);

    const span = opentracing
      .globalTracer()
      .startSpan('find-one-order-controller');
    try {
      // return this.ekycService.sendEkycRequest(partner_order_id);
      await this.ordersService.validatePartnerHeaders(partnerId, apiKey);

      const result =
        await this.videokycService.sendVideokycRequest(partner_order_id);
      return {
        success: true,
        data: result,
      };

      // // If response is successful, transform the output
      // if (response.success) {
      //   return {
      //     success: true,
      //     message: "V-KYC link generated successfully",
      //     e_sign_link:
      //       response.data?.result?.source_output?.esign_details?.find(
      //         (esign) => esign.url_status === true
      //       )?.esign_url || null,
      //     e_sign_link_status:
      //       response.data?.result?.source_output?.esign_details?.some(
      //         (esign) => esign.url_status === true
      //       )
      //         ? "active"
      //         : "inactive",
      //     e_sign_link_expires:
      //       response.data?.result?.source_output?.esign_details?.find(
      //         (esign) => esign.url_status === true
      //       )?.esign_expiry || null,
      //     e_sign_status: "pending",
      //   };
      // }

      // // If response is unsuccessful, return the original response
      // return response;
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }

  //   } catch (error) {
  //     throw error instanceof HttpException
  //       ? error
  //       : new HttpException(
  //           "Failed to process sync profiles request",
  //           HttpStatus.INTERNAL_SERVER_ERROR
  //         );
  //   }
  // }

  @Post('retrieve-webhook')
  @ApiOperation({ summary: 'Retrieve V-KYC data via webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async retrieveEkycWebhook(
    @Query('partner_order_id') partner_order_id: string,
  ) {
    try {
      return await this.videokycService.handleEkycRetrieveWebhook(
        partner_order_id,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('sync-profiles')
  @ApiOperation({
    summary: 'Sync profile data for video KYC',
    description:
      'Creates or updates a profile with address information for video KYC verification',
  })
  @ApiHeader({
    name: 'X-API-Key',
    description: 'API authentication token',
    required: true,
  })
  @ApiBody({
    type: SyncProfileDto,
    description: 'Profile reference ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully synced',
    type: Object,
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid X-API-Key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async syncProfiles(
    @Headers('X-API-Key') token: string,
    @Body() requestData: SyncProfileDto,
  ) {
    try {
      if (!token) {
        throw new HttpException(
          'X-API-Key header is required',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Extract just the reference_id from the DTO
      const result = await this.videokycService.sendVideokycRequest(
        requestData.reference_id,
      );
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
    description: 'Retrieves details of a specific KYC task by request ID',
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
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing request_id',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid X-API-Key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getTaskDetails(
    @Headers('X-API-Key') token: string,
    @Query('request_id') requestId: string,
  ) {
    try {
      if (!token) {
        throw new HttpException(
          'X-API-Key header is required',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.videokycService.getTaskDetails(
        token,
        requestId,
      );
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

  @Get('retrieve/:profile_id')
  @ApiOperation({
    summary: 'Retrieve video KYC data',
    description: 'Retrieves completed video KYC verification data',
  })
  @ApiHeader({
    name: 'X-API-Key',
    description: 'API authentication token',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'KYC data retrieved successfully',
    type: Object,
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid X-API-Key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async retrieveVideokyc(
    @Headers('X-API-Key') token: string,
    @Param('profile_id') profileId: string, // Accept profile_id as a URL parameter
  ) {
    try {
      // if (!token) {
      //   throw new HttpException('X-API-Key header is required', HttpStatus.UNAUTHORIZED);
      // }

      // Pass the profile_id as part of the request data
      const requestData = { request_id: profileId }; // Creating requestData object with profile_id

      const result =
        await this.videokycService.retrieveVideokycData(requestData);
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

  // @Post('upload-resources')
  //   @ApiOperation({ summary: 'Upload VKYC resources to S3' })
  //   @ApiBody({ type: VkycResourcesDto, description: 'VKYC resources to upload' })
  //   @ApiResponse({ status: 201, description: 'Resources uploaded successfully' })
  //   @ApiResponse({ status: 400, description: 'Invalid input' })
  //   @ApiResponse({ status: 500, description: 'Server error' })
  //   async uploadVkycResources(@Body() resources: VkycResourcesDto) {
  //     try {
  //       // Validate input
  //       if (!resources || typeof resources !== 'object') {
  //         throw new HttpException(
  //           'Invalid or missing resources in request body',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       // Basic structure validation
  //       if (!resources.documents && !resources.images && !resources.videos) {
  //         throw new HttpException(
  //           'At least one of documents, images, or videos must be provided',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       // Process and upload VKYC files
  //       const uploadedFiles = await this.videokycService.processAndUploadVKYCFiles(resources);

  //       // Return success response with uploaded file paths
  //       return {
  //         success: true,
  //         message: 'VKYC resources uploaded successfully',
  //         data: uploadedFiles,
  //       };
  //     } catch (error) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           message: error.message || 'Failed to upload VKYC resources',
  //           details: error.stack || 'Unknown error',
  //         },
  //         error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  @Post('upload-resources')
  @ApiOperation({ summary: 'Upload VKYC resources to S3' })
  @ApiBody({ type: VkycResourcesDto, description: 'VKYC resources to upload' })
  @ApiResponse({ status: 201, description: 'Resources uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async uploadVkycResources(@Body() resources: VkycResourcesDto) {
    try {
      // Validate input
      if (
        !resources ||
        typeof resources !== 'object' ||
        !resources.partner_order_id
      ) {
        throw new HttpException(
          'Invalid input: partner_order_id is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Construct path string
      const pathString = `${resources.partner_order_id}/vkyc_documents`;

      // Process and upload VKYC files
      const uploadedFiles =
        await this.videokycService.processAndUploadVKYCFiles(
          resources,
          pathString,
        );

      // Return success response with uploaded file paths
      return {
        success: true,
        message: 'VKYC resources uploaded successfully',
        data: uploadedFiles,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to upload VKYC resources',
          details: error.stack || 'Unknown error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
