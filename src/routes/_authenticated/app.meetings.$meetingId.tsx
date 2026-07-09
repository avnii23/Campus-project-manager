import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMeetingsStore } from "@/stores/meetings-store";

export const Route = createFileRoute("/_authenticated/app/meetings/$meetingId")({
  component: MeetingLayout,
});

function MeetingLayout() {
  const { meetingId } = Route.useParams();
  const meeting = useMeetingsStore((s) => s.getById(meetingId));
  if (!meeting) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 bg-surface/40 p-16 text-center">
        <div className="font-display text-base font-semibold">Meeting not found</div>
        <p className="mt-1 text-sm text-muted-foreground">It may have been cancelled or deleted.</p>
      </div>
    );
  }
  return <Outlet />;
}
