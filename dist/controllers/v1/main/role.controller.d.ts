import { RoleService } from "../../../services/v1/role/role.service";
import { Role } from "../../../database/models/role.model";
import { CreateRoleDto, UpdateRoleDto } from "src/dto/role.dto";
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    findAll(params: Record<string, any>): Promise<Role[]>;
    createRole(createRoleDto: CreateRoleDto): Promise<Role>;
    updateStatus(body: UpdateRoleDto): Promise<Role>;
}
