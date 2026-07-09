import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  MoreHorizontal,
  Sparkles,
  PlayCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Meeting } from "@/lib/mock/meetings";
import { timeFromNow } from "@/lib/mock/data";

const statusTone: Record<Meeting["status"], string> = {
  scheduled: "bg-info/15 text-info border-info/20",
  live: "bg-destructive/15 text-destructive border-destructive/25 animate-pulse",
  completed: "bg-success/15 text-success border-success/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const providerIcon = {
  "campus-live": Video,
  "google-meet": Video,
  zoom: Video,
  "in-person": MapPin,
} as const;

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const Icon = providerIcon[meeting.provider];
  const going = meeting.participants.filter(
    (p) => p.attendance === "accepted" || p.attendance === "attended",
  ).length;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-4 transition hover:border-primary/40 hover:bg-surface/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge className={`border text-[10px] uppercase ${statusTone[meeting.status]}`}>
              {meeting.status === "live" ? "● Live" : meeting.status}
            </Badge>
            <Badge variant="outline" className="border-border/60 text-[10px]">
              {meeting.projectName}
            </Badge>
          </div>
          <Link
            to="/app/meetings/$meetingId"
            params={{ meetingId: meeting.id }}
            className="mt-2 block truncate font-display text-base font-semibold hover:text-primary"
          >
            {meeting.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{meeting.description}</p>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" /> {timeFromNow(meeting.startsAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> {meeting.durationMin} min
        </span>
        <span className="flex items-center gap-1.5">
          <Icon className="h-3 w-3" /> {meeting.provider.replace("-", " ")}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" /> {going}/{meeting.participants.length}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {meeting.participants.slice(0, 5).map((p) => (
            <span
              key={p.id}
              className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-primary/15 text-[9px] font-semibold text-primary"
              title={p.name}
            >
              {p.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          ))}
          {meeting.participants.length > 5 && (
            <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-surface-2 text-[9px] font-semibold text-muted-foreground">
              +{meeting.participants.length - 5}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {meeting.status === "completed" ? (
            <Button asChild size="sm" variant="outline" className="h-7 border-border/60 text-xs">
              <Link to="/app/meetings/$meetingId/summary" params={{ meetingId: meeting.id }}>
                <Sparkles className="mr-1 h-3 w-3 text-primary" /> AI summary
              </Link>
            </Button>
          ) : meeting.status === "live" ? (
            <Button
              asChild
              size="sm"
              className="h-7 gradient-primary text-xs text-primary-foreground"
            >
              <Link to="/app/meetings/$meetingId/room" params={{ meetingId: meeting.id }}>
                <PlayCircle className="mr-1 h-3 w-3" /> Join now
              </Link>
            </Button>
          ) : meeting.status === "scheduled" ? (
            <Button asChild size="sm" variant="outline" className="h-7 border-border/60 text-xs">
              <Link to="/app/meetings/$meetingId" params={{ meetingId: meeting.id }}>
                View details
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
