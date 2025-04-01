import { Model } from 'sequelize-typescript';
export declare class RoleLog extends Model<RoleLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    name: string;
    status: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
