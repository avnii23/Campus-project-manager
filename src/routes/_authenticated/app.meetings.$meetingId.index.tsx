import { createFileRoute } from "@tanstack/react-router";
import { MeetingDetails } from "@/components/app/meetings/meeting-details";
import { useMeetingsStore } from "@/stores/meetings-store";

export const Route = createFileRoute("/_authenticated/app/meetings/$meetingId/")({
  component: MeetingDetailsPage,
});

function MeetingDetailsPage() {
  const { meetingId } = Route.useParams();
  const meeting = useMeetingsStore((s) => s.getById(meetingId));
  if (!meeting) return null;
  return <MeetingDetails meeting={meeting} />;
}
