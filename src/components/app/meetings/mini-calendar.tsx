import { useMemo } from "react";
import { useMeetingsStore } from "@/stores/meetings-store";
import { cn } from "@/lib/utils";

/** Compact month calendar showing meeting density; click-through to details is optional. */
export function MiniCalendar({ onSelectDate }: { onSelectDate?: (day: string) => void }) {
  const meetings = useMeetingsStore((s) => s.meetings);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = first.getDay();

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of meetings) {
      const d = new Date(m.startsAt);
      if (d.getMonth() !== month || d.getFullYear() !== year) continue;
      const key = d.getDate().toString();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [meetings, month, year]);

  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => {
    const day = i - startOffset + 1;
    return day > 0 ? day : null;
  });

  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-sm font-semibold">
          {first.toLocaleString("default", { month: "long" })} {year}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {meetings.length} meetings this month
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const count = byDay.get(day.toString()) ?? 0;
          const isToday = day === today.getDate();
          return (
            <button
              key={i}
              onClick={() =>
                onSelectDate?.(
                  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                )
              }
              className={cn(
                "relative aspect-square rounded-lg text-[11px] transition",
                isToday
                  ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                  : count > 0
                    ? "bg-surface-2/60 text-foreground hover:bg-surface-2"
                    : "text-muted-foreground hover:bg-surface-2/40",
              )}
            >
              {day}
              {count > 0 && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
