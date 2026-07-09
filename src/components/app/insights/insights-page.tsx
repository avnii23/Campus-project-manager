import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AI_RECOMMENDATIONS, CONTRIBUTION_BREAKDOWN, WEEKLY_VELOCITY } from "@/lib/mock/phase6";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "#94a3b8",
];

const TONE = {
  risk: "border-warning/30 bg-warning/5 text-warning",
  opportunity: "border-info/30 bg-info/5 text-info",
  win: "border-success/30 bg-success/5 text-success",
} as const;

export function InsightsPage() {
  const health = 82;
  const contribution = 88;
  const risk = 24;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative">
          <Badge className="gap-1 border-primary/30 bg-primary/20 text-primary">
            <TrendingUp className="h-3 w-3" /> Insights
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Project Insights</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            AI-powered signals across health, contribution, risk and velocity. Updated every hour.
          </p>
        </div>
      </section>

      {/* Score cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Project health"
          value={health}
          icon={ShieldCheck}
          tone="hsl(var(--success))"
          desc="Above the healthy threshold."
        />
        <ScoreCard
          label="Team contribution"
          value={contribution}
          icon={Users}
          tone="hsl(var(--primary))"
          desc="Well balanced across roles."
        />
        <ScoreCard
          label="Deadline risk"
          value={risk}
          inverse
          icon={AlertTriangle}
          tone="hsl(var(--warning))"
          desc="Low, thanks to steady velocity."
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Productivity trends</h3>
              <p className="text-[11px] text-muted-foreground">Weekly planned vs shipped tasks</p>
            </div>
            <Badge variant="outline" className="border-border/60 text-[10px]">
              Last 8 weeks
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart
                data={WEEKLY_VELOCITY}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="shipped" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="hsl(var(--info))"
                  fill="url(#planned)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="shipped"
                  stroke="hsl(var(--primary))"
                  fill="url(#shipped)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5">
          <h3 className="font-display text-lg font-semibold">Contribution split</h3>
          <p className="text-[11px] text-muted-foreground">By tasks shipped</p>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={CONTRIBUTION_BREAKDOWN}
                  innerRadius={45}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {CONTRIBUTION_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Recommendations + weekly summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> AI recommendations
          </div>
          <ul className="space-y-2">
            {AI_RECOMMENDATIONS.map((r) => (
              <li
                key={r.id}
                className={cn("rounded-xl border p-3", TONE[r.tone as keyof typeof TONE])}
              >
                <div className="text-sm font-semibold text-foreground">{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.detail}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Zap className="h-4 w-4 text-primary" /> Weekly summary
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center justify-between">
              <span>Tasks shipped</span>
              <span className="font-semibold text-foreground">22</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Meetings held</span>
              <span className="font-semibold text-foreground">6</span>
            </li>
            <li className="flex items-center justify-between">
              <span>AI actions</span>
              <span className="font-semibold text-foreground">18</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Blockers cleared</span>
              <span className="font-semibold text-foreground">3</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Cycle time</span>
              <span className="font-semibold text-foreground">1.8d</span>
            </li>
          </ul>
          <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
            <div className="flex items-center gap-1 text-primary">
              <Activity className="h-3.5 w-3.5" /> <span className="font-semibold">Momentum</span>
            </div>
            <p className="mt-1 text-muted-foreground">
              +9% vs last week. Keep the current sprint scope steady.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function ScoreCard({
  label,
  value,
  icon: Icon,
  tone,
  desc,
  inverse,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  desc: string;
  inverse?: boolean;
}) {
  const displayValue = inverse ? 100 - value : value;
  const data = [{ name: label, value: displayValue }];
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: tone }}>
          <Icon className="h-4 w-4" />
          <span className="text-foreground">{label}</span>
        </div>
        <span className="font-display text-2xl font-semibold" style={{ color: tone }}>
          {value}
          {inverse ? "%" : ""}
        </span>
      </div>
      <div className="mt-3 h-24">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="60%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              fill={tone}
              cornerRadius={20}
              background={{ fill: "hsl(var(--surface-2))" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-muted-foreground">{desc}</p>
      <Progress value={displayValue} className="mt-2 h-1" />
    </div>
  );
}
