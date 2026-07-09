import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Sparkles,
  PlayCircle,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMeetingsStore } from "@/stores/meetings-store";
import { timeFromNow } from "@/lib/mock/data";
import type { Meeting, MeetingParticipant } from "@/lib/mock/meetings";

const providerIcon = {
  "campus-live": Video,
  "google-meet": Video,
  zoom: Video,
  "in-person": MapPin,
} as const;

const attendanceIcon = {
  accepted: <CheckCircle2 className="h-3 w-3 text-success" />,
  attended: <CheckCircle2 className="h-3 w-3 text-success" />,
  declined: <XCircle className="h-3 w-3 text-destructive" />,
  tentative: <HelpCircle className="h-3 w-3 text-warning" />,
  invited: <HelpCircle className="h-3 w-3 text-muted-foreground" />,
  missed: <XCircle className="h-3 w-3 text-destructive" />,
} as const;

export function MeetingDetails({ meeting }: { meeting: Meeting }) {
  const Icon = providerIcon[meeting.provider];
  const navigate = useNavigate();
  const cancel = useMeetingsStore((s) => s.cancel);
  const setStatus = useMeetingsStore((s) => s.setStatus);
  const generateSummary = useMeetingsStore((s) => s.generateSummary);

  const isLive = meeting.status === "live";
  const isDone = meeting.status === "completed";

  const attended = meeting.participants.filter((p) => p.attendance === "attended").length;
  const accepted = meeting.participants.filter((p) => p.attendance === "accepted").length;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2 text-xs text-muted-foreground">
          <Link to="/app/meetings">
            <ArrowLeft className="mr-1 h-3 w-3" /> All meetings
          </Link>
        </Button>
      </div>

      <header className="rounded-3xl border border-border/60 bg-gradient-to-br from-surface/70 via-surface/40 to-background p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                className={
                  isLive
                    ? "bg-destructive/15 text-destructive border border-destructive/25 animate-pulse"
                    : isDone
                      ? "bg-success/15 text-success border border-success/20"
                      : meeting.status === "cancelled"
                        ? "bg-muted text-muted-foreground border border-border"
                        : "bg-info/15 text-info border border-info/20"
                }
              >
                {isLive ? "● Live now" : meeting.status}
              </Badge>
              <Badge variant="outline" className="border-border/60 text-[10px]">
                {meeting.projectName}
              </Badge>
              <Badge variant="outline" className="border-border/60 text-[10px]">
                {meeting.provider}
              </Badge>
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold md:text-3xl">
              {meeting.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{meeting.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {new Date(meeting.startsAt).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {meeting.durationMin} min
              </span>
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {meeting.provider.replace("-", " ")}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {meeting.participants.length} invited
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            {isDone ? (
              <Button asChild size="sm" className="gradient-primary text-primary-foreground">
                <Link to="/app/meetings/$meetingId/summary" params={{ meetingId: meeting.id }}>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> View AI summary
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="gradient-primary text-primary-foreground">
                <Link to="/app/meetings/$meetingId/room" params={{ meetingId: meeting.id }}>
                  <PlayCircle className="mr-1.5 h-3.5 w-3.5" />{" "}
                  {isLive ? "Join live" : "Enter room"}
                </Link>
              </Button>
            )}
            <div className="flex gap-1.5">
              {meeting.joinUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-border/60 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + meeting.joinUrl!);
                    toast.success("Link copied");
                  }}
                >
                  <Copy className="mr-1 h-3 w-3" /> Copy link
                </Button>
              )}
              {!isDone && meeting.status !== "cancelled" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  onClick={() => {
                    cancel(meeting.id);
                    toast("Meeting cancelled");
                  }}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Cancel
                </Button>
              )}
              {isDone && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-border/60 text-xs"
                  onClick={() => {
                    generateSummary(meeting.id);
                    toast.success("Summary refreshed");
                    navigate({
                      to: "/app/meetings/$meetingId/summary",
                      params: { meetingId: meeting.id },
                    });
                  }}
                >
                  <Sparkles className="mr-1 h-3 w-3 text-primary" /> Re-summarise
                </Button>
              )}
              {meeting.status === "scheduled" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-border/60 text-xs"
                  onClick={() => {
                    setStatus(meeting.id, "completed");
                    toast.success("Marked completed");
                  }}
                >
                  Mark done
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">Agenda</h2>
              <span className="text-[11px] text-muted-foreground">
                {meeting.agenda.reduce((s, a) => s + a.minutes, 0)} min total
              </span>
            </div>
            <ol className="space-y-2">
              {meeting.agenda.map((a, i) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-medium ${a.done ? "line-through text-muted-foreground" : ""}`}
                    >
                      {a.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{a.minutes} min</div>
                  </div>
                  {a.done && (
                    <Badge className="bg-success/15 text-success border-success/20 text-[10px]">
                      Done
                    </Badge>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
            <h2 className="mb-3 font-display text-sm font-semibold">Attendance</h2>
            <div className="mb-4 grid grid-cols-3 gap-2">
              <Stat label="Invited" value={meeting.participants.length} />
              <Stat label="Accepted" value={accepted} tone="success" />
              <Stat label="Attended" value={attended} tone="info" />
            </div>
            <ParticipantsList participants={meeting.participants} hostId={meeting.hostId} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Meeting info</h3>
            <dl className="space-y-2 text-xs">
              <Row k="Project" v={meeting.projectName} />
              <Row k="Starts" v={timeFromNow(meeting.startsAt)} />
              <Row k="Duration" v={`${meeting.durationMin} min`} />
              <Row k="Provider" v={meeting.provider.replace("-", " ")} />
              <Row
                k="Host"
                v={meeting.participants.find((p) => p.id === meeting.hostId)?.name ?? "—"}
              />
            </dl>
            <Separator className="my-3" />
            <div className="text-[11px] text-muted-foreground">
              Meeting ID: <span className="font-mono">{meeting.id}</span>
            </div>
          </div>

          {meeting.recording && (
            <div className="rounded-2xl border border-border/60 bg-surface/40 p-5">
              <h3 className="mb-3 font-display text-sm font-semibold">Recording</h3>
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{meeting.recording.durationMin} min</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span>{meeting.recording.sizeMb} MB</span>
                </div>
                <Button size="sm" className="mt-3 w-full gradient-primary text-primary-foreground">
                  <PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Play recording
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "success" | "info" }) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "info" ? "text-info" : "text-foreground";
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-center">
      <div className={`font-display text-lg font-semibold ${toneClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function ParticipantsList({
  participants,
  hostId,
}: {
  participants: MeetingParticipant[];
  hostId: string;
}) {
  return (
    <ul className="space-y-1.5">
      {participants.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {p.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium">
                {p.name}{" "}
                {p.id === hostId && <span className="ml-1 text-[10px] text-primary">· Host</span>}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">{p.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {attendanceIcon[p.attendance]}
            <span className="capitalize">{p.attendance}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
