import { Model } from 'sequelize-typescript';
export declare class DocumentsLog extends Model<DocumentsLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    entityId: string;
    entityType: string;
    purpose_id: string;
    document_type_id: string;
    document_name: string;
    documentUrl: {
        url: string;
        mimeType?: string;
        size?: number;
        uploadedAt?: string;
    };
    status: string;
    documentExpiry: Date;
    isDocFrontImage: boolean;
    isDocBackImage: boolean;
    isUploaded: boolean;
    isCustomer: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
