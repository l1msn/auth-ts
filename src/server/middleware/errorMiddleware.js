//Инициализация модулей
const authError = require("../exceptions/authError")
/**
 * @description - Функция обработчик ошибок
 * @function
 * @module
 * @param error - сама ошибка
 * @param request - запрос к серверу
 * @param response - ответ от сервера
 * @param next - следующая middleware
 */
function errorHandler(error, request, response, next) {
    try {
        //Выводим ошибку в логи
        console.log(error);
        //Если это известная нам ошибка (описана в exceptions), то возвращаем уже готовую форму ошибки
        if (error instanceof authError) {
            logger.error(error);
            return response.status(error.status).json({message: error.message, errors: error.errors});
        }
        //... могут быть еще другие ошибки

        //Если же это неизвестная ошибка, возвращаем готовую схему
        return response.status(500).json({message: "Unexpected error from server"});
    } catch (error) {
        //Обрабатываем ошибки и отправляем статус код
        console.log("Error on errorHandler in errorMiddleware")
        console.log(error);
    }
}

//Экспортируем данный модуль
export {errorHandler};