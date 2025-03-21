import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { transaction_type } from '../../../database/models/transaction_type.model';
import * as opentracing from 'opentracing';
import {
  transaction_typeDto,
  Createtransaction_typeDto,
  Updatetransaction_typeDto,
} from '../../../dto/transaction_type.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class transaction_typeService {
  constructor(
    @Inject('TRANSACTION_TYPE_REPOSITORY')
    private readonly transaction_typeRepository: typeof transaction_type,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<transaction_type>,
  ): Promise<transaction_type[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.transaction_typeRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createtransaction_type(
    span: opentracing.Span,
    createtransaction_typeDto: Createtransaction_typeDto,
  ): Promise<transaction_type> {
    const childSpan = span
      .tracer()
      .startSpan('create-transaction-type', { childOf: span });

    try {
      // Check if transaction type already exists
      const existingtransaction_type =
        await this.transaction_typeRepository.findOne({
          where: { name: createtransaction_typeDto.transaction_name },
        });
      if (existingtransaction_type) {
        throw new ConflictException('Transaction Type already exists');
      }

      console.log('Received DTO:', createtransaction_typeDto); // Debugging log

      // Ensure all required fields are passed to create()
      return await this.transaction_typeRepository.create({
        name: createtransaction_typeDto.transaction_name,
        created_by: createtransaction_typeDto.created_by, // Ensure UUIDs are provided
        updated_by: createtransaction_typeDto.updated_by,
      });
    } finally {
      childSpan.finish();
    }
  }

  async updatetransaction_type(
    span: opentracing.Span,
    hashed_key: string,
    updatetransaction_typeDto: Updatetransaction_typeDto,
  ): Promise<transaction_type> {
    const childSpan = span
      .tracer()
      .startSpan('update-transaction-type', { childOf: span });

    try {
      // Find the transaction type by hashed_key
      const transaction_type = await this.transaction_typeRepository.findOne({
        where: { hashed_key },
      });
      if (!transaction_type) {
        throw new NotFoundException('Transaction Type not found');
      }

      // Check if the updated name already exists for another transaction type
      if (updatetransaction_typeDto.transaction_name) {
        const existingtransaction_type =
          await this.transaction_typeRepository.findOne({
            where: { name: updatetransaction_typeDto.transaction_name },
          });

        if (
          existingtransaction_type &&
          existingtransaction_type.id !== hashed_key
        ) {
          throw new ConflictException(
            'Another Transaction Type with the same name already exists',
          );
        }
      }

      // Update transaction type
      await transaction_type.update({
        name:
          updatetransaction_typeDto.transaction_name ?? transaction_type.name, // Keep existing value if not provided
        isActive:
          updatetransaction_typeDto.is_active ?? transaction_type.isActive,
        updated_by:
          updatetransaction_typeDto.updated_by ?? transaction_type.updated_by,
      });

      return transaction_type;
    } finally {
      childSpan.finish();
    }
  }

  async findAllConfig(): Promise<{ id: string; text: string }[]> {
    const transaction = await this.transaction_typeRepository.findAll({
      where: { isActive: true }, // Only fetch active documents
    });
    return transaction.map((transaction) => ({
      id: transaction.hashed_key,
      text: transaction.name,
    }));
  }

  async deletetransaction_type(
    span: opentracing.Span,
    hashed_key: string,
  ): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const transaction_type = await this.transaction_typeRepository.findOne({
        where: { hashed_key },
      });
      if (!transaction_type)
        throw new NotFoundException('Transaction Type not found');

      await transaction_type.destroy();
      childSpan.log({
        event: 'transaction_type_deleted',
        transaction_type_id: hashed_key,
      });
    } finally {
      childSpan.finish();
    }
  }
}
