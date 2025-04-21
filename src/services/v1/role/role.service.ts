import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '../../../database/models/role.model';
import { User } from '../../../database/models/user.model';
import * as opentracing from 'opentracing';
import * as crypto from 'crypto';

import { CreateRoleDto, UpdateRoleDto } from '../../../dto/role.dto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: typeof Role,

    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
  ) {}

  // Fetch all roles with optional filters
  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Role>,
  ): Promise<Role[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.roleRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  // Fetch a single role by ID
  async findOne(span: opentracing.Span, id: string): Promise<Role> {
    const childSpan = span.tracer().startSpan('find-role', { childOf: span });

    try {
      const role = await this.roleRepository.findOne({
        where: { hashed_key: id },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } finally {
      childSpan.finish();
    }
  }

  async createRole(
    span: opentracing.Span,
    createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    const childSpan = span.tracer().startSpan('create-role', { childOf: span });

    try {
      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });
      if (existingRole) {
        throw new ConflictException('Role already exists');
      }

      // Ensure `created_by` is passed as a valid `BIGINT` number
      let createdById: number | null = null;
      if (createRoleDto.created_by) {
        // Ensure the `created_by` field is a valid number (BIGINT)
        if (isNaN(createRoleDto.created_by)) {
          throw new BadRequestException('Invalid number for created_by');
        }

        const creatorUser = await this.userRepository.findOne({
          where: { id: createRoleDto.created_by },
        });
        if (!creatorUser) {
          throw new NotFoundException('Creator user not found');
        }

        createdById = Number(creatorUser.id); // Explicit conversion to number
      }

      // Create new role instance with BIGINT `created_by` and `updated_by`
      const role = this.roleRepository.build({
        name: createRoleDto.name,
        status: createRoleDto.status ?? true,
        created_by: createdById, // Ensure it passes as BIGINT
      });

      await role.save();
      return role;
    } finally {
      childSpan.finish();
    }
  }

  // async createRole(
  //   span: opentracing.Span,
  //   createRoleDto: CreateRoleDto,
  // ): Promise<Role> {
  //   const childSpan = span.tracer().startSpan('create-role', { childOf: span });

  //   try {
  //     // Check if role already exists
  //     const existingRole = await this.roleRepository.findOne({
  //       where: { name: createRoleDto.name },
  //     });
  //     if (existingRole) {
  //       throw new ConflictException('Role already exists');
  //     }

  //     // Fetch User ID using `created_by`
  //     let createdById: number | null = null;
  //     if (createRoleDto.created_by) {
  //       const creatorUser = await this.userRepository.findOne({
  //         where: { id: createRoleDto.created_by }, // ✅ Querying `users` instead of `roles`
  //       });
  //       console.log(creatorUser)
  //       if (!creatorUser) {
  //         throw new NotFoundException('Creator user not found');
  //       }
  //       createdById = Number(creatorUser.id);

  //       // createdById = creatorUser.id;
  //     }

  //     // Create new role instance
  //     const role = this.roleRepository.build({
  //       name: createRoleDto.name,
  //       status: createRoleDto.status ?? true,
  //       created_by: createdById,
  //     });
  //     console.log(role)

  //     // Fallback in case `@BeforeCreate` doesn't trigger
  //     if (!role.hashed_key) {
  //       role.hashed_key =
  //         crypto.randomBytes(16).toString('hex') + Date.now().toString(36);
  //     }

  //     await role.save();
  //     return role;
  //   } finally {
  //     childSpan.finish();
  //   }
  // }

  // update a new role
  async updateRole(
    span: opentracing.Span,
    hashedKey: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const childSpan = span.tracer().startSpan('update-role', { childOf: span });

    try {
      const role = await this.roleRepository.findOne({
        where: { hashed_key: hashedKey },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Resolve hashed_key to ID for updated_by
      let updatedById: number | null = role.updated_by;

      if (updateRoleDto.updated_by) {
        const updaterRole = await this.roleRepository.findOne({
          where: { hashed_key: updateRoleDto.updated_by },
        });
        if (!updaterRole) {
          throw new NotFoundException('Updater role not found');
        }
        updatedById = updaterRole.id;
      }

      // Update the role
      await role.update({
        name: updateRoleDto.name ?? role.name,
        status: updateRoleDto.status ?? role.status,
        updated_by: updatedById,
      });

      return role;
    } finally {
      childSpan.finish();
    }
  }
}
