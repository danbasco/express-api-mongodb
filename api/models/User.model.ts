import mongoose, { Schema, model, Model } from 'mongoose';

interface IUser {
  username: string;
  password: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User : Model<IUser> = model("User", UserSchema);

export default User;