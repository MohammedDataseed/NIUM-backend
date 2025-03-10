import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PurposeService } from '../../../services/v1/purpose/purpose.service';
import { DocumentTypeService } from '../../../services/v1/document/documentType.service';
import { TransactionTypeService } from '../../../services/v1/transaction/transactionType.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Config') // This groups the API under "Config" in Swagger UI
@Controller('config')
export class ConfigController {
  constructor(
    private readonly purposeService: PurposeService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly transactionTypeService: TransactionTypeService,
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
    schema: { example: [{ publicKey: 'a1b2c3d4', purposeName: 'Business' }] },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid type provided. Allowed values: purpose_type, document_type, transaction_type',
  })
  async getConfigDetails(@Query('type') type: string): Promise<any> {
    if (!type) {
      throw new BadRequestException('Type parameter is required');
    }

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
  }
}
