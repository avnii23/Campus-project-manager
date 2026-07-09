import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

/** Personalized welcome + AI CTA at the top of the dashboard. */
export function DashboardHero() {
  const { data, isLoading } = useCurrentUser();
  const name =
    data?.profile?.full_name?.split(" ")[0] ?? data?.user?.email?.split("@")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/40 p-6 md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems on track
          </div>
          {isLoading ? (
            <Skeleton className="mt-3 h-8 w-72" />
          ) : (
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
              {greeting}, <span className="gradient-text">{name}</span>.
            </h1>
          )}
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            You have <span className="text-foreground font-medium">4 tasks</span> due this week and{" "}
            <span className="text-foreground font-medium">1 advisor sync</span> in the next 3 hours.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="bg-background/60">
            View this week
          </Button>
          <Button className="gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
