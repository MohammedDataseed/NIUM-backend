export declare class CreatePurposeDto {
    purpose_name: string;
    created_by: string;
    updated_by: string;
}
export declare class UpdatePurposeDto {
    purpose_name?: string;
    is_active?: boolean;
    updated_by: string;
}
export declare class PurposeDto {
    id: string;
    purposeName: string;
    createdAt: Date;
    updatedAt: Date;
    created_by: string;
    updated_by: string;
}
