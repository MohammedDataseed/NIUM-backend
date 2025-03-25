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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const config_1 = require("@nestjs/config");
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
let LoggerService = class LoggerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = (0, winston_1.createLogger)(this.logOptions());
        this.addTransportConsole();
    }
    logOptions() {
        return {
            level: this.configService.get('LOGGER_LEVEL') || 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json(), winston_1.format.colorize()),
        };
    }
    getTransportConsoleOptions() {
        return {
            debugStdout: false,
        };
    }
    getTransportS3Options() {
        return new S3StreamLogger({
            bucket: this.configService.get('S3_LOG_BUCKET'),
            access_key_id: this.configService.get('S3_LOG_ACCESS_ID'),
            folder: `${this.configService.get('S3_LOG_FOLDER')}/${this.configService.get('NODE_ENV')}`,
            tags: { type: 'log', project: 'retail' },
            secret_access_key: this.configService.get('S3_LOG_ACCESS_KEY'),
            max_file_size: '10Mb',
        });
    }
    addTransportConsole() {
        this.logger.add(new winston_1.transports.Console(this.getTransportConsoleOptions()));
    }
    addS3Logger() {
        this.logger.add(new winston_1.transports.Stream({
            stream: this.getTransportS3Options(),
        }));
    }
    info(message, data) {
        this.logger.info(message, data);
    }
    error(message, data) {
        this.logger.error(message, data);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map