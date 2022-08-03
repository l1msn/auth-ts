import Token from '../../models/tokenModel';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testUser = {
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYWthY2hha292aWNoQGdtYWlsLmNvbSIsImlkIjoiNjJlMmFiNWU0MGY0YTYwNmY0YjdiYWM0IiwiaXNBY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE2NTkwMjI1MjIsImV4cCI6MTY1OTYyNzMyMn0.xnwRvqoVPjMdwky8x97Ygi2z8C-WCvM3pYNOqx_QRBU',

};

const newRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYWthY2hha292aWNoQGdtYWlsLmNvbSIsImlkIjoiNjJlMmI1OWY0MGY3MWY1NTZjNmFmOWVjIiwiaXNBY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE2NTkwMjQ3OTksImV4cCI6MTY1OTYyOTU5OX0.VvAllGVj7G76Et_nBV3fxDUGxY47lQkyDA8-SYbEKzY';

describe('Correct work with Token Model', ()=>{
  beforeAll(async ()=> {
    await mongoose.connect('mongodb://' + process.env.MONGO_HOST +
            ':' + process.env.MONGO_PORT + '/' +
            process.env.MONGO_NAME_TEST);
  });

  test('Adding and searching Token in Database', async ()=>{
    await Token.create({refreshToken: testUser.refreshToken});

    const newToken = await Token.findOne({refreshToken: testUser.refreshToken});

    expect(newToken!.refreshToken).toEqual(testUser.refreshToken);
  });

  test('Modifying and deleting Token in Database', async ()=>{
    await Token.findOneAndUpdate(
        {refreshToken: testUser.refreshToken},
        {refreshToken: newRefreshToken},
    );

    const newRefreshTokenObject = await Token.findOne({refreshToken: newRefreshToken});

    expect(newRefreshTokenObject!.refreshToken).toEqual(newRefreshToken);

    await Token.findOneAndDelete({email: newRefreshToken});

    const deletedToken = await Token.findOne({email: newRefreshToken});

    expect(deletedToken).toBeNull();
  });

  afterAll(async ()=> {
    await mongoose.connection.close();
  });
});
