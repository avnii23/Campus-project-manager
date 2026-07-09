import { mockProjects, type ProjectHealth } from "@/lib/mock/data";

const healthColor: Record<ProjectHealth, string> = {
  excellent: "oklch(0.72 0.17 155)",
  good: "oklch(0.7 0.14 230)",
  "at-risk": "oklch(0.82 0.16 80)",
  critical: "oklch(0.62 0.22 27)",
};

/** Radial health score for each project. */
export function HealthPanel() {
  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-4">
        <h2 className="font-display text-base font-semibold">Project health</h2>
        <p className="text-xs text-muted-foreground">Composite of velocity, risk, and quality.</p>
      </header>
      <ul className="space-y-4">
        {mockProjects.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <HealthRing value={p.healthScore} color={healthColor[p.health]} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">
                {p.health.replace("-", " ")} · {p.healthScore}/100
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HealthRing({ value, color }: { value: number; color: string }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={r} stroke="oklch(0.25 0.008 264)" strokeWidth="4" fill="none" />
      <circle
        cx="22"
        cy="22"
        r={r}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
      />
      <text
        x="22"
        y="22"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground font-display text-[10px] font-bold"
      >
        {value}
      </text>
    </svg>
  );
}
