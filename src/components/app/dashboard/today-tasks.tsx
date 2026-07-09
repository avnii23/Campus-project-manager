import { ArrowRight, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { todayTasks, timeFromNow } from "@/lib/mock/data";

const priorityTone: Record<string, string> = {
  low: "border-border/60 bg-surface/60 text-muted-foreground",
  medium: "border-info/30 bg-info/10 text-info",
  high: "border-warning/30 bg-warning/10 text-warning",
  urgent: "border-destructive/30 bg-destructive/10 text-destructive",
};

/** Today + tomorrow tasks list. */
export function TodayTasks() {
  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold">Today's tasks</h2>
          <p className="text-xs text-muted-foreground">Focus on what's due next.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          All tasks <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </header>

      {todayTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
          <CircleDot className="mx-auto h-5 w-5 text-success" />
          <p className="mt-2">Nothing due today — enjoy the calm.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todayTasks.map((t) => (
            <li
              key={t.id}
              className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition hover:bg-background/60"
            >
              <Checkbox className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{t.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{t.projectName}</span>
                  <span>·</span>
                  <span>Due {timeFromNow(t.dueDate)}</span>
                </div>
              </div>
              <Badge className={`border text-[10px] ${priorityTone[t.priority]}`}>
                {t.priority}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
