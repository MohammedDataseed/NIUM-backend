import { Sequelize } from "sequelize";
import { Order } from "../../../database/models/order.model";
import { CreateOrderDto, UpdateOrderDto, UpdateCheckerDto, UnassignCheckerDto, GetCheckerOrdersDto, UpdateOrderDetailsDto, GetOrderDetailsDto, FilterOrdersDto } from "../../../dto/order.dto";
import * as opentracing from "opentracing";
import { User } from "../../../database/models/user.model";
import { ESign } from "src/database/models/esign.model";
import { Vkyc } from "src/database/models/vkyc.model";
import { Partner } from "../../../database/models/partner.model";
import { Purpose } from "src/database/models/purpose.model";
import { transaction_type } from "src/database/models/transaction_type.model";
export interface FilteredOrder {
    partner_order_id: string;
    nium_order_id: string;
    order_status: string;
    is_esign_required: boolean;
    is_v_kyc_required: boolean;
    e_sign_status: string;
    e_sign_link: string;
    e_sign_link_status: string;
    e_sign_link_expires: Date;
    e_sign_completed_by_customer: boolean;
    e_sign_customer_completion_date: Date;
    e_sign_doc_comments: string;
    is_e_sign_regenerated: boolean;
    e_sign_regenerated_count: number;
    v_kyc_link_status: string;
    v_kyc_link: string;
    v_kyc_link_expires: Date;
    v_kyc_completed_by_customer: boolean;
    v_kyc_customer_completion_date: Date;
    v_kyc_comments: string;
    v_kyc_status: string;
    is_v_kyc_link_regenerated: boolean;
    v_kyc_regenerated_count: number;
    merged_document: string;
    transaction_type: {
        id: string | null;
        text: string;
    };
    purpose_type: {
        id: string | null;
        text: string;
    };
}
export declare class OrdersService {
    private readonly orderRepository;
    private readonly partnerRepository;
    private readonly userRepository;
    private readonly purposeTypeRepository;
    private readonly transactionTypeRepository;
    constructor(orderRepository: typeof Order, partnerRepository: typeof Partner, userRepository: typeof User, purposeTypeRepository: typeof Purpose, transactionTypeRepository: typeof transaction_type);
    createOrder(span: opentracing.Span, createOrderDto: CreateOrderDto, partnerId: string): Promise<{
        message: string;
        partner_order_id: string;
        nium_forex_order_id: string;
    }>;
    findAll(span: opentracing.Span): Promise<FilteredOrder[] | null>;
    validatePartnerHeaders(partnerId: string, apiKey: string): Promise<void>;
    findOne(span: opentracing.Span, orderId: string): Promise<Order>;
    findOneByOrderId(span: opentracing.Span, orderId: string): Promise<FilteredOrder>;
    updateOrder(span: opentracing.Span, orderId: string, updateOrderDto: Partial<UpdateOrderDto>): Promise<Order>;
    deleteOrder(span: opentracing.Span, orderId: string): Promise<void>;
    updateChecker(dto: UpdateCheckerDto): Promise<{
        message: string;
        updatedOrders: string[];
    }>;
    unassignChecker(dto: UnassignCheckerDto): Promise<{
        message: string;
        unassignedOrder: string;
    }>;
    getOrdersByChecker(dto: GetCheckerOrdersDto): Promise<{
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
            creator: Partner;
            updater: Partner;
            checker: User;
            merged_document: {
                url: string;
                mimeType: string;
                size: number;
                createdAt: string;
                documentIds: string[];
            };
            esigns: ESign[];
            vkycs: Vkyc[];
            createdAt?: Date | any;
            updatedAt?: Date | any;
            deletedAt?: Date | any;
            version?: number | any;
            _attributes: Order;
            dataValues: Order;
            _creationAttributes: Order;
            isNewRecord: boolean;
            sequelize: Sequelize;
            _model: import("sequelize").Model<Order, Order>;
        }[];
    }>;
    updateOrderDetails(dto: UpdateOrderDetailsDto): Promise<{
        message: string;
        updatedOrder: Order;
    }>;
    getOrderDetails(dto: GetOrderDetailsDto): Promise<Order>;
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
}
