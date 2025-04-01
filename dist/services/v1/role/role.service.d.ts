import { Role } from "../../../database/models/role.model";
import { User } from "src/database/models/user.model";
import * as opentracing from "opentracing";
import { CreateRoleDto, UpdateRoleDto } from "../../../dto/role.dto";
import { WhereOptions } from "sequelize";
export declare class RoleService {
    private readonly roleRepository;
    private readonly userRepository;
    constructor(roleRepository: typeof Role, userRepository: typeof User);
    findAll(span: opentracing.Span, params: WhereOptions<Role>): Promise<Role[]>;
    findOne(span: opentracing.Span, id: string): Promise<Role>;
    createRole(span: opentracing.Span, createRoleDto: CreateRoleDto): Promise<Role>;
    updateRole(span: opentracing.Span, hashedKey: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
}
