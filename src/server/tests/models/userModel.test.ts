import User from '../../models/userModel';
import IUser from '../../models/IModels/iUser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testUser: {email: string, password: string} = {
  email: 'email@gmail.com',
  password: '1234',
};

const newEmail = '111@mail.com';

describe('Correct work with User Model', ()=>{
  beforeAll(async ()=> {
    await mongoose.connect('mongodb://' + process.env.MONGO_HOST +
            ':' + process.env.MONGO_PORT + '/' +
            process.env.MONGO_NAME_TEST);
  });

  test('Adding and found User in Database', async ()=>{
    await User.create({
      email: testUser.email,
      password: testUser.password},
    );


    const newUser: (mongoose.Document<unknown, any, IUser> & IUser & {_id: mongoose.Types.ObjectId}) | null =
        await User.findOne({email: testUser.email});

    expect(newUser!.email).toEqual(testUser.email);
    expect(newUser!.password).toEqual(testUser.password);
  });

  test('Modifying and deleting User in Database', async ()=>{
    await User.findOneAndUpdate(
        {email: testUser.email},
        {email: newEmail},
    );

    const newEmailUser: (mongoose.Document<unknown, any, IUser> & IUser & {_id: mongoose.Types.ObjectId}) | null =
        await User.findOne({email: newEmail});

    expect(newEmailUser!.email).toEqual(newEmail);

    await User.findOneAndDelete({email: newEmail});

    const deletedUser: (mongoose.Document<unknown, any, IUser> & IUser & {_id: mongoose.Types.ObjectId}) | null =
        await User.findOne({email: newEmail});

    expect(deletedUser).toBeNull();
  });

  afterAll(async ()=> {
    await mongoose.connection.close();
  });
});
