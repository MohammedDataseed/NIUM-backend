import { createClient, RedisClient } from 'redis';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { createClient as createMockClient } from 'redis-mock';
import { NODE_ENV_VALUES } from '../../../constants/general.constants';

@Injectable()
export class RedisService {
  public client!: RedisClient;
  private prefix = 'retail:instapoints';

  constructor(private logger: LoggerService, private readonly configService: ConfigService) {
    if (configService.get('NODE_ENV') === NODE_ENV_VALUES.TEST) {
      this.client = createMockClient();
      return;
    } else {
      this.client = createClient({ url: this.configService.get('REDIS_CONNECTION_URL'), db: this.configService.get('REDIS_DB') || 0 });
    }

    this.client.on('error', err => {
      this.logger.error('Cannot make redis connection');
      process.kill(process.pid, 'SIGINT');
    });
    this.client.on('ready', err => {
      this.logger.info(`Redis connected at ${this.configService.get('REDIS_CONNECTION_URL')}`);
    });
  }

  public async setValue(key: string, value: object) {
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

  public async setValueWithExpiry(key: string, value: object, expire: string) {
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

  public async delKey(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  public async getValue(key: string): Promise<object | number | string | boolean | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(response));
      });
    });
  }

  private keyTransform(key: string, disablePrefix = false) {
    key = key.replace('{{env}}', this.configService.get('NODE_ENV'));
    return disablePrefix ? key : `${this.prefix}:${key}`;
  }

  public async getExactKeyValue(key: string): Promise<object | number | string | boolean | null> {
    return new Promise((resolve, reject) => {
      this.client.get(this.keyTransform(key, true), (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(response));
      });
    });
  }

  public async setExactKeyWithExpiry(key: string, value: object | boolean, expire: string): Promise<boolean> {
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

  public async closeConnection() {
    return new Promise((resolve, reject) => {
      this.client.quit((err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
