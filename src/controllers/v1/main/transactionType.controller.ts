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
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionTypeService } from '../../../services/v1/transaction/transactionType.service';
import { TransactionType } from '../../../database/models/transactionType.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import {
  CreateTransactionTypeDto,
  UpdateTransactionTypeDto,
} from 'src/dto/transactionType.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('TransactionType')
@Controller('TransactionType')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  // @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() params: Record<string, any>,
  ): Promise<{ transaction_type_id: string; transaction_name: string }[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-transaction-types-request');

    try {
      const whereCondition: WhereOptions<TransactionType> =
        params as WhereOptions<TransactionType>;
      const transactionType = await this.transactionTypeService.findAll(
        span,
        whereCondition,
      );

      return transactionType.map((doc) => ({
        transaction_type_id: doc.publicKey, // Return masked key instead of UUID
        transaction_name: doc.name,
      }));
    } finally {
      span.finish();
    }
  }

  // @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new transaction type' })
  @ApiResponse({
    status: 201,
    description: 'The transaction type has been successfully created.',
    type: TransactionType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async createTransactionType(
    @Body() createTransactionTypeDto: CreateTransactionTypeDto,
  ): Promise<{ transaction_type_id: string; transaction_name: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-transaction-type-request');

    try {
      const newTransaction =
        await this.transactionTypeService.createTransactionType(
          span,
          createTransactionTypeDto,
        );
      return {
        transaction_type_id: newTransaction.publicKey,
        transaction_name: newTransaction.name,
      };
    } finally {
      span.finish();
    }
  }

  // @UseGuards(JwtGuard)
  @Put(':transaction_type_id')
  @ApiOperation({ summary: 'Update a transaction type' })
  @ApiResponse({
    status: 200,
    description: 'Transaction Type updated successfully.',
    type: TransactionType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  @ApiResponse({ status: 404, description: 'Transaction Type not found.' })
  @ApiBody({ type: UpdateTransactionTypeDto })
  async update(
    @Param('transaction_type_id') transaction_type_id: string,
    @Body() updateTransactionTypeDto: UpdateTransactionTypeDto,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-transaction-type-request');

    try {
      await this.transactionTypeService.updateTransactionType(
        span,
        transaction_type_id,
        updateTransactionTypeDto,
      );
      return { message: 'Purpose Type updated successfully' };
    } finally {
      span.finish();
    }
  }

  // @UseGuards(JwtGuard)
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
      await this.transactionTypeService.deleteTransactionType(
        span,
        transaction_type_id,
      );
      return { message: 'Transaction Type deleted successfully' };
    } finally {
      span.finish();
    }
  }
}
