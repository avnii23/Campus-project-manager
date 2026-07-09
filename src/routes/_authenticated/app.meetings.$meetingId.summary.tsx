import { createFileRoute } from "@tanstack/react-router";
import { AiSummaryView } from "@/components/app/meetings/ai-summary";
import { useMeetingsStore } from "@/stores/meetings-store";

export const Route = createFileRoute("/_authenticated/app/meetings/$meetingId/summary")({
  component: MeetingSummaryPage,
});

function MeetingSummaryPage() {
  const { meetingId } = Route.useParams();
  const meeting = useMeetingsStore((s) => s.getById(meetingId));
  const generateSummary = useMeetingsStore((s) => s.generateSummary);
  const summary = useMeetingsStore((s) => s.getSummary(meetingId));
  if (!meeting) return null;
  const s = summary ?? generateSummary(meetingId);
  return <AiSummaryView meeting={meeting} summary={s} />;
}
