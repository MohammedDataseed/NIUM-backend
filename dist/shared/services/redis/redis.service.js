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
exports.RedisService = void 0;
const redis_1 = require("redis");
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const config_1 = require("@nestjs/config");
const redis_mock_1 = require("redis-mock");
const general_constants_1 = require("../../../constants/general.constants");
let RedisService = class RedisService {
    constructor(logger, configService) {
        this.logger = logger;
        this.configService = configService;
        this.prefix = 'retail:instapoints';
        if (configService.get('NODE_ENV') === general_constants_1.NODE_ENV_VALUES.TEST) {
            this.client = (0, redis_mock_1.createClient)();
            return;
        }
        else {
            this.client = (0, redis_1.createClient)({ url: this.configService.get('REDIS_CONNECTION_URL'), db: this.configService.get('REDIS_DB') || 0 });
        }
        this.client.on('error', err => {
            this.logger.error('Cannot make redis connection');
            process.kill(process.pid, 'SIGINT');
        });
        this.client.on('ready', err => {
            this.logger.info(`Redis connected at ${this.configService.get('REDIS_CONNECTION_URL')}`);
        });
    }
    async setValue(key, value) {
        return new Promise((resolve, reject) => {
            const _value = JSON.stringify(value);
            this.client.set(key, _value, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            });
        });
    }
    async setValueWithExpiry(key, value, expire) {
        return new Promise((resolve, reject) => {
            const stringifiedValue = JSON.stringify(value);
            this.client.set(key, stringifiedValue, (err, response) => {
                if (err) {
                    return reject(err);
                }
                this.client.expire(key, parseInt(expire, 10));
                resolve(response);
            });
        });
    }
    async delKey(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
    async getValue(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(response));
            });
        });
    }
    keyTransform(key, disablePrefix = false) {
        key = key.replace('{{env}}', this.configService.get('NODE_ENV'));
        return disablePrefix ? key : `${this.prefix}:${key}`;
    }
    async getExactKeyValue(key) {
        return new Promise((resolve, reject) => {
            this.client.get(this.keyTransform(key, true), (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(response));
            });
        });
    }
    async setExactKeyWithExpiry(key, value, expire) {
        return new Promise((resolve, reject) => {
            const _value = JSON.stringify(value);
            this.client.setex(this.keyTransform(key, true), parseInt(expire, 10), _value, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
    async closeConnection() {
        return new Promise((resolve, reject) => {
            this.client.quit((err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map