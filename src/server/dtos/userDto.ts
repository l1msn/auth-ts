import mongoose from 'mongoose';
import IUser from '../models/IModels/iUser';

/**
 * @description - Класс трансфера данных для пользователя
 * @class
 */
class userDto {
  // Данные
  email: string;
  id: string;
  isActivated: boolean | undefined;

  // Конструктор
  constructor(model: mongoose.Document<unknown, any, IUser> & IUser & {_id: mongoose.Types.ObjectId} | null) {
    if (!model) {
      throw new Error('Getting nothing, expect User from DB!');
    }
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }

  public info() {
    return {
      email: this.email,
      id: this.id,
      isActivated: this.isActivated,
    };
  }
}

// Экспортируем данный модуль
export default userDto;
