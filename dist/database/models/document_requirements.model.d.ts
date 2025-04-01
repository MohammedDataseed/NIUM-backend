import { Model } from 'sequelize-typescript';
export declare class DocumentRequirements extends Model<DocumentRequirements> {
    id: string;
    hashed_key: string;
    documentType: string;
    isRequired: boolean;
    created_by: string;
    updated_by: string;
    static generatehashed_key(instance: DocumentRequirements): void;
    static logInsert(instance: DocumentRequirements, options: any): Promise<void>;
    static logUpdate(instance: DocumentRequirements, options: any): Promise<void>;
    static logDelete(instance: DocumentRequirements, options: any): Promise<void>;
}
