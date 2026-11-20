import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";

// Register User
export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Remove password before returning
    const { password: _, ...safeUser } = user;

    return safeUser;
}

// Login User
export async function loginUser(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isValid = await comparePassword(
        password,
        user.password
    );

    if (!isValid) {
        throw new Error("Invalid email or password");
    }

    // Remove password before returning
    const { password: _, ...safeUser } = user;

    return safeUser;
}