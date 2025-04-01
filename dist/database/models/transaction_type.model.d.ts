import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class transaction_type extends Model<transaction_type> {
    id: string;
    hashed_key: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    created_by?: string;
    updated_by?: string;
    creator: User;
    updater: User;
    static generateHashedKey(instance: transaction_type): void;
    static logInsert(instance: transaction_type, options: any): Promise<void>;
    static logUpdate(instance: transaction_type, options: any): Promise<void>;
    static logDelete(instance: transaction_type, options: any): Promise<void>;
}
