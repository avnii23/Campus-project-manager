import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}