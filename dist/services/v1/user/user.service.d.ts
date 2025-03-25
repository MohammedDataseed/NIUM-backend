import { WhereOptions } from "sequelize";
import { User } from "../../../database/models/user.model";
import { Role } from "src/database/models/role.model";
import { Branch } from "src/database/models/branch.model";
import { bank_account } from "src/database/models/bank_account.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { CreateUserDto, UpdateUserDto } from "src/dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "src/dto/login.dto";
import { MailerService } from "src/shared/services/mailer/mailer.service";
export interface UserCreationResponse {
    message: string;
    user: User;
}
export declare class UserService {
    private readonly userRepository;
    private readonly branchRepository;
    private readonly roleRepository;
    private readonly bankAccountRepository;
    private readonly tracerService;
    private readonly jwtService;
    private readonly mailService;
    constructor(userRepository: typeof User, branchRepository: typeof Branch, roleRepository: typeof Role, bankAccountRepository: typeof bank_account, tracerService: TracerService, jwtService: JwtService, mailService: MailerService);
    createUser(span: opentracing.Span, createUserDto: CreateUserDto, jwt: string): Promise<any>;
    private isValidUUID;
    updateUser(span: opentracing.Span, id: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(span: opentracing.Span, id: string): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        access_token: string;
        refresh_token: string;
    }>;
    findAll(span: opentracing.Span, params: WhereOptions<User>): Promise<User[]>;
    findByEmail(email: string): Promise<User>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{
        message: string;
    }>;
}
