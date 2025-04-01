"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../shared/services/logger/logger.service");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        try {
            let status = 500;
            let errorResponse = {
                message: 'Something went wrong',
                error: 'Internal Server Error',
                statusCode: 500,
            };
            if (exception.name && exception.name.includes('Sequelize')) {
                status = 500;
                errorResponse = {
                    message: exception.message,
                    error: exception.name,
                    statusCode: 500,
                };
            }
            else if (exception instanceof common_1.HttpException) {
                status = exception.getStatus();
                errorResponse = exception.getResponse();
            }
            else {
                this.logger.error('Unexpected error:', exception);
            }
            this.logger.error(`Name: ${errorResponse.error} | Message: ${errorResponse.message} | Status: ${errorResponse.statusCode}`);
            response.status(status).json(errorResponse);
        }
        catch (err) {
            this.logger.error('Uncaught exception in GlobalExceptionFilter:', err);
            return response.status(500).json({ message: 'Something went wrong' });
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], GlobalExceptionFilter);
//# sourceMappingURL=exception.filter.js.map