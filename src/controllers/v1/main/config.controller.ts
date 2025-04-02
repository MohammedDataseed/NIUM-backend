import {
  Controller,
  Get,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PurposeService } from '../../../services/v1/purpose/purpose.service';
import { DocumentTypeService } from '../../../services/v1/document/documentType.service';
import { transaction_typeService } from '../../../services/v1/transaction/transaction_type.service';
import { OrdersService } from '../../../services/v1/order/order.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import * as opentracing from 'opentracing';

@ApiTags('Config') // Groups API under "Config" in Swagger UI
@Controller('config')
export class ConfigController {
  constructor(
    private readonly purposeService: PurposeService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly transactionTypeService: transaction_typeService, // Fixed naming convention
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch configuration details by type',
    description:
      'Retrieve details for purpose types, document types, or transaction types using a query parameter.',
  })
  @ApiQuery({
    name: 'type',
    enum: ['purpose_type', 'document_type', 'transaction_type'],
    required: true,
    description: 'The type of configuration data to retrieve.',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration details retrieved successfully.',
    schema: { example: [{ hashed_key: 'a1b2c3d4', purposeName: 'Business' }] },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid type provided. Allowed values: purpose_type, document_type, transaction_type',
  })
  async getConfigDetails(
    @Headers('api_key') apiKey: string,
    @Headers('partner_id') partnerId: string,
    @Query('type') type: string,
  ): Promise<any> {
    if (!type) {
      throw new BadRequestException('Type parameter is required');
    }

    // Start OpenTracing span
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('get-master-details');

    try {
      // Validate partner headers using OrdersService
      await this.ordersService.validatePartnerHeaders(partnerId, apiKey);

      switch (type.toLowerCase()) {
        case 'purpose_type':
          return this.purposeService.findAllConfig();
        case 'document_type':
          return this.documentTypeService.findAllConfig();
        case 'transaction_type':
          return this.transactionTypeService.findAllConfig();
        default:
          throw new BadRequestException(
            'Invalid type provided. Allowed values: purpose_type, document_type, transaction_type',
          );
      }
    } catch (error) {
      throw error;
    } finally {
      span.finish();
    }
  }
}
