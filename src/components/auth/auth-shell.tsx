import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Consistent split-screen auth surface with premium dark styling.
 * Left = branded hero, right = form. Collapses to single column on mobile.
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 gradient-mesh opacity-60" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="hidden flex-col justify-between border-r border-border/60 bg-surface/30 p-10 backdrop-blur-xl lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
              <span className="font-display text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">CampusPM</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Trusted by 300+ campus teams
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight">
              Ship better academic projects,{" "}
              <span className="gradient-text">from kickoff to viva.</span>
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Kanban, meetings, repository, AI reports & presentations — one polished workspace
              built for student teams.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "Projects shipped", value: "12k+" },
                { label: "Meetings run", value: "45k" },
                { label: "AI docs made", value: "82k" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border/60 bg-surface/40 p-4"
                >
                  <div className="font-display text-xl font-bold">{s.value}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CampusPM. Built for students.
          </p>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Mobile brand */}
            <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
                <span className="font-display text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="font-display text-lg font-semibold">CampusPM</span>
            </Link>

            <div className="glass-strong rounded-3xl border border-border/60 p-6 sm:p-8 shadow-elevated">
              <div className="mb-6 text-center sm:text-left">
                <h1 className="font-display text-2xl font-bold">{title}</h1>
                {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
