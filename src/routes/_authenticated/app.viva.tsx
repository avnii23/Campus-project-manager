import { createFileRoute } from "@tanstack/react-router";
import { VivaAssistant } from "@/components/app/viva/viva-assistant";

export const Route = createFileRoute("/_authenticated/app/viva")({
  head: () => ({
    meta: [{ title: "Viva Assistant — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: VivaAssistant,
});
