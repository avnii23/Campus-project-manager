import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Github,
  ExternalLink,
  Trophy,
  Users,
  Camera,
  Calendar,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { mockProjects } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const ROLES = [
  "Team Lead",
  "Frontend",
  "Backend",
  "ML Engineer",
  "Researcher",
  "Designer",
] as const;

export function PortfolioExport() {
  const [projectId, setProjectId] = useState(mockProjects[0].id);
  const project = useMemo(() => mockProjects.find((p) => p.id === projectId)!, [projectId]);
  const [github, setGithub] = useState("https://github.com/campuspm/drone-delivery");
  const [demo, setDemo] = useState("https://demo.campuspm.app/drone");

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-primary/30 bg-primary/20 text-primary">
              <Sparkles className="h-3 w-3" /> Portfolio
            </Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Portfolio Export
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              A polished, shareable summary of your project — ready for LinkedIn, résumés and
              recruiter emails.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-border/60"
              onClick={() => toast.success("Public URL copied (mock)")}
            >
              <Share2 className="mr-1.5 h-4 w-4" /> Share
            </Button>
            <Button
              className="shadow-glow"
              onClick={() => toast.success("Portfolio PDF exported (mock)")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Project switcher */}
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

      {/* Portfolio card */}
      <article className="overflow-hidden rounded-3xl border border-border/60 bg-surface/40">
        <header className="relative overflow-hidden bg-gradient-to-br from-primary/25 via-info/15 to-background p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {project.code}
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{project.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Badge key={t} variant="outline" className="border-border/60">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <Block title="Overview">
            <p className="text-sm text-muted-foreground">
              {project.name} solves last-mile delivery in dense campus environments. Over the course
              of the semester the team designed, built and evaluated a working prototype that meets
              every objective set at kickoff.
            </p>
          </Block>

          <Block title="Achievements" icon={Trophy} tone="text-warning">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• {project.healthScore}/100 project health score</li>
              <li>
                • {project.tasksDone} of {project.tasksTotal} tasks shipped
              </li>
              <li>• Featured in the departmental showcase</li>
              <li>• Selected for the inter-college demo day</li>
            </ul>
          </Block>

          <Block title="Technologies">
            <div className="flex flex-wrap gap-1.5">
              {[
                "React",
                "TanStack",
                "Supabase",
                "Python",
                "ROS 2",
                "PyTorch",
                "MQTT",
                "Tailwind",
              ].map((t) => (
                <Badge
                  key={t}
                  className="border-border/60 bg-background/60 text-foreground hover:bg-background/60"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </Block>

          <Block title="Team roles" icon={Users}>
            <ul className="space-y-2">
              {project.team.map((m, i) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {ROLES[i % ROLES.length]}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Timeline" icon={Calendar}>
            <ol className="relative space-y-2 border-l border-border/60 pl-4 text-sm">
              {[
                { t: "Sep 2025", l: "Kickoff & literature review" },
                { t: "Nov 2025", l: "Working prototype" },
                { t: "Feb 2026", l: "Mid-review passed" },
                { t: "May 2026", l: "Final demo & submission" },
              ].map((m, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="font-medium">{m.l}</div>
                  <div className="text-[11px] text-muted-foreground">{m.t}</div>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Screenshots" icon={Camera}>
            <div className="grid grid-cols-3 gap-2">
              {[
                "from-primary/40 to-info/30",
                "from-warning/40 to-primary/30",
                "from-info/40 to-success/30",
              ].map((g, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-video rounded-lg border border-border/60 bg-gradient-to-br",
                    g,
                  )}
                />
              ))}
            </div>
          </Block>
        </div>

        <footer className="border-t border-border/60 bg-background/40 p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                GitHub
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="bg-background/60 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Live demo
              </label>
              <div className="mt-1 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={demo}
                  onChange={(e) => setDemo(e.target.value)}
                  className="bg-background/60 text-xs"
                />
              </div>
            </div>
          </div>
        </footer>
      </article>
    </motion.div>
  );
}

function Block({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className={cn("h-4 w-4", tone ?? "text-primary")} />}
        {title}
      </h3>
      {children}
    </section>
  );
}
