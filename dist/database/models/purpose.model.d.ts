import { Model } from "sequelize-typescript";
import { User } from "./user.model";
export declare class Purpose extends Model<Purpose> {
    id: string;
    hashed_key: string;
    purposeName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    created_by?: string;
    updated_by?: string;
    creator: User;
    updater: User;
    static ensureHashedKey(instance: Purpose): void;
}
