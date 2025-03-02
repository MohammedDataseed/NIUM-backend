import { Injectable, Inject, ConflictException, NotFoundException } from "@nestjs/common";
import { Products } from "../../../database/models/products.model";
import * as opentracing from "opentracing";
import { CreateProductDto, UpdateProductDto } from "../../../dto/product.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCTS_REPOSITORY")
    private readonly productRepository: typeof Products
  ) {}

  /**
   * Find all products based on filter criteria.
   */
  async findAll(span: opentracing.Span, params: WhereOptions<Products>): Promise<Products[]> {
    const childSpan = span.tracer().startSpan("findAll-products", { childOf: span });

    try {
      childSpan.log({ event: "query-started", query: params });

      const products = await this.productRepository.findAll({ where: params });

      childSpan.log({ event: "query-success", count: products.length });

      return products;
    } catch (error) {
      childSpan.setTag("error", true);
      childSpan.log({ event: "query-failed", error: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  /**
   * Create a new product if it does not already exist.
   */
  async createProduct(span: opentracing.Span, createProductDto: CreateProductDto): Promise<Products> {
    const childSpan = span.tracer().startSpan("create-product", { childOf: span });

    try {
      childSpan.log({ event: "create-check-existence", name: createProductDto.name });

      // Check if product already exists
      const existingProduct = await this.productRepository.findOne({
        where: { name: createProductDto.name },
      });

      if (existingProduct) {
        childSpan.setTag("error", true);
        childSpan.log({ event: "product-exists", productId: existingProduct.id });
        throw new ConflictException("Product already exists");
      }

      // Create a new product
      const newProduct = await this.productRepository.create({
        name: createProductDto.name,
        is_active: createProductDto.is_active ?? true, // Default is_active to true if not provided
        created_by: createProductDto.created_by,
        updated_by: createProductDto.updated_by
      });

      childSpan.log({ event: "product-created", productId: newProduct.id });

      return newProduct;
    } catch (error) {
      childSpan.setTag("error", true);
      childSpan.log({ event: "create-failed", error: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  /**
   * Find a product by ID.
   */
  async findById(span: opentracing.Span, id: string): Promise<Products> {
    const childSpan = span.tracer().startSpan("find-product-by-id", { childOf: span });

    try {
      childSpan.log({ event: "searching-product", productId: id });

      const product = await this.productRepository.findByPk(id);
      if (!product) {
        childSpan.setTag("error", true);
        childSpan.log({ event: "product-not-found", productId: id });
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      childSpan.log({ event: "product-found", productId: product.id });

      return product;
    } catch (error) {
      childSpan.setTag("error", true);
      childSpan.log({ event: "find-failed", error: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  /**
   * Update an existing product.
   */
  async updateProduct(span: opentracing.Span, id: string, updateProductDto: UpdateProductDto): Promise<Products> {
    const childSpan = span.tracer().startSpan("update-product", { childOf: span });

    try {
      childSpan.log({ event: "updating-product", productId: id });

      const product = await this.findById(childSpan, id); // Ensures the product exists
      await product.update(updateProductDto);

      childSpan.log({ event: "product-updated", productId: product.id });

      return product;
    } catch (error) {
      childSpan.setTag("error", true);
      childSpan.log({ event: "update-failed", error: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  /**
   * Delete a product by ID.
   */
  async deleteProduct(span: opentracing.Span, id: string): Promise<void> {
    const childSpan = span.tracer().startSpan("delete-product", { childOf: span });

    try {
      childSpan.log({ event: "deleting-product", productId: id });

      const product = await this.findById(childSpan, id);
      await product.destroy();

      childSpan.log({ event: "product-deleted", productId: id });
    } catch (error) {
      childSpan.setTag("error", true);
      childSpan.log({ event: "delete-failed", error: error.message });
      throw error;
    } finally {
      childSpan.finish();
    }
  }
}
