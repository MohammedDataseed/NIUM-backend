import { Model } from 'sequelize-typescript';
export declare class PartnerProducts extends Model<PartnerProducts> {
    partner_id: string;
    product_id: string;
    static logInsert(instance: PartnerProducts, options: any): Promise<void>;
    static logUpdate(instance: PartnerProducts, options: any): Promise<void>;
    static logDelete(instance: PartnerProducts, options: any): Promise<void>;
}
