import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class BranchLog extends Model<BranchLog> {
    log_id: number;
    dml_action: string;
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    name: string;
    location: string;
    city: string;
    state: string;
    business_type: string;
    createdAt: Date;
    updatedAt: Date;
    BranchLog: any;
    created_by?: string;
    updated_by?: string;
    creator: User;
    updater: User;
}
