import { RedisClient } from 'redis';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
export declare class RedisService {
    private logger;
    private readonly configService;
    client: RedisClient;
    private prefix;
    constructor(logger: LoggerService, configService: ConfigService);
    setValue(key: string, value: object): Promise<unknown>;
    setValueWithExpiry(key: string, value: object, expire: string): Promise<unknown>;
    delKey(key: string): Promise<boolean>;
    getValue(key: string): Promise<object | number | string | boolean | null>;
    private keyTransform;
    getExactKeyValue(key: string): Promise<object | number | string | boolean | null>;
    setExactKeyWithExpiry(key: string, value: object | boolean, expire: string): Promise<boolean>;
    closeConnection(): Promise<unknown>;
}
