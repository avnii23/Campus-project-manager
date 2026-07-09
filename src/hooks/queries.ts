import { useQuery } from "@tanstack/react-query";
import { projectsService, tasksService, meetingsService, searchService } from "@/services";

export const projectsQueryKeys = {
  all: ["projects"] as const,
  detail: (id: string) => ["projects", id] as const,
};

export const tasksQueryKeys = {
  all: (projectId?: string) => ["tasks", projectId ?? "all"] as const,
};

export const meetingsQueryKeys = {
  all: ["meetings"] as const,
  detail: (id: string) => ["meetings", id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKeys.all,
    queryFn: () => projectsService.list(),
    staleTime: 60_000,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectsQueryKeys.detail(id ?? ""),
    queryFn: () => projectsService.get(id!),
    enabled: !!id,
  });
}

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: tasksQueryKeys.all(projectId),
    queryFn: () => tasksService.list(projectId),
    staleTime: 30_000,
  });
}

export function useMeetings() {
  return useQuery({
    queryKey: meetingsQueryKeys.all,
    queryFn: () => meetingsService.list(),
    staleTime: 30_000,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchService.query(query),
    enabled: query.trim().length > 0,
    staleTime: 15_000,
  });
}
