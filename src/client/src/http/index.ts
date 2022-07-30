import axios from "axios";
import AuthResponse from "../models/responses/AuthResponse";

//URL локального сервера
export const API_URL = "http://localhost:5000/auth";

//Стандартный аксиос для взаимодействия с сервером
const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

//Интерцептор для перехвата requst'a для записи в него определенного header
$api.interceptors.request.use((config)=>{
    // @ts-ignore
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use(
    (config)=>{
        return config;
},async (error)=> {
        try {
            const originalRequest = error.config;
            if(error.response.status == 401 && error.config && !error.config._isRetry) {
                originalRequest._isRetry = true;
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
                localStorage.setItem('token', response.data.accessToken);
                return $api.request(originalRequest);
            }
        } catch (error: any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on interceptor for response in Index");
            console.log(error.response?.data?.message);
        }
        throw error;
});

export default $api;