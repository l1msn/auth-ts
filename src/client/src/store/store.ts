import IUser from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios, {AxiosResponse} from "axios";
import AuthResponse from "../models/responses/AuthResponse";
import {API_URL} from "../http";

/**
 * @description - Класс Стора на основе mobx
 * @class
 */
class Store {
    //Основные поля Стора
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    //Конструктор
    constructor() {
        //Отслеживаем с помощью mobx
        makeAutoObservable(this);
    }

    //Основные мутации полей
    setAuth(bool: boolean): void {
        this.isAuth = bool;
    }

    setUser(user: IUser): void {
        this.user = user;
    }

    setLoading(bool: boolean): void {
        this.isLoading = bool;
    }

    /**
     * @description - Метод логина
     * @method
     * @async
     * @param email - емайл пользователя
     * @param password - пароль пользователя
     */
    async login(email: string, password: string): Promise<void> {
        try {
            console.log("Login process...");

            const response: AxiosResponse<AuthResponse, any> = await AuthService.login(email, password);
            if(!response)
                throw new Error("No response");
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

            console.log("Login success");
        } catch (error: unknown | any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on login in Store")
            console.log(error.response?.data?.message);
        }
    }

    /**
     * @description - Метод регистрации
     * @method
     * @async
     * @param email - емайл пользователя
     * @param password - пароль пользователя
     */
    async registration(email: string, password: string): Promise<void> {
        try {
            console.log("Registration process...");

            const response: AxiosResponse<AuthResponse, any> = await AuthService.registration(email, password);
            if(!response)
                throw new Error("No response");
            console.log(response);

            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

            console.log("Registration success");
        } catch (error: unknown | any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on registration in Store")
            console.log(error.response?.data?.message);
        }
    }

    /**
     * @description - Метод логаута
     * @method
     * @async
     */
    async logout(): Promise<void> {
        try {
            console.log("Logout process...");

            await AuthService.logout();

            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);

            console.log("Logout success");
        } catch (error: unknown | any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on logout in Store")
            console.log(error.response?.data?.message);
        }
    }

    /**
     * @description - Метод проверки состояния авторизирования
     * @method
     * @async
     */
    async checkAuth(): Promise<void> {
        try {
            console.log("Checking auth...");

            this.setLoading(true);
            const response: AxiosResponse<AuthResponse, any> = await axios.get<AuthResponse>(`${API_URL}/refresh`,{ withCredentials: true });
            if(!response)
                throw new Error("No response");
            console.log(response);

            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

            console.log("Auth success")

        } catch (error: unknown | any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on checkAuth in Store")
            console.log(error.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

}

export default Store;