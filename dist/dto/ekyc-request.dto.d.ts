declare class EsignFieldsDto {
    esign_fields: Record<string, unknown>;
}
declare class EsignFileDetailsDto {
    esign_profile_id: string;
    file_name: string;
    esign_file?: string;
    esign_fields: EsignFieldsDto;
    esign_additional_files: string[];
    esign_allow_fill: boolean;
    order_id?: string;
}
declare class EsignStampDetailsDto {
    esign_stamp_series: string;
    esign_series_group: string;
    esign_stamp_value: string;
}
declare class AadhaarEsignVerificationDto {
    aadhaar_pincode: string;
    aadhaar_yob: string;
    aadhaar_gender: string;
}
declare class EsignInviteeDto {
    esigner_name: string;
    esigner_email: string;
    esigner_phone: string;
    aadhaar_esign_verification: AadhaarEsignVerificationDto;
}
declare class EkycDataDto {
    flow_type: string;
    user_key: string;
    verify_aadhaar_details: boolean;
    esign_file_details: EsignFileDetailsDto;
    esign_stamp_details: EsignStampDetailsDto;
    esign_invitees: EsignInviteeDto[];
}
export declare class EkycRequestDto {
    task_id: string;
    group_id: string;
    order_id: string;
    data: EkycDataDto;
}
export declare class EkycRetrieveDataDto {
    user_key: string;
    esign_doc_id?: string;
}
export declare class EkycRetrieveRequestDto {
    task_id: string;
    group_id: string;
    data: EkycRetrieveDataDto;
}
export {};
