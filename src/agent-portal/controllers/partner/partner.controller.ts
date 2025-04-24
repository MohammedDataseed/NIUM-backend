import {
  UseGuards,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PartnerService } from '../../services/partner/partner.service';
import * as opentracing from 'opentracing';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  PartnerResponseDto,
} from '../../../dto/partner.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('Partners')
@Controller('partners')
@ApiBearerAuth('access_token')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  /** 🔹 Get All Partners */
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all partners' })
  @ApiResponse({
    status: 200,
    description: 'List of all partners',
    type: [PartnerResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(): Promise<PartnerResponseDto[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('get-all-partners');

    try {
      return await this.partnerService.findAllPartners(span);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Get Partner by Hashed Key */
  @UseGuards(JwtGuard)
  @Get(':hashed_key')
  @ApiOperation({ summary: 'Get a partner by hashed key' })
  @ApiParam({
    name: 'hashed_key',
    description: 'Unique hashed key of the partner',
    example: 'a1b2c3d4e5f6...',
  })
  @ApiResponse({
    status: 200,
    description: 'Partner details',
    type: PartnerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Partner not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findByHashedKey(
    @Param('hashed_key') hashed_key: string,
  ): Promise<PartnerResponseDto> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('get-partner-by-hashed-key');

    try {
      return await this.partnerService.findPartnerByHashedKey(span, hashed_key);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Create Partner */
  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({
    status: 201,
    description: 'Partner created successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<PartnerResponseDto> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-partner-request');

    try {
      return await this.partnerService.createPartner(span, createPartnerDto);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Update Partner */
  @UseGuards(JwtGuard)
  @Put(':hashed_key')
  @ApiOperation({ summary: 'Update a partner by hashed key' })
  @ApiParam({
    name: 'hashed_key',
    description: 'Unique hashed key of the partner',
    example: 'a1b2c3d4e5f6...',
  })
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({
    status: 200,
    description: 'Partner updated successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Partner not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Param('hashed_key') hashed_key: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-partner-request');

    try {
      return await this.partnerService.updatePartnerByHashedKey(
        span,
        hashed_key,
        updatePartnerDto,
      );
    } finally {
      span.finish();
    }
  }

  /** 🔹 Delete Partner */
  @UseGuards(JwtGuard)
  @Delete(':hashed_key')
  @ApiOperation({ summary: 'Delete a partner by hashed key' })
  @ApiParam({
    name: 'hashed_key',
    description: 'Unique hashed key of the partner',
    example: 'a1b2c3d4e5f6...',
  })
  @ApiResponse({
    status: 200,
    description: 'Partner deleted successfully',
    type: Object, // For { message: string }
    example: { message: 'Partner deleted successfully' },
  })
  @ApiResponse({
    status: 404,
    description: 'Partner not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async delete(
    @Param('hashed_key') hashed_key: string,
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-partner-request');

    try {
      await this.partnerService.deletePartnerByHashedKey(span, hashed_key);
      return { message: 'Partner deleted successfully' };
    } finally {
      span.finish();
    }
  }
}
