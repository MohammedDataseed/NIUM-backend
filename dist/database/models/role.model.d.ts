import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Role extends Model<Role> {
    id: string;
    hashed_key: string;
    name: string;
    status: boolean;
    created_by: string;
    updated_by: string;
    creator: User;
    updater: User;
    static generatePublicKey(instance: Role): void;
    static logInsert(instance: Role, options: any): Promise<void>;
    static logUpdate(instance: Role, options: any): Promise<void>;
    static logDelete(instance: Role, options: any): Promise<void>;
}
