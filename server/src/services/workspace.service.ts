import prisma from "../config/prisma";

export async function createWorkspace(
    userId: string,
    name: string,
    description?: string
) {
    const workspace = await prisma.workspace.create({
        data: {
            name,
            description,

            members: {
                create: {
                    userId,
                    role: "OWNER",
                },
            },
        },

        include: {
            members: true,
        },
    });

    return workspace;
}

export async function getUserWorkspaces(userId: string) {
    return prisma.workspace.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },

        include: {
            members: true,
        },
    });
}
export async function isWorkspaceMember(
    workspaceId: string,
    userId: string
) {
    return prisma.workspaceMember.findFirst({
        where: {
            workspaceId,
            userId,
        },
    });
}