import { createFileRoute } from "@tanstack/react-router";
import { NotificationsCenter } from "@/components/app/notifications/notifications-center";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: NotificationsCenter,
});
