import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Branch } from '../../../database/models/branch.model';
import * as opentracing from 'opentracing';
import { CreateBranchDto } from '../../../dto/branch.dto';
import * as crypto from 'crypto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class BranchService {
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private readonly branchRepository: typeof Branch,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Branch>,
  ): Promise<Branch[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.branchRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createBranch(
    span: opentracing.Span,
    createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    const childSpan = span
      .tracer()
      .startSpan('create-branch', { childOf: span });

    try {
      // Check if branch already exists
      const existingBranch = await this.branchRepository.findOne({
        where: { name: createBranchDto.name },
      });
      if (existingBranch) {
        throw new ConflictException('Branch already exists');
      }

      // Create new branch instance
      const branch = this.branchRepository.build({
        name: createBranchDto.name,
        location: createBranchDto.location,
        city: createBranchDto.city,
        state: createBranchDto.state,
        bussiness_type: createBranchDto.business_type,
      });

      // 🔹 Fallback in case `@BeforeCreate` hook doesn't trigger
      if (!branch.hashed_key) {
        branch.hashed_key =
          crypto.randomBytes(16).toString('hex') + Date.now().toString(36);
      }
      await branch.save();
      return branch;
    } finally {
      childSpan.finish();
    }
  }
}
