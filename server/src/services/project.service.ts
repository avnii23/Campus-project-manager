import prisma from "../config/prisma";
import { isWorkspaceMember } from "./workspace.service";

export async function createProject(
    userId: string,
    workspaceId: string,
    name: string,
    description?: string,
    startDate?: string,
    endDate?: string
) {

    const member = await isWorkspaceMember(
        workspaceId,
        userId
    );

    if (!member) {
        throw new Error("Access denied");
    }

    return prisma.project.create({
        data: {
            workspaceId,
            name,
            description,
            startDate: startDate
                ? new Date(startDate)
                : undefined,

            endDate: endDate
                ? new Date(endDate)
                : undefined,
        },
    });

}

export async function getProjects(workspaceId: string) {
    return prisma.project.findMany({
        where: {
            workspaceId,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}