import { createFileRoute, notFound } from "@tanstack/react-router";

import { KanbanBoard } from "@/components/app/projects/kanban/kanban-board";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId/board")({
  component: BoardPage,
});

function BoardPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();
  return <KanbanBoard project={project} />;
}
