import $api from "../http";
import {AxiosResponse} from "axios";
import IUser from "../models/IUser";

/**
 * @description - Сервис клиента для взаимодействия с авторизацией
 * @class
 */
class UserService {
    /**
     * @description - Метод получения всех пользователей
     * @method
     * @static
     */
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>("/users");
    }
}

export default UserService;