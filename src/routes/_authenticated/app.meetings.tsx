import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/meetings")({
  head: () => ({
    meta: [{ title: "Meetings — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <Outlet />,
});
