import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  MoreVertical,
  Send,
  Circle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMeetingsStore } from "@/stores/meetings-store";
import type { Meeting, MeetingParticipant } from "@/lib/mock/meetings";

type Panel = "chat" | "people" | null;

export function MeetingRoom({ meeting }: { meeting: Meeting }) {
  const navigate = useNavigate();
  const toggleMedia = useMeetingsStore((s) => s.toggleMedia);
  const postChat = useMeetingsStore((s) => s.postChat);
  const setStatus = useMeetingsStore((s) => s.setStatus);
  const generateSummary = useMeetingsStore((s) => s.generateSummary);
  const live = useMeetingsStore((s) => s.meetings.find((m) => m.id === meeting.id)) ?? meeting;

  const meRef = useRef(live.participants[0]?.id ?? "me");
  const [panel, setPanel] = useState<Panel>("chat");
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (live.status !== "live") setStatus(live.id, "live");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const me = live.participants.find((p) => p.id === meRef.current) ?? live.participants[0];

  const timer = useMemo(() => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [seconds]);

  const leave = () => {
    setStatus(live.id, "completed");
    generateSummary(live.id);
    toast.success("Meeting ended", { description: "AI summary is being generated." });
    navigate({ to: "/app/meetings/$meetingId/summary", params: { meetingId: live.id } });
  };

  const send = () => {
    if (!message.trim() || !me) return;
    postChat(live.id, { authorId: me.id, authorName: me.name, body: message.trim() });
    setMessage("");
  };

  const gridCols =
    live.participants.length <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : live.participants.length <= 4
        ? "grid-cols-2"
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08090c] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
            <Circle className="h-2 w-2 fill-current animate-pulse" /> LIVE
          </Badge>
          <div className="text-sm font-medium truncate max-w-[40vw]">{live.title}</div>
          <span className="text-xs text-white/50 hidden md:inline">· {live.projectName}</span>
        </div>
        <div className="flex items-center gap-3">
          {recording && (
            <span className="hidden md:flex items-center gap-1.5 text-[11px] text-destructive">
              <Circle className="h-2 w-2 fill-current animate-pulse" /> Recording
            </span>
          )}
          <span className="font-mono text-xs text-white/70">{timer}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 p-4">
          {screenSharing ? (
            <div className="grid h-full grid-rows-[1fr_120px] gap-3">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-black/60">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <Monitor className="mx-auto h-10 w-10 text-white/40" />
                    <div className="mt-2 text-sm text-white/70">Screen sharing preview</div>
                    <div className="text-xs text-white/40">
                      Backend integration: LiveKit / Daily.co
                    </div>
                  </div>
                </div>
                <div className="absolute left-3 top-3">
                  <Badge className="bg-white/10 text-white border-white/20">
                    You are presenting
                  </Badge>
                </div>
              </div>
              <div className="scrollbar-none flex gap-2 overflow-x-auto">
                {live.participants.map((p) => (
                  <ParticipantTile key={p.id} p={p} size="sm" />
                ))}
              </div>
            </div>
          ) : (
            <div className={cn("grid h-full gap-3", gridCols)}>
              {live.participants.map((p) => (
                <ParticipantTile key={p.id} p={p} isMe={p.id === me?.id} />
              ))}
            </div>
          )}
        </main>

        {/* Side panel */}
        {panel && (
          <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden w-80 shrink-0 border-l border-white/10 bg-black/50 backdrop-blur-lg md:flex md:flex-col"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {panel === "chat" ? (
                  <>
                    <MessageSquare className="h-4 w-4" /> In-meeting chat
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" /> Participants ({live.participants.length})
                  </>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white/60 hover:bg-white/10"
                onClick={() => setPanel(null)}
              >
                ×
              </Button>
            </header>

            {panel === "chat" ? (
              <>
                <ScrollArea className="flex-1">
                  <ul className="space-y-2 p-3">
                    {live.chat.length === 0 ? (
                      <li className="rounded-lg border border-dashed border-white/10 p-6 text-center text-xs text-white/50">
                        No messages yet — say hi 👋
                      </li>
                    ) : (
                      live.chat.map((c) => (
                        <li key={c.id} className="rounded-lg bg-white/5 p-2.5">
                          <div className="flex items-center justify-between text-[10px] text-white/50">
                            <span className="font-medium text-white/80">{c.authorName}</span>
                            <span>
                              {new Date(c.at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-white/90">{c.body}</p>
                        </li>
                      ))
                    )}
                  </ul>
                </ScrollArea>
                <div className="border-t border-white/10 p-3">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                      placeholder="Message…"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button
                      size="icon"
                      onClick={send}
                      className="gradient-primary text-primary-foreground"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ScrollArea className="flex-1">
                <ul className="divide-y divide-white/10">
                  {live.participants.map((p) => (
                    <li key={p.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-semibold">
                          {p.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div>
                          <div className="text-xs font-medium">
                            {p.name}
                            {p.id === live.hostId && (
                              <span className="ml-1 text-[10px] text-primary">Host</span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/50 capitalize">{p.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/70">
                        {p.handRaised && <Hand className="h-3.5 w-3.5 text-warning" />}
                        {p.mic ? (
                          <Mic className="h-3.5 w-3.5" />
                        ) : (
                          <MicOff className="h-3.5 w-3.5 text-destructive" />
                        )}
                        {p.camera ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : (
                          <VideoOff className="h-3.5 w-3.5 text-destructive" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </motion.aside>
        )}
      </div>

      {/* Controls */}
      <footer className="border-t border-white/10 bg-black/60 px-4 py-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2">
          <ControlButton
            active={!!me?.mic}
            onClick={() => me && toggleMedia(live.id, me.id, "mic")}
            on={<Mic className="h-4 w-4" />}
            off={<MicOff className="h-4 w-4" />}
            label={me?.mic ? "Mute" : "Unmute"}
          />
          <ControlButton
            active={!!me?.camera}
            onClick={() => me && toggleMedia(live.id, me.id, "camera")}
            on={<Video className="h-4 w-4" />}
            off={<VideoOff className="h-4 w-4" />}
            label={me?.camera ? "Stop video" : "Start video"}
          />
          <button
            onClick={() => setScreenSharing((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
              screenSharing
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Monitor className="h-4 w-4" /> {screenSharing ? "Stop share" : "Share screen"}
          </button>
          <button
            onClick={() => me && toggleMedia(live.id, me.id, "handRaised")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
              me?.handRaised
                ? "bg-warning/20 text-warning"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Hand className="h-4 w-4" /> {me?.handRaised ? "Lower hand" : "Raise hand"}
          </button>
          <button
            onClick={() => setPanel(panel === "chat" ? null : "chat")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
              panel === "chat"
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <MessageSquare className="h-4 w-4" /> Chat
          </button>
          <button
            onClick={() => setPanel(panel === "people" ? null : "people")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
              panel === "people"
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Users className="h-4 w-4" /> People
          </button>
          <button
            onClick={() => {
              setRecording((v) => !v);
              toast(recording ? "Recording paused" : "Recording resumed");
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
              recording
                ? "bg-destructive/25 text-destructive"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Circle className={cn("h-3 w-3", recording && "fill-current animate-pulse")} />
            {recording ? "Rec" : "Record"}
          </button>
          <button
            onClick={leave}
            className="ml-2 flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2.5 text-xs font-medium text-white hover:bg-destructive/90"
          >
            <PhoneOff className="h-4 w-4" /> Leave
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-white/40">
          <Sparkles className="mr-1 inline h-3 w-3 text-primary" /> AI transcription + summary will
          run after the meeting ends.
        </div>
      </footer>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  on,
  off,
  label,
}: {
  active: boolean;
  onClick: () => void;
  on: React.ReactNode;
  off: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
        active
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-destructive/20 text-destructive hover:bg-destructive/30",
      )}
      aria-label={label}
    >
      {active ? on : off}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ParticipantTile({
  p,
  isMe,
  size = "lg",
}: {
  p: MeetingParticipant;
  isMe?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.04] to-white/[0.01]",
        p.speaking ? "border-primary/60 ring-2 ring-primary/40" : "border-white/10",
        size === "sm" && "h-28 w-40 shrink-0",
      )}
    >
      {p.camera ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/25 via-info/15 to-transparent">
          <span
            className={cn(
              "grid place-items-center rounded-full bg-white/10 font-semibold text-white/90 backdrop-blur-sm",
              size === "sm" ? "h-10 w-10 text-sm" : "h-20 w-20 text-2xl",
            )}
          >
            {p.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-black/60">
          <div className="text-center">
            <VideoOff className="mx-auto h-6 w-6 text-white/40" />
            <div className="mt-1 text-[10px] text-white/50">Camera off</div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 backdrop-blur">
          <span className="text-[10px] font-medium text-white">
            {p.name}
            {isMe && " (You)"}
          </span>
          {p.handRaised && <Hand className="h-3 w-3 text-warning" />}
        </div>
        <div className="rounded-lg bg-black/50 p-1 backdrop-blur">
          {p.mic ? (
            <Mic className="h-3 w-3 text-white/80" />
          ) : (
            <MicOff className="h-3 w-3 text-destructive" />
          )}
        </div>
      </div>
    </div>
  );
}
