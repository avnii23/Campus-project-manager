// Rich meeting fixtures for the /app/meetings surface.
// Backend swap-in target: replace `seedMeetings` + `seedSummaries` with
// server queries; the store contracts stay the same.

export type MeetingStatus = "scheduled" | "live" | "completed" | "cancelled";
export type MeetingProvider = "campus-live" | "google-meet" | "zoom" | "in-person";
export type AttendanceStatus =
  "invited" | "accepted" | "declined" | "tentative" | "attended" | "missed";

export type MeetingParticipant = {
  id: string;
  name: string;
  email: string;
  role: "host" | "co-host" | "member" | "guide" | "guest";
  avatarUrl?: string;
  attendance: AttendanceStatus;
  online?: boolean;
  camera?: boolean;
  mic?: boolean;
  handRaised?: boolean;
  speaking?: boolean;
};

export type MeetingAgendaItem = {
  id: string;
  title: string;
  ownerId?: string;
  minutes: number;
  done?: boolean;
};

export type MeetingChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
  system?: boolean;
};

export type MeetingRecording = {
  id: string;
  url?: string;
  durationMin: number;
  sizeMb: number;
  createdAt: string;
};

export type Meeting = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  provider: MeetingProvider;
  joinUrl?: string;
  startsAt: string;
  durationMin: number;
  status: MeetingStatus;
  hostId: string;
  participants: MeetingParticipant[];
  agenda: MeetingAgendaItem[];
  chat: MeetingChatMessage[];
  recording?: MeetingRecording;
  createdAt: string;
  updatedAt: string;
};

export type ActionItem = {
  id: string;
  title: string;
  ownerId?: string;
  ownerName?: string;
  dueDate?: string;
  status: "open" | "in_progress" | "done";
};

export type MeetingSummary = {
  meetingId: string;
  generatedAt: string;
  overview: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
  nextMeetingSuggestion: {
    title: string;
    when: string;
    reason: string;
  };
  sentiment: "positive" | "neutral" | "mixed";
  transcriptExcerpt: { speaker: string; at: string; text: string }[];
};

const now = new Date();
const iso = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3600_000).toISOString();

const P = {
  ada: { id: "u1", name: "Ada Lovelace", email: "ada@campus.edu" },
  alan: { id: "u2", name: "Alan Turing", email: "alan@campus.edu" },
  grace: { id: "u3", name: "Grace Hopper", email: "grace@campus.edu" },
  linus: { id: "u4", name: "Linus Torvalds", email: "linus@campus.edu" },
  marie: { id: "u5", name: "Marie Curie", email: "marie@campus.edu" },
  nikola: { id: "u6", name: "Nikola Tesla", email: "nikola@campus.edu" },
  rosa: { id: "u7", name: "Rosa Parks", email: "rosa@campus.edu" },
  guide: { id: "g1", name: "Dr. R. Patel", email: "rpatel@campus.edu" },
};

function part(
  base: { id: string; name: string; email: string },
  role: MeetingParticipant["role"],
  attendance: AttendanceStatus,
  extra: Partial<MeetingParticipant> = {},
): MeetingParticipant {
  return {
    ...base,
    role,
    attendance,
    online: attendance === "attended",
    camera: true,
    mic: true,
    handRaised: false,
    ...extra,
  };
}

