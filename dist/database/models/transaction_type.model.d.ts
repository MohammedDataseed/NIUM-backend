import { Model } from "sequelize-typescript";
import { User } from "./user.model";
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
}
