import { mockActivity, timeFromNow } from "@/lib/mock/data";

/** Real-time-feel activity log. */
export function ActivityFeed() {
  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-4">
        <h2 className="font-display text-base font-semibold">Recent activity</h2>
        <p className="text-xs text-muted-foreground">What your team has been up to.</p>
      </header>
      <ol className="relative space-y-3 border-l border-border/60 pl-5">
        {mockActivity.map((a) => (
          <li key={a.id} className="relative">
            <span className="absolute -left-[27px] top-1.5 grid h-6 w-6 place-items-center rounded-full border border-border bg-background text-[9px] font-semibold">
              {a.actorInitials}
            </span>
            <div className="text-sm">
              <span className="font-medium">{a.actor}</span>{" "}
              <span className="text-muted-foreground">{a.verb}</span>{" "}
              <span className="font-medium">{a.target}</span>
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {a.projectName} · {timeFromNow(a.at)}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
