import { Model } from "sequelize-typescript";
export declare class bank_account extends Model<bank_account> {
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
    static generatehashed_key(instance: bank_account): void;
}
