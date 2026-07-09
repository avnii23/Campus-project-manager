import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/app/insights/insights-page";

export const Route = createFileRoute("/_authenticated/app/insights")({
  head: () => ({
    meta: [{ title: "Project Insights — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: InsightsPage,
});
