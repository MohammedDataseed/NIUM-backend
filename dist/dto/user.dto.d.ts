export declare class CreateUserDto {
    email: string;
    password: string;
    role_id: string;
    business_type: string;
    branch_id: string;
    bank_account_id?: string;
    is_active: boolean;
}
export declare class UpdateUserDto {
    email?: string;
    role_id?: string;
    business_type?: string;
    branch_id?: string;
    updated_by?: string;
    is_active?: boolean;
}
export declare class SendEmailDto {
    to: string;
    subject: string;
    text: string;
    html: string;
}
