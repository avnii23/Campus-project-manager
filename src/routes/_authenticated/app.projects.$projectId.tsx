import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { WorkspaceHeader } from "@/components/app/projects/workspace-header";
import { useProjectsStore } from "@/stores/projects-store";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId")({
  head: ({ params }) => ({
    meta: [
      { title: `Project ${params.projectId} — CampusPM` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectWorkspaceLayout,
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Project not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">It may have been archived or deleted.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-lg py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function ProjectWorkspaceLayout() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.getById(projectId));
  if (!project) throw notFound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1600px] space-y-6"
    >
      <WorkspaceHeader project={project} />
      <Outlet />
    </motion.div>
  );
}
