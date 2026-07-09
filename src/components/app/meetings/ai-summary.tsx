import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  ListChecks,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Lightbulb,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMeetingsStore } from "@/stores/meetings-store";
import { useProjectsStore } from "@/stores/projects-store";
import {
  generateTasksFromSummary,
  type Meeting,
  type MeetingSummary,
  type AiGeneratedTask,
} from "@/lib/mock/meetings";
import { timeFromNow } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function AiSummaryView({ meeting, summary }: { meeting: Meeting; summary: MeetingSummary }) {
  const [tab, setTab] = useState<"summary" | "tasks">("summary");
  const [generated, setGenerated] = useState<AiGeneratedTask[] | null>(null);
  const [pending, setPending] = useState(false);
  const addTask = useProjectsStore((s) => s.addTask);
  const generateSummary = useMeetingsStore((s) => s.generateSummary);
  const navigate = useNavigate();

  const runGen = async () => {
    setPending(true);
    setTab("tasks");
    await new Promise((r) => setTimeout(r, 900));
    setGenerated(generateTasksFromSummary(summary));
    setPending(false);
    toast.success("AI generated tasks", { description: "Review and push into the project board." });
  };

  const pushAll = () => {
    if (!generated) return;
    for (const g of generated) {
      addTask(meeting.projectId, {
        title: g.title,
        description: g.description,
        status: "todo",
        priority: g.priority,
        labels: ["docs"],
        assigneeIds: g.suggestedAssigneeId ? [g.suggestedAssigneeId] : [],
        dueDate: g.dueDate,
        subtasks: [],
        comments: [],
        attachments: [],
      });
    }
    toast.success(`${generated.length} tasks added to ${meeting.projectName}`);
    navigate({ to: "/app/projects/$projectId/board", params: { projectId: meeting.projectId } });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Button asChild size="sm" variant="ghost" className="-ml-2 text-xs text-muted-foreground">
        <Link to="/app/meetings/$meetingId" params={{ meetingId: meeting.id }}>
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to meeting
        </Link>
      </Button>

      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-surface/50 to-background p-5 md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                <Sparkles className="h-3 w-3" /> AI generated
              </Badge>
              <Badge variant="outline" className="border-border/60 text-[10px]">
                {meeting.projectName}
              </Badge>
              <Badge variant="outline" className="border-border/60 text-[10px] capitalize">
                Sentiment · {summary.sentiment}
              </Badge>
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold md:text-3xl">
              {meeting.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{summary.overview}</p>
            <div className="mt-3 text-[11px] text-muted-foreground">
              Generated {timeFromNow(summary.generatedAt)} · {summary.actionItems.length} action
              items · {summary.decisions.length} decisions
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <Button onClick={runGen} className="gradient-primary text-primary-foreground">
              <ListChecks className="mr-1.5 h-3.5 w-3.5" /> Generate tasks
            </Button>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-border/60 text-xs"
                onClick={() => {
                  generateSummary(meeting.id);
                  toast.success("Regenerated");
                }}
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-border/60 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(summary.overview);
                  toast.success("Copied");
                }}
              >
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
              <Button size="sm" variant="outline" className="h-8 border-border/60 text-xs">
                <Download className="mr-1 h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="flex gap-1 rounded-2xl border border-border/60 bg-surface/40 p-1">
        {(["summary", "tasks"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition",
              tab === k
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {k === "summary" ? "Full summary" : "Generated tasks"}
          </button>
        ))}
      </nav>

      {tab === "summary" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <Card
              icon={<Lightbulb className="h-4 w-4 text-primary" />}
              title="Key discussion points"
            >
              <ul className="space-y-2">
                {summary.keyPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card icon={<CheckCircle2 className="h-4 w-4 text-success" />} title="Decisions taken">
              <ul className="space-y-2">
                {summary.decisions.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card icon={<ListChecks className="h-4 w-4 text-warning" />} title="Action items">
              <ul className="space-y-2">
                {summary.actionItems.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {a.ownerName ?? "Unassigned"} · Due{" "}
                        {a.dueDate ? timeFromNow(a.dueDate) : "TBD"}
                      </div>
                    </div>
                    <Badge
                      className={
                        a.status === "done"
                          ? "bg-success/15 text-success border-success/20"
                          : a.status === "in_progress"
                            ? "bg-info/15 text-info border-info/20"
                            : "bg-warning/15 text-warning border-warning/20"
                      }
                    >
                      {a.status.replace("_", " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card icon={<ArrowRight className="h-4 w-4 text-info" />} title="Follow-ups">
              <ul className="space-y-2 text-sm">
                {summary.followUps.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card icon={<Calendar className="h-4 w-4 text-primary" />} title="Next meeting">
              <div className="text-sm font-medium">{summary.nextMeetingSuggestion.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Suggested {timeFromNow(summary.nextMeetingSuggestion.when)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {summary.nextMeetingSuggestion.reason}
              </p>
              <Button size="sm" className="mt-3 w-full gradient-primary text-primary-foreground">
                Schedule follow-up
              </Button>
            </Card>

            {summary.transcriptExcerpt.length > 0 && (
              <Card
                icon={<MessageCircle className="h-4 w-4 text-info" />}
                title="Transcript excerpt"
              >
                <ol className="space-y-2 text-xs">
                  {summary.transcriptExcerpt.map((t, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border/60 bg-background/40 p-2.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-medium text-foreground">{t.speaker}</span>
                        <span>
                          {new Date(t.at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-foreground/90">{t.text}</p>
                    </li>
                  ))}
                </ol>
                <Separator className="my-3" />
                <Button size="sm" variant="ghost" className="w-full text-xs">
                  View full transcript
                </Button>
              </Card>
            )}
          </aside>
        </div>
      ) : (
        <section className="rounded-2xl border border-border/60 bg-surface/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">AI-generated tasks</h2>
              <p className="text-xs text-muted-foreground">
                Review, edit, then push into the project board.
              </p>
            </div>
            {generated && (
              <Button
                size="sm"
                onClick={pushAll}
                className="gradient-primary text-primary-foreground"
              >
                Push all to {meeting.projectName}
              </Button>
            )}
          </div>
          {pending ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="h-3 w-2/3 rounded bg-muted/50" />
                  <div className="mt-2 h-2 w-full rounded bg-muted/30" />
                  <div className="mt-1 h-2 w-4/5 rounded bg-muted/30" />
                </div>
              ))}
            </div>
          ) : !generated ? (
            <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <div className="mt-2 text-sm font-medium">Nothing generated yet</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Click "Generate tasks" to turn action items into a ready-to-ship backlog.
              </p>
              <Button className="mt-4 gradient-primary text-primary-foreground" onClick={runGen}>
                <ListChecks className="mr-1.5 h-3.5 w-3.5" /> Generate now
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {generated.map((t) => (
                <li key={t.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          className={
                            t.priority === "urgent"
                              ? "bg-destructive/15 text-destructive border-destructive/25"
                              : t.priority === "high"
                                ? "bg-warning/15 text-warning border-warning/20"
                                : "bg-info/15 text-info border-info/20"
                          }
                        >
                          {t.priority}
                        </Badge>
                        {t.labels.map((l) => (
                          <Badge key={l} variant="outline" className="border-border/60 text-[10px]">
                            {l}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-sm font-medium">{t.title}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                        <span>
                          Assignee:{" "}
                          <span className="text-foreground">
                            {t.suggestedAssigneeName ?? "Unassigned"}
                          </span>
                        </span>
                        <span>
                          Due: <span className="text-foreground">{timeFromNow(t.dueDate)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </motion.div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="font-display text-sm font-semibold">{title}</h2>
      </header>
      {children}
    </section>
  );
}
