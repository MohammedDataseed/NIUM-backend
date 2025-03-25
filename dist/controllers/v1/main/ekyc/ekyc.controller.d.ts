import { EkycService } from "../../../../services/v1/ekyc/ekyc.service";
import { EkycRetrieveRequestDto } from "src/dto/ekyc-request.dto";
import { OrdersService } from "../../../../services/v1/order/order.service";
export declare class ConvertUrlsToBase64Dto {
    urls: string[];
}
export declare class EkycController {
    private readonly ekycService;
    private readonly ordersService;
    private readonly logger;
    constructor(ekycService: EkycService, ordersService: OrdersService);
    sendEkycLink(apiKey: string, partnerId: string, partner_order_id: string): Promise<any>;
    retrieveEkycWebhook(partner_order_id: string): Promise<any>;
    retrieveEkyc(requestData: EkycRetrieveRequestDto): Promise<any>;
    getTaskDetails(token: string, requestId: string): Promise<any>;
    getMergedPdf(orderId: string): Promise<{
        success: boolean;
        data: string;
        message: string;
    }>;
}
