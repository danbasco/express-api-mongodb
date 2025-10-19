import User, { IUser } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";


interface ResponseType {
    status: number;
    message: string;
    data?: any;
}

const createJWT = (uid: Types.ObjectId | string) => {
    const id = typeof uid === "string" ? uid : uid.toString();
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
};

const locateUserByEmail = async (email: string) => {
    return await User.findOne({ email }).select('+password');
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export const registerService = async (data: IUser): Promise<ResponseType> => {

    try {
        if (!data || !data.name || !data.password || !data.email) {

            return { status: 400, message: "Name, email, and password are required." };
        }

        // Validação email existente
        const existingUser = await locateUserByEmail(data.email);
        if (existingUser) {
            return { status: 409, message: "Email already exists." };
        }
        
        const validEmail = isValidEmail(data.email);
        if (!validEmail) {
            return { status: 400, message: "Invalid email format." };
        }

        const validPassword = isValidPassword(data.password);
        if (!validPassword) {
            return { status: 400, message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character." };
        }

        // Hashing password


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const user = new User({ 
            name: data.name, 
            email: data.email,
            password: hashedPassword });

        await user.save();
        return { status: 201, message: "User registered successfully.", data: { name: user.name, email: user.email } };
    } catch (error) {
        return { status: 500, message: "Internal server error." };
    }
};

export const loginService = async (data: IUser): Promise<ResponseType> => {

    try {
        if (!data || !data.email || !data.password) {
            return { status: 400, message: "Email and password are required." };
        }

        const user = await locateUserByEmail(data.email);
        if (!user) {
            console.log("User not found with email:", data.email);
            return { status: 404, message: "User not found." };
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            console.log("Invalid password attempt for email:", data.email); 
            return { status: 401, message: "Invalid password." };
        }
        console.log("User logged in successfully:", data.email);

       const token = createJWT(user._id);

        return { status: 200, message: "Login successful.", data: { name: user.name, email: user.email, token: token } };

    } catch (error) {
        return { status: 500, message: "Internal server error." };
    }

}