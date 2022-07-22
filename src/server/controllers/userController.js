//Инициализация библиотек
require("dotenv").config()

//Инициализация модулей
const userService = require("../services/userService");
const authError = require("../exceptions/authError");
const validator = require("express-validator");

//Класс контроллер для аутентификации и действий пользователя
/**
 * @description - Класс контроллер для аутентификации и действий пользователя
 * @class
 */
class UserController{
    /**
     * @description - Метод регистрации пользователя
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async registration(request,response,next){
        try {
            //Получим ошибки валидации
            console.log("Checking for validation errors...");
            const errorValid = validator.validationResult(request);
            if(!errorValid.isEmpty())
                return next(authError.badRequest("Validation error", errorValid.array()));

            //Получаем из тела запроса данные
            console.log("Getting data from request...")
            const {email, password} = request.body;
            if(!email || !password)
                return next(authError.badRequest("Not found data in request"));
            console.log("Data are: " + email + " , " + password);

            //Регистрируем пользователя
            console.log("Registration new user...")
            const userData = await userService.registration(email, password);
            //Если не получается - выбрасываем ошибку
            if(!userData)
                return next(authError.badRequest("Error on registration"));
            console.log("New user is created");

            //Добавляем в cookie refreshToken
            response.cookie("refreshToken", userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});

            //Возвращаем данные
            return response.json(userData);
        } catch (error){
            console.log("Error on registration in Controller")
            next(error);
        }
    }
    /**
     * @description - Метод авторизации пользователя
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async login(request,response,next){
        try {
            //Получим ошибки валидации
            console.log("Checking for validation errors...");
            const errorValid = validator.validationResult(request);
            if(!errorValid.isEmpty())
                return next(authError.badRequest("Validation error", errorValid.array()));

            //Получаем из тела запроса данные
            console.log("Getting data from request...");
            const {email, password} = request.body;
            if(!email || !password)
                return next(authError.badRequest("Not found data in request"));
            console.log("Data are: " + email + " , " + password);

            //Логин пользователя
            console.log("Login user...")
            const userData = await userService.login(email, password);
            if(!userData)
                return next(authError.badRequest("Error on login"));
            console.log("Success auth login")

            //Добавляем в cookie refreshToken
            response.cookie("refreshToken", userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});

            //Возвращаем данные
            return response.json(userData);
        } catch (error){
            console.log("Error on login in Controller")
            next(error);
        }
    }
    /**
     * @description - Метод выхода из сессии пользователя
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async logout(request,response,next){
        try {
            //Получаем токен из request'a
            const {refreshToken} = request.cookies;
            //Если его нет, то выбрасываем ошибку
            if(!refreshToken)
                return next(authError.badRequest("Not found a token in request"));

            //Выходим из сессии\удаляем токен
            console.log("Logout process...")
            const token = await userService.logout(refreshToken);
            //Если из информации об удаление нет, то выбрасываем ошибку
            if(!token)
                return next(authError.badRequest("Can't logout and removing token"));
            //Выводим информацию об этом
            console.log(token);

            //Удаляем токен локально
            response.clearCookie('refreshToken');
            console.log("Success logout");
            //Возвращаем данные
            return response.json(token);
        } catch (error){
            console.log("Error on logout in Controller")
            next(error);
        }
    }
    /**
     * @description - Метод активации пользователя
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async activate(request,response,next){
        try {
            console.log("Activation user by email...")
            //Получаем ссылку активации
            const activationLink = request.params.link;
            //Если ее нет - выбрасываем ошибку
            if(!activationLink)
                return next(authError.badRequest("Cannot get activation Link"));

            //Активируем пользователя
            await userService.activate(activationLink);
            console.log("Activation user success");

            //Производим перенаправление на клиентскую часть фронта
            return response.redirect((process.env.CLIENT_URL || "https://www.google.com"));
        } catch (error){
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on activating user in Controller")
            next(error);
        }
    }
    /**
     * @description - Метод получения нового refresh token пользователя
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async refresh(request,response,next){
        try {
            //Ищем токен в cookie's
            const {refreshToken} = request.cookies;
            //Если его нет, то выбрасываем ошибку
            if(!refreshToken)
                return next(authError.badRequest("Not found a token in request"));

            console.log("Refreshing Token...");
            //Обновляем токен
            const userData = await userService.refresh(refreshToken);
            //Если произошла ошибка при обновлении - выбрасываем ошибку
            if(!userData)
                return next(authError.unauthorizedError());

            //Добавляем в cookie новый refreshToken
            response.cookie("refreshToken", userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});

            console.log("Refreshing Token success");
            //Возвращаем данные
            return response.json(userData);
        } catch (error){
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on refresh token in Controller")
            next(error);
        }
    }
    /**
     * @description - Метод получения всех пользователей для Admin
     * @method
     * @async
     * @param request - запрос
     * @param response - ответ
     * @param next - следующая middleware функция
     */
    async getUsers(request,response,next){
        try {
            console.log("Getting all users...");
            //Получаем всех пользователей
            const users = await userService.getAllUsers();
            //Если не получили, то выбросили ошибку
            if(!users)
                return next(authError.unauthorizedError());

            console.log("Got all users");
            return response.json(users);
        } catch (error){
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on getting users in Controller")
            next(error);
        }
    }
}

//Экспортируем данный модуль
module.exports = new UserController();