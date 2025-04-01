import { Model } from 'sequelize-typescript';
export declare class DocumentMaster extends Model<DocumentMaster> {
    id: string;
    hashed_key: string;
    documentType: string;
    purposeId: string;
    created_by: string;
    updated_by: string;
    static generatehashed_key(instance: DocumentMaster): void;
    static logInsert(instance: DocumentMaster, options: any): Promise<void>;
    static logUpdate(instance: DocumentMaster, options: any): Promise<void>;
    static logDelete(instance: DocumentMaster, options: any): Promise<void>;
}
