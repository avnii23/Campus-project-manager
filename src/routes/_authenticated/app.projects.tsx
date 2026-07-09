import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/projects")({
  head: () => ({
    meta: [{ title: "Projects — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <Outlet />,
});
