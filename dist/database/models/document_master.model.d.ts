import { Model } from "sequelize-typescript";
export declare class DocumentMaster extends Model<DocumentMaster> {
    id: string;
    hashed_key: string;
    documentType: string;
    purposeId: string;
    created_by: string;
    updated_by: string;
    static generatehashed_key(instance: DocumentMaster): void;
}
