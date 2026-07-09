import { createFileRoute, notFound } from "@tanstack/react-router";

import { TimelineView } from "@/components/app/projects/timeline-view";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/timeline")({
  component: TimelinePage,
});

function TimelinePage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <TimelineView project={project} />;
}
