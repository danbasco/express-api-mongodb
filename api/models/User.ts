import mongoose, { Schema, model, Model } from 'mongoose';

export interface IUser {
    username: string;
    password: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // do not return password field by default
    }
});

const User : Model<IUser> = model("User", UserSchema);

export default User;