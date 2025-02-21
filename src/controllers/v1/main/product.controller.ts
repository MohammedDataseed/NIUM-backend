import { Controller, Get, Query, Post, Body, UseGuards } from "@nestjs/common";
import { ProductService } from "../../../services/v1/product/product.service";
import { Products } from "../../../database/models/products.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { WhereOptions } from "sequelize";
import { CreateProductDto } from "src/dto/product.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { PdfService } from "src/shared/services/documents-consolidate/documents-consolidate.service";

@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<Products[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-products-request");
    const whereCondition: WhereOptions<Products> =
      params as WhereOptions<Products>;
    const result = await this.productService.findAll(span, whereCondition);
    span.finish();
    return result;
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({
    status: 201,
    description: "The product has been successfully created.",
    type: Products,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto
  ): Promise<Products> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-product-request");

    try {
      return await this.productService.createProduct(span, createProductDto);
    } finally {
      span.finish();
    }
  }
}
