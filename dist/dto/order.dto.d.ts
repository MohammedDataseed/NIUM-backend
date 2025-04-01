export declare class CreateOrderDto {
    partner_order_id: string;
    transaction_type_id: string;
    is_e_sign_required: boolean;
    is_v_kyc_required: boolean;
    purpose_type_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_pan: string;
}
export declare class UpdateOrderDto {
    order_id?: string;
    transaction_type?: string;
    purpose_type?: string;
    is_e_sign_required?: boolean;
    is_v_kyc_required?: boolean;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_pan?: string;
    order_status?: string;
    e_sign_status?: string;
    e_sign_link?: string;
    e_sign_link_status?: string;
    e_sign_link_request_id?: string;
    e_sign_link_doc_id?: string;
    e_sign_link_expires?: string;
    e_sign_completed_by_customer?: boolean;
    e_sign_customer_completion_date?: string;
    e_sign_doc_comments?: string;
    v_kyc_profile_id?: string;
    v_kyc_reference_id?: string;
    v_kyc_status?: string;
    v_kyc_link?: string;
    v_kyc_link_status?: string;
    v_kyc_link_expires?: string;
    v_kyc_completed_by_customer?: boolean;
    v_kyc_customer_completion_date?: string;
    v_kyc_comments?: string;
    is_esign_regenerated?: boolean;
    is_esign_regenerated_details?: any;
    is_video_kyc_link_regenerated?: boolean;
    is_video_kyc_link_regenerated_details?: any;
    created_by?: string;
    updated_by?: string;
    checker_id?: string;
    partner_hashed_api_key?: string;
    partner_hashed_key?: string;
}
export declare class UpdateCheckerDto {
    orderIds: string[];
    checkerId: string;
}
export declare class UnassignCheckerDto {
    orderId: string;
    checkerId: string;
}
export declare class GetCheckerOrdersDto {
    checkerId: string;
    transaction_type?: string;
}
export declare class UpdateOrderDetailsDto {
    partner_order_id: string;
    checker_id: string;
    nium_invoice_number: string;
    incident_checker_comments: string;
    incident_status: boolean;
}
export declare class GetOrderDetailsDto {
    orderId: string;
    checkerId: string;
}
export declare class FilterOrdersDto {
    checkerId: string;
    transaction_type_hashed_key?: string;
    purpose_type_hashed_key?: string;
    from?: string;
    to?: string;
}
