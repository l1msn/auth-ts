import mongoose from "mongoose";

interface IToken extends Document{
    User: mongoose.Types.ObjectId;
    refreshToken: string;
    createDate: string;
}

export default IToken;