import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { workspaceSchema } from "../validators/workspace.validator";

import {
    createWorkspace,
    getUserWorkspaces,
} from "../services/workspace.service";

// Create Workspace
export const create = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        // Validate request body
        const { name, description } = workspaceSchema.parse(req.body);

        const workspace = await createWorkspace(
            req.userId!,
            name,
            description
        );

        res.status(201).json({
            success: true,
            workspace,
        });
    }
);

// Get All Workspaces
export const getAll = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const workspaces = await getUserWorkspaces(req.userId!);

        res.status(200).json({
            success: true,
            workspaces,
        });
    }
);