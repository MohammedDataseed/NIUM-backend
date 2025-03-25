import { Logger as Iwinston } from 'winston';
import { ConfigService } from '@nestjs/config';
export declare class LoggerService {
    private configService;
    logger: Iwinston;
    constructor(configService: ConfigService);
    private logOptions;
    private getTransportConsoleOptions;
    private getTransportS3Options;
    private addTransportConsole;
    private addS3Logger;
    info(message: string, data?: any): void;
    error(message: string, data?: {
        error: any;
    }): void;
}
