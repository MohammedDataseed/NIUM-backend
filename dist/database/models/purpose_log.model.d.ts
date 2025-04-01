import { Model } from 'sequelize-typescript';
import { Purpose } from './purpose.model';
import { User } from './user.model';
export declare class PurposeLog extends Model<PurposeLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    purpose_name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    created_by?: string;
    updated_by?: string;
    purpose: Purpose;
    creator: User;
    updater: User;
}
