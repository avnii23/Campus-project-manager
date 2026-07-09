import { createFileRoute } from "@tanstack/react-router";
import { SubmissionChecklist } from "@/components/app/submission/submission-checklist";

export const Route = createFileRoute("/_authenticated/app/submission")({
  head: () => ({
    meta: [{ title: "Submission Checklist — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: SubmissionChecklist,
});
