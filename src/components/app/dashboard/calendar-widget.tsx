import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { mockMeetings, mockTasks } from "@/lib/mock/data";

/** Mini calendar with dots for scheduled activity. */
export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const busyDates = new Set(
    [...mockMeetings.map((m) => m.startsAt), ...mockTasks.map((t) => t.dueDate)].map((d) =>
      new Date(d).toDateString(),
    ),
  );

  return (
    <section className="rounded-3xl border border-border/60 bg-surface/40 p-5">
      <header className="mb-3">
        <h2 className="font-display text-base font-semibold">Calendar</h2>
        <p className="text-xs text-muted-foreground">{busyDates.size} days with scheduled work.</p>
      </header>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-2xl bg-background/40 p-2"
        modifiers={{
          busy: (d) => busyDates.has(d.toDateString()),
        }}
        modifiersClassNames={{
          busy: "relative after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
        }}
      />
    </section>
  );
}
