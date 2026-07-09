import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, FileText, MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { timeFromNow } from "@/lib/mock/data";
import type { WorkspaceProject } from "@/lib/mock/workspace";
import { priorityTone } from "@/lib/mock/workspace";

export function OverviewView({ project }: { project: WorkspaceProject }) {
  const upcoming = [...project.milestones]
    .filter((m) => m.status !== "done")
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3);
  const pendingTasks = project.tasks.filter((t) => t.status !== "done").slice(0, 5);
  const recentComments = project.tasks
    .flatMap((t) => t.comments.map((c) => ({ ...c, taskTitle: t.title })))
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 4);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <h2 className="font-display text-base font-semibold">About this project</h2>
          <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
          <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <Info label="Faculty guide" value={project.guide} />
            <Info label="Subject" value={project.subject} />
            <Info label="Semester" value={project.semester} />
            <Info label="Deadline" value={new Date(project.dueDate).toLocaleDateString()} />
          </dl>
        </section>

        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Upcoming milestones</h2>
              <p className="text-xs text-muted-foreground">Roadmap for the coming weeks.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/app/projects/$projectId/timeline" params={{ projectId: project.id }}>
                Timeline <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </header>
          <ul className="mt-4 space-y-3">
            {upcoming.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <Badge
                      variant="outline"
                      className={
                        m.status === "at-risk"
                          ? "border-warning/40 text-warning"
                          : "border-border/60"
                      }
                    >
                      {m.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {m.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {timeFromNow(m.date)} · {new Date(m.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Pending tasks</h2>
              <p className="text-xs text-muted-foreground">Next up for the team.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/app/projects/$projectId/board" params={{ projectId: project.id }}>
                Open board <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </header>
          <ul className="mt-4 divide-y divide-border/60">
            {pendingTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-background text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{t.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{t.status.replace("_", " ")}</span>
                    <span>·</span>
                    <span>Due {timeFromNow(t.dueDate)}</span>
                  </div>
                </div>
                <Badge className={`border text-[10px] ${priorityTone[t.priority]}`}>
                  {t.priority}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <h2 className="font-display text-base font-semibold">Health snapshot</h2>
          <div className="mt-4 flex items-center gap-4">
            <RadialScore value={project.healthScore} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Score</p>
              <p className="font-display text-3xl font-semibold">{project.healthScore}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.tasksDone} of {project.tasksTotal} tasks done
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <ProgressRow label="Completion" value={project.progress} />
            <ProgressRow label="On-time delivery" value={Math.min(100, project.healthScore + 5)} />
            <ProgressRow label="Team engagement" value={Math.max(30, project.healthScore - 8)} />
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <h2 className="font-display text-base font-semibold">Team</h2>
          <ul className="mt-4 space-y-3">
            {project.members.slice(0, 6).map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-[10px] font-semibold">
                    {m.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </div>
                  {m.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-success" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{m.role}</p>
                </div>
                <Badge variant="outline" className="border-border/60 text-[10px]">
                  {m.contribution}%
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <h2 className="font-display text-base font-semibold">Recent discussion</h2>
          <ul className="mt-4 space-y-3">
            {recentComments.length === 0 && (
              <li className="text-xs text-muted-foreground">No comments yet.</li>
            )}
            {recentComments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-semibold">
                  {c.authorName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p>
                    <span className="font-medium">{c.authorName}</span>{" "}
                    <span className="text-muted-foreground">on {c.taskTitle}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-muted-foreground">{c.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{timeFromNow(c.at)}</p>
                </div>
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
          <h2 className="font-display text-base font-semibold">Latest files</h2>
          <ul className="mt-4 space-y-2">
            {project.files
              .filter((f) => f.type === "file")
              .slice(0, 4)
              .map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl bg-background/40 p-2.5"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{f.path.split("/").pop()}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {f.updatedBy} · {timeFromNow(f.updatedAt)}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="mt-1 h-1" />
    </div>
  );
}

function RadialScore({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative grid h-20 w-20 place-items-center">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="currentColor"
          strokeWidth="6"
          className="text-surface-2"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray={`${dash} ${c}`}
          fill="none"
        />
      </svg>
    </div>
  );
}
