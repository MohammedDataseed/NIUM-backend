import { PdfService } from "../document-consolidate/document-consolidate.service";
import { OrdersService } from "../order/order.service";
import { Order } from "src/database/models/order.model";
import { ESign } from "src/database/models/esign.model";
export declare class EkycService {
    private readonly orderRepository;
    private readonly esignRepository;
    private readonly pdfService;
    private readonly orderService;
    private readonly REQUEST_API_URL;
    private readonly REQUEST_TASK_API_URL;
    private readonly RETRIEVE_API_URL;
    private readonly API_KEY;
    private readonly ACCOUNT_ID;
    private readonly USER_KEY;
    private readonly PROFILE_ID;
    private readonly logger;
    constructor(orderRepository: typeof Order, esignRepository: typeof ESign, pdfService: PdfService, orderService: OrdersService);
    getMergedPdfBase64(orderId: string): Promise<{
        base64: string;
        signedUrl: string;
    }>;
    getMergedPdfBase64W(orderId: string): Promise<string>;
    sendEkycRequest(orderId: string): Promise<any>;
    getTaskDetails(token: string, requestId: string): Promise<any>;
    handleEkycRetrieveWebhook(partner_order_id: string): Promise<any>;
    retrieveEkycData(requestData: any): Promise<any>;
    convertUrlsToBase64(urls: string[]): Promise<any>;
    sendEkycRequestBase64(token: string, requestData: any): Promise<any>;
}
