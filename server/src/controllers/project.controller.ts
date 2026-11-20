import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createProjectSchema } from "../validators/project.validator";

import {
    createProject,
    getProjects,
} from "../services/project.service";

export const create = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const {
            workspaceId,
            name,
            description,
            startDate,
            endDate,
        } = createProjectSchema.parse(req.body);
        const project = await createProject(
            req.userId!,
            workspaceId,
            name,
            description,
            startDate,
            endDate
        );

        res.status(201).json({
            success: true,
            project,
        });
    }
);

export const getAll = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const workspaceId = req.query.workspaceId as string;

        if (!workspaceId) {
            return res.status(400).json({
                success: false,
                message: "workspaceId is required",
            });
        }

        const projects = await getProjects(workspaceId);

        res.status(200).json({
            success: true,
            projects,
        });
    }
);