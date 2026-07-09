import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  app: "Home",
  projects: "Projects",
  meetings: "Meetings",
  ai: "AI Studio",
  reports: "Reports",
  analytics: "Analytics",
  team: "Team",
  settings: "Settings",
  help: "Help",
};

/** Derives breadcrumbs from the current pathname. */
export function AppBreadcrumbs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden min-w-0 items-center gap-1 text-xs text-muted-foreground md:flex"
    >
      <Link to="/app" className="flex items-center gap-1 hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.slice(1).map((seg, i) => {
        const label = LABELS[seg] ?? decodeURIComponent(seg);
        const isLast = i === segments.length - 2;
        return (
          <span key={i} className="flex items-center gap-1 truncate">
            <ChevronRight className="h-3 w-3" />
            <span className={isLast ? "text-foreground font-medium" : ""}>{label}</span>
          </span>
        );
      })}
    </nav>
  );
}
