import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { Products } from "../../../database/models/products.model";
import * as opentracing from "opentracing";
import { ProductDto,CreateProductDto,UpdateProductDto } from "../../../dto/product.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCTS_REPOSITORY")
    private readonly productRepository: typeof Products
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<Products>
  ): Promise<Products[]> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });

    try {
      return await this.productRepository.findAll({ where: params });
    } finally {
      childSpan.finish();
    }
  }

  async createProduct(
    span: opentracing.Span,
    createProductDto: CreateProductDto
  ): Promise<Products> {
    const childSpan = span.tracer().startSpan("create-product", { childOf: span });

    try {
      // Check if product already exists
      const existingProduct = await this.productRepository.findOne({
        where: { name: createProductDto.name },
      });
      if (existingProduct) {
        throw new ConflictException("Product already exists");
      }

      // Create a new product
      return await this.productRepository.create({
        name: createProductDto.name,
        // status: createProductDto.status ?? true, // Default status to true if not provided
      });
    } finally {
      childSpan.finish();
    }
  }
}
