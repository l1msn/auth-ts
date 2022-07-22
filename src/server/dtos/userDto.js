/**
 * @description - Класс трансфера данных для пользоватея
 * @class
 */
class userDto {
    //Данные
    email;
    id;
    isActivated;
    //Конструктор
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
//Экспортируем данный модуль
module.exports = userDto;