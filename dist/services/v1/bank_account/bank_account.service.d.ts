import { bank_account } from "src/database/models/bank_account.model";
import * as opentracing from "opentracing";
import { CreateBankAccountDto } from "../../../dto/bank_account.dto";
import { WhereOptions } from "sequelize";
export declare class BankAccountService {
    private readonly bankAccountRepository;
    constructor(bankAccountRepository: typeof bank_account);
    findAll(span: opentracing.Span, params: WhereOptions<bank_account>): Promise<bank_account[]>;
    findOne(span: opentracing.Span, id: string): Promise<bank_account>;
    createBankAccount(span: opentracing.Span, createBankAccountDto: CreateBankAccountDto): Promise<bank_account>;
    updateBankAccount(span: opentracing.Span, id: string, updateBankAccountDto: Partial<CreateBankAccountDto>): Promise<bank_account>;
    deleteBankAccount(span: opentracing.Span, id: string): Promise<void>;
    private generateHashedKey;
}
