import { Model } from 'sequelize-typescript';
export declare class DocumentMasterLog extends Model<DocumentMasterLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    document_type: string;
    purpose_id: string;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
