// Инициализация библиотек
import jwt from 'jsonwebtoken';
import logger from '../logger/logger';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Инициализация модулей
import Token from '../models/tokenModel';
import IToken from '../models/IModels/iToken';
import {DeleteResult} from 'mongodb';
import UserDto from '../dtos/userDto';

/**
 * @description - Класс сервис для генерации токенов и их обновления
 * @class
 */
class tokenService {
  /**
     * @description - генерация токена
     * @method
     * @async
     * @param payload - информация о пользователе
     */
  async generateToken(payload: UserDto)
        : Promise<{ accessToken: string, refreshToken: string } | undefined> {
    try {
      // Генерация access Token
      logger.log('Generating access Token...');
      const accessToken: string | undefined = jwt.sign({...payload},
          (process.env.SECRED_CODE_ACCESS as string)
          , {expiresIn: '30m'},
      );
      // Если произошла ошибка - выбрасываем ее
      if (!accessToken) {
        throw new Error('Error on generating access Token!');
      }
      logger.log('Access Token is: ' + accessToken);

      // Генерация refresh Token
      logger.log('Generating refresh Token...');
      const refreshToken: string | undefined = jwt.sign({...payload},
          (process.env.SECRED_CODE_REFRESH as string)
          , {expiresIn: '7d'},
      );
      // Если произошла ошибка - выбрасываем ее
      if (!refreshToken) {
        throw new Error('Error on generating refresh Token!');
      }
      logger.log('Refresh Token is: ' + refreshToken);

      // Возвращаем Token'ы
      return {
        accessToken,
        refreshToken,
      };
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on generateToken in Token service!');
      logger.error(error);
    }
  }

  /**
     * @description - сохранение нового или обновление старого refresh Token
     * @method
     * @async
     * @param userId - id пользователя
     * @param refreshToken - refresh Token пользователя
     */
  async saveToken(userId: string, refreshToken: string)
        : Promise<(mongoose.Document<unknown, any, IToken> & IToken & { _id: mongoose.Types.ObjectId }) | undefined> {
    try {
      // Поиск существующего token
      logger.log('Searching already exist refreshToken...');
      const tokenData: (mongoose.Document<unknown, any, IToken> & IToken & {_id: mongoose.Types.ObjectId}) | null =
                await Token.findOne({user: userId});
      // Если такой token есть, то обновляем его
      if (tokenData) {
        logger.log('refreshToken found.');
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
      }
      // Создание нового token
      logger.log('Generating new refresh Token...');
      const token: mongoose.Document<unknown, any, IToken> & IToken & {_id: mongoose.Types.ObjectId} | null =
                await Token.create({user: userId, refreshToken: refreshToken});
      // Если при генерации произошла ошибка - то выбрасываем ее
      if (!token) {
        throw new Error('Error on creating token on Token service!');
      }

      // Возвращаем новый refresh Token
      logger.log('Generated new refresh Token.');
      return token;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on saveToken in Token service!');
      logger.error(error);
    }
  }

  /**
     * @description - Метод удаления токена из БД
     * @async
     * @function
     * @param refreshToken - токен для выхода
     */
  async removeToken(refreshToken: string): Promise<DeleteResult | undefined> {
    try {
      logger.info('Removing Token from DB...');
      // Удаляем токен из БД
      const tokenData: DeleteResult | undefined = await Token.deleteOne({refreshToken: refreshToken});
      // Если там нет такого токена, то выбрасываем ошибку
      if (!tokenData) {
        throw new Error('Error on deleting token in DB!');
      }

      logger.info('Success removing Token from DB.');
      // Возвращаем информацию об этом
      return tokenData;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on removeToken in Token service!');
      logger.error(error);
    }
  }

  /**
     * @description - Метод поиска токена в БД
     * @async
     * @method
     * @param refreshToken - текущий refreshToken
     */
  async findToken(refreshToken: string): Promise<(mongoose.Document<unknown, any, IToken> & IToken & { _id: mongoose.Types.ObjectId }) | undefined> {
    try {
      logger.info('Searching Token in DB...');
      // Удаляем токен из БД
      const tokenData: (mongoose.Document<unknown, any, IToken> & IToken & {_id: mongoose.Types.ObjectId}) | null =
                await Token.findOne({refreshToken: refreshToken});
      // Если там нет такого токена, то выбрасываем ошибку
      if (!tokenData) {
        throw new Error('Error on deleting token in DB!');
      }
      // Возвращаем информацию об этом
      logger.info('Token found in DB.');
      return tokenData;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on removeToken in Token service!');
      logger.error(error);
    }
  }

  /**
     * @description - метод валидации AccessToken
     * @async
     * @method
     * @param token - токен
     */
  async validateAccessToken(token: string): Promise<string | jwt.JwtPayload | undefined> {
    try {
      // Валидируем токен
      logger.info('Validating Access Token...');
      const userData: string | jwt.JwtPayload = jwt.verify(token, process.env.SECRED_CODE_ACCESS as string);
      // Если произошла ошибка валидации, то выбрасываем ее
      if (!userData) {
        throw new Error('Error on validate Access Token!');
      }

      // Возвращаем данные об этом
      logger.info('Validating Access Token success.');
      return userData;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on validateAccessToken in Token service!');
      logger.error(error);
    }
  }

  /**
     * @description - метод валидации RefreshToken
     * @async
     * @method
     * @param token - токен
     */
  async validateRefreshToken(token: string): Promise<string | jwt.JwtPayload | undefined> {
    try {
      // Валидируем токен
      logger.info('Validating Refresh Token...');
      const userData: string | jwt.JwtPayload = jwt.verify(token, process.env.SECRED_CODE_REFRESH as string);
      // Если произошла ошибка валидации, то выбрасываем ее
      if (!userData) {
        throw new Error('Error on validate Access Token!');
      }

      // Возвращаем данные об этом
      logger.info('Validating Refresh Token success.');
      return userData;
    } catch (error) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on validateRefreshToken in Token service!');
      logger.error(error);
    }
  }
}

// Экспортируем данный модуль
export default new tokenService();
