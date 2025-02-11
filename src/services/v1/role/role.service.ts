import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { Role } from "../../../database/models/role.model";
import * as opentracing from "opentracing";
import { CreateRoleDto } from "../../../dto/role.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class RoleService {
  constructor(
    @Inject("ROLE_REPOSITORY")
    private readonly roleRepository: typeof Role
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Role>
  ): Promise<Role[]> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });

    try {
      return await this.roleRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createRole(
    span: opentracing.Span,
    createRoleDto: CreateRoleDto
  ): Promise<Role> {
    const childSpan = span.tracer().startSpan("create-role", { childOf: span });

    try {
      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });
      if (existingRole) {
        throw new ConflictException("Role already exists");
      }

      // Create a new role
      return await this.roleRepository.create({
        name: createRoleDto.name,
        status: createRoleDto.status ?? true, // Default status to true if not provided
      });
    } finally {
      childSpan.finish();
    }
  }
}
