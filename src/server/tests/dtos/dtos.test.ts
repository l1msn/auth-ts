import UserDto from '../../dtos/userDto';
import User from '../../models/userModel';
import IUser from '../../models/IModels/iUser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testUser: {email: string, password: string, isActivated: string} = {
  email: 'email@gmail.com',
  password: '1234',
  isActivated: 'false',
};


describe('UserDto testing', ()=> {
  beforeAll(async ()=> {
    await mongoose.connect('mongodb://' + process.env.MONGO_HOST +
            ':' + process.env.MONGO_PORT + '/' +
            process.env.MONGO_NAME_TEST);
  });

  test('Creating UserDto from User model with API', async ()=> {
    await User.create(
        {
          email: testUser.email,
          password: testUser.password,
        },
    );

    const newUser: (mongoose.Document<unknown, any, IUser> & IUser & {_id: mongoose.Types.ObjectId}) | null =
        await User.findOne({email: testUser.email});

    const newUserDto: UserDto = new UserDto(newUser);

    expect(newUserDto.email).toEqual(testUser.email);

    await User.findOneAndDelete({email: testUser.email});
  });
});
