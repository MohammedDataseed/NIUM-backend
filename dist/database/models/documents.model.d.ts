import { Model } from 'sequelize-typescript';
export declare class Documents extends Model<Documents> {
    documentId: string;
    hashed_key: string;
    entityId: string;
    entityType: 'user' | 'customer';
    purposeId: string;
    document_type_id: string;
    document_name: string;
    documentUrl: {
        url: string;
        mimeType?: string;
        size?: number;
        uploadedAt?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    documentExpiry: Date;
    isDocFrontImage: boolean;
    isDocBackImage: boolean;
    isUploaded: boolean;
    isCustomer: boolean;
    created_by: string;
    updated_by: string;
    static generatePublicKey(instance: Documents): void;
    static logInsert(instance: Documents, options: any): Promise<void>;
    static logUpdate(instance: Documents, options: any): Promise<void>;
    static logDelete(instance: Documents, options: any): Promise<void>;
}
