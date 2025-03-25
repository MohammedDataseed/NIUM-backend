"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../../../services/v1/product/product.service");
const products_model_1 = require("../../../database/models/products.model");
const opentracing = require("opentracing");
const product_dto_1 = require("../../../dto/product.dto");
const swagger_1 = require("@nestjs/swagger");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async findAll(params) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-all-products-request");
        try {
            span.log({ event: "query-start", filters: params });
            const whereCondition = params;
            const products = await this.productService.findAll(span, whereCondition);
            span.log({ event: "query-success", count: products.length });
            return products;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "query-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async findOne(id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("find-product-by-id-request");
        try {
            span.log({ event: "searching-product", productId: id });
            const product = await this.productService.findById(span, id);
            span.log({ event: "product-found", productId: id });
            return product;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "product-not-found", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async createProduct(createProductDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("create-product-request");
        try {
            span.log({
                event: "creating-product",
                productName: createProductDto.name,
            });
            const product = await this.productService.createProduct(span, createProductDto);
            span.log({ event: "product-created", productId: product.id });
            return product;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "creation-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async updateProduct(id, updateProductDto) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("update-product-request");
        try {
            span.log({ event: "updating-product", productId: id });
            const product = await this.productService.updateProduct(span, id, updateProductDto);
            span.log({ event: "product-updated", productId: product.id });
            return product;
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "update-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
    async deleteProduct(id) {
        const tracer = opentracing.globalTracer();
        const span = tracer.startSpan("delete-product-request");
        try {
            span.log({ event: "deleting-product", productId: id });
            await this.productService.deleteProduct(span, id);
            span.log({ event: "product-deleted", productId: id });
            return { message: "Product successfully deleted" };
        }
        catch (error) {
            span.setTag("error", true);
            span.log({ event: "delete-failed", error: error.message });
            throw error;
        }
        finally {
            span.finish();
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all products with optional filtering" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of products",
        type: [products_model_1.Products],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a product by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Product ID", type: "string" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Product details", type: products_model_1.Products }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Product not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new product" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Product successfully created",
        type: products_model_1.Products,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid data provided" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update an existing product" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Product ID", type: "string" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Product successfully updated",
        type: products_model_1.Products,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Product not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a product" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Product ID", type: "string" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Product successfully deleted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Product not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)("Products"),
    (0, common_1.Controller)("products"),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map