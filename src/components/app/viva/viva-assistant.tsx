import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mic,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { VIVA_TOPICS, type VivaDifficulty, type VivaQuestion } from "@/lib/mock/phase6";

const DIFFICULTY_TONE: Record<VivaDifficulty, string> = {
  easy: "bg-success/15 text-success border-success/20",
  medium: "bg-info/15 text-info border-info/20",
  hard: "bg-warning/15 text-warning border-warning/20",
};

type Mode = "practice" | "mock";

export function VivaAssistant() {
  const [topicId, setTopicId] = useState(VIVA_TOPICS[0].id);
  const [mode, setMode] = useState<Mode>("practice");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [mockDone, setMockDone] = useState(false);
  const [draft, setDraft] = useState("");

  const topic = useMemo(() => VIVA_TOPICS.find((t) => t.id === topicId)!, [topicId]);
  const allQuestions = useMemo(() => VIVA_TOPICS.flatMap((t) => t.questions), []);
  const mockQ = allQuestions[mockIndex];

  const startMock = () => {
    setMode("mock");
    setMockIndex(0);
    setMockAnswers({});
    setMockDone(false);
    setDraft("");
  };

  const submitMock = () => {
    setMockAnswers((prev) => ({ ...prev, [mockQ.id]: draft }));
    setDraft("");
    if (mockIndex + 1 >= allQuestions.length) {
      setMockDone(true);
    } else {
      setMockIndex((i) => i + 1);
    }
  };

  const score = useMemo(() => {
    const answered = Object.values(mockAnswers).filter((a) => a.trim().length > 20).length;
    return Math.round((answered / allQuestions.length) * 100);
  }, [mockAnswers, allQuestions.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-warning/15 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-warning/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="gap-1 border-warning/30 bg-warning/20 text-warning">
              <Brain className="h-3 w-3" /> AI Coach
            </Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Viva Assistant</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Rehearse expected questions, review model answers, then run a mock viva with instant
              scoring.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "practice" ? "default" : "outline"}
              onClick={() => setMode("practice")}
            >
              {" "}
              Practice
            </Button>
            <Button variant={mode === "mock" ? "default" : "outline"} onClick={startMock}>
              <Play className="mr-1.5 h-4 w-4" /> Start mock viva
            </Button>
          </div>
        </div>
      </section>

      {mode === "practice" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
          <aside className="space-y-1 rounded-2xl border border-border/60 bg-surface/40 p-3">
            <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Topics
            </h3>
            {VIVA_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopicId(t.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs transition",
                  topicId === t.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-background/40 hover:text-foreground",
                )}
              >
                <span className="truncate">{t.name}</span>
                <span className="rounded-full border border-border/60 bg-background/40 px-1.5 py-0.5 text-[10px]">
                  {t.questions.length}
                </span>
              </button>
            ))}
          </aside>

          <div className="space-y-3">
            {topic.questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                revealed={!!revealed[q.id]}
                onToggle={() => setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))}
              />
            ))}
          </div>
        </div>
      ) : (
        <MockView
          mockDone={mockDone}
          question={mockQ}
          index={mockIndex}
          total={allQuestions.length}
          draft={draft}
          setDraft={setDraft}
          score={score}
          answers={mockAnswers}
          onSubmit={submitMock}
          onRestart={() => {
            startMock();
            toast.success("Mock viva reset");
          }}
        />
      )}
    </motion.div>
  );
}

function QuestionCard({
  q,
  index,
  revealed,
  onToggle,
}: {
  q: VivaQuestion;
  index: number;
  revealed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-surface/40 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Q{index + 1}</span>
            <Badge className={cn("border text-[10px]", DIFFICULTY_TONE[q.difficulty])}>
              {q.difficulty}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-medium">{q.q}</p>
        </div>
        <Button size="sm" variant="outline" className="border-border/60" onClick={onToggle}>
          {revealed ? "Hide answer" : "Reveal answer"}
        </Button>
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">
              <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Model answer
              </div>
              {q.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MockView({
  mockDone,
  question,
  index,
  total,
  draft,
  setDraft,
  onSubmit,
  onRestart,
  score,
  answers,
}: {
  mockDone: boolean;
  question: VivaQuestion;
  index: number;
  total: number;
  draft: string;
  setDraft: (s: string) => void;
  onSubmit: () => void;
  onRestart: () => void;
  score: number;
  answers: Record<string, string>;
}) {
  if (mockDone) {
    const strengths = Object.entries(answers).filter(([, a]) => a.trim().length > 60).length;
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/60 bg-gradient-to-br from-success/10 to-surface/40 p-8 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
          <Trophy className="h-6 w-6 text-primary-foreground" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">Viva complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You answered {Object.keys(answers).length} of {total} questions.
        </p>

        <div className="mx-auto mt-6 grid max-w-md gap-4 sm:grid-cols-3">
          <ScoreTile label="Score" value={`${score}%`} tone="text-primary" />
          <ScoreTile label="Strong answers" value={`${strengths}`} tone="text-success" />
          <ScoreTile label="Improve" value={`${total - strengths}`} tone="text-warning" />
        </div>

        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-border/60 bg-background/40 p-4 text-left">
          <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> AI feedback
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Add concrete numbers when discussing methodology and results.</li>
            <li>• Prepare 2-line elevator answers for common architecture questions.</li>
            <li>• Cite one paper or source per topic to signal literature depth.</li>
          </ul>
        </div>

        <Button onClick={onRestart} className="mt-6">
          <RotateCcw className="mr-1.5 h-4 w-4" /> Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-surface/40 p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Question {index + 1} / {total}
        </div>
        <Badge className={cn("border text-[10px]", DIFFICULTY_TONE[question.difficulty])}>
          {question.difficulty}
        </Badge>
      </div>
      <Progress value={((index + 1) / total) * 100} className="h-1.5" />
      <h2 className="mt-4 font-display text-xl font-semibold">{question.q}</h2>
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type your answer as if you were speaking to the examiner…"
        rows={6}
        className="mt-4 bg-background/60"
      />
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="outline"
          className="border-border/60"
          onClick={() => toast.info("Voice input coming soon")}
        >
          <Mic className="mr-1.5 h-4 w-4" /> Speak
        </Button>
        <Button onClick={onSubmit}>
          Next <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ScoreTile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 font-display text-2xl font-semibold", tone)}>{value}</div>
    </div>
  );
}
