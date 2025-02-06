import { Sequelize } from 'sequelize-typescript';
import Mongoose from 'mongoose';
import { models } from '../models';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../shared/services/logger/logger.service';
import { NODE_ENV_VALUES } from '../../constants/general.constants';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (config: ConfigService, logger: LoggerService) => {
      if (config.get('NODE_ENV') === NODE_ENV_VALUES.TEST) {
        return new Sequelize({
          validateOnly: true,
          models: [...models],
        });
      }

      const sequelize = new Sequelize({
        host: config.get('PGHOST'),
        port: config.get('PGPORT'),
        database: config.get('PGDATABASE'),
        dialect: 'postgres',
        username: config.get('PGUSER'),
        password: config.get('PGPASSWORD'),
        logging: (msg) => {
          if (config.get('NODE_ENV') === NODE_ENV_VALUES.DEVELOPMENT) {
            logger.info(msg);
          }
        },
        query: {
          raw: false,
          nest: true,
        },
        dialectOptions: {
          connectTimeout: 3000,
          application_name: config.get('SERVICE_NAME'),
        },
        pool: {
          max: parseInt(config.get('PGMAX'), 10) || 5,
          min: 1,
          idle: config.get('PGIDLETIMEOUT'),
        },
      });
      await sequelize.addModels(models);
      await sequelize
        .authenticate()
        .then(() => {
          logger.info('Postgres DB - Connection successful');
        })
        .catch((error) => {
          // logger.error(
          //   `DB - Connection failed.Error: ${error} ${databaseProviders[0].name} ${config.get('PGHOST')} ${config.get('PGPORT')} ${config.get(
          //     'PGUSER',
          //   )} ${config.get('PGDATABASE')}`,
          //   error.message || error,
          // );
          
          logger.error(
            `DB - Connection failed.Error: ${error} ${config.get('PGHOST')} ${config.get('PGPORT')} ${config.get(
              'PGUSER',
            )} ${config.get('PGDATABASE')}`,
            error.message || error,
          );
          process.exit(1);
        });
      return sequelize;
    },
    inject: [ConfigService, LoggerService],
  },
  // {
  //   name: 'MongoDBProvider',
  //   provide: 'MONGO',
  //   useFactory: async (config: ConfigService, logger: LoggerService) => {
  //     const uri = config.get('MONGO_DB_URL');
  //     const connectionString = `${uri}`;
  //     Mongoose.connection.on('connected', async () => {
  //       logger.info(`${config.get('SERVICE_NAME')} :: DB - Connection successful to MongoDB`);
  //     });
  //     Mongoose.connection.on('error', (error) => {
  //       logger.error(`${config.get('SERVICE_NAME')} :: DB - Connection failed.`, error.message || error);
  //     });
  //     Mongoose.connection.on('disconnected', () => {
  //       logger.info(`${config.get('SERVICE_NAME')} :: Mongoose default connection disconnected`);
  //     });
  //     await Mongoose.connect(connectionString);
  //     const conn: Mongoose.Connection = Mongoose.connection;
  //     return conn;
  //   },
  //   inject: [ConfigService, LoggerService],
  // },
];
