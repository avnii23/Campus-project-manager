import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertTriangle, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { timeFromNow } from "@/lib/mock/data";
import type { Milestone, WorkspaceProject } from "@/lib/mock/workspace";

const iconFor = (s: Milestone["status"]) =>
  s === "done" ? CheckCircle2 : s === "at-risk" ? AlertTriangle : Circle;

const tone: Record<Milestone["status"], string> = {
  done: "text-success border-success/30 bg-success/10",
  upcoming: "text-primary border-primary/30 bg-primary/10",
  "at-risk": "text-warning border-warning/30 bg-warning/10",
};

export function TimelineView({ project }: { project: WorkspaceProject }) {
  const sorted = [...project.milestones].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const done = sorted.filter((m) => m.status === "done").length;

  const startMs = sorted.length ? +new Date(sorted[0].date) : Date.now();
  const endMs = sorted.length ? +new Date(sorted[sorted.length - 1].date) : Date.now();
  const nowMs = Date.now();
  const nowPct = Math.max(
    0,
    Math.min(100, ((nowMs - startMs) / Math.max(1, endMs - startMs)) * 100),
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold">Semester roadmap</h2>
            <p className="text-xs text-muted-foreground">
              {done}/{sorted.length} milestones done · Final deadline{" "}
              {new Date(project.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Overall progress</span>
              <span className="font-medium text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="mt-1 h-1.5" />
          </div>
        </header>

        <div className="relative mt-8 hidden md:block">
          <div className="absolute inset-x-0 top-5 h-1 rounded-full bg-surface-2">
            <div className="h-full rounded-full gradient-primary" style={{ width: `${nowPct}%` }} />
          </div>
          <div
            className="absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-glow"
            style={{ left: `${nowPct}%` }}
            title="Today"
          />
          <div className="flex justify-between">
            {sorted.map((m) => {
              const Icon = iconFor(m.status);
              return (
                <div key={m.id} className="flex w-24 flex-col items-center text-center">
                  <div
                    className={`z-10 grid h-11 w-11 place-items-center rounded-full border-2 ${tone[m.status]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] font-medium">{m.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(m.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
        <h2 className="font-display text-base font-semibold">Milestone details</h2>
        <ol className="mt-4 space-y-3">
          {sorted.map((m, i) => {
            const Icon = iconFor(m.status);
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/40 p-4"
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${tone[m.status]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{m.title}</h3>
                    <Badge variant="outline" className="border-border/60 text-[10px]">
                      {m.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(m.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {timeFromNow(m.date)}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
