import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/project.routes";

import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import { errorHandler } from "./middlewares/error.middleware";
import taskRoutes from "./routes/task.routes";

const app = express();

/* ----------------------- Middlewares ----------------------- */

app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------- Routes -------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

/* ---------------------- Health Check ----------------------- */

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CampusPM Backend Running 🚀",
        timestamp: new Date(),
    });
});

/* ------------------- Global Error Handler ------------------ */
/*
 * MUST always be the LAST middleware
 */
app.use(errorHandler);

export default app;