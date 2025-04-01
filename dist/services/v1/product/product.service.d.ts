import { Products } from '../../../database/models/products.model';
import * as opentracing from 'opentracing';
import { CreateProductDto, UpdateProductDto } from '../../../dto/product.dto';
import { WhereOptions } from 'sequelize';
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: typeof Products);
    findAll(span: opentracing.Span, params: WhereOptions<Products>): Promise<Products[]>;
    createProduct(span: opentracing.Span, createProductDto: CreateProductDto): Promise<Products>;
    findById(span: opentracing.Span, id: string): Promise<Products>;
    updateProduct(span: opentracing.Span, id: string, updateProductDto: UpdateProductDto): Promise<Products>;
    deleteProduct(span: opentracing.Span, id: string): Promise<void>;
}
