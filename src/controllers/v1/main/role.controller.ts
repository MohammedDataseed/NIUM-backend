import { Controller, Get, Query, Post, Body,UseGuards } from "@nestjs/common";
import { RoleService } from "../../../services/v1/role/role.service";
import { Role } from "../../../database/models/role.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { WhereOptions } from "sequelize";
import { CreateRoleDto } from "src/dto/role.dto";
import { ApiTags, ApiOperation, ApiResponse,ApiBody } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { PdfService } from "src/shared/services/documents-consolidate/documents-consolidate.service";

@ApiTags("Roles")
@Controller("roles")
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly pdfService: PdfService,
  ) {}

  // @UseGuards(JwtGuard) 
  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<Role[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-roles-request");
    const whereCondition: WhereOptions<Role> = params as WhereOptions<Role>;
    const result = await this.roleService.findAll(span, whereCondition);
    span.finish();
    return result;
  }

  // @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new role" })
  @ApiResponse({
    status: 201,
    description: "The role has been successfully created.",
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-role-request");

    try {
      return await this.roleService.createRole(span, createRoleDto);
    } finally {
      span.finish();
    }
  }


  @Post("document-consolidate")
  @ApiOperation({ summary: "Merge multiple PDFs into one" })
  @ApiResponse({ status: 200, description: "Merged PDF successfully created.", schema: { example: { message: "Merged PDF created successfully!", file_url: "/uploads/merged_1700000000000.pdf" } } })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid input format." })
  @ApiResponse({ status: 500, description: "Internal server error." })
  @ApiBody({
    schema: {
      example: {
        "documents": [
          {
            "aadhar_url": "https://fibregridstorage.blr1.digitaloceanspaces.com/Fibregrid_projects/FY_25-26/Agriculture Projects/Agri land Survey_AGR_25-26_01_[Ekfrazo]/stage 4/PDF Files/TAYIB.pdf",
            "base64_image1": "https://res.cloudinary.com/dxjrvvjp1/raw/upload/v1738865170/ixf6kpwiyz51btl6qgm8.txt",
            "esign_file": "https://storage.idfy.com/3d838376-2cfa-4923-804b-9ad1a11acfca-esign_file0.txt?Expires=1738954098&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=Q0IdvQ1dH1FVHP0zBjUp4Y4RKekwf%2FgqUAwNpXLW9Jk0fWL%2FNAP8FDcInNYuTE9PgGA1qUXLdYtHqkXRYlnUPLypHjjozU5AFozzd%2B0kJgC%2BVm4UbGFCvYqq%2BL02IJ%2BSRbV4Nq%2BUgKMM%2BUs0hAMoI6enDJkGAEhdrLl5JzPnlAeZBe68A%2BMgKi0QchDXh9%2B9%2BavLBVbicxRQ1dKo2zXSReUuaHAGeUq3JXULsVL4ulMAmLHg42ymx7Q8VPzrYQnjGExRDBaU6T9dl4A54qXhGxdR3two%2FpPWoKLTyFzoKcF%2BcUQ2%2FI4TCgDe6ur%2F3E%2B58qiTbRaGDJNx7yTUR2jjUQ%3D%3D"
          }
        ]
      }
    }
  })
  async documentConsolidate(@Body() body: { documents: Record<string, string>[] }) {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("document-consolidate-request");

    try {
      if (!body.documents || !Array.isArray(body.documents)) {
        throw new Error("Invalid input format");
      }

      const filename = await this.pdfService.mergeDocuments(body.documents);
      return { message: "Merged PDF created successfully!", file_url: `/uploads/${filename}` };
    } catch (error) {
      console.error("Error merging PDFs:", error.message);
      throw new Error("Internal server error");
    } finally {
      span.finish();
    }
  }
}
