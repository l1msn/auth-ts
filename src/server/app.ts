// Инициализация библиотек
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import {graphqlHTTP} from 'express-graphql';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Инициализация модулей
import swaggerOptions from './middleware/swagger/swaggerOptions';
import logger from './logger/logger';
import router from './routes/index';
import errorHandler from './middleware/errorMiddleware';
import graphUserModel from './models/graphqlSchemas/graphUserModel';

dotenv.config();

/**
 * @description - Основное приложение сервера
 * @class
 */
class App {
  public express: express.Application = express();

  constructor() {
    try {
      logger.info('Loading Application...');

      this.database();
      this.middlewares();
      this.routes();
      this.errors();

      logger.info('Success load Application.');
    } catch (error: unknown | Error) {
      logger.fatal('Error on creating Application object!');
      logger.error(error);
    }
  }

  private database() {
    try {
      logger.log('Database connecting...');
      mongoose.connect(
          'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_NAME,
      ).catch(() => {
        throw new Error('Error on mongoose connect!');
      });

      logger.log('Database connected.');
    } catch (error: unknown | any) {
      logger.fatal('Error on connection to DataBase of Application!');
      logger.error(error);
    }
  }

  private middlewares() {
    try {
      logger.log('Middlewares including...');

      // Инициализируем возможность работы с json
      this.express.use(express.json());
      // Инициализируем возможность работы с cookieParser
      this.express.use(cookieParser());
      // Инициализируем возможность работы с cors
      this.express.use(cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
      }));
      // Подключаем SwaggerDoc
      this.express.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

      this.express.use(
          '/graphql',
          graphqlHTTP({
            schema: graphUserModel,
            graphiql: true,
          }),
      );

      logger.log('Middlewares included.');
    } catch (error: unknown | any) {
      logger.fatal('Error on including middlewares of Application!');
      logger.error(error);
    }
  }

  private routes() {
    try {
      logger.log('Routing including...');

      // Маршрутизация
      this.express.use('/auth', router);

      logger.log('Routing included.');
    } catch (error: unknown | any) {
      logger.fatal('Error on including routes of Application!');
      logger.error(error);
    }
  }

  private errors() {
    try {
      logger.log('Error middleware including...');

      // Обработчик ошибок
      this.express.use(errorHandler);

      logger.log('Error middleware included.');
    } catch (error: unknown | any) {
      logger.fatal('Error on creating including Error Middleware object!');
      logger.error(error);
    }
  }
}

export default new App().express;
