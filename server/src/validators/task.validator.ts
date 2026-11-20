import { z } from "zod";

export const createTaskSchema = z.object({
    projectId: z.string(),

    title: z
        .string()
        .min(3, "Task title must be at least 3 characters"),

    description: z.string().optional(),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        .optional(),

    dueDate: z.string().optional(),
});