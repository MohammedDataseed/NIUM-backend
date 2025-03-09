import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { Branch } from "../../../database/models/branch.model";
import * as opentracing from "opentracing";
import {
  BranchDto,
  CreateBranchDto,
  UpdateBranchDto,
} from "../../../dto/branch.dto";
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
    const childSpan = span
      .tracer()
      .startSpan("create-branch", { childOf: span });

    try {
      // Check if branch already exists
      const existingBranch = await this.branchRepository.findOne({
        where: { name: createBranchDto.name },
      });
      if (existingBranch) {
        throw new ConflictException("Branch already exists");
      }

      console.log("Received DTO:", createBranchDto); // Debugging log

      // Ensure all required fields are passed to create()
      return await this.branchRepository.create({
        name: createBranchDto.name,
        location: createBranchDto.location,
        city: createBranchDto.city,
        state: createBranchDto.state,
        business_type: createBranchDto.business_type,
        created_by: createBranchDto.created_by, // Ensure UUIDs are provided
        updated_by: createBranchDto.updated_by,
      });
    } finally {
      childSpan.finish();
    }
  }
}
