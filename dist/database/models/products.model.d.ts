import { Model } from "sequelize-typescript";
import { User } from "./user.model";
import { Partner } from "./partner.model";
export declare class Products extends Model<Products> {
    id: string;
    hashed_key: string;
    name: string;
    description: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    partners: Partner[];
    creator: User;
    updater: User;
    static generatePublicKey(instance: Products): void;
}
