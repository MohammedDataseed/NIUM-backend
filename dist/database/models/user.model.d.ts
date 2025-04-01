import { Model } from 'sequelize-typescript';
import { Role } from './role.model';
import { Branch } from './branch.model';
import { bank_account } from './bank_account.model';
export declare class User extends Model<User> {
    id: string;
    email: string;
    password: string;
    hashed_key: string;
    role_id: string;
    branch_id: string;
    bank_account_id: string;
    is_active: boolean;
    business_type: string;
    created_by: string;
    updated_by: string;
    role: Role;
    branch: Branch;
    bank_account: bank_account;
    creator: User;
    updater: User;
    static generatePublicKey(instance: User): void;
    static logInsert(instance: User, options: any): Promise<void>;
    static logUpdate(instance: User, options: any): Promise<void>;
    static logDelete(instance: User, options: any): Promise<void>;
}
