import { Model } from 'sequelize-typescript';
export declare class ProductsLog extends Model<ProductsLog> {
    log_id: number;
    dml_action: 'I' | 'U' | 'D';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    name: string;
    description: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
