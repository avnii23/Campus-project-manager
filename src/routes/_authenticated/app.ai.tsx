import { createFileRoute } from "@tanstack/react-router";
import { AiWorkspace } from "@/components/app/ai/ai-workspace";

export const Route = createFileRoute("/_authenticated/app/ai")({
  head: () => ({
    meta: [{ title: "AI Studio — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: AiWorkspace,
});
