// Инициализация библиотек
import {Response, Request, NextFunction} from 'express';
import {validationResult, Result, ValidationError} from 'express-validator';
import {DeleteResult} from 'mongodb';
import {Document, Types} from 'mongoose';

// Инициализация модулей
import userService from '../services/userService';
import authError from '../exceptions/authError';
import logger from '../logger/logger';
import IUser from '../models/IModels/iUser';
import userDto from '../dtos/userDto';


// Класс контроллер для аутентификации и действий пользователя
/**
 * @description - Класс контроллер для аутентификации и действий пользователя
 * @class
 */
class UserController {
  /**
     * @description - Метод регистрации пользователя
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<void | Response<any, Record<string, any>>>}
     */
  public async registration(request: Request, response: Response, next: NextFunction)
        : Promise<void | Response<any, Record<string, any>>> {
    try {
      // Получим ошибки валидации
      logger.info('Checking for validation errors...');
      const errorValid: Result<ValidationError> = validationResult(request);
      if (!errorValid.isEmpty()) {
        return next(authError.badRequest('Validation error!', errorValid.array()));
      }
      logger.info('Validation success.');

      // Получаем из тела запроса данные
      logger.log('Getting data from request...');
      const {email, password} = request.body;
      if (!email || !password) {
        return next(authError.badRequest('Not found data in request!'));
      }
      logger.log('Data are: ' + email + ' , ' + password + '.');

      // Регистрируем пользователя
      logger.log('Registration new user...');
      const userData: { user: userDto, accessToken: string, refreshToken: string } | undefined =
                await userService.registration(email, password);
      // Если не получается - выбрасываем ошибку
      if (!userData) {
        return next(authError.badRequest('Error on registration!', ['User already exist!']));
      }
      logger.info('New user is created.');

      // Добавляем в cookie refreshToken
      response.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});

      // Возвращаем данные
      return response.json(userData);
    } catch (error: unknown | any) {
      logger.error('Error on registration in Controller!');
      next(error);
    }
  }

  /**
     * @description - Метод авторизации пользователя
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<void | Response<any, Record<string, any>>>}
     */
  public async login(request: Request, response: Response, next: NextFunction)
        : Promise<void | Response<any, Record<string, any>>> {
    try {
      // Получим ошибки валидации
      logger.info('Checking for validation errors...');
      const errorValid: Result<ValidationError> = validationResult(request);
      if (!errorValid.isEmpty()) {
        return next(authError.badRequest('Validation error!', errorValid.array()));
      }

      // Получаем из тела запроса данные
      logger.log('Getting data from request...');
      const {email, password} = request.body;
      if (!email || !password) {
        return next(authError.badRequest('Not found data in request!'));
      }
      logger.log('Data are: ' + email + ' , ' + password + '.');

      // Логин пользователя
      logger.log('Login user...');
      const userData: { user: userDto, accessToken: string, refreshToken: string } | undefined =
                await userService.login(email, password);
      if (!userData) {
        return next(authError.badRequest('Error on login!'));
      }
      logger.info('Success auth login.');

      // Добавляем в cookie refreshToken
      response.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});

      // Возвращаем данные
      return response.json(userData);
    } catch (error: unknown | any) {
      logger.error('Error on login in Controller!');
      next(error);
    }
  }

  /**
     * @description - Метод выхода из сессии пользователя
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<void | Response<any, Record<string, any>>>}
     */
  public async logout(request: Request, response: Response, next: NextFunction)
        : Promise<void | Response<any, Record<string, any>>> {
    try {
      logger.info('Logout process...');
      // Получаем токен из request'a
      const {refreshToken} = request.cookies;
      // Если его нет, то выбрасываем ошибку
      if (!refreshToken) {
        return next(authError.badRequest('Not found a token in request!'));
      }

      // Выходим из сессии\удаляем токен
      const token: DeleteResult | undefined = await userService.logout(refreshToken);
      // Если из информации об удаление нет, то выбрасываем ошибку
      if (!token) {
        return next(authError.badRequest('Can\'t logout and removing token!'));
      }
      // Выводим информацию об этом
      logger.log(token as unknown as string);

      // Удаляем токен локально
      response.clearCookie('refreshToken');
      logger.info('Success logout.');
      // Возвращаем данные
      return response.json(token);
    } catch (error: unknown | any) {
      logger.error('Error on logout in Controller!');
      next(error);
    }
  }

  /**
     * @description - Метод активации пользователя
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<Response | void>}
     */
  public async activate(request: Request, response: Response, next: NextFunction)
        : Promise<Response | void> {
    try {
      logger.info('Activation user by email...');
      // Получаем ссылку активации
      const activationLink: string | undefined = request.params.link;
      // Если ее нет - выбрасываем ошибку
      if (!activationLink) {
        return next(authError.badRequest('Cannot get activation Link!'));
      }

      // Активируем пользователя
      await userService.activate(activationLink);
      logger.info('Activation user success.');

      // Производим перенаправление на клиентскую часть фронта
      return response.redirect(process.env.CLIENT_URL as string);
    } catch (error: unknown | any) {
      logger.error('Error on activating user in Controller!');
      next(error);
    }
  }

  /**
     * @description - Метод получения нового refresh token пользователя
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<void | Response<any, Record<string, any>>>}
     */
  public async refresh(request: Request, response: Response, next: NextFunction)
        : Promise<void | Response<any, Record<string, any>>> {
    try {
      logger.info('Refreshing Token...');
      // Ищем токен в cookie's
      const {refreshToken} = request.cookies;
      // Если его нет, то выбрасываем ошибку
      if (!refreshToken) {
        return next(authError.badRequest('Not found a token in request!'));
      }

      // Обновляем токен
      const userData: { user: userDto, accessToken: string, refreshToken: string } | undefined =
                await userService.refresh(refreshToken);
      // Если произошла ошибка при обновлении - выбрасываем ошибку
      if (!userData) {
        return next(authError.unauthorizedError());
      }

      // Добавляем в cookie новый refreshToken
      response.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});

      logger.info('Refreshing Token success.');
      // Возвращаем данные
      return response.json(userData);
    } catch (error: unknown | any) {
      logger.error('Error on refresh token in Controller!');
      next(error);
    }
  }

  /**
     * @description - Метод получения всех пользователей для Admin
     * @method
     * @async
     * @param request {Request} - запрос
     * @param response {Response} - ответ
     * @param next {NextFunction} - следующая middleware функции
     * @return {Promise<void | Response<any, Record<string, any>>>}
     */
  public async getUsers(request: Request, response: Response, next: NextFunction)
        : Promise<void | Response<any, Record<string, any>>> {
    try {
      logger.info('Getting all users...');
      // Получаем всех пользователей
      const users: (Document<unknown, any, IUser> & IUser & { _id: Types.ObjectId })[] | undefined =
                await userService.getAllUsers();
      // Если не получили, то выбросили ошибку
      if (!users) {
        return next(authError.unauthorizedError());
      }

      logger.info('Got all users.');
      logger.info('All users:' + users);
      return response.json(users);
    } catch (error: unknown | any) {
      logger.error('Error on getting users in Controller!');
      next(error);
    }
  }
}

// Экспортируем данный модуль
export default new UserController();
