import { Injectable, OnApplicationShutdown, Inject } from '@nestjs/common';
import { RedisService } from '../../../shared/services/redis/redis.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    private redisService: RedisService,
    @Inject('SEQUELIZE') private readonly orm: Sequelize,
  ) {}

  async onApplicationShutdown(signal: string) {
    await this.gracefulShutdown();
  }
  async gracefulShutdown() {
    this.redisService.client.quit();
    await this.orm.close();
  }
}
