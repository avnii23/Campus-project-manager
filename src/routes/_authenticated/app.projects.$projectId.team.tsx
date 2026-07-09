import { createFileRoute, notFound } from "@tanstack/react-router";

import { TeamView } from "@/components/app/projects/team-view";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/team")({
  component: TeamPage,
});

function TeamPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <TeamView project={project} />;
}
