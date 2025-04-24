import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { TransactionTypeService } from '../../services/transaction/transaction-type.service';
import { transaction_type } from '../../../database/models/transaction_type.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import {
  Createtransaction_typeDto,
  Updatetransaction_typeDto,
} from '../../../dto/transaction_type.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('transaction_type')
@Controller('transaction_type')
@ApiBearerAuth('access_token')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() params: Record<string, any>,
  ): Promise<Array<{ transaction_type_id: string; transaction_name: string }>> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-transaction-types-request');

    try {
      const whereCondition: WhereOptions<transaction_type> =
        params as WhereOptions<transaction_type>;
      const transaction_type = await this.transactionTypeService.findAll(
        span,
        whereCondition,
      );

      return transaction_type.map((doc) => ({
        transaction_type_id: doc.hashed_key, // Return masked key instead of UUID
        transaction_name: doc.name,
      }));
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new transaction type' })
  @ApiResponse({
    status: 201,
    description: 'The transaction type has been successfully created.',
    type: transaction_type,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async createtransaction_type(
    @Body() createtransaction_typeDto: Createtransaction_typeDto,
  ): Promise<{ transaction_type_id: string; transaction_name: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-transaction-type-request');

    try {
      const newTransaction =
        await this.transactionTypeService.createtransaction_type(
          span,
          createtransaction_typeDto,
        );
      return {
        transaction_type_id: newTransaction.hashed_key,
        transaction_name: newTransaction.name,
      };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Put(':transaction_type_id')
  @ApiOperation({ summary: 'Update a transaction type' })
  @ApiResponse({
    status: 200,
    description: 'Transaction Type updated successfully.',
    type: transaction_type,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  @ApiResponse({ status: 404, description: 'Transaction Type not found.' })
  @ApiBody({ type: Updatetransaction_typeDto })
  async update(
    @Param('transaction_type_id') transaction_type_id: string,
    @Body() updatetransaction_typeDto: Updatetransaction_typeDto,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-transaction-type-request');

    try {
      await this.transactionTypeService.updatetransaction_type(
        span,
        transaction_type_id,
        updatetransaction_typeDto,
      );
      return { message: 'Purpose Type updated successfully' };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':transaction_type_id')
  @ApiOperation({ summary: 'Delete a Transaction type' })
  @ApiResponse({
    status: 200,
    description: 'Transaction Type deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Transaction Type not found.' })
  async delete(
    @Param('transaction_type_id') transaction_type_id: string,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-transaction-type-request');

    try {
      await this.transactionTypeService.deletetransaction_type(
        span,
        transaction_type_id,
      );
      return { message: 'Transaction Type deleted successfully' };
    } finally {
      span.finish();
    }
  }
}
