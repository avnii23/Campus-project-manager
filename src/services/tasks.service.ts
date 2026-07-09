import { mockDelay, USE_MOCKS, request } from "./api-client";
import { mockTasks, type MockTask } from "@/lib/mock/data";

export type Task = MockTask;

export const tasksService = {
  async list(projectId?: string): Promise<Task[]> {
    if (USE_MOCKS) {
      await mockDelay();
      return projectId ? mockTasks.filter((t) => t.projectId === projectId) : mockTasks;
    }
    const qs = projectId ? `?projectId=${projectId}` : "";
    return request<Task[]>(`/api/tasks${qs}`);
  },
  async create(input: Partial<Task>): Promise<Task> {
    if (USE_MOCKS) {
      await mockDelay();
      return { ...mockTasks[0], ...input, id: `t-${Date.now()}` } as Task;
    }
    return request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(input) });
  },
  async update(id: string, patch: Partial<Task>): Promise<Task> {
    if (USE_MOCKS) {
      await mockDelay();
      return { ...mockTasks.find((t) => t.id === id)!, ...patch };
    }
    return request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCKS) {
      await mockDelay();
      return;
    }
    await request(`/api/tasks/${id}`, { method: "DELETE" });
  },
};
