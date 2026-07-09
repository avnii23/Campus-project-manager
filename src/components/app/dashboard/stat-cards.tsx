import { FolderKanban, ListTodo, Calendar, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { dashboardStats } from "@/lib/mock/data";

const cards = [
  {
    label: "Active projects",
    value: dashboardStats.activeProjects,
    icon: FolderKanban,
    trend: "+1 this month",
    tone: "primary",
  },
  {
    label: "Tasks in flight",
    value: dashboardStats.tasksInFlight,
    icon: ListTodo,
    trend: "8 due this week",
    tone: "info",
  },
  {
    label: "Meetings this week",
    value: dashboardStats.meetingsThisWeek,
    icon: Calendar,
    trend: "2 with advisor",
    tone: "accent",
  },
  {
    label: "Overall health",
    value: `${dashboardStats.overallHealth}%`,
    icon: Activity,
    trend: "+6 vs. last week",
    tone: "success",
  },
] as const;

/** Four KPI cards at the top of the dashboard. */
export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-5 transition hover:border-border hover:bg-surface/60"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {c.label}
              </div>
              <div className="mt-2 font-display text-2xl font-bold">{c.value}</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <c.icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-success">
            <TrendingUp className="h-3 w-3" />
            {c.trend}
          </div>
          <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
        </motion.div>
      ))}
    </div>
  );
}
