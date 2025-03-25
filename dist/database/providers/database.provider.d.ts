import { Sequelize } from "sequelize-typescript";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "../../shared/services/logger/logger.service";
export declare const databaseProviders: {
    provide: string;
    useFactory: (config: ConfigService, logger: LoggerService) => Promise<Sequelize>;
    inject: (typeof ConfigService | typeof LoggerService)[];
}[];