export const seedMeetings: Meeting[] = [
  {
    id: "m1",
    projectId: "p1",
    projectName: "Autonomous Drone Delivery",
    title: "Advisor sync — flight test recap",
    description: "Review last week's outdoor flight test data and align on next milestone.",
    provider: "campus-live",
    joinUrl: "/app/meetings/m1/room",
    startsAt: iso(3),
    durationMin: 30,
    status: "scheduled",
    hostId: P.ada.id,
    participants: [
      part(P.ada, "host", "accepted"),
      part(P.alan, "member", "accepted"),
      part(P.grace, "member", "tentative"),
      part(P.guide, "guide", "accepted"),
    ],
    agenda: [
      { id: "a1", title: "Flight test highlights", ownerId: P.alan.id, minutes: 8 },
      { id: "a2", title: "Obstacle map accuracy metrics", ownerId: P.grace.id, minutes: 10 },
      { id: "a3", title: "Next milestone commitments", ownerId: P.ada.id, minutes: 8 },
      { id: "a4", title: "Blockers & risks", minutes: 4 },
    ],
    chat: [],
    createdAt: iso(-24),
    updatedAt: iso(-2),
  },
  {
    id: "m2",
    projectId: "p2",
    projectName: "Smart Campus IoT Grid",
    title: "Hardware review with Dr. Patel",
    description: "Sensor placement plan and MQTT topic naming review.",
    provider: "zoom",
    joinUrl: "https://zoom.us/j/000",
    startsAt: iso(21),
    durationMin: 45,
    status: "scheduled",
    hostId: P.marie.id,
    participants: [
      part(P.marie, "host", "accepted"),
      part(P.ada, "member", "accepted"),
      part(P.nikola, "member", "accepted"),
      part(P.guide, "guide", "accepted"),
    ],
    agenda: [
      { id: "a1", title: "Sensor placement walkthrough", minutes: 15 },
      { id: "a2", title: "MQTT topic taxonomy", minutes: 15 },
      { id: "a3", title: "Power budget review", minutes: 10 },
      { id: "a4", title: "Q&A", minutes: 5 },
    ],
    chat: [],
    createdAt: iso(-40),
    updatedAt: iso(-6),
  },
  {
    id: "m3",
    projectId: "p3",
    projectName: "Financial Literacy Chatbot",
    title: "UX critique — chat flows v3",
    description: "Walk through revised onboarding + conversational flows.",
    provider: "in-person",
    startsAt: iso(48),
    durationMin: 60,
    status: "scheduled",
    hostId: P.rosa.id,
    participants: [
      part(P.rosa, "host", "accepted"),
      part(P.ada, "member", "accepted"),
      part(P.marie, "member", "accepted"),
    ],
    agenda: [
      { id: "a1", title: "Onboarding sequence", minutes: 20 },
      { id: "a2", title: "Advice tone patterns", minutes: 20 },
      { id: "a3", title: "Testing plan", minutes: 20 },
    ],
    chat: [],
    createdAt: iso(-72),
    updatedAt: iso(-24),
  },
  {
    id: "m4",
    projectId: "p1",
    projectName: "Autonomous Drone Delivery",
    title: "Weekly team standup — live now",
    description: "Cross-track sync: routing, controls, docs.",
    provider: "campus-live",
    joinUrl: "/app/meetings/m4/room",
    startsAt: iso(-0.1),
    durationMin: 30,
    status: "live",
    hostId: P.ada.id,
    participants: [
      part(P.ada, "host", "attended", { speaking: true }),
      part(P.alan, "member", "attended"),
      part(P.grace, "member", "attended"),
      part(P.linus, "member", "attended", { handRaised: true }),
    ],
    agenda: [
      { id: "a1", title: "Wins from last week", minutes: 5, done: true },
      { id: "a2", title: "This week's commitments", minutes: 15 },
      { id: "a3", title: "Blockers", minutes: 10 },
    ],
    chat: [
      {
        id: "c1",
        authorId: P.linus.id,
        authorName: "Linus T.",
        body: "Landed the PID rewrite — 30% smoother.",
        at: iso(-0.08),
      },
      {
        id: "c2",
        authorId: P.grace.id,
        authorName: "Grace H.",
        body: "Nice! I'll rerun the eval this afternoon.",
        at: iso(-0.06),
      },
    ],
    createdAt: iso(-24 * 7),
    updatedAt: iso(-0.1),
  },
  {
    id: "m5",
    projectId: "p2",
    projectName: "Smart Campus IoT Grid",
    title: "Sprint kickoff — sensor firmware",
    description: "Scope confirmation and task assignment.",
    provider: "campus-live",
    startsAt: iso(-24),
    durationMin: 45,
    status: "completed",
    hostId: P.marie.id,
    participants: [
      part(P.marie, "host", "attended"),
      part(P.ada, "member", "attended"),
      part(P.nikola, "member", "attended"),
      part(P.guide, "guide", "missed"),
    ],
    agenda: [
      { id: "a1", title: "Firmware architecture", minutes: 15, done: true },
      { id: "a2", title: "Task breakdown", minutes: 20, done: true },
      { id: "a3", title: "Owners + deadlines", minutes: 10, done: true },
    ],
    chat: [],
    recording: { id: "r1", durationMin: 41, sizeMb: 118, createdAt: iso(-23.5) },
    createdAt: iso(-72),
    updatedAt: iso(-23),
  },
  {
    id: "m6",
    projectId: "p3",
    projectName: "Financial Literacy Chatbot",
    title: "User research readout",
    description: "5 usability sessions, common pain points and delight moments.",
    provider: "campus-live",
    startsAt: iso(-72),
    durationMin: 60,
    status: "completed",
    hostId: P.rosa.id,
    participants: [
      part(P.rosa, "host", "attended"),
      part(P.ada, "member", "attended"),
      part(P.marie, "member", "attended"),
      part(P.guide, "guide", "attended"),
    ],
    agenda: [
      { id: "a1", title: "Sample overview", minutes: 10, done: true },
      { id: "a2", title: "Top 5 usability findings", minutes: 25, done: true },
      { id: "a3", title: "Prioritisation", minutes: 20, done: true },
      { id: "a4", title: "Next steps", minutes: 5, done: true },
    ],
    chat: [],
    recording: { id: "r2", durationMin: 58, sizeMb: 174, createdAt: iso(-71) },
    createdAt: iso(-24 * 7),
    updatedAt: iso(-70),
  },
];

