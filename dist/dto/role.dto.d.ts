export declare class CreateRoleDto {
    name: string;
    status?: boolean;
    created_by: string;
}
export declare class UpdateRoleDto {
    hashed_key: string;
    name?: string;
    status?: boolean;
    updated_by?: string;
}
export declare class DeleteRoleDto {
    hashed_key: string;
    deleted_by: string;
}
export declare class RoleResponseDto {
    hashed_key: string;
    name: string;
    status: boolean;
    created_by: string;
    updated_by?: string;
}
