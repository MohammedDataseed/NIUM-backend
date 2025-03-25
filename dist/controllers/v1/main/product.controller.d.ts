import { ProductService } from "../../../services/v1/product/product.service";
import { Products } from "../../../database/models/products.model";
import { CreateProductDto, UpdateProductDto } from "src/dto/product.dto";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(params: Record<string, any>): Promise<Products[]>;
    findOne(id: string): Promise<Products>;
    createProduct(createProductDto: CreateProductDto): Promise<Products>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Products>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
}
