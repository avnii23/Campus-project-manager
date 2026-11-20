import { z } from "zod";

export const workspaceSchema = z.object({
    name: z
        .string()
        .min(3, "Workspace name must be at least 3 characters"),

    description: z
        .string()
        .optional(),
});