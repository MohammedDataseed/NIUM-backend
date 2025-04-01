import { Model } from "sequelize-typescript";
import { Role } from "./role.model";
import { Products } from "./products.model";
import { User } from "./user.model";
export declare class Partner extends Model<Partner> {
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
    role: Role;
    creator: User;
    updater: User;
    products: Products[];
    static generatePublicKey(instance: Partner): void;
}
