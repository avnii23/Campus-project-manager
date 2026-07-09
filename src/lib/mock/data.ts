// Realistic mock data for the CampusPM app shell + dashboard.
// Replace with backend queries once the schema is live.

export type ProjectHealth = "excellent" | "good" | "at-risk" | "critical";

export type MockProject = {
  id: string;
  name: string;
  code: string;
  description: string;
  progress: number;
  health: ProjectHealth;
  healthScore: number;
  dueDate: string;
  tags: string[];
  team: { id: string; name: string; avatar?: string }[];
  tasksTotal: number;
  tasksDone: number;
  meetingsThisWeek: number;
};

export type MockTask = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignees: { id: string; name: string }[];
};

export type MockMeeting = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  startsAt: string;
  durationMin: number;
  attendees: number;
  location: "google-meet" | "zoom" | "in-person";
};

export type MockActivity = {
  id: string;
  actor: string;
  actorInitials: string;
  verb: string;
  target: string;
  projectName: string;
  at: string;
};

export type MockNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: "meeting" | "task" | "mention" | "system";
};

const now = new Date();
const iso = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3600_000).toISOString();

export const mockProjects: MockProject[] = [
  {
    id: "p1",
    name: "Autonomous Drone Delivery",
    code: "CS-491",
    description: "Final-year capstone: obstacle-aware last-mile drone routing.",
    progress: 72,
    health: "good",
    healthScore: 84,
    dueDate: iso(24 * 21),
    tags: ["AI/ML", "Robotics"],
    team: [
      { id: "u1", name: "Ada L." },
      { id: "u2", name: "Alan T." },
      { id: "u3", name: "Grace H." },
      { id: "u4", name: "Linus T." },
    ],
    tasksTotal: 48,
    tasksDone: 34,
    meetingsThisWeek: 3,
  },
  {
    id: "p2",
    name: "Smart Campus IoT Grid",
    code: "ECE-320",
    description: "Occupancy + energy sensors dashboard for the engineering block.",
    progress: 41,
    health: "at-risk",
    healthScore: 62,
    dueDate: iso(24 * 34),
    tags: ["IoT", "Web"],
    team: [
      { id: "u1", name: "Ada L." },
      { id: "u5", name: "Marie C." },
      { id: "u6", name: "Nikola T." },
    ],
    tasksTotal: 62,
    tasksDone: 25,
    meetingsThisWeek: 2,
  },
  {
    id: "p3",
    name: "Financial Literacy Chatbot",
    code: "MBA-210",
    description: "GPT-powered advisor for undergraduate personal finance.",
    progress: 92,
    health: "excellent",
    healthScore: 94,
    dueDate: iso(24 * 6),
    tags: ["NLP", "Product"],
    team: [
      { id: "u1", name: "Ada L." },
      { id: "u7", name: "Rosa P." },
    ],
    tasksTotal: 27,
    tasksDone: 25,
    meetingsThisWeek: 1,
  },
  {
    id: "p4",
    name: "Sustainable Packaging Study",
    code: "ENV-115",
    description: "LCA of biodegradable food-service containers.",
    progress: 18,
    health: "critical",
    healthScore: 41,
    dueDate: iso(24 * 3),
    tags: ["Research", "Sustainability"],
    team: [
      { id: "u1", name: "Ada L." },
      { id: "u8", name: "Sam K." },
    ],
    tasksTotal: 22,
    tasksDone: 4,
    meetingsThisWeek: 0,
  },
];

export const mockTasks: MockTask[] = [
  {
    id: "t1",
    projectId: "p1",
    projectName: "Autonomous Drone Delivery",
    title: "Integrate LiDAR obstacle map with PID controller",
    status: "in_progress",
    priority: "high",
    dueDate: iso(6),
    assignees: [{ id: "u1", name: "Ada L." }],
  },
  {
    id: "t2",
    projectId: "p2",
    projectName: "Smart Campus IoT Grid",
    title: "Wire ESP32 sensors to MQTT broker",
    status: "todo",
    priority: "urgent",
    dueDate: iso(9),
    assignees: [
      { id: "u1", name: "Ada L." },
      { id: "u5", name: "Marie C." },
    ],
  },
  {
    id: "t3",
    projectId: "p3",
    projectName: "Financial Literacy Chatbot",
    title: "Ship user-testing recruitment email",
    status: "review",
    priority: "medium",
    dueDate: iso(4),
    assignees: [{ id: "u7", name: "Rosa P." }],
  },
  {
    id: "t4",
    projectId: "p4",
    projectName: "Sustainable Packaging Study",
    title: "Draft literature review section 2",
    status: "todo",
    priority: "high",
    dueDate: iso(22),
    assignees: [{ id: "u1", name: "Ada L." }],
  },
  {
    id: "t5",
    projectId: "p1",
    projectName: "Autonomous Drone Delivery",
    title: "Record demo flight footage",
    status: "in_progress",
    priority: "low",
    dueDate: iso(30),
    assignees: [{ id: "u2", name: "Alan T." }],
  },
];

