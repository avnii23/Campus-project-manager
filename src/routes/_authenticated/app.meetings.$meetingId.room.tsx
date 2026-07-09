import { createFileRoute } from "@tanstack/react-router";
import { MeetingRoom } from "@/components/app/meetings/meeting-room";
import { useMeetingsStore } from "@/stores/meetings-store";

export const Route = createFileRoute("/_authenticated/app/meetings/$meetingId/room")({
  component: MeetingRoomPage,
});

function MeetingRoomPage() {
  const { meetingId } = Route.useParams();
  const meeting = useMeetingsStore((s) => s.getById(meetingId));
  if (!meeting) return null;
  return <MeetingRoom meeting={meeting} />;
}
