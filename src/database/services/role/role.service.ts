// import { Injectable, Inject } from "@nestjs/common";
// import { Role } from "../../models/role.model";
// import * as opentracing from 'opentracing';
// import { WhereOptions } from 'sequelize';
// import { TracerService } from '../../../shared/services/tracer/tracer.service';
// @Injectable()
// export class RoleService {
//   constructor(
//     @Inject("ROLE_REPOSITORY")
//     private readonly roleRepository: typeof Role
//   ) {}

//   async findAll(
//     span: opentracing.Span,
//     params: WhereOptions<Role> // Ensure params match expected type
//   ): Promise<Role[]> {
//     const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    
//     try {
//       const result = await this.roleRepository.findAll({ where: params });
//       return result;
//     } finally {
//       childSpan.finish();
//     }
//   }

// }

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Role } from '../../models/role.model';
import * as opentracing from 'opentracing';
import { CreateRoleDto } from '../../../dto/role.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: typeof Role,
  ) {}

  async findAll(span: opentracing.Span, params: WhereOptions<Role>): Promise<Role[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.roleRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createRole(span: opentracing.Span, createRoleDto: CreateRoleDto): Promise<Role> {
    const childSpan = span.tracer().startSpan('create-role', { childOf: span });

    try {
      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
      if (existingRole) {
        throw new ConflictException('Role already exists');
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
