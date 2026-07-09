import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle2, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { timeFromNow } from "@/lib/mock/data";
import { priorityTone, type WorkspaceProject } from "@/lib/mock/workspace";

export function ProjectDashboard({ project }: { project: WorkspaceProject }) {
  const leaderboard = [...project.members].sort((a, b) => b.contribution - a.contribution);
  const upcomingDeadlines = [...project.tasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 5);
  const recentActivity = project.tasks
    .flatMap((t) => t.activity.map((a) => ({ ...a, task: t.title })))
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 6);
  const pendingTasks = project.tasks.filter((t) => t.status !== "done");

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="Health score"
          value={`${project.healthScore}`}
          hint={project.health.replace("-", " ")}
          tone="primary"
        />
        <Kpi
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Completion"
          value={`${project.progress}%`}
          hint={`${project.tasksDone}/${project.tasksTotal} tasks`}
          tone="success"
        />
        <Kpi
          icon={<Clock className="h-4 w-4" />}
          label="Pending tasks"
          value={`${pendingTasks.length}`}
          hint="across all columns"
          tone="warning"
        />
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Active members"
          value={`${project.members.filter((m) => m.online).length}/${project.members.length}`}
          hint="online right now"
          tone="info"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5 xl:col-span-2">
          <header className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-semibold">Contribution leaderboard</h2>
          </header>
          <ol className="mt-4 space-y-3">
            {leaderboard.map((m, i) => (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-bold ${
                    i === 0
                      ? "bg-primary/15 text-primary"
                      : i === 1
                        ? "bg-info/15 text-info"
                        : i === 2
                          ? "bg-accent/15 text-accent-foreground"
                          : "bg-surface-2 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold">
                  {m.name
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {m.role} · {m.tasksDone}/{m.tasksAssigned} tasks
                  </p>
                  <Progress value={m.contribution} className="mt-1.5 h-1" />
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-semibold">{m.contribution}</p>
                  <p className="text-[10px] text-muted-foreground">score</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
            <h2 className="font-display text-base font-semibold">Upcoming deadlines</h2>
            <ul className="mt-4 space-y-2">
              {upcomingDeadlines.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{t.title}</p>
                    <p className="text-[10px] text-muted-foreground">{timeFromNow(t.dueDate)}</p>
                  </div>
                  <Badge className={`border text-[9px] ${priorityTone[t.priority]}`}>
                    {t.priority}
                  </Badge>
                </li>
              ))}
              {upcomingDeadlines.length === 0 && (
                <li className="text-xs text-muted-foreground">Nothing due — nice work.</li>
              )}
            </ul>
          </section>

          <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
            <h2 className="font-display text-base font-semibold">Team activity</h2>
            <ul className="mt-4 space-y-3">
              {recentActivity.map((a) => (
                <li key={`${a.id}-${a.task}`} className="flex items-start gap-2 text-xs">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">
                        {a.verb} on {a.task}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">{timeFromNow(a.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "success" | "warning" | "info";
}) {
  const tones = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  } as const;
  return (
    <div className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>{icon}</div>
      <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
