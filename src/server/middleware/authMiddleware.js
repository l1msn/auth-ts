const authError = require("../exceptions/authError");
const tokenService = require("../services/tokenService");

/**
 * @description - Модуль проверки авторизированного пользователя
 * @function
 * @module
 * @param request - запрос
 * @param response - ответ
 * @param next - следующая middleware
 */
function authHandler(request,response,next) {
    try{
        //Получаем Access token из request
        const authHeader = request.headers.authorization;
        //Если его тут нет, то выбрасываем ошибку
        if(!authHeader)
            return next(authError.unauthorizedError());
        //Отделяем непосредственно сам токен
        const accessToken = authHeader.split(' ')[1];
        //Если не получается выделить строку, то выбрасываем ошибку
        if(!accessToken)
            return next(authError.unauthorizedError());

        //Проверяем полученный токен на валидность
        const userData = tokenService.validateAccessToken(accessToken);
        //Если не валидный, то ошибочка вышла)))
        if(!userData)
            return next(authError.unauthorizedError());

        //Ну сохраняем данные
        request.user = userData;
        next();
    } catch (error) {
        return next(authError.unauthorizedError());
    }
}


//Экспортируем данный модуль
module.exports = authHandler;