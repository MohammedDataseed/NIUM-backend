export declare enum business_type {
    LARGE_ENTERPRISE = "large_enterprise",
    CASH_CARRY = "cash&carry"
}
export declare class CreatePartnerDto {
    role_id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_active?: boolean;
    hashed_key?: string;
    api_key?: string;
    business_type: business_type;
    created_by: string;
    updated_by: string;
    product_ids?: string[];
}
export declare class UpdatePartnerDto {
    role_id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    api_key?: string;
    is_active?: boolean;
    business_type?: business_type;
    hashed_key?: string;
    updated_by?: string;
    product_ids?: string[];
}
declare class ProductResponseDto {
    id: string;
    name: string;
}
export declare class PartnerResponseDto {
    partner_id: string;
    hashed_key: string;
    role_id: string;
    email: string;
    first_name: string;
    last_name: string;
    api_key: string;
    is_active: boolean;
    business_type: business_type;
    created_by: string;
    updated_by: string;
    products: ProductResponseDto[];
}
export {};
