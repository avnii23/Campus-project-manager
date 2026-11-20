import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createTaskSchema } from "../validators/task.validator";

import {
    createTask,
    getTasks,
} from "../services/task.service";

export const create = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const {
            projectId,
            title,
            description,
            priority,
            dueDate,
        } = createTaskSchema.parse(req.body);

        const task = await createTask(
            projectId,
            title,
            description,
            priority,
            dueDate
        );

        res.status(201).json({
            success: true,
            task,
        });
    }
);

export const getAll = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const projectId = req.query.projectId as string;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "projectId is required",
            });
        }

        const tasks = await getTasks(projectId);

        res.status(200).json({
            success: true,
            tasks,
        });
    }
);