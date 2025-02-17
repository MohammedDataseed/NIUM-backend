import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { Branch } from "../../../database/models/branch.model";
import * as opentracing from "opentracing";
import { BranchDto,CreateBranchDto,UpdateBranchDto } from "../../../dto/branch.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class BranchService {
  constructor(
    @Inject("BRANCH_REPOSITORY")
    private readonly branchRepository: typeof Branch
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Branch>
  ): Promise<Branch[]> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });

    try {
      return await this.branchRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createBranch(
    span: opentracing.Span,
    createBranchDto: CreateBranchDto
  ): Promise<Branch> {
    const childSpan = span.tracer().startSpan("create-branch", { childOf: span });

    try {
      // Check if branch already exists
      const existingBranch = await this.branchRepository.findOne({
        where: { name: createBranchDto.name },
      });
      if (existingBranch) {
        throw new ConflictException("Branch already exists");
      }

      // Create a new branch
      return await this.branchRepository.create({
        name: createBranchDto.name,
        // status: createBranchDto.status ?? true, // Default status to true if not provided
      });
    } finally {
      childSpan.finish();
    }
  }
}
