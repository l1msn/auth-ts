import IUser from "../IUser";

/**
 * @description - Модель ответа от сервера
 * @interface
 */
interface AuthResponse {
    accessToken: string,
    refreshToken: string
    user: IUser
}

export default AuthResponse;