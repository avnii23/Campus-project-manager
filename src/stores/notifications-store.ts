import { create } from "zustand";

export type NotificationKind =
  "meeting" | "task" | "deadline" | "repo" | "ai" | "team" | "mention" | "system";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
  actor?: { name: string; initials: string };
};

const now = new Date();
const iso = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3600_000).toISOString();

const seed: AppNotification[] = [
  {
    id: "n1",
    kind: "meeting",
    title: "Advisor sync starts in 3 hours",
    body: "Autonomous Drone Delivery — CampusLive",
    at: iso(-0.1),
    read: false,
    href: "/app/meetings/m1",
    actor: { name: "CampusPM", initials: "CP" },
  },
  {
    id: "n2",
    kind: "ai",
    title: "AI summary ready",
    body: "Sprint kickoff — sensor firmware · 4 action items generated",
    at: iso(-1),
    read: false,
    href: "/app/meetings/m5/summary",
    actor: { name: "CampusPM AI", initials: "AI" },
  },
  {
    id: "n3",
    kind: "task",
    title: "New task assigned to you",
    body: "Prompt-engineer justification layer — due in 4 days",
    at: iso(-3),
    read: false,
    href: "/app/projects/p3/board",
    actor: { name: "Rosa Parks", initials: "RP" },
  },
  {
    id: "n4",
    kind: "deadline",
    title: "Draft literature review section 2 is due tomorrow",
    body: "Sustainable Packaging Study",
    at: iso(-6),
    read: false,
    href: "/app/projects/p4",
    actor: { name: "CampusPM", initials: "CP" },
  },
  {
    id: "n5",
    kind: "repo",
    title: "Alan pushed 3 commits",
    body: "feat: kanban drag-and-drop wired up · +137 −22",
    at: iso(-8),
    read: true,
    href: "/app/projects/p1/repository",
    actor: { name: "Alan Turing", initials: "AT" },
  },
  {
    id: "n6",
    kind: "team",
    title: "Marie accepted your invitation",
    body: "Marie Curie joined Smart Campus IoT Grid as Designer.",
    at: iso(-24),
    read: true,
    href: "/app/projects/p2/team",
    actor: { name: "Marie Curie", initials: "MC" },
  },
  {
    id: "n7",
    kind: "mention",
    title: "Marie mentioned you in a comment",
    body: '"Can you review the MQTT topic naming?"',
    at: iso(-30),
    read: true,
    href: "/app/projects/p2",
    actor: { name: "Marie Curie", initials: "MC" },
  },
  {
    id: "n8",
    kind: "system",
    title: "Weekly AI digest",
    body: "12 tasks shipped, 3 meetings run, 2 blockers resolved.",
    at: iso(-72),
    read: true,
    href: "/app/ai",
    actor: { name: "CampusPM AI", initials: "AI" },
  },
];

type State = {
  items: AppNotification[];
  unread: () => number;
  push: (n: Omit<AppNotification, "id" | "at" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
};

export const useNotificationsStore = create<State>((set, get) => ({
  items: seed,
  unread: () => get().items.filter((n) => !n.read).length,
  push: (n) =>
    set((s) => ({
      items: [
        {
          id: `n${Date.now()}`,
          at: new Date().toISOString(),
          read: false,
          ...n,
        },
        ...s.items,
      ],
    })),
  markRead: (id) =>
    set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
}));