export const mockMeetings: MockMeeting[] = [
  {
    id: "m1",
    projectId: "p1",
    projectName: "Autonomous Drone Delivery",
    title: "Advisor sync — flight test recap",
    startsAt: iso(3),
    durationMin: 30,
    attendees: 5,
    location: "google-meet",
  },
  {
    id: "m2",
    projectId: "p2",
    projectName: "Smart Campus IoT Grid",
    title: "Hardware review with Dr. Patel",
    startsAt: iso(21),
    durationMin: 45,
    attendees: 6,
    location: "zoom",
  },
  {
    id: "m3",
    projectId: "p3",
    projectName: "Financial Literacy Chatbot",
    title: "UX critique — chat flows v3",
    startsAt: iso(48),
    durationMin: 60,
    attendees: 4,
    location: "in-person",
  },
];

export const mockActivity: MockActivity[] = [
  {
    id: "a1",
    actor: "Alan Turing",
    actorInitials: "AT",
    verb: "completed task",
    target: "PID loop tuning",
    projectName: "Autonomous Drone Delivery",
    at: iso(-1),
  },
  {
    id: "a2",
    actor: "Marie Curie",
    actorInitials: "MC",
    verb: "uploaded",
    target: "sensor-diagram.pdf",
    projectName: "Smart Campus IoT Grid",
    at: iso(-3),
  },
  {
    id: "a3",
    actor: "Rosa Parks",
    actorInitials: "RP",
    verb: "commented on",
    target: "Recruitment email v3",
    projectName: "Financial Literacy Chatbot",
    at: iso(-7),
  },
  {
    id: "a4",
    actor: "Sam Kim",
    actorInitials: "SK",
    verb: "scheduled",
    target: "Literature review sync",
    projectName: "Sustainable Packaging Study",
    at: iso(-12),
  },
  {
    id: "a5",
    actor: "CampusPM AI",
    actorInitials: "AI",
    verb: "generated",
    target: "Midterm progress report",
    projectName: "Autonomous Drone Delivery",
    at: iso(-26),
  },
  {
    id: "a6",
    actor: "Ada Lovelace",
    actorInitials: "AL",
    verb: "created meeting",
    target: "Advisor sync — flight test recap",
    projectName: "Autonomous Drone Delivery",
    at: iso(-4),
  },
  {
    id: "a7",
    actor: "CampusPM AI",
    actorInitials: "AI",
    verb: "summarised",
    target: "User research readout",
    projectName: "Financial Literacy Chatbot",
    at: iso(-70),
  },
  {
    id: "a8",
    actor: "CampusPM AI",
    actorInitials: "AI",
    verb: "created 4 tasks from",
    target: "Sprint kickoff — sensor firmware",
    projectName: "Smart Campus IoT Grid",
    at: iso(-23),
  },
  {
    id: "a9",
    actor: "Alan Turing",
    actorInitials: "AT",
    verb: "pushed 3 commits to",
    target: "main",
    projectName: "Autonomous Drone Delivery",
    at: iso(-8),
  },
  {
    id: "a10",
    actor: "Marie Curie",
    actorInitials: "MC",
    verb: "joined",
    target: "team",
    projectName: "Smart Campus IoT Grid",
    at: iso(-24),
  },
];

export const mockNotifications: MockNotification[] = [
  {
    id: "n1",
    title: "Advisor sync in 3 hours",
    body: "Autonomous Drone Delivery — Google Meet",
    at: iso(-0.2),
    read: false,
    kind: "meeting",
  },
  {
    id: "n2",
    title: "Marie mentioned you",
    body: '"Can you review the MQTT topic naming?"',
    at: iso(-2),
    read: false,
    kind: "mention",
  },
  {
    id: "n3",
    title: "Task due tomorrow",
    body: "Ship user-testing recruitment email",
    at: iso(-8),
    read: true,
    kind: "task",
  },
  {
    id: "n4",
    title: "AI weekly digest ready",
    body: "Your team shipped 12 tasks and ran 3 meetings.",
    at: iso(-30),
    read: true,
    kind: "system",
  },
];

export const dashboardStats = {
  activeProjects: mockProjects.length,
  tasksInFlight: mockTasks.filter((t) => t.status !== "done").length,
  meetingsThisWeek: mockMeetings.length,
  overallHealth: Math.round(
    mockProjects.reduce((s, p) => s + p.healthScore, 0) / mockProjects.length,
  ),
};

export const todayTasks = mockTasks.filter((t) => {
  const due = new Date(t.dueDate).getTime();
  return due - now.getTime() < 48 * 3600_000 && t.status !== "done";
});

export function timeFromNow(iso: string): string {
  const ms = new Date(iso).getTime() - now.getTime();
  const abs = Math.abs(ms);
  const mins = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / (24 * 3_600_000));
  const format = (v: number, unit: string) => `${v} ${unit}${v === 1 ? "" : "s"}`;
  const rel =
    mins < 60 ? format(mins, "min") : hours < 24 ? format(hours, "hr") : format(days, "day");
  return ms >= 0 ? `in ${rel}` : `${rel} ago`;
}
