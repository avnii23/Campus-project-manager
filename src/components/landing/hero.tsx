import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientLink } from "@/components/ui/gradient-button";
import { DashboardMockup } from "./dashboard-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">
              New — AI viva assistant + smart submission checklist
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Where student projects
            <br />
            <span className="gradient-text">actually get shipped.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            CampusPM is the all-in-one workspace for student teams. Plan on a kanban, store code in
            a repository, run meetings, generate reports & presentations with AI — from kickoff to
            final submission.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GradientLink to="/auth" size="lg">
              Start free
              <ArrowRight className="h-4 w-4" />
            </GradientLink>
            <a
              href="#features"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface/50 px-6 text-base font-semibold backdrop-blur transition hover:bg-surface-2"
            >
              Explore features
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free for students · No credit card required · Works with your team
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 sm:mt-20"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
