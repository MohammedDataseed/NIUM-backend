import { ArgumentsHost } from '@nestjs/common';
import { LoggerService } from '../shared/services/logger/logger.service';
export declare class GlobalExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(exception: any, host: ArgumentsHost): any;
}
