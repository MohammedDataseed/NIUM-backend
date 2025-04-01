export declare class CreateProductDto {
    name: string;
    description?: string;
    is_active?: boolean;
    created_by: string;
    updated_by: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    is_active?: boolean;
    updated_by?: string;
}
