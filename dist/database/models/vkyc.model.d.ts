import { Model } from 'sequelize-typescript';
import { Order } from './order.model';
export declare class Vkyc extends Model<Vkyc> {
    id: string;
    hashed_key: string;
    partner_order_id: string;
    order_id: string;
    order: Order;
    attempt_number: number;
    reference_id: string;
    profile_id: string;
    v_kyc_link: string;
    v_kyc_link_expires: Date;
    v_kyc_link_status: string;
    v_kyc_comments: string;
    v_kyc_doc_completion_date: Date;
    device_info: any;
    profile_data: any;
    performed_by: any[];
    resources_documents: any[];
    resources_documents_files: any[];
    resources_images: any[];
    resources_images_files: any[];
    resources_videos: any[];
    resources_videos_files: any[];
    resources_text: any[];
    location_info: any;
    first_name: string;
    reviewer_action: string;
    tasks: object;
    status: string;
    status_description: object;
    status_detail: string | null;
    created_by: string | null;
    updated_by: string | null;
    static generatehashed_key(instance: Vkyc): void;
    static logInsert(instance: Vkyc, options: any): Promise<void>;
    static logUpdate(instance: Vkyc, options: any): Promise<void>;
    static logDelete(instance: Vkyc, options: any): Promise<void>;
}
