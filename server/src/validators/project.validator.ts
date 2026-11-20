import { z } from "zod";

export const createProjectSchema = z.object({
    workspaceId: z.string().min(1),

    name: z
        .string()
        .min(3, "Project name must be at least 3 characters"),

    description: z.string().optional(),

    startDate: z.string().optional(),

    endDate: z.string().optional(),
});