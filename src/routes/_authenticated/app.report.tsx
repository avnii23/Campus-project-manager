import { createFileRoute } from "@tanstack/react-router";
import { ReportGenerator } from "@/components/app/report/report-generator";

export const Route = createFileRoute("/_authenticated/app/report")({
  head: () => ({
    meta: [{ title: "AI Report Generator — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: ReportGenerator,
});
