/**
 * @description - Класс трансфера данных для пользователя
 * @class
 */

class userDto {
    //Данные
    email: string;
    id: string;
    isActivated: boolean;
    //Конструктор
    constructor(model: any) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
//Экспортируем данный модуль
export default userDto;