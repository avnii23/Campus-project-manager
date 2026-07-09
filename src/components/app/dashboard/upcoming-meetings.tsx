import { ArrowRight, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockMeetings, timeFromNow } from "@/lib/mock/data";

/** Upcoming meetings list. */
export function UpcomingMeetings() {
  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold">Upcoming meetings</h2>
          <p className="text-xs text-muted-foreground">Next 7 days.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Schedule <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </header>
      {mockMeetings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
          No meetings scheduled yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {mockMeetings.map((m) => (
            <li
              key={m.id}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                {m.location === "in-person" ? (
                  <MapPin className="h-4 w-4" />
                ) : (
                  <Video className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{m.projectName}</span>
                  <span>·</span>
                  <span>{m.durationMin} min</span>
                  <span>·</span>
                  <span>{m.attendees} people</span>
                </div>
              </div>
              <div className="text-right text-[11px] font-medium text-primary">
                {timeFromNow(m.startsAt)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
