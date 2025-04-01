"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../models");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("../../shared/services/logger/logger.service");
const general_constants_1 = require("../../constants/general.constants");
exports.databaseProviders = [
    {
        provide: "SEQUELIZE",
        useFactory: async (config, logger) => {
            const sequelize = new sequelize_typescript_1.Sequelize({
                host: config.get("PGHOST"),
                port: config.get("PGPORT"),
                database: config.get("PGDATABASE"),
                dialect: "postgres",
                username: config.get("PGUSER"),
                password: config.get("PGPASSWORD"),
                logging: (msg) => {
                    if (config.get("NODE_ENV") === general_constants_1.NODE_ENV_VALUES.DEVELOPMENT) {
                        console.log("dev");
                        logger.info(msg);
                    }
                },
                query: {
                    raw: false,
                    nest: true,
                },
                dialectOptions: {
                    connectTimeout: 3000,
                    application_name: config.get("SERVICE_NAME"),
                },
                pool: {
                    max: parseInt(config.get("PGMAX"), 10) || 5,
                    min: 1,
                    idle: config.get("PGIDLETIMEOUT"),
                },
            });
            console.log("Loaded Models:", models_1.models);
            await sequelize.addModels(models_1.models);
            await sequelize
                .authenticate()
                .then(() => {
                logger.info("Postgres DB - Connection successful");
                logger.info(`DB : ${config.get("PGHOST")} ${config.get("PGPORT")} ${config.get("PGUSER")} ${config.get("PGDATABASE")}`);
            })
                .catch((error) => {
                logger.error(`DB - Connection failed. Error: ${error} ${config.get("PGHOST")} ${config.get("PGPORT")} ${config.get("PGUSER")} ${config.get("PGDATABASE")}`, error.message || error);
                process.exit(1);
            });
            return sequelize;
        },
        inject: [config_1.ConfigService, logger_service_1.LoggerService],
    },
];
//# sourceMappingURL=database.provider.js.map