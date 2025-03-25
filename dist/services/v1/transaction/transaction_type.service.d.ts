import { transaction_type } from "../../../database/models/transaction_type.model";
import * as opentracing from "opentracing";
import { Createtransaction_typeDto, Updatetransaction_typeDto } from "../../../dto/transaction_type.dto";
import { WhereOptions } from "sequelize";
export declare class transaction_typeService {
    private readonly transaction_typeRepository;
    constructor(transaction_typeRepository: typeof transaction_type);
    findAll(span: opentracing.Span, params: WhereOptions<transaction_type>): Promise<transaction_type[]>;
    createtransaction_type(span: opentracing.Span, createtransaction_typeDto: Createtransaction_typeDto): Promise<transaction_type>;
    updatetransaction_type(span: opentracing.Span, hashed_key: string, updatetransaction_typeDto: Updatetransaction_typeDto): Promise<transaction_type>;
    findAllConfig(): Promise<{
        id: string;
        text: string;
    }[]>;
    deletetransaction_type(span: opentracing.Span, hashed_key: string): Promise<void>;
}
