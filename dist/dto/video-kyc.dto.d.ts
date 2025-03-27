export declare class AddressDto {
    type: string;
    house_number: string;
    street_address: string;
    district: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    country_code: string;
}
export declare class SyncProfileDto {
    reference_id: string;
}
export declare class VkycImagesDto {
    selfie?: string;
    pan?: string;
    others?: string[];
}
export declare class VkycVideosDto {
    agent?: string;
    customer?: string;
}
export declare class VkycTextDto {
    location?: object;
    name?: string;
    dob?: string | null;
}
export declare class VkycResourcesDto {
    partner_order_id: string;
    documents?: string[];
    images?: {
        selfie?: string;
        pan?: string;
        others?: string[];
    };
    videos?: {
        agent?: string;
        customer?: string;
    };
}
