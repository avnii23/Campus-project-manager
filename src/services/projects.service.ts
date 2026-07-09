import { mockDelay, USE_MOCKS, request } from "./api-client";
import { mockProjects, type MockProject } from "@/lib/mock/data";

export type Project = MockProject;

export const projectsService = {
  async list(): Promise<Project[]> {
    if (USE_MOCKS) {
      await mockDelay();
      return mockProjects;
    }
    return request<Project[]>("/api/projects");
  },
  async get(id: string): Promise<Project | null> {
    if (USE_MOCKS) {
      await mockDelay();
      return mockProjects.find((p) => p.id === id) ?? null;
    }
    return request<Project | null>(`/api/projects/${id}`);
  },
  async create(input: Partial<Project>): Promise<Project> {
    if (USE_MOCKS) {
      await mockDelay(200, 500);
      return { ...mockProjects[0], ...input, id: `p-${Date.now()}` } as Project;
    }
    return request<Project>("/api/projects", { method: "POST", body: JSON.stringify(input) });
  },
  async update(id: string, patch: Partial<Project>): Promise<Project> {
    if (USE_MOCKS) {
      await mockDelay();
      const existing = mockProjects.find((p) => p.id === id)!;
      return { ...existing, ...patch };
    }
    return request<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },
  async archive(id: string): Promise<void> {
    if (USE_MOCKS) {
      await mockDelay();
      return;
    }
    await request(`/api/projects/${id}/archive`, { method: "POST" });
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCKS) {
      await mockDelay();
      return;
    }
    await request(`/api/projects/${id}`, { method: "DELETE" });
  },
};
