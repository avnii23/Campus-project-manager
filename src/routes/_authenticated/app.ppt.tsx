import { createFileRoute } from "@tanstack/react-router";
import { PptGenerator } from "@/components/app/ppt/ppt-generator";

export const Route = createFileRoute("/_authenticated/app/ppt")({
  head: () => ({
    meta: [
      { title: "AI Presentation Generator — CampusPM" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PptGenerator,
});
