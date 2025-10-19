import mongoose, { Schema, model, Model } from 'mongoose';

export interface IUser {
    name: string;
    password: string;
    email: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
        select: false, // do not return password field by default
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

const User : Model<IUser> = model("User", UserSchema);

export default User;