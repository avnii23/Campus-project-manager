import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { loginUser } from "../services/auth.service";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function me(
    req: AuthRequest,
    res: Response
) {

    const user = await prisma.user.findUnique({
        where: {
            id: req.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.json({
        success: true,
        user,
    });

}
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            token,
            user,
        });

    } catch (err) {

        res.status(401).json({
            success: false,
            message:
                err instanceof Error
                    ? err.message
                    : "Login failed",
        });

    }
}
export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser(
            name,
            email,
            password
        );

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            token,
            user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message:
                err instanceof Error
                    ? err.message
                    : "Registration failed",
        });
    }
}