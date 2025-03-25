import { UserService, UserCreationResponse } from "../../../services/v1/user/user.service";
import { User } from "../../../database/models/user.model";
import { CreateUserDto, UpdateUserDto, SendEmailDto } from "../../../dto/user.dto";
import { LoginDto } from "src/dto/login.dto";
import { MailerService } from "src/shared/services/mailer/mailer.service";
export declare class UserController {
    private readonly userService;
    private readonly mailService;
    constructor(userService: UserService, mailService: MailerService);
    findAll(params: Record<string, any>): Promise<User[]>;
    createUser(createUserDto: CreateUserDto, authHeader: string): Promise<UserCreationResponse>;
    update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<User>;
    delete(id: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        access_token: string;
        refresh_token: string;
    }>;
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
    sendEmail(body: SendEmailDto): Promise<{
        message: string;
        result: any;
        error?: undefined;
    } | {
        message: string;
        error: any;
        result?: undefined;
    }>;
}
