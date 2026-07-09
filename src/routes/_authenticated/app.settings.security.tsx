import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shield, Smartphone, Monitor, LogOut } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/app/settings/security")({
  head: () => ({
    meta: [{ title: "Security — Settings" }, { name: "robots", content: "noindex" }],
  }),
  component: SecuritySettings,
});

const SESSIONS = [
  {
    id: "s1",
    device: "MacBook Pro · Chrome",
    where: "Bengaluru, IN",
    current: true,
    icon: Monitor,
  },
  {
    id: "s2",
    device: "iPhone 15 · Safari",
    where: "Bengaluru, IN",
    current: false,
    icon: Smartphone,
  },
  {
    id: "s3",
    device: "Windows · Edge",
    where: "Delhi, IN (24h ago)",
    current: false,
    icon: Monitor,
  },
];

function SecuritySettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Change password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (next !== confirm) {
              toast.error("Passwords don't match");
              return;
            }
            toast.success("Password updated");
            setCurrent("");
            setNext("");
            setConfirm("");
          }}
          className="mt-4 grid gap-4 md:grid-cols-3"
        >
          <div>
            <Label>Current password</Label>
            <Input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Confirm new password</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Two-factor authentication</h2>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
            Coming soon
          </Badge>
        </div>
        <Button
          variant="outline"
          className="mt-4 border-border/60"
          onClick={() => toast.info("2FA enrolment ships with backend integration")}
        >
          <Shield className="mr-1.5 h-4 w-4" /> Enable 2FA
        </Button>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Active sessions</h2>
        <ul className="mt-4 divide-y divide-border/40">
          {SESSIONS.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-background/60 text-muted-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {s.device}
                  {s.current && (
                    <Badge className="bg-success/20 text-success border-success/30 text-[10px]">
                      This device
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{s.where}</div>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" onClick={() => toast.success("Session revoked")}>
                  <LogOut className="mr-1.5 h-3.5 w-3.5" /> Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
