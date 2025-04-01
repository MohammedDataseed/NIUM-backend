import { OrdersService } from "../../../../services/v1/order/order.service";
import { VideokycService } from "../../../../services/v1/videokyc/videokyc.service";
import { SyncProfileDto, VkycResourcesDto } from "src/dto/video-kyc.dto";
export declare class VideokycController {
    private readonly videokycService;
    private readonly ordersService;
    private readonly logger;
    constructor(videokycService: VideokycService, ordersService: OrdersService);
    generateVkyc(apiKey: string, partnerId: string, partner_order_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    retrieveEkycWebhook(partner_order_id: string): Promise<any>;
    syncProfiles(token: string, requestData: SyncProfileDto): Promise<{
        success: boolean;
        data: any;
    }>;
    getTaskDetails(token: string, requestId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    retrieveVideokyc(token: string, profileId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    uploadVkycResources(resources: VkycResourcesDto): Promise<{
        success: boolean;
        message: string;
        data: {
            documents: string;
            images: {
                selfie: string;
                pan: string;
                others: any[];
            };
            videos: {
                agent: string;
                customer: string;
            };
        };
    }>;
}
