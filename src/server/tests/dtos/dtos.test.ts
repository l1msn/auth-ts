import UserDto from "../../dtos/userDto";
import User from "../../models/userModel";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testUser = {
    email: "email@gmail.com",
    password: "1234",
    isActivated: "false",
}


describe("UserDto testing",()=> {
    beforeAll(async ()=> {
        await mongoose.connect("mongodb://" + process.env.MONGO_HOST
            + ":" + process.env.MONGO_PORT + "/"
            + process.env.MONGO_NAME_TEST);
    });

    test("Creating UserDto from User model with API", async ()=> {
        await User.create(
            {
                email: testUser.email,
                password: testUser.password,
            }
        );

        const newUser = await User.findOne({email: testUser.email});

        const newUserDto = new UserDto(newUser);

        expect(newUserDto.email).toEqual(testUser.email);

        await User.findOneAndDelete({email: testUser.email});
    });
});