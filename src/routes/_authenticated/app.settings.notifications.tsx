import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/app/settings/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — Settings" }, { name: "robots", content: "noindex" }],
  }),
  component: NotificationsSettings,
});

const CHANNELS = [
  { id: "email", label: "Email", desc: "Daily digest and important alerts." },
  { id: "push", label: "Push", desc: "Real-time browser and mobile push notifications." },
  { id: "meeting", label: "Meeting reminders", desc: "5 and 15 minutes before every meeting." },
  { id: "mentions", label: "Mentions", desc: "When a teammate @mentions you in a comment." },
  { id: "ai", label: "AI updates", desc: "When AI finishes a summary or generated report." },
];

function NotificationsSettings() {
  const [state, setState] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    meeting: true,
    mentions: true,
    ai: false,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Notification channels</h2>
        <p className="text-xs text-muted-foreground">Choose how CampusPM keeps you in the loop.</p>
        <ul className="mt-4 divide-y divide-border/40">
          {CHANNELS.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm font-medium">{c.label}</Label>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <Switch
                checked={state[c.id]}
                onCheckedChange={(v) => setState((prev) => ({ ...prev, [c.id]: v }))}
                aria-label={`Toggle ${c.label}`}
              />
            </li>
          ))}
        </ul>
      </section>
      <div className="flex justify-end">
        <Button onClick={() => toast.success("Notification preferences saved")}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}
