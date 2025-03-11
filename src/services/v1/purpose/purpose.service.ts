import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Purpose } from '../../../database/models/purpose.model';
import * as opentracing from 'opentracing';
import {
  PurposeDto,
  CreatePurposeDto,
  UpdatePurposeDto,
} from '../../../dto/purpose.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class PurposeService {
  constructor(
    @Inject('PURPOSE_REPOSITORY')
    private readonly purposeRepository: typeof Purpose,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Purpose>,
  ): Promise<Purpose[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.purposeRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createPurpose(
    span: opentracing.Span,
    createPurposeDto: CreatePurposeDto,
  ): Promise<Purpose> {
    const childSpan = span
      .tracer()
      .startSpan('create-purpose', { childOf: span });

    try {
      // Check if purpose already exists
      const existingPurposeType = await this.purposeRepository.findOne({
        where: { purposeName: createPurposeDto.purpose_name },
      });
      if (existingPurposeType) {
        throw new ConflictException('Purpose Type already exists');
      }

      console.log('Received DTO:', createPurposeDto); // Debugging log

      // Ensure all required fields are passed to create()
      const newPurpose = await this.purposeRepository.create({
        purposeName: createPurposeDto.purpose_name,
        created_by: createPurposeDto.created_by,
        updated_by: createPurposeDto.updated_by,
      });

      return newPurpose;
    } finally {
      childSpan.finish();
    }
  }

  async updatePurpose(
    span: opentracing.Span,
    publicKey: string, // ✅ Update based on `publicKey`
    updatePurposeDto: UpdatePurposeDto,
  ): Promise<Purpose> {
    const childSpan = span
      .tracer()
      .startSpan('update-purpose-type', { childOf: span });

    try {
      // Find the purpose type by `publicKey`
      const purpose = await this.purposeRepository.findOne({
        where: { publicKey },
      });
      if (!purpose) {
        throw new NotFoundException('Purpose Type not found');
      }

      // Check if the updated name already exists for another purpose type
      if (updatePurposeDto.purpose_name) {
        const existingPurpose = await this.purposeRepository.findOne({
          where: { purposeName: updatePurposeDto.purpose_name },
        });

        if (existingPurpose && existingPurpose.publicKey !== publicKey) {
          throw new ConflictException(
            'Another Purpose Type with the same name already exists',
          );
        }
      }

      // Update purpose type
      await purpose.update({
        purposeName: updatePurposeDto.purpose_name ?? purpose.purposeName,
        isActive: updatePurposeDto.is_active ?? purpose.isActive,
        updated_by: updatePurposeDto.updated_by ?? purpose.updated_by,
      });

      return purpose;
    } finally {
      childSpan.finish();
    }
  }

  async findAllConfig(): Promise<
    { purpose_type_id: string; purpose_name: string }[]
  > {
    const purposes = await this.purposeRepository.findAll({
      where: { isActive: true }, // Only fetch active documents
    });
    return purposes.map((purpose) => ({
      purpose_type_id: purpose.publicKey,
      purpose_name: purpose.purposeName,
    }));
  }

  async deletePurposeType(
    span: opentracing.Span,
    publicKey: string,
  ): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const purpose = await this.purposeRepository.findOne({
        where: { publicKey },
      });
      if (!purpose) throw new NotFoundException('Purpose Type not found');

      await purpose.destroy();
      childSpan.log({ event: 'purpose_deleted', publicKey });
    } finally {
      childSpan.finish();
    }
  }
}
