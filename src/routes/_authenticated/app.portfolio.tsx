import { createFileRoute } from "@tanstack/react-router";
import { PortfolioExport } from "@/components/app/portfolio/portfolio-export";

export const Route = createFileRoute("/_authenticated/app/portfolio")({
  head: () => ({
    meta: [{ title: "Portfolio Export — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: PortfolioExport,
});
