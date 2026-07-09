import { create } from "zustand";

import {
  MEMBER_ROLES,
  seedProjects,
  type BoardTask,
  type MemberRole,
  type ProjectMember,
  type TaskStatus,
  type WorkspaceProject,
} from "@/lib/mock/workspace";

type CreateProjectInput = {
  name: string;
  code: string;
  description: string;
  guide: string;
  subject: string;
  semester: string;
  dueDate: string;
  tags: string[];
};

type UpdateProjectInput = Partial<CreateProjectInput> & { archived?: boolean };

type State = {
  projects: WorkspaceProject[];
  getById: (id: string) => WorkspaceProject | undefined;
  createProject: (input: CreateProjectInput) => WorkspaceProject;
  updateProject: (id: string, patch: UpdateProjectInput) => void;
  archiveProject: (id: string, archived: boolean) => void;
  deleteProject: (id: string) => void;

  addMember: (
    projectId: string,
    member: Omit<ProjectMember, "id" | "contribution" | "tasksDone" | "tasksAssigned" | "online">,
  ) => void;
  removeMember: (projectId: string, memberId: string) => void;
  updateMemberRole: (projectId: string, memberId: string, role: MemberRole) => void;

  moveTask: (projectId: string, taskId: string, to: TaskStatus) => void;
  updateTask: (projectId: string, taskId: string, patch: Partial<BoardTask>) => void;
  addComment: (projectId: string, taskId: string, authorName: string, body: string) => void;
  toggleSubtask: (projectId: string, taskId: string, subtaskId: string) => void;
  addTask: (
    projectId: string,
    task: Omit<BoardTask, "id" | "projectId" | "createdAt" | "activity">,
  ) => void;
};

const now = () => new Date().toISOString();

/** In-memory store standing in for backend CRUD. Swap-in surface = these methods. */
export const useProjectsStore = create<State>((set, get) => ({
  projects: seedProjects,

  getById: (id) => get().projects.find((p) => p.id === id),

  createProject: (input) => {
    const id = `p${Math.random().toString(36).slice(2, 8)}`;
    const project: WorkspaceProject = {
      id,
      name: input.name,
      code: input.code,
      description: input.description,
      guide: input.guide,
      subject: input.subject,
      semester: input.semester,
      dueDate: input.dueDate,
      tags: input.tags,
      progress: 0,
      health: "good",
      healthScore: 80,
      team: [],
      tasksTotal: 0,
      tasksDone: 0,
      meetingsThisWeek: 0,
      archived: false,
      createdAt: now(),
      members: [],
      milestones: [],
      files: [],
      commits: [],
      tasks: [],
    };
    set((s) => ({ projects: [project, ...s.projects] }));
    return project;
  },

  updateProject: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  archiveProject: (id, archived) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, archived } : p)),
    })),

  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  addMember: (projectId, member) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const id = `u${Math.random().toString(36).slice(2, 8)}`;
        const full: ProjectMember = {
          id,
          contribution: 0,
          tasksDone: 0,
          tasksAssigned: 0,
          online: false,
          ...member,
        };
        return {
          ...p,
          members: [...p.members, full],
          team: [...p.team, { id, name: full.name }],
        };
      }),
    })),

  removeMember: (projectId, memberId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              members: p.members.filter((m) => m.id !== memberId),
              team: p.team.filter((m) => m.id !== memberId),
            },
      ),
    })),

  updateMemberRole: (projectId, memberId, role) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              members: p.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
            },
      ),
    })),

  moveTask: (projectId, taskId, to) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const tasks = p.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: to,
                activity: [
                  {
                    id: `l${Date.now()}`,
                    actor: "You",
                    verb: `moved to ${to.replace("_", " ")}`,
                    at: now(),
                  },
                  ...t.activity,
                ],
              }
            : t,
        );
        const tasksDone = tasks.filter((t) => t.status === "done").length;
        return { ...p, tasks, tasksDone, tasksTotal: tasks.length };
      }),
    })),

  updateTask: (projectId, taskId, patch) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
            },
      ),
    })),

  addComment: (projectId, taskId, authorName, body) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId
                  ? t
                  : {
                      ...t,
                      comments: [
                        ...t.comments,
                        {
                          id: `c${Date.now()}`,
                          authorId: "me",
                          authorName,
                          body,
                          at: now(),
                        },
                      ],
                    },
              ),
            },
      ),
    })),

  toggleSubtask: (projectId, taskId, subtaskId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId
                  ? t
                  : {
                      ...t,
                      subtasks: t.subtasks.map((sub) =>
                        sub.id === subtaskId ? { ...sub, done: !sub.done } : sub,
                      ),
                    },
              ),
            },
      ),
    })),

  addTask: (projectId, task) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const id = `${projectId}-t${Date.now()}`;
        const tasks = [
          ...p.tasks,
          {
            id,
            projectId,
            createdAt: now(),
            activity: [
              { id: `l${Date.now()}`, actor: "You", verb: "created this task", at: now() },
            ],
            ...task,
          } as BoardTask,
        ];
        return {
          ...p,
          tasks,
          tasksTotal: tasks.length,
          tasksDone: tasks.filter((t) => t.status === "done").length,
        };
      }),
    })),
}));

export const ROLE_OPTIONS = MEMBER_ROLES;
