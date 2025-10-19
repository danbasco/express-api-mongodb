import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {   
        if (err) {
            return res.status(400).json({ message: "Invalid token." });
        }
        req.user = decoded;
        next();
    });
};

export default verifyJWT;