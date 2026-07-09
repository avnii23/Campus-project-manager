import { createFileRoute } from "@tanstack/react-router";
import { PresentationMode } from "@/components/app/present/presentation-mode";

export const Route = createFileRoute("/_authenticated/app/present")({
  head: () => ({
    meta: [{ title: "Presentation Mode — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: PresentationMode,
});
