//Инициализация библиотек
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
require("dotenv").config();

//Инициализация модулей
const User = require("../models/userModel");
const emailService = require("./emailService");
const tokenService = require("./tokenService");
const authError = require("../exceptions/authError");
const UserDto = require("../dtos/userDto");
//Класс сервис для аутентификации и действий пользователя
/**
 * @description - Класс сервис для аутентификации и действий пользователя
 * @class
 */
class userService{
    /**
     * @description - Метод сервиса пользователя для регистрации
     * @method
     * @async
     * @param email - email пользователя
     * @param password - пароль пользователя
     */
    async registration(email,password){
        try {
            //Ищем пользователя в БД
            console.log("Checking for already exist user...");
            const candidate = await User.findOne({email: email});
            //Если такой пользователь есть - выбрасываем ошибку
            if(candidate)
                throw new Error("User already exist");
            console.log("User not found - creating new")

            //Хэшируем пароль
            console.log("Hashing password...");
            const hashPassword = bcrypt.hashSync(password,bcrypt.genSaltSync(3));
            //Если произошла ошибка шифрования - выбрасываем ошибку
            if(!hashPassword)
                throw new Error("Hash password error");
            console.log("Hash password is: " + hashPassword);

            //Генерируем строку для ссылки активации
            console.log("Generating new activationLink...");
            const activationLink = uuid.v4();
            //Если произошла ошибка при генерации - то выбрасываем ошибку
            if(!activationLink)
                throw new Error("Error to generate link")
            console.log("Activation link is: " + activationLink);

            //Помещаем пользователя в БД
            console.log("Adding new user to DB...");
            const user = await User.create({email: email, password: hashPassword, activationLink: activationLink});
            //Если не получается поместить в БД - выбрасываем ошибку
            if(!user)
                throw new Error("Error save user");
            console.log("New user is: " + user);

            //Отправляем на почту ссылку на активацию
            console.log("Sending message to email...")
            await emailService.sendActivationEmail(email,
                (("http://localhost:" + process.env.PORT) || "http://localhost:3000")
                        + "/auth/activate/" + activationLink);

            //Создаем объект для трансфера данных пользователя
            console.log("Creating Dto for user...")
            const userDto = new UserDto(user);
            //Если не удается создать - то выбрасываем ошибку
            if(!userDto)
                throw new Error("Error on creating user");
            console.log(userDto);

            //Генерируем токены
            console.log("Generating new tokens...")
            const tokens = await tokenService.generateToken({...userDto});
            //Если не удается создать - то выбрасываем ошибку
            if(!tokens)
                throw new Error("Error on generating tokens");

            //Сохраняем или обновляем токен
            console.log("Saving or update refresh token...")
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            //Возвращаем токены и информацию о пользователе
            console.log("Sending info and tokens...");
            return {
                ...tokens,
                user: userDto
            }
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on registration in User service")
            console.log(error);
        }

    }

    /**
     * @description - Метод активации пользователя
     * @method
     * @async
     * @param activationLink - ссылка активации
     */
    async activate(activationLink){
        try {
            //Поиск пользователя по ссылке
            const user = await User.findOne({activationLink: activationLink});
            if (!user)
                throw new Error("Uncorrected link");

            //Изменение поля на активированный
            user.isActivated = true;
            await user.save();
            console.log(user.isActivated);
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on activating in User service")
            console.log(error);
        }
    }

    /**
     * @description - Метод логина пользователя
     * @method
     * @param email - email пользователя
     * @param password - пароль пользователя
     */
    async login(email, password) {
        try {
            //Ищем пользователя в БД
            console.log("Checking for already exist user...");
            const user = await User.findOne({email: email});
            //Если такой пользователь есть - выбрасываем ошибку
            if (!user)
                throw new Error("User not exist");

            //Расхэшируем пароль
            console.log("Rehashing password...");
            const isEqualPassword = bcrypt.compareSync(password, user.password);
            //Если произошла ошибка шифрования - выбрасываем ошибку
            if (!isEqualPassword)
                throw new Error("Password not equal");
            console.log("Password equal: " + isEqualPassword);

            //Создаем объект для трансфера данных пользователя
            console.log("Creating Dto for user...")
            const userDto = new UserDto(user);
            //Если не удается создать - то выбрасываем ошибку
            if (!userDto)
                throw new Error("Error on creating user");
            console.log("User Dto created: " + userDto);

            //Генерируем токены
            console.log("Generating new tokens...")
            const tokens = await tokenService.generateToken({...userDto});
            //Если не удаться создать - то выбрасываем ошибку
            if (!tokens)
                throw new Error("Error on generating tokens");

            //Сохраняем или обновляем токен
            console.log("Saving or update refresh token...")
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            //Возвращаем токены и информацию о пользователе
            console.log("Sending info and tokens...");
            return {
                ...tokens,
                user: userDto
            }
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on login in User service")
            console.log(error);
        }
    }

    /**
     * @description - Метод выхода
     * @async
     * @method
     * @param refreshToken - токен для выхода
     */
    async logout(refreshToken){
        try {
            //Удаляем токен из БД
            const token = await tokenService.removeToken(refreshToken);
            //Если не получилось удалить токен, то выкидываем ошибку
            if(!token)
                throw new Error("Error on removing token")
            //Возвращаем данные о выходе пользователя и удалении токена
            console.log("Success deleting token")
            return token;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on logout in User service")
            console.log(error);
        }
    }

    /**
     * @description - Метод обновления refreshToken
     * @async
     * @method
     * @param refreshToken - текущий refresh Token
     */
    async refresh(refreshToken){
        try {
            //Проверка на наличие самого токена
            if (!refreshToken)
                throw new Error("Not found Token");

            //Проводим валидацию самого Токена
            const userData = tokenService.validateRefreshToken(refreshToken);
            //Если валидация неудачная, то выбрасываем ошибку
            if(!userData)
                throw authError.unauthorizedError("Validation token error");

            //Ищем сам токен в БД
            const tokenFromDb = tokenService.findToken(refreshToken);
            //Если его там нет, то выбрасываем ошибку
            if(!tokenFromDb)
                throw authError.unauthorizedError("Not found token in DB");

            //Создаем объект для трансфера данных пользователя
            console.log("Creating Dto for user...");
            const user = await User.findOne(userData.id);
            console.log(user);
            const userDto = new UserDto(user);
            //Если не удается создать - то выбрасываем ошибку
            if(!userDto)
                throw new Error("Error on creating user");
            console.log(userDto);

            //Генерируем токены
            console.log("Generating new tokens...")
            const tokens = await tokenService.generateToken({...userDto});
            //Если не удается создать - то выбрасываем ошибку
            if(!tokens)
                throw new Error("Error on generating tokens");

            //Сохраняем или обновляем токен
            console.log("Saving or update refresh token...")
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            //Возвращаем токены и информацию о пользователе
            console.log("Sending info and tokens...");
            return {
                ...tokens,
                user: userDto
            }
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on refresh in User service")
            console.log(error);
        }
    }

    /**
     * @description - Метод получения всех пользователей
     * @method
     * @async
     */
    async getAllUsers(){
        try {
            console.log("Taking data from DB...");
            //Получаем всех пользователей из БД
            const users = await User.find({});
            //Если произошла ошибка, то выбрасываем ее
            if (!users)
                throw new Error("Can't take data from DB");

            //Возвращаем список всех пользователей
            console.log("Success got data form DB");
            return users;
        } catch (error) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on getAllUsers in User service")
            console.log(error);
        }
    }
}

//Экспортируем данный модуль
module.exports = new userService();