import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { User, Users, Palette, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile", icon: User, url: "/app/settings/profile" },
  { key: "workspace", label: "Workspace", icon: Users, url: "/app/settings/workspace" },
  { key: "appearance", label: "Appearance", icon: Palette, url: "/app/settings/appearance" },
  { key: "notifications", label: "Notifications", icon: Bell, url: "/app/settings/notifications" },
  { key: "security", label: "Security", icon: Shield, url: "/app/settings/security" },
] as const;

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: ({ location }) => {
    if (location.pathname === "/app/settings") {
      throw redirect({ to: "/app/settings/profile" });
    }
  },
  component: SettingsLayout,
});

function SettingsLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Settings</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Manage your workspace</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Profile, team, appearance, notifications and security — all in one place.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <nav
          className="space-y-1 rounded-2xl border border-border/60 bg-surface/40 p-2"
          aria-label="Settings sections"
        >
          {TABS.map((t) => {
            const active = pathname.startsWith(t.url);
            return (
              <Link
                key={t.key}
                to={t.url}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-background/40 hover:text-foreground",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
