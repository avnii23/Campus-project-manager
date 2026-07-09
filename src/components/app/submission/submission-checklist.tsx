import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Upload,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DEFAULT_SUBMISSION, type SubmissionItem } from "@/lib/mock/phase6";

export function SubmissionChecklist() {
  const [items, setItems] = useState<SubmissionItem[]>(DEFAULT_SUBMISSION);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.done).length;
    const required = items.filter((i) => i.required);
    const requiredDone = required.filter((i) => i.done).length;
    const missing = items.filter((i) => !i.done);
    const readiness = Math.round(
      ((requiredDone / required.length) * 0.8 + (done / total) * 0.2) * 100,
    );
    return { total, done, requiredDone, required: required.length, missing, readiness };
  }, [items]);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-success/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-success/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-success/30 bg-success/20 text-success">
              <ClipboardCheck className="h-3 w-3" /> Submission
            </Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Smart Submission Checklist
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Track every artefact your reviewer expects and see a live readiness score before you
              submit.
            </p>
          </div>
          <ReadinessMeter readiness={stats.readiness} />
        </div>

        <div className="relative mt-5 grid gap-3 md:grid-cols-4">
          <Kpi label="Completed" value={`${stats.done}/${stats.total}`} />
          <Kpi label="Required done" value={`${stats.requiredDone}/${stats.required}`} />
          <Kpi label="Missing" value={`${stats.missing.length}`} />
          <Kpi label="Readiness" value={`${stats.readiness}%`} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-border/60 bg-surface/40 p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deliverables
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="border-border/60"
              onClick={() => toast.success("Submission packaged (mock)")}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Package all
            </Button>
          </div>
          <ul className="divide-y divide-border/40">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-2 py-3">
                <button
                  onClick={() => toggle(item.id)}
                  className="mt-0.5 shrink-0"
                  aria-label={item.done ? "Mark as pending" : "Mark as done"}
                >
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        item.done && "text-muted-foreground line-through",
                      )}
                    >
                      {item.label}
                    </span>
                    {item.required && (
                      <Badge
                        variant="outline"
                        className="border-warning/30 bg-warning/10 text-[10px] text-warning"
                      >
                        Required
                      </Badge>
                    )}
                    {!item.required && (
                      <Badge variant="outline" className="border-border/60 text-[10px]">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(`Uploaded ${item.label} (mock)`)}
                >
                  Upload
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> AI review
            </div>
            <p className="text-xs text-muted-foreground">
              Your submission is{" "}
              <span className="font-semibold text-foreground">{stats.readiness}%</span> ready.
              {stats.missing.length > 0
                ? " Close the required gaps below to hit 100%."
                : " Everything looks good — you can submit."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" /> Missing items
            </div>
            {stats.missing.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nothing missing. You're clear to submit.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {stats.missing.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-2 py-1.5 text-xs"
                  >
                    <span>{m.label}</span>
                    {m.required ? (
                      <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">
                        Required
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">Optional</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

function ReadinessMeter({ readiness }: { readiness: number }) {
  const tone = readiness >= 90 ? "text-success" : readiness >= 60 ? "text-info" : "text-warning";
  return (
    <div className="w-full min-w-56 rounded-2xl border border-border/60 bg-background/40 p-4 md:w-72">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Readiness</span>
        <span className={cn("font-display text-2xl font-semibold", tone)}>{readiness}%</span>
      </div>
      <Progress value={readiness} className="mt-2 h-2" />
      <p className="mt-2 text-[11px] text-muted-foreground">
        {readiness >= 90
          ? "Ready to submit."
          : readiness >= 60
            ? "Almost there — close the gaps."
            : "Several critical items pending."}
      </p>
    </div>
  );
}
