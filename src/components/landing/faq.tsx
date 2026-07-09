import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const faqs = [
  {
    q: "Is CampusPM really free for students?",
    a: "Yes. The Student plan is free forever. It covers one active project, up to 5 teammates, and 50 AI generations per month — enough for most course and capstone projects.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. CampusPM runs entirely in your browser. Sign in and you're ready. It's fully responsive so you can plan on your phone and build on your laptop.",
  },
  {
    q: "What AI models do you use?",
    a: "We use best-in-class models via a unified gateway — Gemini for fast summarization and generation, and premium models when you need higher fidelity. You never provide an API key.",
  },
  {
    q: "Can my advisor or professor view our progress?",
    a: "Yes. Invite advisors as read-only viewers or reviewers. They see the board, meeting notes, contribution scores, and submission status — no more status emails.",
  },
  {
    q: "Is my project data private?",
    a: "Your data is yours. Every project is scoped to its members with row-level security. Nothing is used to train models. You can export or delete everything at any time.",
  },
  {
    q: "Can we import our existing files and code?",
    a: "Yes. Drag and drop folders into the repository, or paste task lists to auto-generate a board. Most teams migrate their whole project in under 15 minutes.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Answers, <span className="gradient-text">before you ask.</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/[0.02]"
                >
                  <span className="font-display text-base font-semibold sm:text-lg">{f.q}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
