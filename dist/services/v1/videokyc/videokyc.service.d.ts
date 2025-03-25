import { Vkyc } from "src/database/models/vkyc.model";
import { OrdersService } from "../order/order.service";
import { Order } from "src/database/models/order.model";
export declare class VideokycService {
    private readonly orderRepository;
    private readonly vkycRepository;
    private readonly orderService;
    private readonly REQUEST_API_URL;
    private readonly REQUEST_TASK_API_URL;
    private readonly RETRIEVE_API_URL;
    private readonly CONFIG_ID;
    private readonly API_KEY;
    private readonly ACCOUNT_ID;
    private readonly logger;
    constructor(orderRepository: typeof Order, vkycRepository: typeof Vkyc, orderService: OrdersService);
    sendVideokycRequest(orderId: string): Promise<any>;
    handleEkycRetrieveWebhook(partner_order_id: string): Promise<any>;
    retrieveVideokycData(requestData: any): Promise<any>;
    sendVideokycRequestOld(token: string, referenceId: string): Promise<any>;
    getTaskDetails(token: string, requestId: string): Promise<any>;
    private handleError;
}
