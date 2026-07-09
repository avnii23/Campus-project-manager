import { createFileRoute, notFound } from "@tanstack/react-router";

import { OverviewView } from "@/components/app/projects/overview-view";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <OverviewView project={project} />;
}
