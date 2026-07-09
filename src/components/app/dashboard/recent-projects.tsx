import { ArrowRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockProjects, timeFromNow, type ProjectHealth } from "@/lib/mock/data";

const healthTone: Record<ProjectHealth, string> = {
  excellent: "bg-success/15 text-success border-success/20",
  good: "bg-info/15 text-info border-info/20",
  "at-risk": "bg-warning/15 text-warning border-warning/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
};

/** Card grid of the user's active projects. */
export function RecentProjects() {
  const projects = mockProjects;

  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold">Recent projects</h2>
          <p className="text-xs text-muted-foreground">Your workspace, sorted by activity.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </header>

      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border/60 bg-background/40 p-4 transition hover:border-border hover:bg-background/60"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border/60 bg-surface/60 text-[10px]">
                      {p.code}
                    </Badge>
                    <Badge className={`border text-[10px] ${healthTone[p.health]}`}>
                      {p.health.replace("-", " ")}
                    </Badge>
                  </div>
                  <h3 className="mt-2 truncate font-display text-sm font-semibold">{p.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{p.progress}% complete</span>
                  <span>
                    {p.tasksDone}/{p.tasksTotal} tasks
                  </span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.team.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-surface-2 text-[9px] font-semibold"
                      title={m.name}
                    >
                      {m.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </div>
                  ))}
                  {p.team.length > 4 && (
                    <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-surface-2 text-[9px]">
                      +{p.team.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Due {timeFromNow(p.dueDate)}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyProjects() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
      <p className="text-sm font-medium">No projects yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Create your first project to unlock the workspace.
      </p>
      <Button className="mt-4">Create project</Button>
    </div>
  );
}
