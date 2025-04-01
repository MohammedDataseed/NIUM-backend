import { Model } from 'sequelize-typescript';
export declare class Branch extends Model<Branch> {
    id: string;
    hashed_key: string;
    name: string;
    location: string;
    city: string;
    state: string;
    business_type: string;
    created_by: string;
    updated_by: string;
    static generatehashed_key(instance: Branch): void;
    static logInsert(instance: Branch, options: any): Promise<void>;
    static logUpdate(instance: Branch, options: any): Promise<void>;
    static logDelete(instance: Branch, options: any): Promise<void>;
}
