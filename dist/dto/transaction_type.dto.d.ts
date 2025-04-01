export declare class Createtransaction_typeDto {
    transaction_name: string;
    created_by: string;
    updated_by: string;
}
export declare class Updatetransaction_typeDto {
    transaction_name?: string;
    is_active?: boolean;
    updated_by: string;
}
export declare class transaction_typeDto {
    id: string;
    transaction_name: string;
    createdAt: Date;
    updatedAt: Date;
    created_by: string;
    updated_by: string;
}
