import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
  Calendar,
  ListChecks,
  GitBranch,
  AtSign,
  Users,
  AlertTriangle,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useNotificationsStore,
  type AppNotification,
  type NotificationKind,
} from "@/stores/notifications-store";
import { timeFromNow } from "@/lib/mock/data";

const kindMeta: Record<
  NotificationKind,
  { icon: React.ComponentType<{ className?: string }>; tint: string; label: string }
> = {
  meeting: { icon: Calendar, tint: "bg-info/15 text-info", label: "Meeting" },
  task: { icon: ListChecks, tint: "bg-primary/15 text-primary", label: "Task" },
  deadline: { icon: AlertTriangle, tint: "bg-warning/15 text-warning", label: "Deadline" },
  repo: { icon: GitBranch, tint: "bg-success/15 text-success", label: "Repository" },
  ai: { icon: Sparkles, tint: "bg-primary/15 text-primary", label: "AI" },
  team: { icon: Users, tint: "bg-info/15 text-info", label: "Team" },
  mention: { icon: AtSign, tint: "bg-warning/15 text-warning", label: "Mention" },
  system: { icon: Bell, tint: "bg-muted text-muted-foreground", label: "System" },
};

type Filter = "all" | "unread" | NotificationKind;

export function NotificationsCenter() {
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const remove = useNotificationsStore((s) => s.remove);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.kind === filter);
  }, [filter, items]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
              <Bell className="h-3 w-3" /> Notifications
            </Badge>
            {unread > 0 && (
              <Badge variant="outline" className="border-border/60 text-[10px]">
                {unread} unread
              </Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold md:text-3xl">
            Everything, in one place
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Meeting reminders, task assignments, deadlines, repo updates, and AI insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border/60">
            <Settings className="mr-1.5 h-3.5 w-3.5" /> Preferences
          </Button>
          <Button
            size="sm"
            onClick={markAllRead}
            disabled={unread === 0}
            className="gradient-primary text-primary-foreground"
          >
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Mark all read
          </Button>
        </div>
      </header>

      <nav className="scrollbar-none flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-surface/40 p-1">
        {(
          [
            "all",
            "unread",
            "meeting",
            "task",
            "deadline",
            "repo",
            "ai",
            "team",
            "mention",
            "system",
          ] as Filter[]
        ).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition",
              filter === k
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {k}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-surface/40 p-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <div className="mt-3 font-display text-base font-semibold">You're all caught up</div>
          <p className="mt-1 text-sm text-muted-foreground">Nothing matches this filter.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-surface/40">
          {filtered.map((n) => (
            <NotificationRow
              key={n.id}
              n={n}
              onRead={() => markRead(n.id)}
              onRemove={() => remove(n.id)}
            />
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function NotificationRow({
  n,
  onRead,
  onRemove,
}: {
  n: AppNotification;
  onRead: () => void;
  onRemove: () => void;
}) {
  const meta = kindMeta[n.kind];
  const Icon = meta.icon;
  const Body = (
    <div className="flex items-start gap-3">
      <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", meta.tint)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-border/60 text-[9px] uppercase">
            {meta.label}
          </Badge>
          {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
          <span className="text-[10px] text-muted-foreground">{timeFromNow(n.at)}</span>
        </div>
        <div className={cn("mt-1 text-sm", !n.read && "font-semibold")}>{n.title}</div>
        <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</div>
      </div>
    </div>
  );
  return (
    <li
      className={cn(
        "group flex items-center gap-2 px-4 py-3 transition hover:bg-background/40",
        !n.read && "bg-background/20",
      )}
    >
      <div className="min-w-0 flex-1">
        {n.href ? (
          <a href={n.href} className="block" onClick={onRead}>
            {Body}
          </a>
        ) : (
          Body
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
        {!n.read && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onRead}
            aria-label="Mark read"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </li>
  );
}
