import { OrdersService } from '../../../services/v1/order/order.service';
import { CreateOrderDto, UpdateOrderDto, UpdateCheckerDto, UnassignCheckerDto, GetCheckerOrdersDto, UpdateOrderDetailsDto, GetOrderDetailsDto, FilterOrdersDto } from '../../../dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("../../../services/v1/order/order.service").FilteredOrder[]>;
    createOrder(api_key: string, partner_id: string, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        partner_order_id: string;
        nium_forex_order_id: string;
    }>;
    updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<import("../../../database/models/order.model").Order>;
    deleteOrder(orderId: string): Promise<{
        message: string;
    }>;
    getUnassignedOrders(): Promise<Array<{
        [key: string]: any;
        transaction_type: {
            id: string | null;
            text: string;
        };
        purpose_type: {
            id: string | null;
            text: string;
        };
    }>>;
    updateChecker(updateCheckerDto: UpdateCheckerDto): Promise<{
        message: string;
        updatedOrders: string[];
    }>;
    unassignChecker(unassignCheckerDto: UnassignCheckerDto): Promise<{
        message: string;
        unassignedOrder: string;
    }>;
    getCheckerOrders(getCheckerOrdersDto: GetCheckerOrdersDto): Promise<{
        message: string;
        totalOrders: number;
        filterApplied: string;
        orders: {
            transaction_type: {
                id: string;
                text: string;
            };
            purpose_type: {
                id: string;
                text: string;
            };
            id: string;
            hashed_key: string;
            partner_id: string;
            partner_order_id: string;
            is_esign_required: boolean;
            is_v_kyc_required: boolean;
            customer_name: string;
            customer_email: string;
            customer_phone: string;
            customer_pan: string;
            order_status: string;
            e_sign_status: string;
            e_sign_link: string;
            e_sign_link_status: string;
            e_sign_link_doc_id: string;
            e_sign_link_request_id: string;
            e_sign_link_expires: Date;
            e_sign_completed_by_customer: boolean;
            e_sign_customer_completion_date: Date;
            e_sign_doc_comments: string;
            v_kyc_reference_id: string;
            v_kyc_profile_id: string;
            v_kyc_status: string;
            v_kyc_link: string;
            v_kyc_link_status: string;
            v_kyc_link_expires: Date;
            v_kyc_completed_by_customer: boolean;
            v_kyc_customer_completion_date: Date;
            v_kyc_comments: string;
            incident_status: boolean;
            incident_checker_comments: string;
            nium_order_id: string;
            nium_invoice_number: string;
            date_of_departure: Date;
            incident_completion_date: Date;
            is_esign_regenerated: boolean;
            is_esign_regenerated_details: any;
            is_video_kyc_link_regenerated: boolean;
            is_video_kyc_link_regenerated_details: any;
            created_by: string;
            updated_by: string;
            checker_id: string;
            creator: import("../../../database/models/partner.model").Partner;
            updater: import("../../../database/models/partner.model").Partner;
            checker: import("../../../database/models/user.model").User;
            merged_document: {
                url: string;
                mimeType: string;
                size: number;
                createdAt: string;
                documentIds: string[];
            };
            esigns: import("../../../database/models/esign.model").ESign[];
            vkycs: import("../../../database/models/vkyc.model").Vkyc[];
            createdAt?: Date | any;
            updatedAt?: Date | any;
            deletedAt?: Date | any;
            version?: number | any;
            _attributes: import("../../../database/models/order.model").Order;
            dataValues: import("../../../database/models/order.model").Order;
            _creationAttributes: import("../../../database/models/order.model").Order;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<import("../../../database/models/order.model").Order, import("../../../database/models/order.model").Order>;
        }[];
    }>;
    updateOrderDetails(updateInvoiceStatusDto: UpdateOrderDetailsDto): Promise<{
        message: string;
        updatedOrder: import("../../../database/models/order.model").Order;
    }>;
    fetchOrderDetails(getOrderDetailsDto: GetOrderDetailsDto): Promise<import("../../../database/models/order.model").Order>;
    getOrderStatusCounts(): Promise<{}>;
    getFilteredOrders(filterDto: FilterOrdersDto): Promise<Array<{
        [key: string]: any;
        transaction_type: {
            id: string | null;
            text: string;
        };
        purpose_type: {
            id: string | null;
            text: string;
        };
    }>>;
    findOneByOrderId(apiKey: string, partnerId: string, orderId: string): Promise<import("../../../services/v1/order/order.service").FilteredOrder>;
}
