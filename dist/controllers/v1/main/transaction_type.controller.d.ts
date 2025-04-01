import { transaction_typeService } from "../../../services/v1/transaction/transaction_type.service";
import { Createtransaction_typeDto, Updatetransaction_typeDto } from "src/dto/transaction_type.dto";
export declare class transaction_typeController {
    private readonly transaction_typeService;
    constructor(transaction_typeService: transaction_typeService);
    findAll(params: Record<string, any>): Promise<{
        transaction_type_id: string;
        transaction_name: string;
    }[]>;
    createtransaction_type(createtransaction_typeDto: Createtransaction_typeDto): Promise<{
        transaction_type_id: string;
        transaction_name: string;
    }>;
    update(transaction_type_id: string, updatetransaction_typeDto: Updatetransaction_typeDto): Promise<{
        message: string;
    }>;
    delete(transaction_type_id: string): Promise<{
        message: string;
    }>;
}
