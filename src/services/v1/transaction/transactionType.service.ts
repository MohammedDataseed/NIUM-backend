import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '../../../database/models/transactionType.model';
import * as opentracing from 'opentracing';
import {
  TransactionTypeDto,
  CreateTransactionTypeDto,
  UpdateTransactionTypeDto,
} from '../../../dto/transactionType.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class TransactionTypeService {
  constructor(
    @Inject('TRANSACTIONTYPE_REPOSITORY')
    private readonly transactionTypeRepository: typeof TransactionType,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<TransactionType>,
  ): Promise<TransactionType[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.transactionTypeRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createTransactionType(
    span: opentracing.Span,
    createTransactionTypeDto: CreateTransactionTypeDto,
  ): Promise<TransactionType> {
    const childSpan = span
      .tracer()
      .startSpan('create-transaction-type', { childOf: span });

    try {
      // Check if transaction type already exists
      const existingTransactionType =
        await this.transactionTypeRepository.findOne({
          where: { name: createTransactionTypeDto.transaction_name },
        });
      if (existingTransactionType) {
        throw new ConflictException('Transaction Type already exists');
      }

      console.log('Received DTO:', createTransactionTypeDto); // Debugging log

      // Ensure all required fields are passed to create()
      return await this.transactionTypeRepository.create({
        name: createTransactionTypeDto.transaction_name,
        created_by: createTransactionTypeDto.created_by, // Ensure UUIDs are provided
        updated_by: createTransactionTypeDto.updated_by,
      });
    } finally {
      childSpan.finish();
    }
  }

  async updateTransactionType(
    span: opentracing.Span,
    publicKey: string,
    updateTransactionTypeDto: UpdateTransactionTypeDto,
  ): Promise<TransactionType> {
    const childSpan = span
      .tracer()
      .startSpan('update-transaction-type', { childOf: span });

    try {
      // Find the transaction type by publicKey
      const transactionType = await this.transactionTypeRepository.findOne({
        where: { publicKey },
      });
      if (!transactionType) {
        throw new NotFoundException('Transaction Type not found');
      }

      // Check if the updated name already exists for another transaction type
      if (updateTransactionTypeDto.transaction_name) {
        const existingTransactionType =
          await this.transactionTypeRepository.findOne({
            where: { name: updateTransactionTypeDto.transaction_name },
          });

        if (
          existingTransactionType &&
          existingTransactionType.id !== publicKey
        ) {
          throw new ConflictException(
            'Another Transaction Type with the same name already exists',
          );
        }
      }

      // Update transaction type
      await transactionType.update({
        name: updateTransactionTypeDto.transaction_name ?? transactionType.name, // Keep existing value if not provided
        isActive:
          updateTransactionTypeDto.is_active ?? transactionType.isActive,
        updated_by:
          updateTransactionTypeDto.updated_by ?? transactionType.updated_by,
      });

      return transactionType;
    } finally {
      childSpan.finish();
    }
  }

  async findAllConfig(): Promise<
    { transaction_type_id: string; transaction_name: string }[]
  > {
    const transaction = await this.transactionTypeRepository.findAll({
      where: { isActive: true }, // Only fetch active documents
    });
    return transaction.map((transaction) => ({
      transaction_type_id: transaction.publicKey,
      transaction_name: transaction.name,
    }));
  }

  async deleteTransactionType(
    span: opentracing.Span,
    publicKey: string,
  ): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const transactionType = await this.transactionTypeRepository.findOne({
        where: { publicKey },
      });
      if (!transactionType)
        throw new NotFoundException('Transaction Type not found');

      await transactionType.destroy();
      childSpan.log({
        event: 'transactionType_deleted',
        transaction_type_id: publicKey,
      });
    } finally {
      childSpan.finish();
    }
  }
}
