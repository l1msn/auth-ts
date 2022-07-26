import authError from "../exceptions/authError";
import tokenService from "../services/tokenService";
import {JwtPayload} from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";

/**
 * @description - Модуль проверки авторизированного пользователя
 * @function
 * @module
 * @param request - запрос
 * @param response - ответ
 * @param next - следующая middleware
 */
function authHandler(request: Request, response: Response, next: NextFunction): void {
    try {
        //Получаем Access token из request
        const authHeader: string | undefined = request.headers.authorization;
        //Если его тут нет, то выбрасываем ошибку
        if(!authHeader)
            return next(authError.unauthorizedError());
        //Отделяем непосредственно сам токен
        const accessToken: string | undefined = authHeader.split(' ')[1];
        //Если не получается выделить строку, то выбрасываем ошибку
        if(!accessToken)
            return next(authError.unauthorizedError());

        //Проверяем полученный токен на валидность
        const userData: Promise<string | JwtPayload | undefined> = tokenService.validateAccessToken(accessToken);
        //Если не валидный, то ошибочка вышла)))
        if(!userData)
            return next(authError.unauthorizedError());

        //Ну сохраняем данные
        //request.user = user;
        request.body.user = userData;
        next();
    } catch (error: unknown | any) {
        return next(authError.unauthorizedError());
    }
}


//Экспортируем данный модуль
export default authHandler;