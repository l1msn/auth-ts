import $api from "../http";
import {AxiosResponse} from "axios";
import AuthResponse from "../models/responses/AuthResponse";

/**
 * @description - Сервис клиента для взаимодействия с авторизацией
 * @class
 */
class AuthService {
    /**
     * @description - Метод логина пользователя
     * @method
     * @async
     * @static
     * @param email - емайл пользователя
     * @param password - пароль пользователя
     */
    static async login(email: string, password: string)
        : Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/login",{email, password});
    }
    /**
     * @description - Метод регистрации пользователя
     * @method
     * @async
     * @static
     * @param email - емайл пользователя
     * @param password - пароль пользователя
     */
    static async registration(email: string, password: string)
        : Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/registration",{email, password});
    }

    static async logout(): Promise<void> {
        return $api.post("/logout");
    }
}

export default AuthService;