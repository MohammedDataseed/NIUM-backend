//database.provider.ts
import { Sequelize } from "sequelize-typescript";
import { models } from "../models";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "../../shared/services/logger/logger.service";
import { NODE_ENV_VALUES } from "../../constants/general.constants";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async (config: ConfigService, logger: LoggerService) => {
      const sequelize = new Sequelize({
        host: config.get("PGHOST"),
        port: config.get("PGPORT"),
        database: config.get("PGDATABASE"),
        dialect: "postgres",
        username: config.get("PGUSER"),
        password: config.get("PGPASSWORD"),
        logging: (msg) => {
          if (config.get("NODE_ENV") === NODE_ENV_VALUES.DEVELOPMENT) {
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
      console.log("Loaded Models:", models);
      await sequelize.addModels(models);

      // Authenticate the connection
      await sequelize
        .authenticate()
        .then(() => {
          logger.info("Postgres DB - Connection successful");
        })
        .catch((error) => {
          logger.error(
            `DB - Connection failed. Error: ${error} ${config.get(
              "PGHOST"
            )} ${config.get("PGPORT")} ${config.get("PGUSER")} ${config.get(
              "PGDATABASE"
            )}`,
            error.message || error
          );
          process.exit(1);
        });


      // // Conditionally sync models based on environment
      // if (config.get("NODE_ENV") === NODE_ENV_VALUES.DEVELOPMENT) {
      //   // In development: Sync models and adjust tables if necessary
      //   await sequelize.sync({
      //     force: false, // Don't drop existing tables
      //     alter: true, // Automatically adjust tables to match models
      //     logging: console.log,
      //   });
      //   logger.info("Database synced successfully in development");
      // } else {
      //   // In production: Don't sync automatically (for safety)
      //   await sequelize.sync({
      //     force: false, // Don't drop tables in production
      //     alter: false, // Don't alter existing tables
      //   });
      //   logger.info("Database sync skipped in production");
      // }

      return sequelize;
    },
    inject: [ConfigService, LoggerService],
  },
];
