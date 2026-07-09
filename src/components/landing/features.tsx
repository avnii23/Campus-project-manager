import { motion } from "motion/react";
import {
  Kanban,
  GitBranch,
  Video,
  FileText,
  Presentation,
  BarChart3,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Kanban that fits how students work",
    desc: "Backlog → In Progress → Review → Done. Drag, assign, deadline, done.",
  },
  {
    icon: GitBranch,
    title: "Project repository",
    desc: "A GitHub-inspired file store with folders, previews, and version history.",
  },
  {
    icon: Video,
    title: "Meetings, notes, action items",
    desc: "Schedule, meet, and capture everything — with automatic AI summaries.",
  },
  {
    icon: Sparkles,
    title: "AI report & PPT generator",
    desc: "Turn your project into a polished report or presentation in one click.",
  },
  {
    icon: Presentation,
    title: "Viva assistant",
    desc: "Practice with AI-generated questions based on your actual project.",
  },
  {
    icon: BarChart3,
    title: "Analytics & contribution score",
    desc: "See who did what, when, and how healthy your project really is.",
  },
  {
    icon: FileText,
    title: "Smart submission checklist",
    desc: "Never miss a deliverable. Auto-checks your files against the rubric.",
  },
  {
    icon: Users,
    title: "Made for teams of 2 to 20",
    desc: "Real-time collaboration, roles, and permissions built in.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Everything you need
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            One workspace. <span className="gradient-text">Ten superpowers.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No more juggling WhatsApp, Google Drive, and last-minute all-nighters.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),oklch(0.78_0.17_70/0.06),transparent_40%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