export const seedSummaries: MeetingSummary[] = [
  {
    meetingId: "m5",
    generatedAt: iso(-23),
    overview:
      "Team confirmed the two-week firmware sprint scope, assigned owners for each module, and locked deadlines. Dr. Patel was absent so the guide review shifts to next week.",
    keyPoints: [
      "Firmware architecture is layered: HAL → sensors → transport → app.",
      "MQTT broker will run on Raspberry Pi 5 with a Mosquitto container.",
      "Sensor telemetry cadence set to 5s baseline, 1s burst on trigger.",
      "Battery budget requires deep-sleep between reads.",
    ],
    decisions: [
      "Adopt Zephyr RTOS over FreeRTOS for scheduler ergonomics.",
      "Standardise MQTT topics under `campus/<building>/<room>/<sensor>`.",
      "Bring in Nikola as documentation reviewer starting this sprint.",
    ],
    actionItems: [
      {
        id: "ai1",
        title: "Bootstrap Zephyr project + CI",
        ownerId: "u2",
        ownerName: "Alan Turing",
        dueDate: iso(24 * 3),
        status: "open",
      },
      {
        id: "ai2",
        title: "Draft MQTT topic style guide",
        ownerId: "u5",
        ownerName: "Marie Curie",
        dueDate: iso(24 * 2),
        status: "in_progress",
      },
      {
        id: "ai3",
        title: "Prototype deep-sleep scheduler",
        ownerId: "u4",
        ownerName: "Linus Torvalds",
        dueDate: iso(24 * 5),
        status: "open",
      },
      {
        id: "ai4",
        title: "Book bench time in embedded lab",
        ownerId: "u6",
        ownerName: "Nikola Tesla",
        dueDate: iso(24),
        status: "done",
      },
    ],
    followUps: [
      "Re-run architecture walkthrough with Dr. Patel next week.",
      "Compare Zephyr toolchain footprint against project storage budget.",
    ],
    nextMeetingSuggestion: {
      title: "Firmware progress review",
      when: iso(24 * 7),
      reason: "One week is enough to land Zephyr bootstrap + first sensor driver.",
    },
    sentiment: "positive",
    transcriptExcerpt: [
      { speaker: "Marie C.", at: iso(-24), text: "Let's start with the firmware architecture." },
      { speaker: "Alan T.", at: iso(-23.98), text: "Layered HAL keeps sensor swaps cheap." },
      {
        speaker: "Ada L.",
        at: iso(-23.95),
        text: "Agreed — and we should freeze the transport API this week.",
      },
    ],
  },
  {
    meetingId: "m6",
    generatedAt: iso(-70),
    overview:
      "Rosa presented findings from 5 usability sessions. The top three findings all cluster around trust and jargon; team agreed to invest in tone + onboarding before adding new features.",
    keyPoints: [
      "4 of 5 users abandoned the first prompt because tone felt lecture-y.",
      "Numeric answers without context reduce trust significantly.",
      "Users want a way to save advice they liked.",
    ],
    decisions: [
      "Rewrite onboarding to use plain, friendly language.",
      "Always attach a one-line justification to numeric outputs.",
      "Ship a 'save this advice' bookmark before the next round.",
    ],
    actionItems: [
      {
        id: "ai1",
        title: "Draft new onboarding copy",
        ownerId: "u7",
        ownerName: "Rosa Parks",
        dueDate: iso(24 * 3),
        status: "open",
      },
      {
        id: "ai2",
        title: "Prompt-engineer justification layer",
        ownerId: "u1",
        ownerName: "Ada Lovelace",
        dueDate: iso(24 * 4),
        status: "open",
      },
      {
        id: "ai3",
        title: "Design 'save advice' UI",
        ownerId: "u5",
        ownerName: "Marie Curie",
        dueDate: iso(24 * 2),
        status: "in_progress",
      },
    ],
    followUps: [
      "Recruit 6 users for round-2 usability sessions.",
      "Add sentiment tags to conversation logs.",
    ],
    nextMeetingSuggestion: {
      title: "Trust & tone review",
      when: iso(24 * 10),
      reason: "Give the team a week to iterate before another readout.",
    },
    sentiment: "mixed",
    transcriptExcerpt: [
      {
        speaker: "Rosa P.",
        at: iso(-72),
        text: "Trust is the theme — users want to understand why we said what we said.",
      },
      {
        speaker: "Ada L.",
        at: iso(-71.98),
        text: "We can bolt on a lightweight justification layer this sprint.",
      },
    ],
  },
];

/** AI mock output when generating tasks from a meeting's action items. */
export type AiGeneratedTask = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  suggestedAssigneeId?: string;
  suggestedAssigneeName?: string;
  dueDate: string;
  labels: string[];
};

export function generateTasksFromSummary(summary: MeetingSummary): AiGeneratedTask[] {
  return summary.actionItems.map((a, i) => ({
    id: `gen-${summary.meetingId}-${i}`,
    title: a.title,
    description: `Auto-generated from "${summary.overview.slice(0, 80)}…" — refine before assigning.`,
    priority: a.status === "done" ? "low" : i === 0 ? "high" : "medium",
    suggestedAssigneeId: a.ownerId,
    suggestedAssigneeName: a.ownerName,
    dueDate: a.dueDate ?? iso(24 * (3 + i)),
    labels: i % 2 === 0 ? ["from-meeting", "sprint"] : ["from-meeting", "review"],
  }));
}
