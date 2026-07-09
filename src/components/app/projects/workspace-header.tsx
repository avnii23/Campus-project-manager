import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Users, GraduationCap, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { timeFromNow, type ProjectHealth } from "@/lib/mock/data";
import type { WorkspaceProject } from "@/lib/mock/workspace";

const healthTone: Record<ProjectHealth, string> = {
  excellent: "bg-success/15 text-success border-success/20",
  good: "bg-info/15 text-info border-info/20",
  "at-risk": "bg-warning/15 text-warning border-warning/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
};

const TABS = [
  { key: "", label: "Overview" },
  { key: "board", label: "Board" },
  { key: "timeline", label: "Timeline" },
  { key: "repository", label: "Repository" },
  { key: "team", label: "Team" },
  { key: "dashboard", label: "Dashboard" },
] as const;

export function WorkspaceHeader({ project }: { project: WorkspaceProject }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const base = `/app/projects/${project.id}`;
  const activeKey =
    TABS.slice()
      .reverse()
      .find((t) => (t.key ? pathname.endsWith(`/${t.key}`) : pathname === base))?.key ?? "";

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-surface/70 via-surface/40 to-background p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="border-border/60 bg-background/60 text-[10px]">
                {project.code}
              </Badge>
              <Badge className={`border text-[10px] ${healthTone[project.health]}`}>
                {project.health.replace("-", " ")} · {project.healthScore}
              </Badge>
              {project.tags.map((t) => (
                <Badge key={t} variant="outline" className="border-border/60 text-[10px]">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold md:text-3xl">{project.name}</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> {project.guide}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {project.members.length} members
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Due {timeFromNow(project.dueDate)}
              </span>
              <span className="flex items-center gap-1.5">
                {project.subject} · {project.semester}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <Button size="sm" variant="outline" className="border-border/60">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> AI insights
            </Button>
            <div className="w-full min-w-56 rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Progress</span>
                <span className="font-semibold text-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="mt-1.5 h-1.5" />
            </div>
          </div>
        </div>
      </div>

      <nav className="scrollbar-none flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-surface/40 p-1">
        {TABS.map((t) => {
          const to = t.key ? `${base}/${t.key}` : base;
          const active = activeKey === t.key;
          return (
            <Link
              key={t.key}
              to={to}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
