import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  ListChecks,
  TrendingUp,
  Zap,
  Lightbulb,
  Send,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ToolKey = "chat" | "summary" | "tasks" | "insights" | "sprint" | "tips";

const tools: Array<{
  key: ToolKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  accent: string;
}> = [
  {
    key: "chat",
    label: "Assistant chat",
    icon: MessageSquare,
    desc: "Ask anything about your projects.",
    accent: "from-primary/25 to-primary/5",
  },
  {
    key: "summary",
    label: "Meeting summary",
    icon: Sparkles,
    desc: "Paste notes, get a polished recap.",
    accent: "from-info/25 to-info/5",
  },
  {
    key: "tasks",
    label: "Task generator",
    icon: ListChecks,
    desc: "Turn goals or notes into a backlog.",
    accent: "from-warning/25 to-warning/5",
  },
  {
    key: "insights",
    label: "Project insights",
    icon: TrendingUp,
    desc: "Health, velocity, risk radar.",
    accent: "from-success/25 to-success/5",
  },
  {
    key: "sprint",
    label: "Sprint suggestions",
    icon: Zap,
    desc: "AI-planned next sprint scope.",
    accent: "from-purple/25 to-primary/5",
  },
  {
    key: "tips",
    label: "Productivity tips",
    icon: Lightbulb,
    desc: "Personalised nudges for your team.",
    accent: "from-info/25 to-primary/5",
  },
];

type ChatMsg = { id: string; role: "user" | "assistant"; body: string };

export function AiWorkspace() {
  const [active, setActive] = useState<ToolKey>("chat");
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-20 h-40 w-40 rounded-full bg-info/15 blur-3xl" />
        <div className="relative">
          <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
            <Sparkles className="h-3 w-3" /> AI Studio
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Your project co-pilot
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            One workspace for meeting summaries, task generation, insights, sprint planning and
            productivity coaching — all backed by CampusPM AI.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-background/40 px-3 py-1">
              6 built-in tools
            </span>
            <span className="rounded-full border border-border/60 bg-background/40 px-3 py-1">
              Streaming responses
            </span>
            <span className="rounded-full border border-border/60 bg-background/40 px-3 py-1">
              Project-aware context
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="space-y-1.5">
          {tools.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "group relative w-full overflow-hidden rounded-2xl border p-3 text-left transition",
                active === t.key
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-surface/40 hover:border-border hover:bg-surface/60",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0 transition-opacity",
                  "bg-gradient-to-br",
                  t.accent,
                  active === t.key ? "opacity-100" : "group-hover:opacity-60",
                )}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl transition",
                    active === t.key
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-2 text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <t.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    {t.desc}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {active === "chat" && <ChatPanel />}
            {active === "summary" && (
              <TextToolPanel
                placeholder="Paste raw notes, transcript, or bullet points…"
                cta="Generate summary"
                resultTitle="Meeting summary"
                render={(v) => ({
                  Overview:
                    v ||
                    "Meeting focused on unblocking the current sprint and confirming ownership for the top three deliverables.",
                  "Key discussion points": [
                    "Milestone drift risk on the IoT track.",
                    "Deploy pipeline needs a preview environment.",
                    "Design handoff timeline is tight.",
                  ],
                  Decisions: [
                    "Extend sprint by 2 days.",
                    "Ship preview deploys this week.",
                    "Freeze scope after Wednesday.",
                  ],
                  "Action items": [
                    "Ada — spec preview deploy (Fri)",
                    "Marie — final Figma pass (Wed)",
                    "Alan — CI test workflow (Thu)",
                  ],
                })}
              />
            )}
            {active === "tasks" && (
              <TextToolPanel
                placeholder="What are we trying to ship? Paste a goal, brief, or notes…"
                cta="Generate tasks"
                resultTitle="Proposed tasks"
                render={(v) => ({
                  Backlog: [
                    `${v ? "Investigate: " : ""}Draft technical spec (2d, high)`,
                    "Design first-run experience (3d, medium)",
                    "Build API scaffold + tests (3d, high)",
                    "Ship internal prototype (2d, medium)",
                    "User testing round 1 (1w, medium)",
                  ],
                })}
              />
            )}
            {active === "insights" && (
              <StaticPanel
                title="Project insights"
                subtitle="Live snapshot across your active projects."
                blocks={[
                  {
                    label: "Overall health",
                    value: "Good (72)",
                    tone: "success",
                    detail: "Up 6 pts from last week.",
                  },
                  {
                    label: "Velocity",
                    value: "14 tasks/wk",
                    tone: "info",
                    detail: "Steady across last 4 sprints.",
                  },
                  {
                    label: "Risk radar",
                    value: "1 amber, 1 red",
                    tone: "warning",
                    detail: "Sustainable Packaging Study is at 41 — needs a check-in.",
                  },
                  {
                    label: "Meeting load",
                    value: "3 this week",
                    tone: "info",
                    detail: "Ada has 4 syncs — consider one async.",
                  },
                ]}
              />
            )}
            {active === "sprint" && (
              <StaticPanel
                title="Sprint suggestions"
                subtitle="Suggested scope for the upcoming 2-week sprint."
                blocks={[
                  {
                    label: "Sprint goal",
                    value: "Ship testable MVP on staging",
                    tone: "success",
                    detail: "3 milestones align on this outcome.",
                  },
                  {
                    label: "Capacity",
                    value: "78 pts",
                    tone: "info",
                    detail: "Based on last 4-sprint average, minus PTO.",
                  },
                  {
                    label: "Recommended focus",
                    value: "Auth, Board CRUD, Deploy",
                    tone: "info",
                    detail: "Highest-impact unblockers.",
                  },
                  {
                    label: "De-scope candidates",
                    value: "Analytics polish",
                    tone: "warning",
                    detail: "Move to sprint +2 to protect goal.",
                  },
                ]}
              />
            )}
            {active === "tips" && (
              <StaticPanel
                title="Productivity tips"
                subtitle="Personalised for your team, right now."
                blocks={[
                  {
                    label: "Async first",
                    value: "Skip Tuesday sync",
                    tone: "info",
                    detail: "Team completes 22% more tasks on no-meeting days.",
                  },
                  {
                    label: "Batch review",
                    value: "Wed 3pm",
                    tone: "info",
                    detail: "Cluster PR reviews to protect deep work.",
                  },
                  {
                    label: "Guide check-in",
                    value: "Book 20 min",
                    tone: "warning",
                    detail: "It's been 12 days — early feedback prevents rework.",
                  },
                  {
                    label: "Recharge",
                    value: "Ada is on 5-day streak",
                    tone: "success",
                    detail: "Nudge her to close laptop by 8pm.",
                  },
                ]}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "seed",
      role: "assistant",
      body: "Hi 👋 I can help you plan, summarise, extract tasks, or answer questions about your projects. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { id: `u${Date.now()}`, role: "user", body: q }]);
    setInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 700));
    setMessages((m) => [
      ...m,
      {
        id: `a${Date.now()}`,
        role: "assistant",
        body: mockAssistantReply(q),
      },
    ]);
    setThinking(false);
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-border/60 bg-surface/40">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
            AI
          </div>
          <div>
            <div className="text-sm font-semibold">CampusPM Assistant</div>
            <div className="text-[10px] text-muted-foreground">Project-aware · streaming</div>
          </div>
        </div>
        <Badge variant="outline" className="border-border/60 text-[10px]">
          gemini-3-flash
        </Badge>
      </header>
      <ScrollArea className="flex-1">
        <ul className="space-y-3 p-4">
          {messages.map((m) => (
            <li key={m.id} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
                  m.role === "user"
                    ? "bg-primary/20 text-primary"
                    : "gradient-primary text-primary-foreground",
                )}
              >
                {m.role === "user" ? "You" : "AI"}
              </span>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/60 text-foreground",
                )}
              >
                {m.body}
              </div>
            </li>
          ))}
          {thinking && (
            <li className="flex gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full gradient-primary text-[10px] font-semibold text-primary-foreground">
                AI
              </span>
              <div className="flex items-center gap-1 rounded-2xl bg-background/60 px-3 py-2 text-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
              </div>
            </li>
          )}
        </ul>
      </ScrollArea>
      <footer className="border-t border-border/60 p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about tasks, health, meetings…"
            className="h-10"
          />
          <Button onClick={send} className="gradient-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Summarise my week", "What's at risk?", "Draft next sprint plan"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
              }}
              className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}

