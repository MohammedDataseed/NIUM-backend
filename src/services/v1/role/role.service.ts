import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "../../../database/models/role.model";
import * as opentracing from "opentracing";
import * as crypto from "crypto";

import { CreateRoleDto, UpdateRoleDto } from "../../../dto/role.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class RoleService {
  constructor(
    @Inject("ROLE_REPOSITORY")
    private readonly roleRepository: typeof Role
  ) {}

  // Fetch all roles with optional filters
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

  // Fetch a single role by ID
  async findOne(span: opentracing.Span, id: string): Promise<Role> {
    const childSpan = span.tracer().startSpan("find-role", { childOf: span });

    try {
      const role = await this.roleRepository.findByPk(id);
      if (!role) {
        throw new NotFoundException("Role not found");
      }
      return role;
    } finally {
      childSpan.finish();
    }
  }

  // Create a new role
  // async createRole(span: opentracing.Span, createRoleDto: CreateRoleDto): Promise<Role> {
  //   const childSpan = span.tracer().startSpan("create-role", { childOf: span });
  
  //   try {
  //     const existingRole = await this.roleRepository.findOne({
  //       where: { name: createRoleDto.name },
  //     });
  //     if (existingRole) {
  //       throw new ConflictException("Role already exists");
  //     }
  
  //     // Create new role instance
  //     const role = this.roleRepository.build({
  //       name: createRoleDto.name,
  //       status: createRoleDto.status ?? true,
  //       created_by: createRoleDto.created_by,
  //     });
  
  //     // Manually set `hashed_key`
  //     role.hashed_key = crypto.createHash("sha256").update(`${role.name}-${Date.now()}`).digest("hex");
  
  //     await role.save(); // Save the role
  
  //     return role;
  //   } finally {
  //     childSpan.finish();
  //   }
  // }

  async createRole(span: opentracing.Span, createRoleDto: CreateRoleDto): Promise<Role> {
    const childSpan = span.tracer().startSpan("create-role", { childOf: span });

    try {
        const existingRole = await this.roleRepository.findOne({
            where: { name: createRoleDto.name },
        });
        if (existingRole) {
            throw new ConflictException("Role already exists");
        }

        // Fetch creator's role ID using hashed_key
        let createdById: string | null = null;
       
        if (createRoleDto.created_by) {
            const creatorRole = await this.roleRepository.findOne({
                where: { hashed_key: createRoleDto.created_by },
            });
            if (!creatorRole) {
                throw new NotFoundException("Creator role not found");
            }
            createdById = creatorRole.id;
        }

        // Create new role instance
        const role = this.roleRepository.build({
            name: createRoleDto.name,
            status: createRoleDto.status ?? true,
            created_by: createdById
        });

        // Generate hashed_key
        role.hashed_key = crypto.createHash("sha256")
            .update(`${role.name}-${Date.now()}`)
            .digest("hex");

        await role.save(); // Save the role

        return role;
    } finally {
        childSpan.finish();
    }
}

  
 
  async updateRole(
    span: opentracing.Span,
    id: string,
    updateRoleDto: UpdateRoleDto
  ): Promise<Role> {
    const childSpan = span.tracer().startSpan("update-role", { childOf: span });

    try {
      const role = await this.roleRepository.findByPk(id);
      if (!role) {
        throw new NotFoundException("Role not found");
      }

      // Update the role
      await role.update({
        name: updateRoleDto.name ?? role.name,
        status: updateRoleDto.status ?? role.status,
        updated_by: updateRoleDto.updated_by,
      });

      return role;
    } finally {
      childSpan.finish();
    }
  }

  // Delete a role
  async deleteRole(span: opentracing.Span, id: string): Promise<void> {
    const childSpan = span.tracer().startSpan("delete-role", { childOf: span });

    try {
      const role = await this.roleRepository.findByPk(id);
      if (!role) {
        throw new NotFoundException("Role not found");
      }

      await role.destroy();
    } finally {
      childSpan.finish();
    }
  }
}
