import { OnApplicationShutdown } from '@nestjs/common';
import { RedisService } from '../../../shared/services/redis/redis.service';
import { Sequelize } from 'sequelize-typescript';
export declare class ShutdownService implements OnApplicationShutdown {
    private redisService;
    private readonly orm;
    constructor(redisService: RedisService, orm: Sequelize);
    onApplicationShutdown(signal: string): Promise<void>;
    gracefulShutdown(): Promise<void>;
}
