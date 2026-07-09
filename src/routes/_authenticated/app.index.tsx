import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { DashboardHero } from "@/components/app/dashboard/dashboard-hero";
import { StatCards } from "@/components/app/dashboard/stat-cards";
import { RecentProjects } from "@/components/app/dashboard/recent-projects";
import { HealthPanel } from "@/components/app/dashboard/health-panel";
import { TodayTasks } from "@/components/app/dashboard/today-tasks";
import { UpcomingMeetings } from "@/components/app/dashboard/upcoming-meetings";
import { CalendarWidget } from "@/components/app/dashboard/calendar-widget";
import { ActivityFeed } from "@/components/app/dashboard/activity-feed";
import { AiAssistantPanel } from "@/components/app/dashboard/ai-assistant-panel";
import { QuickActions } from "@/components/app/dashboard/quick-actions";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [{ title: "Dashboard — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-[1600px] space-y-6"
    >
      <DashboardHero />
      <StatCards />
      <QuickActions />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecentProjects />
          <div className="grid gap-6 md:grid-cols-2">
            <TodayTasks />
            <UpcomingMeetings />
          </div>
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <HealthPanel />
          <CalendarWidget />
          <AiAssistantPanel />
        </div>
      </div>
    </motion.div>
  );
}
