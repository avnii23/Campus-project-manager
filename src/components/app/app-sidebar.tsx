import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Sparkles,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  Presentation,
  FileCheck2,
  GraduationCap,
  Rocket,
  Briefcase,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const workspace = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Projects", url: "/app/projects", icon: FolderKanban },
  { title: "Meetings", url: "/app/meetings", icon: Calendar },
  { title: "AI Studio", url: "/app/ai", icon: Sparkles },
  { title: "AI Presentation", url: "/app/ppt", icon: Presentation, badge: "New" },
  { title: "AI Report", url: "/app/report", icon: FileText },
  { title: "Viva Assistant", url: "/app/viva", icon: GraduationCap },
  { title: "Submission", url: "/app/submission", icon: FileCheck2 },
  { title: "Insights", url: "/app/insights", icon: BarChart3 },
  { title: "Present Mode", url: "/app/present", icon: Rocket },
  { title: "Portfolio", url: "/app/portfolio", icon: Briefcase },
  { title: "Reports", url: "/app/reports", icon: FileText },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
];

const account = [
  { title: "Team", url: "/app/team", icon: Users },
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Help & docs", url: "/app/help", icon: HelpCircle },
];

/** Premium collapsible sidebar shared across the whole `/app` shell. */
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/60 bg-surface/40 backdrop-blur-xl"
    >
      <SidebarHeader className="border-b border-border/60 px-3 py-4">
        <Link to="/app" className="flex items-center gap-2 px-1">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-primary shadow-glow">
            <span className="font-display text-base font-bold text-primary-foreground">C</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold">CampusPM</div>
              <div className="truncate text-[11px] text-muted-foreground">Student workspace</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {workspace.map((item) => {
                const implemented = [
                  "/app",
                  "/app/projects",
                  "/app/meetings",
                  "/app/ai",
                  "/app/ppt",
                  "/app/report",
                  "/app/viva",
                  "/app/submission",
                  "/app/insights",
                  "/app/present",
                  "/app/portfolio",
                ].includes(item.url);
                const inner = (
                  <>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <span className="flex flex-1 items-center justify-between">
                        {item.title}
                        {item.badge && (
                          <Badge className="ml-2 h-4 border-0 bg-primary/20 px-1.5 text-[10px] text-primary hover:bg-primary/25">
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    )}
                  </>
                );
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url, item.exact)}
                      tooltip={item.title}
                    >
                      {implemented ? (
                        <Link to={item.url} className="group">
                          {inner}
                        </Link>
                      ) : (
                        <a href={item.url} className="group">
                          {inner}
                        </a>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Account</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((item) => {
                const implemented = item.url === "/app/settings";
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      {implemented ? (
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      ) : (
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 px-2 py-3">
        {!collapsed ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI credits
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">
              780 / 1000 used this month
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-[78%] rounded-full gradient-primary" />
            </div>
          </div>
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
