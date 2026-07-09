import { createFileRoute } from "@tanstack/react-router";
import { MeetingsPage } from "@/components/app/meetings/meetings-page";

export const Route = createFileRoute("/_authenticated/app/meetings/")({
  component: MeetingsPage,
});
