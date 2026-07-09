import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Palette,
  Loader2,
  Presentation,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PPT_INPUTS,
  PPT_THEMES,
  buildSlides,
  type PptInputs,
  type PptSlide,
} from "@/lib/mock/phase6";

export function PptGenerator() {
  const [inputs, setInputs] = useState<PptInputs>(DEFAULT_PPT_INPUTS);
  const [slides, setSlides] = useState<PptSlide[]>(() => buildSlides(DEFAULT_PPT_INPUTS));
  const [themeId, setThemeId] = useState(PPT_THEMES[0].id);
  const [active, setActive] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState<string | null>(null);

  const theme = useMemo(() => PPT_THEMES.find((t) => t.id === themeId)!, [themeId]);
  const currentSlide = slides[active];

  const generate = () => {
    if (!inputs.title.trim()) {
      toast.error("Give your project a title first");
      return;
    }
    setGenerating(true);
    setProgress(8);
    const t = setInterval(() => setProgress((p) => Math.min(96, p + 12)), 220);
    setTimeout(() => {
      clearInterval(t);
      setProgress(100);
      setSlides(buildSlides(inputs));
      setActive(0);
      setGenerating(false);
      toast.success("Presentation generated · 11 slides ready");
    }, 1600);
  };

  const updateSlide = (id: string, patch: Partial<PptSlide>) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const setField = (key: keyof PptInputs, v: string) => setInputs((p) => ({ ...p, [key]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-32 h-40 w-40 rounded-full bg-info/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-primary/30 bg-primary/20 text-primary">
              <Sparkles className="h-3 w-3" /> Flagship
            </Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              AI Presentation Generator
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Turn your project brief into a submission-ready deck. Preview, edit and re-theme in
              seconds.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="border-border/60"
              onClick={() => toast.info("PPTX export queued (mock)")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Export .pptx
            </Button>
            <Button onClick={generate} disabled={generating} className="shadow-glow">
              {generating ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-1.5 h-4 w-4" />
              )}
              {generating ? "Generating…" : "Generate deck"}
            </Button>
          </div>
        </div>
        {(generating || progress > 0) && (
          <div className="relative mt-5">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>AI drafting slides…</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Project brief
            </h2>
            <div className="space-y-3">
              <Field
                label="Project title"
                value={inputs.title}
                onChange={(v) => setField("title", v)}
              />
              <FieldArea
                label="Problem statement"
                value={inputs.problem}
                onChange={(v) => setField("problem", v)}
              />
              <FieldArea
                label="Objectives"
                value={inputs.objectives}
                onChange={(v) => setField("objectives", v)}
              />
              <FieldArea
                label="Methodology"
                value={inputs.methodology}
                onChange={(v) => setField("methodology", v)}
              />
              <FieldArea
                label="Tech stack"
                value={inputs.stack}
                onChange={(v) => setField("stack", v)}
              />
              <FieldArea
                label="Features"
                value={inputs.features}
                onChange={(v) => setField("features", v)}
              />
              <FieldArea
                label="Results"
                value={inputs.results}
                onChange={(v) => setField("results", v)}
              />
              <FieldArea
                label="Future scope"
                value={inputs.future}
                onChange={(v) => setField("future", v)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Palette className="h-4 w-4 text-primary" /> Theme
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {PPT_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={cn(
                    "group overflow-hidden rounded-xl border p-0 text-left transition",
                    themeId === t.id
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60 hover:border-primary/40",
                  )}
                >
                  <div className={cn("h-14 bg-gradient-to-br", t.gradient)} />
                  <div className="flex items-center justify-between px-2 py-1.5 text-[11px]">
                    <span className="font-medium">{t.name}</span>
                    <div className="flex gap-0.5">
                      {t.swatch.map((c) => (
                        <span
                          key={c}
                          className="h-2 w-2 rounded-full ring-1 ring-border/40"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/60">
            <div className={cn("aspect-[16/9] bg-gradient-to-br p-8 md:p-12", theme.gradient)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id + themeId}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col justify-between text-white drop-shadow"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest opacity-80">
                    <span>{inputs.title || "Project"}</span>
                    <span>
                      Slide {active + 1} · {slides.length}
                    </span>
                  </div>
                  <div>
                    {editing === currentSlide.id ? (
                      <Input
                        autoFocus
                        value={currentSlide.title}
                        onChange={(e) => updateSlide(currentSlide.id, { title: e.target.value })}
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                        className="border-white/30 bg-white/10 text-2xl font-semibold text-white md:text-4xl"
                      />
                    ) : (
                      <h2
                        onDoubleClick={() => setEditing(currentSlide.id)}
                        className={cn(
                          "font-display font-semibold leading-tight",
                          currentSlide.kind === "cover"
                            ? "text-4xl md:text-6xl"
                            : "text-3xl md:text-5xl",
                        )}
                      >
                        {currentSlide.title}
                      </h2>
                    )}
                    <ul className="mt-4 space-y-1.5 text-sm md:text-lg">
                      {currentSlide.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                          <span className="opacity-95">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] opacity-70">CampusPM · AI-generated</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 bg-surface/60 px-3 py-2 backdrop-blur">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/60"
                  onClick={() => setEditing(currentSlide.id)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit title
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/60"
                  onClick={() => toast.success("Opened presenter mode (mock)")}
                >
                  <Presentation className="mr-1.5 h-3.5 w-3.5" /> Present
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActive((a) => Math.min(slides.length - 1, a + 1))}
                disabled={active === slides.length - 1}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigator */}
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Slide navigator
              </h3>
              <span className="text-[11px] text-muted-foreground">{slides.length} slides</span>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative w-40 shrink-0 overflow-hidden rounded-lg border text-left transition",
                      i === active
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-border/60 hover:border-primary/40",
                    )}
                  >
                    <div className={cn("h-20 bg-gradient-to-br p-2 text-white", theme.gradient)}>
                      <div className="text-[9px] uppercase opacity-70">Slide {i + 1}</div>
                      <div className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight">
                        {s.title}
                      </div>
                    </div>
                    <div className="truncate px-2 py-1 text-[10px] text-muted-foreground">
                      {s.kind}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Bullet editor */}
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
            <h3 className="mb-2 text-sm font-semibold">Edit slide content</h3>
            <Textarea
              value={currentSlide.bullets.join("\n")}
              onChange={(e) =>
                updateSlide(currentSlide.id, {
                  bullets: e.target.value.split("\n").filter(Boolean),
                })
              }
              rows={5}
              className="bg-background/60"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              One bullet per line. Changes reflect live in the preview.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-background/60"
      />
    </div>
  );
}

function FieldArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="mt-1 bg-background/60"
      />
    </div>
  );
}
