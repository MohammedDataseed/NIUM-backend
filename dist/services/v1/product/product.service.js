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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let ProductService = class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findAll(span, params) {
        const childSpan = span
            .tracer()
            .startSpan('findAll-products', { childOf: span });
        try {
            childSpan.log({ event: 'query-started', query: params });
            const products = await this.productRepository.findAll({ where: params });
            childSpan.log({ event: 'query-success', count: products.length });
            return products;
        }
        catch (error) {
            childSpan.setTag('error', true);
            childSpan.log({ event: 'query-failed', error: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async createProduct(span, createProductDto) {
        var _a;
        const childSpan = span
            .tracer()
            .startSpan('create-product', { childOf: span });
        try {
            childSpan.log({
                event: 'create-check-existence',
                name: createProductDto.name,
            });
            const existingProduct = await this.productRepository.findOne({
                where: { name: createProductDto.name },
            });
            if (existingProduct) {
                childSpan.setTag('error', true);
                childSpan.log({
                    event: 'product-exists',
                    productId: existingProduct.id,
                });
                throw new common_1.ConflictException('Product already exists');
            }
            const hashedKey = crypto
                .createHash('sha256')
                .update(createProductDto.name + Date.now())
                .digest('hex');
            const newProduct = await this.productRepository.create({
                name: createProductDto.name,
                description: createProductDto.description,
                is_active: (_a = createProductDto.is_active) !== null && _a !== void 0 ? _a : true,
                created_by: createProductDto.created_by,
                updated_by: createProductDto.updated_by,
                hashed_key: hashedKey,
            });
            childSpan.log({
                event: 'product-created',
                productId: newProduct.id,
                hashedKey,
            });
            return newProduct;
        }
        catch (error) {
            childSpan.setTag('error', true);
            childSpan.log({ event: 'create-failed', error: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async findById(span, id) {
        const childSpan = span
            .tracer()
            .startSpan('find-product-by-id', { childOf: span });
        try {
            childSpan.log({ event: 'searching-product', productId: id });
            const product = await this.productRepository.findByPk(id);
            if (!product) {
                childSpan.setTag('error', true);
                childSpan.log({ event: 'product-not-found', productId: id });
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            childSpan.log({ event: 'product-found', productId: product.id });
            return product;
        }
        catch (error) {
            childSpan.setTag('error', true);
            childSpan.log({ event: 'find-failed', error: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async updateProduct(span, id, updateProductDto) {
        const childSpan = span
            .tracer()
            .startSpan('update-product', { childOf: span });
        try {
            childSpan.log({ event: 'updating-product', productId: id });
            const product = await this.findById(childSpan, id);
            await product.update(updateProductDto);
            childSpan.log({ event: 'product-updated', productId: product.id });
            return product;
        }
        catch (error) {
            childSpan.setTag('error', true);
            childSpan.log({ event: 'update-failed', error: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
    async deleteProduct(span, id) {
        const childSpan = span
            .tracer()
            .startSpan('delete-product', { childOf: span });
        try {
            childSpan.log({ event: 'deleting-product', productId: id });
            const product = await this.findById(childSpan, id);
            await product.destroy();
            childSpan.log({ event: 'product-deleted', productId: id });
        }
        catch (error) {
            childSpan.setTag('error', true);
            childSpan.log({ event: 'delete-failed', error: error.message });
            throw error;
        }
        finally {
            childSpan.finish();
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCTS_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], ProductService);
//# sourceMappingURL=product.service.js.map