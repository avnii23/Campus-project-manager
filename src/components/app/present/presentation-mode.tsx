import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Presentation,
  Users,
  GitBranch,
  QrCode,
  Sparkles,
  ExternalLink,
  Play,
  Maximize2,
  Calendar,
  Trophy,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockProjects, timeFromNow } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function PresentationMode() {
  const [projectId, setProjectId] = useState(mockProjects[0].id);
  const project = useMemo(() => mockProjects.find((p) => p.id === projectId)!, [projectId]);

  const kpis = [
    { label: "Progress", value: `${project.progress}%`, icon: Activity, tone: "text-primary" },
    { label: "Health", value: `${project.healthScore}`, icon: Trophy, tone: "text-success" },
    {
      label: "Tasks",
      value: `${project.tasksDone}/${project.tasksTotal}`,
      icon: Sparkles,
      tone: "text-info",
    },
    {
      label: "Meetings/wk",
      value: `${project.meetingsThisWeek}`,
      icon: Calendar,
      tone: "text-warning",
    },
  ];

  const enterFullscreen = () => {
    document.documentElement
      .requestFullscreen?.()
      .catch(() => toast.error("Fullscreen blocked by browser"));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-info/25 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-white/20 bg-white/10 text-white">
              <Presentation className="h-3 w-3" /> Demo mode
            </Badge>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">{project.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  {t}
                </span>
              ))}
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                Due {timeFromNow(project.dueDate)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => toast.success("Launching slide deck (mock)")}
            >
              <Play className="mr-1.5 h-4 w-4" /> Launch deck
            </Button>
            <Button className="bg-white text-slate-900 hover:bg-white/90" onClick={enterFullscreen}>
              <Maximize2 className="mr-1.5 h-4 w-4" /> Fullscreen
            </Button>
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
                <span>{k.label}</span>
                <k.icon className={cn("h-4 w-4", k.tone)} />
              </div>
              <div className="mt-1 font-display text-3xl font-semibold">{k.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Project selector */}
      <div className="flex flex-wrap gap-2">
        {mockProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setProjectId(p.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              projectId === p.id
                ? "border-primary bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI summary */}
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 lg:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> AI project summary
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {project.name} is a {project.tags.join(", ")} project by a team of {project.team.length}
            . The team has shipped {project.tasksDone} of {project.tasksTotal} tasks with a health
            score of {project.healthScore}. Current milestones are on track and the demo is ready
            for reviewer evaluation.
          </p>
          <div className="mt-3 grid gap-2 text-xs md:grid-cols-3">
            <SumStat label="Strength" value="Momentum" />
            <SumStat label="Focus" value="Documentation" />
            <SumStat label="Ask" value="1 reviewer slot" />
          </div>
        </section>

        {/* QR */}
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold">
            <QrCode className="h-4 w-4 text-primary" /> Scan for demo
          </div>
          <QrPlaceholder />
          <p className="mt-2 text-[11px] text-muted-foreground">campuspm.app/p/{project.id}</p>
        </section>

        {/* Timeline */}
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-primary" /> Timeline
          </div>
          <ol className="relative border-l border-border/60 pl-4">
            {[
              { t: "Kickoff", d: "Week 1", done: true },
              { t: "Prototype", d: "Week 4", done: true },
              { t: "Mid-review", d: "Week 8", done: true },
              { t: "Feature freeze", d: "Week 12", done: false },
              { t: "Final demo", d: "Week 14", done: false },
            ].map((m, i) => (
              <li key={i} className="mb-3 last:mb-0">
                <span
                  className={cn(
                    "absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-background",
                    m.done ? "bg-success" : "bg-muted-foreground/50",
                  )}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.t}</span>
                  <span className="text-[11px] text-muted-foreground">{m.d}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Team */}
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> Team
          </div>
          <ul className="space-y-2">
            {project.team.map((m) => (
              <li key={m.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border/60">
                  <AvatarFallback className="bg-primary/15 text-[11px] text-primary">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-xs">
                  <div className="truncate font-medium">{m.name}</div>
                  <div className="text-muted-foreground">Contributor</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Repo */}
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GitBranch className="h-4 w-4 text-primary" /> Repository
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-border/60"
              onClick={() => toast.info("Repository link mocked")}
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <RepoStat label="Commits" value="248" />
            <RepoStat label="Contributors" value={`${project.team.length}`} />
            <RepoStat label="Open PRs" value="4" />
            <RepoStat label="Last push" value="2h ago" />
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Test coverage</span>
              <span>84%</span>
            </div>
            <Progress value={84} className="h-1.5" />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function SumStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function RepoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

function QrPlaceholder() {
  // Simple deterministic checker pattern that reads as a QR code.
  const cells = Array.from({ length: 12 * 12 }, (_, i) => (i * 37 + (i % 7)) % 3 !== 0);
  return (
    <div className="mx-auto grid aspect-square w-36 grid-cols-12 gap-[2px] rounded-xl border border-border/60 bg-white p-2">
      {cells.map((on, i) => (
        <span key={i} className={cn("rounded-[1px]", on ? "bg-slate-900" : "bg-white")} />
      ))}
    </div>
  );
}
