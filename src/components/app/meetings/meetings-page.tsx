import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Video, Calendar as CalIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMeetingsStore } from "@/stores/meetings-store";
import { MeetingCard } from "@/components/app/meetings/meeting-card";
import { ScheduleMeetingDialog } from "@/components/app/meetings/schedule-dialog";
import { MiniCalendar } from "@/components/app/meetings/mini-calendar";
import type { Meeting } from "@/lib/mock/meetings";

type Tab = "upcoming" | "live" | "past" | "all";

export function MeetingsPage() {
  const meetings = useMeetingsStore((s) => s.meetings);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [q, setQ] = useState("");

  const now = Date.now();
  const filtered = useMemo(() => {
    let list = meetings;
    if (tab === "upcoming")
      list = list.filter(
        (m) => m.status === "scheduled" && new Date(m.startsAt).getTime() >= now - 3600_000,
      );
    else if (tab === "live") list = list.filter((m) => m.status === "live");
    else if (tab === "past")
      list = list.filter((m) => m.status === "completed" || m.status === "cancelled");
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (m) => m.title.toLowerCase().includes(s) || m.projectName.toLowerCase().includes(s),
      );
    }
    return list
      .slice()
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [meetings, tab, q, now]);

  const counts = {
    upcoming: meetings.filter((m) => m.status === "scheduled").length,
    live: meetings.filter((m) => m.status === "live").length,
    past: meetings.filter((m) => m.status === "completed" || m.status === "cancelled").length,
    all: meetings.length,
  };

  const nextUp = meetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-surface/50 to-background p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                <Sparkles className="h-3 w-3" /> Meetings
              </Badge>
              {counts.live > 0 && (
                <Badge className="bg-destructive/15 text-destructive border-destructive/25 animate-pulse gap-1">
                  ● {counts.live} live
                </Badge>
              )}
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold md:text-3xl">Team meetings</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Schedule, run, and recap syncs. AI writes summaries, extracts decisions, and drafts
              follow-up tasks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ScheduleMeetingDialog />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Tabs + search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="scrollbar-none flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-surface/40 p-1">
              {(["upcoming", "live", "past", "all"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition",
                    tab === k
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {k} <span className="ml-1 text-[10px] opacity-60">{counts[k]}</span>
                </button>
              ))}
            </nav>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search meetings…"
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filtered.map((m) => (
                <li key={m.id}>
                  <MeetingCard meeting={m} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <MiniCalendar />
          {nextUp && <NextUpCard meeting={nextUp} />}
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> AI meeting helpers
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" /> Auto-summaries after
                every meeting
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" /> Decision + action item
                extraction
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" /> One-click task
                generation to your board
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" /> Next-meeting
                scheduling suggestions
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

function NextUpCard({ meeting }: { meeting: Meeting }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-primary">
        <Video className="h-3.5 w-3.5" /> Next up
      </div>
      <div className="mt-2 truncate font-display text-sm font-semibold">{meeting.title}</div>
      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{meeting.projectName}</div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          <CalIcon className="h-3 w-3" />{" "}
          {new Date(meeting.startsAt).toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="font-medium text-primary">{meeting.durationMin} min</span>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/60 bg-surface/40 p-16 text-center">
      <CalIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
      <div className="mt-3 font-display text-base font-semibold">No {tab} meetings</div>
      <p className="mt-1 text-sm text-muted-foreground">
        {tab === "upcoming"
          ? "Schedule your next sync in under a minute."
          : tab === "live"
            ? "When a meeting goes live, it will appear here."
            : tab === "past"
              ? "Completed meetings + AI summaries will land here."
              : "Nothing to show yet."}
      </p>
      <div className="mt-4 flex justify-center">
        <ScheduleMeetingDialog />
      </div>
    </div>
  );
}
