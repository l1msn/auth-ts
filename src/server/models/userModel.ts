// Инициализация библиотек
import mongoose from 'mongoose';
import IUser from './IModels/iUser';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role
 *         - isActivated
 *         - activationLink
 *         - createDate
 *       properties:
 *         email:
 *           type: string
 *           description: The email of User
 *         password:
 *           type: string
 *           description: The hash password of User
 *         role:
 *           type: string
 *           description: The role of User
 *         isActivated:
 *           type: boolean
 *           description: The status of activation by email link
 *         activationLink:
 *           type: string
 *           description: The activation link by email
 *         createDate:
 *           type: string
 *           description: The date and time of creating user
 *       example:
 *         email: chakachakovich@gmail.com
 *         password: $2a$04$.HpkCOp.RDkM7U8zquvASem8YERHo5hbqq8bReS1Ht5V5QCaCmaau
 *         role: User
 *         isActivated: false
 *         activationLink: 5d447fcf-a325-4d83-9e1f-a563ebb7c598
 *         createDate: 28.07.2022, 20:30
 */

// Схема пользователя
/**
 * @description - Схема пользователя
 * @scheme
 */
const userSchema: mongoose.Schema = new mongoose.Schema({
  // Имя
  name: {type: String},
  // Почта
  email: {type: String, required: true, unique: true},
  // Пароль
  password: {type: String, required: true},
  // Роль
  role: {type: String, enum: ['Admin', 'User'], default: 'User'},
  // Активирован ли пользователь
  isActivated: {type: Boolean, default: false},
  // Ссылка активации
  activationLink: {type: String},
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
export default mongoose.model<IUser>('User', userSchema);
