export declare class CreateBankAccountDto {
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    bank_branch: string;
    ifsc_code: string;
    is_beneficiary?: boolean;
}
export declare class UpdateBankAccountDto {
    account_holder_name?: string;
    account_number?: string;
    bank_name?: string;
    bank_branch?: string;
    ifsc_code?: string;
    is_beneficiary?: boolean;
}
