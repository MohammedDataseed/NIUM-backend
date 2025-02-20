import { Controller, Get, Query, Post, Body,UseGuards } from "@nestjs/common";
import { BranchService } from "../../../services/v1/branch/branch.service";
import { Branch } from "../../../database/models/branch.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { WhereOptions } from "sequelize";
import { CreateBranchDto } from "src/dto/branch.dto";
import { ApiTags, ApiOperation, ApiResponse,ApiBody } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { PdfService } from "src/shared/services/documents-consolidate/documents-consolidate.service";

@ApiTags("Branches")
@Controller("branches")
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
  ) {}

  //@UseGuards(JwtGuard) 
  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<Branch[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-branches-request");
    const whereCondition: WhereOptions<Branch> = params as WhereOptions<Branch>;
    const result = await this.branchService.findAll(span, whereCondition);
    span.finish();
    return result;
  }

  // @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new branch" })
  @ApiResponse({
    status: 201,
    description: "The branch has been successfully created.",
    type: Branch,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async createBranch(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-branch-request");

    try {
      return await this.branchService.createBranch(span, createBranchDto);
    } finally {
      span.finish();
    }
  }


}
