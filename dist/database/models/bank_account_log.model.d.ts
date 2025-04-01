import { Model } from 'sequelize-typescript';
export declare class BankAccountLog extends Model<BankAccountLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    bank_branch: string;
    ifsc_code: string;
    is_beneficiary: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
