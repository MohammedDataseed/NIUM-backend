"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("./jwt.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const database_module_1 = require("../database/database.module");
const user_service_1 = require("../services/v1/user/user.service");
const shared_module_1 = require("../shared/shared.module");
const config_1 = require("@nestjs/config");
const mailer_module_1 = require("../shared/services/mailer/mailer.module");
const mailer_service_1 = require("../shared/services/mailer/mailer.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            database_module_1.DatabaseModule,
            passport_1.PassportModule,
            shared_module_1.SharedModule,
            mailer_module_1.MailModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const secret = configService.get('JWT_SECRET');
                    const expiresIn = configService.get('JWT_SECRET_EXPIRE');
                    if (!secret) {
                        throw new Error('JWT_SECRET is not defined in environment variables');
                    }
                    return { secret, signOptions: { expiresIn: expiresIn } };
                },
            }),
        ],
        providers: [jwt_service_1.JwtAuthService, user_service_1.UserService, mailer_service_1.MailerService],
        exports: [jwt_service_1.JwtAuthService, mailer_service_1.MailerService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map