function mockAssistantReply(q: string) {
  const low = q.toLowerCase();
  if (low.includes("risk"))
    return "Right now Sustainable Packaging Study is your biggest risk (health 41). The literature review section 2 is due tomorrow with only 4/22 tasks done. Recommendation: book a 30-min triage sync and re-plan the next 3 tasks.";
  if (low.includes("sprint"))
    return "For your next 2-week sprint, I'd anchor on 'Ship testable MVP on staging'. Capacity ≈ 78 pts. Priorities: Auth flow, Board CRUD, Deploy pipeline. De-scope Analytics polish to sprint +2.";
  if (low.includes("summar"))
    return "This week: 12 tasks completed (+3 vs last), 3 meetings run, 2 blockers resolved. Ada and Alan are your top contributors. Watch: Sustainable Packaging drifting.";
  return "Good question. Here's a starting point — want me to expand any part into a full plan or push it to a project board?";
}

function TextToolPanel({
  placeholder,
  cta,
  resultTitle,
  render,
}: {
  placeholder: string;
  cta: string;
  resultTitle: string;
  render: (input: string) => Record<string, string | string[]>;
}) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Record<string, string | string[]> | null>(null);
  const run = async () => {
    setPending(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    setResult(render(value));
    setPending(false);
    toast.success(`${resultTitle} ready`);
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Wand2 className="h-4 w-4 text-primary" /> Input
        </div>
        <Textarea
          rows={12}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="resize-none"
        />
        <Button
          onClick={run}
          disabled={pending}
          className="mt-3 w-full gradient-primary text-primary-foreground"
        >
          {pending ? "Generating…" : cta}
          {!pending && <ArrowRight className="ml-1 h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> {resultTitle}
        </div>
        {pending ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded bg-muted/40"
                style={{ width: `${60 + i * 8}%` }}
              />
            ))}
          </div>
        ) : !result ? (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
            Results appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(result).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</div>
                {Array.isArray(v) ? (
                  <ul className="mt-1 space-y-1 text-sm">
                    {v.map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm">{v}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StaticPanel({
  title,
  subtitle,
  blocks,
}: {
  title: string;
  subtitle: string;
  blocks: Array<{
    label: string;
    value: string;
    tone: "success" | "info" | "warning";
    detail: string;
  }>;
}) {
  const toneMap = {
    success: "border-success/25 bg-success/5 text-success",
    info: "border-info/25 bg-info/5 text-info",
    warning: "border-warning/25 bg-warning/5 text-warning",
  } as const;
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-4">
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.label} className={cn("rounded-xl border p-4", toneMap[b.tone])}>
            <div className="text-[10px] uppercase tracking-wide opacity-80">{b.label}</div>
            <div className="mt-1 font-display text-lg font-semibold text-foreground">{b.value}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">{b.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
