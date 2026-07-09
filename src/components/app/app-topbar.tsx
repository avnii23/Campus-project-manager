import { useState } from "react";
import { useRouterState, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Search, Command, Sun, Moon, LogOut, User, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { timeFromNow } from "@/lib/mock/data";
import { useNotificationsStore } from "@/stores/notifications-store";
import { AppBreadcrumbs } from "@/components/app/app-breadcrumbs";
import { CommandPalette } from "@/components/app/command-palette";
import { useQueryClient } from "@tanstack/react-query";

/** Top navigation bar: breadcrumbs + search + notifications + user menu. */
export function AppTopbar() {
  const { data } = useCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const initials = (data?.profile?.full_name ?? data?.user?.email ?? "?")
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const notifications = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const markRead = useNotificationsStore((s) => s.markRead);
  const unread = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", search: { mode: "signin" }, replace: true });
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    toast("Theme ready to expand", {
      description: "Full light-mode tokens ship in an upcoming update.",
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl md:px-5">
      <SidebarTrigger className="h-8 w-8" />
      <Separator orientation="vertical" className="mx-1 h-5 hidden md:block" />
      <AppBreadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        {/* Search trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-surface"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search projects, tasks…</span>
          <kbd className="ml-4 inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Notifications</div>
                <div className="text-[11px] text-muted-foreground">
                  {unread} unread · {notifications.length} total
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllRead}
                disabled={unread === 0}
              >
                Mark all read
              </Button>
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  You're all caught up.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.slice(0, 8).map((n) => {
                    const inner = (
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{n.title}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {n.body}
                          </div>
                          <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {timeFromNow(n.at)}
                          </div>
                        </div>
                      </div>
                    );
                    return (
                      <li key={n.id} className="px-4 py-3 hover:bg-surface/60">
                        {n.href ? (
                          <a href={n.href} onClick={() => markRead(n.id)}>
                            {inner}
                          </a>
                        ) : (
                          <button className="w-full text-left" onClick={() => markRead(n.id)}>
                            {inner}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </ScrollArea>
            <div className="border-t border-border px-3 py-2 text-center">
              <a
                href="/app/notifications"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all notifications
              </a>
            </div>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 py-1 pl-1 pr-2.5 transition hover:bg-surface">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/20 text-[11px] font-semibold text-primary">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-xs font-medium sm:inline">
                {data?.profile?.full_name ?? data?.user?.email ?? "You"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold">
                {data?.profile?.full_name ?? "Your account"}
              </div>
              <div className="truncate text-[11px] font-normal text-muted-foreground">
                {data?.user?.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/app/settings">
                <User className="mr-2 h-4 w-4" /> Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/app/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/app/ai">
                <Sparkles className="mr-2 h-4 w-4" /> AI Studio
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
