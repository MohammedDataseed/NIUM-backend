import { Model } from 'sequelize-typescript';
export declare class PartnerProductsLog extends Model<PartnerProductsLog> {
    log_id: number;
    dml_action: 'I' | 'U' | 'D';
    log_timestamp: Date;
    partner_id: string;
    product_id: string;
    createdAt: Date;
    updatedAt: Date;
}
