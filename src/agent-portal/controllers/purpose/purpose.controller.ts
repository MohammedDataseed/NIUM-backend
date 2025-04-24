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
import { PurposeService } from '../../services/purpose/purpose.service';
import { Purpose } from '../../../database/models/purpose.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import { CreatePurposeDto, UpdatePurposeDto } from '../../../dto/purpose.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('Purpose')
@Controller('purpose')
@ApiBearerAuth('access_token')
export class PurposeController {
  constructor(private readonly purposeService: PurposeService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() params: Record<string, any>,
  ): Promise<Array<{ purpose_type_id: string; purpose_name: string }>> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-purpose-type-request');

    try {
      const whereCondition: WhereOptions<Purpose> =
        params as WhereOptions<Purpose>;
      const purposes = await this.purposeService.findAll(span, whereCondition);

      return purposes.map((purpose) => ({
        purpose_type_id: purpose.hashed_key, // Return masked key instead of UUID
        purpose_name: purpose.purposeName,
      }));
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new purpose type' })
  @ApiResponse({
    status: 201,
    description: 'The Purpose type has been successfully created.',
    type: Purpose,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async createPurposeType(
    @Body() createPurposeDto: CreatePurposeDto,
  ): Promise<{ purpose_type_id: string; purpose_name: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-purpose-type-request');

    try {
      const newPurpose = await this.purposeService.createPurpose(
        span,
        createPurposeDto,
      );
      return {
        purpose_type_id: newPurpose.hashed_key,
        purpose_name: newPurpose.purposeName,
      };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Put(':purpose_type_id')
  @ApiOperation({ summary: 'Update a purpose type' })
  @ApiResponse({
    status: 200,
    description: 'Purpose Type updated successfully.',
    type: Purpose,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  @ApiResponse({ status: 404, description: 'Purpose Type not found.' })
  @ApiBody({ type: UpdatePurposeDto })
  async update(
    @Param('purpose_type_id') purpose_type_id: string,
    @Body() updatePurposeDto: UpdatePurposeDto,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-purpose-type-request');

    try {
      await this.purposeService.updatePurpose(
        span,
        purpose_type_id,
        updatePurposeDto,
      );
      return { message: 'Purpose Type updated successfully' };
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':purpose_type_id')
  @ApiOperation({ summary: 'Delete a purpose type' })
  @ApiResponse({
    status: 200,
    description: 'Purpose Type deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Purpose Type not found.' })
  async delete(
    @Param('purpose_type_id') purpose_type_id: string,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-purpose-type-request');

    try {
      await this.purposeService.deletePurposeType(span, purpose_type_id);
      return { message: 'Purpose Type deleted successfully' };
    } finally {
      span.finish();
    }
  }
}
