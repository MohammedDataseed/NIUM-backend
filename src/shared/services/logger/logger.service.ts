import { Injectable } from '@nestjs/common';
import {
  createLogger,
  transports,
  Logger as Iwinston,
  LoggerOptions,
  format,
} from 'winston';
import { ConfigService } from '@nestjs/config';

const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;

@Injectable()
export class LoggerService {
  public logger: Iwinston;
  constructor(private configService: ConfigService) {
    this.logger = createLogger(this.logOptions());
    this.addTransportConsole();

    // this.addS3Logger();
  }

  private logOptions(): LoggerOptions {
    return {
      level: this.configService.get<string>('LOGGER_LEVEL') || 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.colorize(),
      ),
    };
  }
  private getTransportConsoleOptions(): transports.ConsoleTransportOptions {
    return {
      debugStdout: false,
    };
  }

  private getTransportS3Options() {
    return new S3StreamLogger({
      bucket: this.configService.get<string>('S3_LOG_BUCKET'),
      access_key_id: this.configService.get<string>('S3_LOG_ACCESS_ID'),
      folder: `${this.configService.get<string>(
        'S3_LOG_FOLDER',
      )}/${this.configService.get<string>('NODE_ENV')}`,
      tags: { type: 'log', project: 'retail' },
      secret_access_key: this.configService.get<string>('S3_LOG_ACCESS_KEY'),
      max_file_size: '10Mb',
    });
  }

  private addTransportConsole() {
    this.logger.add(new transports.Console(this.getTransportConsoleOptions()));
  }

  private addS3Logger() {
    this.logger.add(
      new transports.Stream({
        stream: this.getTransportS3Options(),
      }),
    );
  }

  public info(message: string, data?: any): void {
    this.logger.info(message, data);
  }

  public error(message: string, data?: { error: any }): void {
    this.logger.error(message, data);
  }
}
