import { 
  UseGuards, Controller, Get, Post, Put, Delete, Body, Param, Query 
} from "@nestjs/common";
import { PartnerService } from "../../../services/v1/partner/partner.service";
import { Partner } from "../../../database/models/partner.model";
import * as opentracing from "opentracing";
import { WhereOptions } from "sequelize";
import { CreatePartnerDto, UpdatePartnerDto} from "../../../dto/partner.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { LoginDto } from "src/dto/login.dto";
import { MailerService } from "src/shared/services/mailer/mailer.service";

@ApiTags("Partners")
@Controller("partners")
@ApiBearerAuth('access_token') // 🔹 Must match the name used in Swagger setup
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly mailService: MailerService) {}

  // @UseGuards(JwtGuard) 
  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<Partner[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-partners-request");
    const whereCondition: WhereOptions<Partner> = params as WhereOptions<Partner>;
    const result = await this.partnerService.findAll(span, whereCondition);
    span.finish();
    return result;
  }

  // @UseGuards(JwtGuard) 
  @Post()
  @ApiOperation({ summary: "Create a new partner" })
  @ApiResponse({
    status: 201,
    description: "The partner has been successfully created.",
    type: Partner,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async create(@Body() createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-partner-request");

    try {
      return await this.partnerService.createPartner(span, createPartnerDto);
    } finally {
      span.finish();
    }
  }

  // @UseGuards(JwtGuard) 
  @Put(':id')
  @ApiOperation({ summary: 'Update a partner' })
  @ApiResponse({ status: 200, description: 'The partner has been successfully updated.', type: Partner })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data provided.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  @ApiBody({ type: UpdatePartnerDto }) // ✅ Ensure Swagger shows request body
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: Partial<UpdatePartnerDto>
  ): Promise<Partner> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-partner-request');

    try {
      return await this.partnerService.updatePartner(span, id, updatePartnerDto);
    } finally {
      span.finish();
    }
  }

  // @UseGuards(JwtGuard) 
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner' })
  @ApiResponse({ status: 200, description: 'Partner successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-partner-request');

    try {
      await this.partnerService.deletePartner(span, id);
      return { message: 'Partner deleted successfully' };
    } finally {
      span.finish();
    }
  }

  @Post("login") // ✅ Login Route
  @ApiOperation({ summary: "Partner login" })
  @ApiResponse({ status: 200, description: "Partner logged in successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.partnerService.login(loginDto);
  }
  
  @UseGuards(JwtGuard) 
  @Get("email")
  @ApiOperation({ summary: "Find partner by email" })
  @ApiResponse({ status: 200, description: "Partner found", type: Partner })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async findByEmail(@Query("email") email: string): Promise<Partner> {
    return await this.partnerService.findByEmail(email);
  }

  
}
