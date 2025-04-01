import { Model } from 'sequelize-typescript';
export declare class DocumentRequirementsLog extends Model<DocumentRequirementsLog> {
    log_id: number;
    dml_action: 'I' | 'D' | 'U';
    log_timestamp: Date;
    id: string;
    hashed_key: string;
    document_type: string;
    is_required: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date;
}
