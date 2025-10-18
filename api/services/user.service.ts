import { Request } from "express";
import User, { IUser } from "../models/User.js";
import bcrypt from "bcrypt";

const locateUserByUsername = async (username: string) => {
    return await User.findOne({ username }).select('+password');
};

export const registerService = async (data: IUser) => {

    try {
        if (!data || !data.username || !data.password ) {
            throw new Error("Username and password are required");
        }


        const existingUser = await locateUserByUsername(data.username);
        if (existingUser) {
            return {
                status: 409,
                message: "Username already exists"
            };
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const user = new User({ 
            username: data.username, 
            password: hashedPassword });

        await user.save();
        return {
            status: 201, 
            data: { username: user.username },
            message: "User registered successfully."
        };

    } catch (error) {

        console.error("Error registering user:", error);
        return {
            status: 500,
            error: "Error registering user"
        };
    }
};
