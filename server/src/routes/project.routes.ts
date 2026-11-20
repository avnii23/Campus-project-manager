import { Router } from "express";

import {
    create,
    getAll,
} from "../controllers/project.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, create);

router.get("/", authenticate, getAll);

export default router;