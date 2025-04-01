import { Model } from 'sequelize-typescript';
export declare class UsersLog extends Model<UsersLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    email: string;
    password: string;
    role_id: string;
    branch_id: string;
    hashed_key: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
