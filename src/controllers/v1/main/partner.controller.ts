import { 
  UseGuards, Controller, Get, Post, Put, Delete, Body, Param, Query 
} from "@nestjs/common";
import { PartnerService } from "../../../services/v1/partner/partner.service";
import { Partner } from "../../../database/models/partner.model";
import * as opentracing from "opentracing";
import { CreatePartnerDto, UpdatePartnerDto } from "../../../dto/partner.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { ParseUUIDPipe } from "@nestjs/common";
import { MailerService } from "src/shared/services/mailer/mailer.service";

@ApiTags("Partners")
@Controller("partners")
@ApiBearerAuth("access_token") // 🔹 Matches the Swagger setup
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly mailService: MailerService
  ) {}

  /** 🔹 Get All Partners */
  // @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: "Get all partners" })
  @ApiResponse({ status: 200, description: "List of all partners", type: [Partner] })
  async findAll(): Promise<Partner[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("get-all-partners");

    try {
      return await this.partnerService.findAllPartners(span);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Get Partner by ID */
  @UseGuards(JwtGuard)
  @Get(":id")
  @ApiOperation({ summary: "Get a partner by ID" })
  @ApiResponse({ status: 200, description: "Partner details", type: Partner })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async findById(@Param("id", ParseUUIDPipe) id: string): Promise<Partner> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("get-partner-by-id");

    try {
      return await this.partnerService.findPartnerById(span, id);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Create Partner */
  // @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new partner" })
  @ApiResponse({ status: 201, description: "Partner created successfully.", type: Partner })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid data provided." })
  @ApiBody({ type: CreatePartnerDto }) 
  async create(@Body() createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-partner-request");

    try {
      return await this.partnerService.createPartner(span, createPartnerDto);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Update Partner */
  @UseGuards(JwtGuard)
  @Put(":id")
  @ApiOperation({ summary: "Update a partner" })
  @ApiResponse({ status: 200, description: "Partner updated successfully.", type: Partner })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid data provided." })
  @ApiResponse({ status: 404, description: "Partner not found." })
  @ApiBody({ type: UpdatePartnerDto })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updatePartnerDto: UpdatePartnerDto
  ): Promise<Partner> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("update-partner-request");

    try {
      return await this.partnerService.updatePartner(span, id, updatePartnerDto);
    } finally {
      span.finish();
    }
  }

  /** 🔹 Delete Partner */
  @UseGuards(JwtGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a partner" })
  @ApiResponse({ status: 200, description: "Partner deleted successfully." })
  @ApiResponse({ status: 404, description: "Partner not found." })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("delete-partner-request");

    try {
      await this.partnerService.deletePartner(span, id);
      return { message: "Partner deleted successfully" };
    } finally {
      span.finish();
    }
  }
}
