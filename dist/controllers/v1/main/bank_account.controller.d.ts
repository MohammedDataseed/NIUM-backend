import { BankAccountService } from "../../../services/v1/bank_account/bank_account.service";
import { bank_account } from "../../../database/models/bank_account.model";
import { CreateBankAccountDto } from "src/dto/bank_account.dto";
export declare class BankAccountController {
    private readonly bankAccountService;
    constructor(bankAccountService: BankAccountService);
    findAll(params: Record<string, any>): Promise<bank_account[]>;
    findOne(id: string): Promise<bank_account>;
    createBankAccount(createBankAccountDto: CreateBankAccountDto): Promise<bank_account>;
    updateBankAccount(id: string, updateBankAccountDto: Partial<CreateBankAccountDto>): Promise<bank_account>;
    deleteBankAccount(id: string): Promise<{
        message: string;
    }>;
}
