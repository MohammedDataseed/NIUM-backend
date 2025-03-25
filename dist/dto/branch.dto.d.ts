export declare enum BusinessType {
    CASH_AND_CARRY = "cash&carry",
    LARGE_ENTERPRISE = "large_enterprise"
}
export declare class CreateBranchDto {
    name: string;
    location: string;
    city: string;
    state: string;
    business_type: BusinessType;
    created_by: string;
    updated_by: string;
}
export declare class UpdateBranchDto {
    name?: string;
    location?: string;
    city?: string;
    state?: string;
    business_type?: BusinessType;
    updated_by?: string;
}
export declare class BranchDto {
    id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    business_type: BusinessType;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}
