import { PurposeService } from "../../../services/v1/purpose/purpose.service";
import { DocumentTypeService } from "../../../services/v1/document/documentType.service";
import { transaction_typeService } from "../../../services/v1/transaction/transaction_type.service";
import { OrdersService } from "src/services/v1/order/order.service";
export declare class ConfigController {
    private readonly purposeService;
    private readonly documentTypeService;
    private readonly transactionTypeService;
    private readonly ordersService;
    constructor(purposeService: PurposeService, documentTypeService: DocumentTypeService, transactionTypeService: transaction_typeService, ordersService: OrdersService);
    getConfigDetails(apiKey: string, partnerId: string, type: string): Promise<any>;
}
