import { createFileRoute, notFound } from "@tanstack/react-router";

import { RepositoryView } from "@/components/app/projects/repository-view";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/repository")({
  component: RepositoryPage,
});

function RepositoryPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <RepositoryView project={project} />;
}
