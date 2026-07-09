import { create } from "zustand";

import {
  seedMeetings,
  seedSummaries,
  type Meeting,
  type MeetingChatMessage,
  type MeetingParticipant,
  type MeetingStatus,
  type MeetingSummary,
} from "@/lib/mock/meetings";

type ScheduleInput = {
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  provider: Meeting["provider"];
  startsAt: string;
  durationMin: number;
  participants: Array<Pick<MeetingParticipant, "id" | "name" | "email" | "role">>;
  agenda: { title: string; minutes: number }[];
  hostId: string;
};

type State = {
  meetings: Meeting[];
  summaries: MeetingSummary[];

  getById: (id: string) => Meeting | undefined;
  getSummary: (meetingId: string) => MeetingSummary | undefined;

  schedule: (input: ScheduleInput) => Meeting;
  updateMeeting: (id: string, patch: Partial<Meeting>) => void;
  cancel: (id: string) => void;
  setStatus: (id: string, status: MeetingStatus) => void;

  toggleMedia: (
    meetingId: string,
    participantId: string,
    media: "mic" | "camera" | "handRaised",
  ) => void;
  postChat: (meetingId: string, message: Omit<MeetingChatMessage, "id" | "at">) => void;
  markAttendance: (
    meetingId: string,
    participantId: string,
    attendance: MeetingParticipant["attendance"],
  ) => void;

  /** Simulate AI producing/refreshing a summary for a completed meeting. */
  generateSummary: (meetingId: string) => MeetingSummary;
};

const now = () => new Date().toISOString();

export const useMeetingsStore = create<State>((set, get) => ({
  meetings: seedMeetings,
  summaries: seedSummaries,

  getById: (id) => get().meetings.find((m) => m.id === id),
  getSummary: (mid) => get().summaries.find((s) => s.meetingId === mid),

  schedule: (input) => {
    const id = `m${Math.random().toString(36).slice(2, 8)}`;
    const meeting: Meeting = {
      id,
      projectId: input.projectId,
      projectName: input.projectName,
      title: input.title,
      description: input.description,
      provider: input.provider,
      joinUrl: input.provider === "campus-live" ? `/app/meetings/${id}/room` : undefined,
      startsAt: input.startsAt,
      durationMin: input.durationMin,
      status: "scheduled",
      hostId: input.hostId,
      participants: input.participants.map((p) => ({
        ...p,
        attendance: "invited",
        online: false,
        camera: true,
        mic: true,
      })),
      agenda: input.agenda.map((a, i) => ({ id: `a${i + 1}`, title: a.title, minutes: a.minutes })),
      chat: [],
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ meetings: [meeting, ...s.meetings] }));
    return meeting;
  },

  updateMeeting: (id, patch) =>
    set((s) => ({
      meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...patch, updatedAt: now() } : m)),
    })),

  cancel: (id) =>
    set((s) => ({
      meetings: s.meetings.map((m) =>
        m.id === id ? { ...m, status: "cancelled", updatedAt: now() } : m,
      ),
    })),

  setStatus: (id, status) =>
    set((s) => ({
      meetings: s.meetings.map((m) => (m.id === id ? { ...m, status, updatedAt: now() } : m)),
    })),

  toggleMedia: (meetingId, participantId, media) =>
    set((s) => ({
      meetings: s.meetings.map((m) =>
        m.id !== meetingId
          ? m
          : {
              ...m,
              participants: m.participants.map((p) =>
                p.id !== participantId ? p : { ...p, [media]: !p[media] },
              ),
            },
      ),
    })),

  postChat: (meetingId, message) =>
    set((s) => ({
      meetings: s.meetings.map((m) =>
        m.id !== meetingId
          ? m
          : {
              ...m,
              chat: [...m.chat, { id: `c${Date.now()}`, at: now(), ...message }],
            },
      ),
    })),

  markAttendance: (meetingId, participantId, attendance) =>
    set((s) => ({
      meetings: s.meetings.map((m) =>
        m.id !== meetingId
          ? m
          : {
              ...m,
              participants: m.participants.map((p) =>
                p.id !== participantId ? p : { ...p, attendance },
              ),
            },
      ),
    })),

  generateSummary: (meetingId) => {
    const existing = get().summaries.find((s) => s.meetingId === meetingId);
    if (existing) return existing;
    const meeting = get().meetings.find((m) => m.id === meetingId);
    const stub: MeetingSummary = {
      meetingId,
      generatedAt: now(),
      overview: meeting
        ? `Auto-generated recap of "${meeting.title}". The team covered the agenda, aligned on next steps, and identified follow-up work.`
        : "Meeting recap.",
      keyPoints: [
        "Agenda items were completed on time.",
        "Team surfaced two blockers requiring guide input.",
        "New action items were assigned with owners and deadlines.",
      ],
      decisions: [
        "Ship the current milestone before the mid-review.",
        "Move risky research spike into next sprint.",
      ],
      actionItems: (meeting?.agenda ?? []).slice(0, 3).map((a, i) => ({
        id: `ai${i}`,
        title: `Follow up on: ${a.title}`,
        ownerName: meeting?.participants[i % (meeting.participants.length || 1)]?.name,
        ownerId: meeting?.participants[i % (meeting.participants.length || 1)]?.id,
        dueDate: new Date(Date.now() + (i + 2) * 24 * 3600_000).toISOString(),
        status: "open",
      })),
      followUps: ["Circulate meeting notes in the project channel.", "Schedule the next sync."],
      nextMeetingSuggestion: {
        title: `${meeting?.title ?? "Team"} — follow-up`,
        when: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
        reason: "One week gives the team enough time to close the top action items.",
      },
      sentiment: "positive",
      transcriptExcerpt: [],
    };
    set((s) => ({ summaries: [stub, ...s.summaries] }));
    return stub;
  },
}));
