import {
  UseGuards,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';
import { Products } from '../../../database/models/products.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import { CreateProductDto, UpdateProductDto } from '../../../dto/product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products with optional filters.
   */
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all products with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Products],
  })
  async findAll(@Query() params: Record<string, any>): Promise<Products[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-products-request');

    try {
      span.log({ event: 'query-start', filters: params });

      const whereCondition: WhereOptions<Products> =
        params as WhereOptions<Products>;
      const products = await this.productService.findAll(span, whereCondition);

      span.log({ event: 'query-success', count: products.length });

      return products;
    } catch (error) {
      span.setTag('error', true);
      span.log({ event: 'query-failed', error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Get a single product by ID.
   */
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product details', type: Products })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<Products> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-product-by-id-request');

    try {
      span.log({ event: 'searching-product', productId: id });

      const product = await this.productService.findById(span, id);

      span.log({ event: 'product-found', productId: id });

      return product;
    } catch (error) {
      span.setTag('error', true);
      span.log({ event: 'product-not-found', error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Create a new product.
   */
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: Products,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Products> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-product-request');

    try {
      span.log({
        event: 'creating-product',
        productName: createProductDto.name,
      });

      const product = await this.productService.createProduct(
        span,
        createProductDto,
      );

      span.log({ event: 'product-created', productId: product.id });

      return product;
    } catch (error) {
      span.setTag('error', true);
      span.log({ event: 'creation-failed', error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Update a product.
   */
  @UseGuards(JwtGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: Products,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-product-request');

    try {
      span.log({ event: 'updating-product', productId: id });

      const product = await this.productService.updateProduct(
        span,
        id,
        updateProductDto,
      );

      span.log({ event: 'product-updated', productId: product.id });

      return product;
    } catch (error) {
      span.setTag('error', true);
      span.log({ event: 'update-failed', error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Delete a product.
   */
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-product-request');

    try {
      span.log({ event: 'deleting-product', productId: id });

      await this.productService.deleteProduct(span, id);

      span.log({ event: 'product-deleted', productId: id });

      return { message: 'Product successfully deleted' };
    } catch (error) {
      span.setTag('error', true);
      span.log({ event: 'delete-failed', error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }
}
