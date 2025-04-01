import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/v1/user/user.service';
export declare class JwtAuthService {
    private readonly jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UserService);
    generateToken(user: any): Promise<string>;
    validateUser(payload: any): Promise<import("../database/models/user.model").User>;
}
