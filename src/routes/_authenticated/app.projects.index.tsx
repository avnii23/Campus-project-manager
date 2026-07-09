import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/components/app/projects/projects-page";

export const Route = createFileRoute("/_authenticated/app/projects/")({
  component: ProjectsPage,
});
