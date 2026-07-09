import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Wand2, Loader2, Sparkles, RefreshCw, FileDown } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DEFAULT_REPORT, type ReportSection } from "@/lib/mock/phase6";

export function ReportGenerator() {
  const [sections, setSections] = useState<ReportSection[]>(DEFAULT_REPORT);
  const [active, setActive] = useState(sections[0].id);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const currentIndex = sections.findIndex((s) => s.id === active);
  const current = sections[currentIndex];
  const wordCount = sections.reduce((n, s) => n + s.body.split(/\s+/).filter(Boolean).length, 0);
  const completion = Math.min(100, Math.round((wordCount / 2500) * 100));

  const regenerate = (id: string) => {
    setRegenerating(id);
    setTimeout(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                body:
                  s.body +
                  "\n\nAI has expanded this section with additional context, examples and evaluation notes for stronger reviewer coverage.",
              }
            : s,
        ),
      );
      setRegenerating(null);
      toast.success("Section regenerated");
    }, 1200);
  };

  const exportAs = (kind: "pdf" | "docx") => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success(`Exported as .${kind} (mock)`);
    }, 900);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-info/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-info/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-info/30 bg-info/20 text-info">
              <FileText className="h-3 w-3" /> Report Studio
            </Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              AI Report Generator
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              A living academic report with per-section AI regeneration and instant PDF or DOCX
              export.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-border/60"
              onClick={() => exportAs("docx")}
              disabled={busy}
            >
              <FileDown className="mr-1.5 h-4 w-4" /> Export .docx
            </Button>
            <Button onClick={() => exportAs("pdf")} disabled={busy} className="shadow-glow">
              {busy ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}{" "}
              Export PDF
            </Button>
          </div>
        </div>
        <div className="relative mt-5 grid gap-3 md:grid-cols-3">
          <Stat label="Sections" value={`${sections.length}`} />
          <Stat label="Words" value={wordCount.toLocaleString()} />
          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Completion</span>
              <span className="font-semibold text-foreground">{completion}%</span>
            </div>
            <Progress value={completion} className="mt-1.5 h-1.5" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        {/* TOC */}
        <aside className="space-y-1 rounded-2xl border border-border/60 bg-surface/40 p-3">
          <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Table of contents
          </h3>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition",
                active === s.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-background/40 hover:text-foreground",
              )}
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border/60 bg-background/40 text-[10px] font-semibold">
                {i + 1}
              </span>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </aside>

        {/* Editor */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Section {currentIndex + 1}
                </div>
                <h2 className="font-display text-2xl font-semibold">{current.title}</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/60"
                  onClick={() => regenerate(current.id)}
                  disabled={regenerating === current.id}
                >
                  {regenerating === current.id ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Regenerate
                </Button>
                <Button size="sm" onClick={() => toast.success("AI expanded this section")}>
                  <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Expand
                </Button>
              </div>
            </div>
            <Textarea
              value={current.body}
              onChange={(e) =>
                setSections((prev) =>
                  prev.map((s) => (s.id === current.id ? { ...s, body: e.target.value } : s)),
                )
              }
              rows={16}
              className="mt-4 min-h-[360px] bg-background/60 leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{current.body.split(/\s+/).filter(Boolean).length} words</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> AI polish available
              </span>
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-2xl border border-border/60 bg-background/60 p-6">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              Live preview
            </div>
            <article className="prose prose-invert max-w-none prose-headings:font-display prose-p:text-sm prose-p:leading-relaxed">
              <h1 className="mb-1">{sections[0].body.slice(0, 60)}…</h1>
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="mt-4">
                  <h2 className="text-lg font-semibold">{s.title}</h2>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{s.body}</p>
                </section>
              ))}
            </article>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}
