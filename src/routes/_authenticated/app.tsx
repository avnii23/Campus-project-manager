import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [{ title: "Workspace — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: AppLayout,
});

/** Persistent shell for every `/app/*` route: sidebar + topbar + main. */
function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1">
          <AppTopbar />
          <main className="flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
