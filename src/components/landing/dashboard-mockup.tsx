import { motion } from "motion/react";
import { CheckCircle2, Clock3, GitBranch, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive dashboard mockup used in the hero section.
 * Real UI, not an illustration — animated stat cards, kanban, activity feed.
 */
export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.17_70/0.25),transparent_70%)] blur-2xl" />

      <div className="glass-strong overflow-hidden rounded-3xl border border-border shadow-[0_40px_120px_-30px_oklch(0_0_0/0.8)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-black/30 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            campuspm.app / projects / final-year-thesis
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          {/* Sidebar */}
          <aside className="col-span-3 hidden border-r border-border bg-black/20 p-4 lg:block">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-md gradient-primary text-xs font-bold text-primary-foreground">
                FY
              </div>
              <div className="text-sm font-semibold">Final Year Thesis</div>
            </div>
            <nav className="space-y-1 text-sm">
              {[
                { label: "Overview", active: false },
                { label: "Board", active: true },
                { label: "Repository", active: false },
                { label: "Meetings", active: false },
                { label: "Reports", active: false },
                { label: "Analytics", active: false },
              ].map((i) => (
                <div
                  key={i.label}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition",
                    i.active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {i.label}
                </div>
              ))}
            </nav>

            <div className="mt-6 rounded-xl border border-border bg-white/5 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> AI Assistant
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                You're 82% ready for viva. Practice 3 more questions?
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-12 space-y-4 p-4 lg:col-span-9">
            {/* Stat row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Tasks",
                  value: "42",
                  delta: "+8",
                  icon: CheckCircle2,
                  tint: "text-emerald-400",
                },
                { label: "Team", value: "5", delta: "active", icon: Users, tint: "text-info" },
                {
                  label: "Commits",
                  value: "127",
                  delta: "+12",
                  icon: GitBranch,
                  tint: "text-primary",
                },
                {
                  label: "Days left",
                  value: "18",
                  delta: "on track",
                  icon: Clock3,
                  tint: "text-accent",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="rounded-xl border border-border bg-black/30 p-3"
                >
                  <div className={cn("mb-1 flex items-center gap-1.5 text-xs", s.tint)}>
                    <s.icon className="h-3 w-3" />
                    {s.label}
                  </div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.delta}</div>
                </motion.div>
              ))}
            </div>

            {/* Mini kanban */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  title: "To Do",
                  color: "bg-info/50",
                  cards: [
                    { t: "Literature review", pr: "med", who: "AS" },
                    { t: "Draft methodology", pr: "high", who: "PR" },
                  ],
                },
                {
                  title: "In Progress",
                  color: "bg-primary/60",
                  cards: [
                    { t: "Build prototype API", pr: "high", who: "MK" },
                    { t: "Design UI mockups", pr: "low", who: "SN" },
                  ],
                },
                {
                  title: "Done",
                  color: "bg-emerald-500/60",
                  cards: [{ t: "Project kickoff", pr: "low", who: "AS" }],
                },
              ].map((col, ci) => (
                <div key={col.title} className="rounded-xl border border-border bg-black/20 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                    <span className={cn("h-1.5 w-1.5 rounded-full", col.color)} />
                    {col.title}
                    <span className="ml-auto text-muted-foreground">{col.cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.cards.map((c, i) => (
                      <motion.div
                        key={c.t}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + ci * 0.1 + i * 0.05 }}
                        className="rounded-lg border border-border bg-surface p-2.5 text-xs shadow-sm"
                      >
                        <div className="font-medium">{c.t}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                              c.pr === "high"
                                ? "bg-destructive/20 text-destructive"
                                : c.pr === "med"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {c.pr}
                          </span>
                          <div className="grid h-5 w-5 place-items-center rounded-full gradient-primary text-[9px] font-bold text-primary-foreground">
                            {c.who}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
