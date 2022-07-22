//Инициализация библиотек
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Инициализация модулей
const Token = require("../models/tokenModel");
/**
 * @description - Класс сервис для генерации токенов и их обновления
 * @class
 */
class tokenService{
    /**
     * @description - генерация токена
     * @method
     * @async
     * @param payload - информация о пользователе
     */
    async generateToken(payload){
        try {
            //Генерация access Token
            console.log("Generating access Token...")
            const accessToken = jwt.sign(payload,
                (process.env.SECRED_CODE_ACCESS || "secret-code-access")
                , {expiresIn: "30m"}
            );
            //Если произошла ошибка - выбрасываем ее
            if(!accessToken)
                throw new Error("Error on generating access Token");
            console.log("Access Token is: " + accessToken)

            //Генерация refresh Token
            console.log("Generating refresh Token...")
            const refreshToken = jwt.sign(payload,
                (process.env.SECRED_CODE_REFRESH || "secret-code-refresh")
                , {expiresIn: "7d"}
            );
            //Если произошла ошибка - выбрасываем ее
            if(!refreshToken)
                throw new Error("Error on generating refresh Token");
            console.log("Refresh Token is: " + refreshToken)

            //Возвращаем Token'ы
            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on generateToken in Token service")
            console.log(error);
        }
    }

    /**
     * @description - сохранение нового или обновление старого refresh Token
     * @method
     * @async
     * @param userId - id пользователя
     * @param refreshToken - refresh Token пользователя
     */
    async saveToken(userId,refreshToken){
        try {
            //Поиск существующего token
            console.log("Searching already exist refreshToken")
            const tokenData = await Token.findOne({user: userId});
            //Если такой token есть, то обновляем его
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }

            //Создание нового token
            console.log("Generating new refresh Token...")
            const token = await Token.create({user: userId, refreshToken: refreshToken});
            //Если при генерации произошла ошибка - то выбрасываем ее
            if (!token)
                throw new Error("Error on creating token on Token service");

            //Возвращаем новый refresh Token
            return token;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on saveToken in Token service")
            console.log(error);
        }
    }

    /**
     * @description - Метод удаления токена из БД
     * @async
     * @function
     * @param refreshToken - токен для выхода
     */
    async removeToken(refreshToken){
        try {
            console.log("Removing Token from DB...")
            //Удаляем токен из БД
            const tokenData = await Token.deleteOne({refreshToken: refreshToken});
            //Если там нет такого токена, то выбрасываем ошибку
            if (!tokenData)
                throw new Error("Error on deleting token in DB");

            console.log("Success removing Token from DB");
            //Возвращаем информацию об этом
            return tokenData;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on removeToken in Token service")
            console.log(error);
        }
    }

    /**
     * @description - Метод поиска токена в БД
     * @async
     * @method
     * @param refreshToken - текущий refreshToken
     */
    async findToken(refreshToken){
        try {
            console.log("Searching Token in DB...");
            //Удаляем токен из БД
            const tokenData = await Token.findOne({refreshToken: refreshToken});
            //Если там нет такого токена, то выбрасываем ошибку
            if (!tokenData)
                throw new Error("Error on deleting token in DB");
            //Возвращаем информацию об этом
            console.log("Token found in DB");
            return tokenData;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on removeToken in Token service")
            console.log(error);
        }
    }

    /**
     * @description - метод валидации AccessToken
     * @async
     * @method
     * @param token - токен
     */
    async validateAccessToken(token){
        try {
            //Валидируем токен
            console.log("Validating Access Token...");
            const userData = jwt.verify(token, process.env.SECRED_CODE_ACCESS || "secret-code-access");
            //Если произошла ошибка валидации, то выбрасываем ее
            if(!userData)
                throw new Error("Error on validate Access Token");

            //Возвращаем данные об этом
            console.log("Validating Access Token success");
            return userData;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on validateAccessToken in Token service")
            console.log(error);
        }
    }

    /**
     * @description - метод валидации RefreshToken
     * @async
     * @method
     * @param token - токен
     */
    async validateRefreshToken(token){
        try {
            //Валидируем токен
            console.log("Validating Refresh Token...");
            const userData = jwt.verify(token, process.env.SECRED_CODE_REFRESH || "secret-code-refresh");
            //Если произошла ошибка валидации, то выбрасываем ее
            if(!userData)
                throw new Error("Error on validate Access Token");

            //Возвращаем данные об этом
            console.log("Validating Refresh Token success");
            return userData;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on validateRefreshToken in Token service")
            console.log(error);
        }
    }
}

//Экспортируем данный модуль
module.exports = new tokenService();