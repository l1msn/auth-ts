//Инициализация библиотек
import mongoose from "mongoose";
import User from "./userModel"
import IToken from "./IModels/iToken";



//Схема refresh token
/**
 * @description - Схема refresh token
 * @scheme
 */
const tokenSchema: mongoose.Schema = new mongoose.Schema({
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
    }
);

//Экспортируем данный модуль
export default mongoose.model<IToken>('Token', tokenSchema);