import { UserService } from '../services/v1/user/user.service';
import { JwtPayload } from './jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<import("../database/models/user.model").User>;
}
export {};
