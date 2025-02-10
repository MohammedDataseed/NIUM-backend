import { Controller, Get, Query,Post,Body } from '@nestjs/common';
import { RoleService } from '../../../database/services/role/role.service';
import { Role } from '../../../database/models/role.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
import { WhereOptions } from 'sequelize';
import { CreateRoleDto } from 'src/dto/role.dto';
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()

  async findAll(@Query() params: Record<string, any>): Promise<Role[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-roles-request');
    const whereCondition: WhereOptions<Role> = params as WhereOptions<Role>;
    const result = await this.roleService.findAll(span, whereCondition);
    span.finish();
    return result;
  }
 
  @Post()
  @ApiOperation({ summary: "Create a new role" })
  @ApiResponse({
    status: 201,
    description: "The role has been successfully created.",
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-role-request');

    try {
      return await this.roleService.createRole(span, createRoleDto);
    } finally {
      span.finish();
    }
  }
}
