//Инициализация модулей
import {NextFunction, Request, Response} from "express";

import authError from "../exceptions/authError";
import logger from "../logger/logger"

/**
 * @description - Функция обработчик ошибок
 * @function
 * @module
 * @param error - сама ошибка
 * @param request - запрос к серверу
 * @param response - ответ от сервера
 * @param next - следующая middleware
 */
function errorHandler(error: authError | Error, request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined {
    try {
        //Выводим ошибку в логи
        logger.error(error);
        //Если это известная нам ошибка (описана в exceptions), то возвращаем уже готовую форму ошибки
        if (error instanceof authError) {
            return response.status(error.status).json({message: error.message, errors: error.errors});
        }
        //... могут быть еще другие ошибки

        //Если же это неизвестная ошибка, возвращаем готовую схему
        return response.status(500).json({message: "Unexpected error from server!"});
    } catch (error: unknown | any) {
        //Обрабатываем ошибки и отправляем статус код
        logger.error("Error on errorHandler in errorMiddleware!")
        logger.error(error);
    }
}

//Экспортируем данный модуль
export default errorHandler;