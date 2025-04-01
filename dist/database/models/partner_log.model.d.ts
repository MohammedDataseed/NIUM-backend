import { Model } from 'sequelize-typescript';
export declare class PartnerLog extends Model<PartnerLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    role_id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    api_key: string;
    is_active: boolean;
    business_type: string;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
