import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET || "super-secret-key-change-this";

export interface AuthRequest extends Request {
    userId?: string;
}

export function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
        };

        req.userId = decoded.userId;

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });

    }
}