import { Model } from 'sequelize-typescript';
export declare class TransactionTypeLog extends Model<TransactionTypeLog> {
    log_id: number;
    dml_action: string;
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    created_by?: string;
    updated_by?: string;
}
