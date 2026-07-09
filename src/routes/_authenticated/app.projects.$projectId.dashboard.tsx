import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProjectDashboard } from "@/components/app/projects/project-dashboard";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <ProjectDashboard project={project} />;
}
