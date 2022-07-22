//Инициализация библиотек
const mongoose = require("mongoose");

//Инициализация модулей

//Схема refresh token
/**
 * @description - Схема refresh token
 * @scheme
 */
const Token = mongoose.model('Token',
    new mongoose.Schema({
        //Ссылка на пользователя в БД
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        //refresh Token пользователя
        refreshToken: {type: String, require: true},
        //Дата создания
        createDate: { type: String, default:
                (new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(new Date()))
        }
    }, {
        versionKey: false
    })
);

//Экспортируем данный модуль
module.exports = Token;