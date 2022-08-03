// Инициализация библиотек
import mongoose from 'mongoose';
import IToken from './IModels/iToken';

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - user
 *         - refreshToken
 *         - createDate
 *       properties:
 *         user:
 *           type: ObjectID
 *           description: The reference by ObjectID to user object in Database
 *         refreshToken:
 *           type: string
 *           description: The refreshToken of user
 *         createDate:
 *           type: string
 *           description: The date and time of creating token
 *       example:
 *         user: 62e2ab5e40f4a606f4b7bac4
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYWthY2hha292aWNoQGdtYWlsLmNvbSIsImlkIjoiNjJlMmFiNWU0MGY0YTYwNmY0YjdiYWM0IiwiaXNBY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE2NTkwMjI1MjIsImV4cCI6MTY1OTYyNzMyMn0.xnwRvqoVPjMdwky8x97Ygi2z8C-WCvM3pYNOqx_QRBU
 *         createdDate: 28.07.2022, 18:29
 */
// Схема refresh token
const tokenSchema: mongoose.Schema = new mongoose.Schema({
  // Ссылка на пользователя в БД
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // refresh Token пользователя
  refreshToken: {type: String, require: true},
  // Дата создания
  createDate: {
    type: String, default:
                (new Intl.DateTimeFormat('ru', {dateStyle: 'short', timeStyle: 'short'}).format(new Date())),
  },
}, {
  versionKey: false,
},
);

// Экспортируем данный модуль
export default mongoose.model<IToken>('Token', tokenSchema);
