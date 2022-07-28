interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    role?: string;
    isActivated?: boolean;
    activationLink?: string;
    createDate?: string;
}

export default IUser;