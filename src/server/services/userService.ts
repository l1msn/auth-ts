// Инициализация библиотек
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';
import logger from '../logger/logger';
import mongoose from 'mongoose';
import {DeleteResult} from 'mongodb';
import {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Инициализация модулей
import User from '../models/userModel';
import IToken from '../models/IModels/iToken';
import IUser from '../models/IModels/iUser';
import emailService from './emailService';
import tokenService from './tokenService';
import authError from '../exceptions/authError';
import UserDto from '../dtos/userDto';

// Класс сервис для аутентификации и действий пользователя
/**
 * @description - Класс сервис для аутентификации и действий пользователя
 * @class
 */
class userService {
  /**
     * @description - Метод сервиса пользователя для регистрации
     * @method
     * @async
     * @param email - email пользователя
     * @param password - пароль пользователя
     */
  async registration(email: string, password: string)
        : Promise<{ user: UserDto, accessToken: string, refreshToken: string } | undefined> {
    try {
      // Ищем пользователя в БД
      logger.log('Checking for already exist user...');
      const candidate: (mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId }) | null =
                await User.findOne({email: email});
      // Если такой пользователь есть - выбрасываем ошибку
      if (candidate) {
        throw new Error('User already exist!');
      }
      logger.log('User not found - creating new.');

      // Хэшируем пароль
      logger.log('Hashing password...');
      const hashPassword: string | undefined = bcrypt.hashSync(password, bcrypt.genSaltSync(3));
      // Если произошла ошибка шифрования - выбрасываем ошибку
      if (!hashPassword) {
        throw new Error('Hash password error!');
      }
      logger.log('Hash password is: ' + hashPassword);

      // Генерируем строку для ссылки активации
      logger.log('Generating new activationLink...');
      const activationLink: string | undefined = v4();
      // Если произошла ошибка при генерации - то выбрасываем ошибку
      if (!activationLink) {
        throw new Error('Error to generating link!');
      }
      logger.log('Activation link is: ' + activationLink);

      // Помещаем пользователя в БД
      logger.log('Adding new user to DB...');
      const user: mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId } =
                await User.create({email: email, password: hashPassword, activationLink: activationLink});
      // Если не получается поместить в БД - выбрасываем ошибку
      if (!user) {
        throw new Error('Error save user!');
      }
      logger.log('New user is: ' + user);

      // Отправляем на почту ссылку на активацию
      logger.log('Sending message to email...');
      await emailService.sendActivationEmail(email,
          ('http://localhost:' + process.env.PORT as string) +
                '/auth/activate/' + activationLink);

      // Создаем объект для трансфера данных пользователя
      logger.log('Creating Dto for user...');
      const userDto: UserDto | undefined = new UserDto(user);
      // Если не удается создать - то выбрасываем ошибку
      if (!userDto) {
        throw new Error('Error on creating user!');
      }

      // Генерируем токены
      logger.log('Generating new tokens...');
      const tokens: { accessToken: string, refreshToken: string } | undefined =
                await tokenService.generateToken(userDto);
      // Если не удается создать - то выбрасываем ошибку
      if (!tokens) {
        throw new Error('Error on generating tokens!');
      }

      // Сохраняем или обновляем токен
      logger.log('Saving or update refresh token...');
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      // Возвращаем токены и информацию о пользователе
      logger.log('Sending info and tokens...');
      return {
        ...tokens,
        user: userDto,
      };
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.error('Error on registration in User service!');
      logger.error(error);
    }
  }

  /**
     * @description - Метод активации пользователя
     * @method
     * @async
     * @param activationLink - ссылка активации
     */
  async activate(activationLink: string): Promise<void> {
    try {
      // Поиск пользователя по ссылке
      const user: (mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId }) | null =
                await User.findOne({activationLink: activationLink});
      if (!user) {
        throw new Error('Uncorrected link!');
      }

      // Изменение поля на активированный
      user.isActivated = true;
      await user.save();
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.log('Error on activating in User service!');
      logger.log(error);
    }
  }

  /**
     * @description - Метод логина пользователя
     * @method
     * @param email - email пользователя
     * @param password - пароль пользователя
     */
  async login(email: string, password: string)
        : Promise<{ user: UserDto, accessToken: string, refreshToken: string } | undefined> {
    try {
      // Ищем пользователя в БД
      logger.log('Checking for already exist user...');
      const user: (mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId }) | null =
                await User.findOne({email: email});
      // Если такой пользователь есть - выбрасываем ошибку
      if (!user) {
        throw new Error('User not exist!');
      }

      // Расхэшируем пароль
      logger.log('Rehashing password...');
      const isEqualPassword: boolean = bcrypt.compareSync(password, user.password);
      // Если произошла ошибка шифрования - выбрасываем ошибку
      if (!isEqualPassword) {
        throw new Error('Password not equal!');
      }
      logger.log('Password equal: ' + isEqualPassword);

      // Создаем объект для трансфера данных пользователя
      logger.log('Creating Dto for user...');
      const userDto: UserDto | undefined = new UserDto(user);
      // Если не удается создать - то выбрасываем ошибку
      if (!userDto) {
        throw new Error('Error on creating user!');
      }
      logger.log('User Dto created: ' + userDto.info());

      // Генерируем токены
      logger.log('Generating new tokens...');
      const tokens: { accessToken: string, refreshToken: string } | undefined =
                await tokenService.generateToken(userDto);
      // Если не удаться создать - то выбрасываем ошибку
      if (!tokens) {
        throw new Error('Error on generating tokens!');
      }

      // Сохраняем или обновляем токен
      logger.log('Saving or update refresh token...');
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      // Возвращаем токены и информацию о пользователе
      logger.log('Sending info and tokens...');
      return {
        ...tokens,
        user: userDto,
      };
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.log('Error on login in User service');
      logger.log(error);
    }
  }

  /**
     * @description - Метод выхода
     * @async
     * @method
     * @param refreshToken - токен для выхода
     */
  async logout(refreshToken: string): Promise<DeleteResult | undefined> {
    try {
      logger.log('Deleting token...');
      // Удаляем токен из БД
      const token: DeleteResult | undefined = await tokenService.removeToken(refreshToken);
      // Если не получилось удалить токен, то выкидываем ошибку
      if (!token) {
        throw new Error('Error on removing token!');
      }
      // Возвращаем данные о выходе пользователя и удалении токена
      logger.log('Success deleting token.');
      return token;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.log('Error on logout in User service!');
      logger.log(error);
    }
  }

  /**
     * @description - Метод обновления refreshToken
     * @async
     * @method
     * @param refreshToken - текущий refresh Token
     */
  async refresh(refreshToken: string)
        : Promise<{ user: UserDto, accessToken: string, refreshToken: string } | undefined> {
    try {
      // Проверка на наличие самого токена
      if (!refreshToken) {
        throw new Error('Not found Token!');
      }

      // Проводим валидацию самого Токена
      const userData: Promise<string | JwtPayload | undefined> | undefined =
                tokenService.validateRefreshToken(refreshToken);
      // Если валидация неудачная, то выбрасываем ошибку
      if (!userData) {
        throw authError.unauthorizedError();
      }

      // Ищем сам токен в БД
      const tokenFromDb: Promise<(mongoose.Document<unknown, any, IToken> & IToken & { _id: mongoose.Types.ObjectId }) | undefined> | undefined =
                tokenService.findToken(refreshToken);
      // Если его там нет, то выбрасываем ошибку
      if (!tokenFromDb) {
        throw authError.unauthorizedError();
      }

      // Создаем объект для трансфера данных пользователя
      logger.log('Creating Dto for user...');

      const user: mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId } | null =
                await User.findOne(userData.then((id) => {
                  return id;
                }));
      const userDto: UserDto | undefined = new UserDto(user);
      // Если не удается создать - то выбрасываем ошибку
      if (!userDto) {
        throw new Error('Error on creating user!');
      }

      // Генерируем токены
      logger.log('Generating new tokens...');
      const tokens = await tokenService.generateToken(userDto);
      // Если не удается создать - то выбрасываем ошибку
      if (!tokens) {
        throw new Error('Error on generating tokens!');
      }

      // Сохраняем или обновляем токен
      logger.log('Saving or update refresh token...');
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      // Возвращаем токены и информацию о пользователе
      logger.log('Sending info and tokens...');
      return {
        ...tokens,
        user: userDto,
      };
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.log('Error on refresh in User service');
      logger.log(error);
    }
  }

  /**
     * @description - Метод получения всех пользователей
     * @method
     * @async
     */
  async getAllUsers()
        : Promise<(mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId })[] | undefined> {
    try {
      logger.log('Taking data from DB...');
      // Получаем всех пользователей из БД
      const users: (mongoose.Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId })[] =
                await User.find({});
      // Если произошла ошибка, то выбрасываем ее
      if (!users) {
        throw new Error('Can\'t take data from DB!');
      }

      // Возвращаем список всех пользователей
      logger.log('Success got data form DB');
      return users;
    } catch (error: unknown | any) {
      // Обрабатываем ошибки и отправляем статус код
      logger.log('Error on getAllUsers in User service');
      logger.log(error);
    }
  }
}

// Экспортируем данный модуль
export default new userService();
