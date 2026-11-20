import prisma from "../config/prisma";

export async function createTask(
    projectId: string,
    title: string,
    description?: string,
    priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    dueDate?: string
) {
    return prisma.task.create({
        data: {
            projectId,
            title,
            description,
            priority,
            dueDate: dueDate
                ? new Date(dueDate)
                : undefined,
        },
    });
}

export async function getTasks(projectId: string) {
    return prisma.task.findMany({
        where: {
            projectId,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}