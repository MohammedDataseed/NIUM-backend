import {
  UseGuards,
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import { RoleService } from '../../services/role/role.service';
import { Role } from '../../../database/models/role.model';
import * as opentracing from 'opentracing';
import { CreateRoleDto, UpdateRoleDto } from '../../../dto/role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth('access_token') // 🔹 Must match the name used in Swagger setup
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** ================================
   * 🔹 Get All Roles
   * ================================ */
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all roles with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [Role],
  })
  async findAll(@Query() params: Record<string, any>): Promise<Role[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-roles-request');

    try {
      const whereCondition = params as any;
      return await this.roleService.findAll(span, whereCondition);
    } finally {
      span.finish();
    }
  }

  /** ================================
   * 🔹 Create a New Role
   * ================================ */
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-role-request');

    try {
      return await this.roleService.createRole(span, createRoleDto);
    } finally {
      span.finish();
    }
  }

  /** ================================
   * 🔹 Update Role by hashed_key
   * ================================ */
  @UseGuards(JwtGuard)
  @Put('status')
  @ApiOperation({ summary: 'Update role status using hashed_key' })
  @ApiResponse({ status: 200, description: 'Role status updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateStatus(@Body() body: UpdateRoleDto): Promise<Role> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-role-status');

    try {
      return await this.roleService.updateRole(
        span,
        body.hashed_key, // ✅ Use directly from body
        body, // ✅ Pass the entire `UpdateRoleDto`
      );
    } finally {
      span.finish();
    }
  }
}
