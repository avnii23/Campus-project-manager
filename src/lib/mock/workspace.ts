// Extended mock data for the project workspace (Phase 4).
// Kept separate from `data.ts` so backend swap-in is scoped.
import type { MockProject } from "./data";

export type MemberRole =
  "Leader" | "Developer" | "Designer" | "Researcher" | "Documentation Lead" | "Presenter";

export const MEMBER_ROLES: MemberRole[] = [
  "Leader",
  "Developer",
  "Designer",
  "Researcher",
  "Documentation Lead",
  "Presenter",
];

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
  contribution: number; // 0-100
  tasksDone: number;
  tasksAssigned: number;
  online: boolean;
};

export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskLabel = "frontend" | "backend" | "research" | "design" | "docs" | "bug" | "review";

export type TaskComment = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
};

export type TaskAttachment = {
  id: string;
  name: string;
  sizeKb: number;
  kind: "pdf" | "image" | "doc" | "code" | "other";
};

export type Subtask = { id: string; title: string; done: boolean };

export type TaskActivity = {
  id: string;
  actor: string;
  verb: string;
  at: string;
};

export type BoardTask = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: TaskLabel[];
  assigneeIds: string[];
  dueDate: string;
  createdAt: string;
  subtasks: Subtask[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  activity: TaskActivity[];
};

export type Milestone = {
  id: string;
  title: string;
  date: string;
  status: "done" | "upcoming" | "at-risk";
  description: string;
};

export type RepoFile = {
  id: string;
  path: string; // e.g. "src/components/Foo.tsx"
  type: "file" | "folder";
  sizeKb?: number;
  updatedAt: string;
  updatedBy: string;
  kind?: "md" | "code" | "image" | "pdf" | "doc" | "sheet" | "other";
  preview?: string;
};

export type Commit = {
  id: string;
  message: string;
  authorId: string;
  authorName: string;
  at: string;
  filesChanged: number;
  additions: number;
  deletions: number;
};

export type WorkspaceProject = MockProject & {
  guide: string;
  subject: string;
  semester: string;
  archived: boolean;
  createdAt: string;
  members: ProjectMember[];
  milestones: Milestone[];
  files: RepoFile[];
  commits: Commit[];
  tasks: BoardTask[];
};

const now = new Date();
const iso = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3600_000).toISOString();

/** Seed members shared across seed projects. */
const seedMembers: ProjectMember[] = [
  {
    id: "u1",
    name: "Ada Lovelace",
    email: "ada@campus.edu",
    role: "Leader",
    contribution: 92,
    tasksDone: 24,
    tasksAssigned: 27,
    online: true,
  },
  {
    id: "u2",
    name: "Alan Turing",
    email: "alan@campus.edu",
    role: "Developer",
    contribution: 84,
    tasksDone: 19,
    tasksAssigned: 23,
    online: true,
  },
  {
    id: "u3",
    name: "Grace Hopper",
    email: "grace@campus.edu",
    role: "Researcher",
    contribution: 76,
    tasksDone: 16,
    tasksAssigned: 22,
    online: false,
  },
  {
    id: "u4",
    name: "Linus Torvalds",
    email: "linus@campus.edu",
    role: "Developer",
    contribution: 68,
    tasksDone: 14,
    tasksAssigned: 21,
    online: true,
  },
  {
    id: "u5",
    name: "Marie Curie",
    email: "marie@campus.edu",
    role: "Designer",
    contribution: 71,
    tasksDone: 12,
    tasksAssigned: 18,
    online: false,
  },
  {
    id: "u6",
    name: "Nikola Tesla",
    email: "nikola@campus.edu",
    role: "Documentation Lead",
    contribution: 63,
    tasksDone: 10,
    tasksAssigned: 17,
    online: false,
  },
  {
    id: "u7",
    name: "Rosa Parks",
    email: "rosa@campus.edu",
    role: "Presenter",
    contribution: 88,
    tasksDone: 15,
    tasksAssigned: 17,
    online: true,
  },
];

function makeTasks(projectId: string, memberIds: string[]): BoardTask[] {
  const templates: Array<
    Omit<BoardTask, "id" | "projectId" | "createdAt" | "activity" | "comments" | "attachments">
  > = [
    {
      title: "Compile literature review sources",
      description: "Gather 25 peer-reviewed sources with abstracts.",
      status: "done",
      priority: "medium",
      labels: ["research", "docs"],
      assigneeIds: [memberIds[2] ?? memberIds[0]],
      dueDate: iso(-48),
      subtasks: [
        { id: "s1", title: "IEEE search", done: true },
        { id: "s2", title: "ACM search", done: true },
        { id: "s3", title: "Summarise 5 key papers", done: true },
      ],
    },
    {
      title: "Draft system architecture diagram",
      description: "C4 model context + container diagrams for the whole system.",
      status: "review",
      priority: "high",
      labels: ["design", "docs"],
      assigneeIds: [memberIds[4] ?? memberIds[0]],
      dueDate: iso(24),
      subtasks: [
        { id: "s1", title: "Context diagram", done: true },
        { id: "s2", title: "Container diagram", done: true },
        { id: "s3", title: "Component diagram", done: false },
      ],
    },
    {
      title: "Set up CI/CD pipeline",
      description: "GitHub Actions → lint, test, preview deploy.",
      status: "in_progress",
      priority: "high",
      labels: ["backend"],
      assigneeIds: [memberIds[1] ?? memberIds[0]],
      dueDate: iso(72),
      subtasks: [
        { id: "s1", title: "Lint workflow", done: true },
        { id: "s2", title: "Test workflow", done: false },
        { id: "s3", title: "Preview deploy", done: false },
      ],
    },
    {
      title: "Design authentication flow screens",
      description: "Sign-in, sign-up, forgot password — mobile + desktop.",
      status: "in_progress",
      priority: "medium",
      labels: ["design", "frontend"],
      assigneeIds: [memberIds[4] ?? memberIds[0]],
      dueDate: iso(48),
      subtasks: [
        { id: "s1", title: "Wireframes", done: true },
        { id: "s2", title: "Hi-fi mocks", done: false },
      ],
    },
    {
      title: "Implement REST endpoints for tasks",
      description: "CRUD + list-by-project + filters.",
      status: "todo",
      priority: "high",
      labels: ["backend"],
      assigneeIds: [memberIds[3] ?? memberIds[0]],
      dueDate: iso(96),
      subtasks: [],
    },
    {
      title: "Write user testing plan",
      description: "5 participants, task scenarios + SUS survey.",
      status: "todo",
      priority: "medium",
      labels: ["research"],
      assigneeIds: [memberIds[2] ?? memberIds[0]],
      dueDate: iso(120),
      subtasks: [],
    },
    {
      title: "Prepare mid-review presentation",
      description: "12 slides covering progress, blockers, next milestones.",
      status: "backlog",
      priority: "urgent",
      labels: ["docs"],
      assigneeIds: [memberIds[6] ?? memberIds[0]],
      dueDate: iso(168),
      subtasks: [],
    },
    {
      title: "Fix mobile nav overlap on iOS",
      description: "Safe-area inset breaks on iPhone 15 landscape.",
      status: "backlog",
      priority: "low",
      labels: ["bug", "frontend"],
      assigneeIds: [memberIds[1] ?? memberIds[0]],
      dueDate: iso(240),
      subtasks: [],
    },
  ];

  return templates.map((t, i) => ({
    id: `${projectId}-t${i + 1}`,
    projectId,
    createdAt: iso(-24 * (10 - i)),
    comments: [
      {
        id: "c1",
        authorId: memberIds[0],
        authorName: "Ada Lovelace",
        body: "Kicking this off — let me know if scope needs a trim.",
        at: iso(-6),
      },
      {
        id: "c2",
        authorId: memberIds[1] ?? memberIds[0],
        authorName: "Alan Turing",
        body: "On it, will push a branch tonight.",
        at: iso(-3),
      },
    ],
    attachments:
      i % 3 === 0
        ? [
            { id: "a1", name: "spec-v2.pdf", sizeKb: 342, kind: "pdf" },
            { id: "a2", name: "wireframe.png", sizeKb: 128, kind: "image" },
          ]
        : [],
    activity: [
      { id: "l1", actor: "Ada", verb: "created this task", at: iso(-24) },
      { id: "l2", actor: "Alan", verb: "changed priority to " + t.priority, at: iso(-12) },
      { id: "l3", actor: "System", verb: "moved to " + t.status, at: iso(-6) },
    ],
    ...t,
  }));
}

function makeMilestones(): Milestone[] {
  return [
    {
      id: "m1",
      title: "Project proposal approved",
      date: iso(-24 * 30),
      status: "done",
      description: "Faculty sign-off on scope and deliverables.",
    },
    {
      id: "m2",
      title: "Literature review submitted",
      date: iso(-24 * 14),
      status: "done",
      description: "25+ sources with critical analysis.",
    },
    {
      id: "m3",
      title: "MVP prototype",
      date: iso(24 * 7),
      status: "upcoming",
      description: "End-to-end happy path demoable on staging.",
    },
    {
      id: "m4",
      title: "Mid-semester review",
      date: iso(24 * 14),
      status: "upcoming",
      description: "Panel presentation + progress report.",
    },
    {
      id: "m5",
      title: "User testing round 1",
      date: iso(24 * 28),
      status: "at-risk",
      description: "5 external participants, SUS + qualitative.",
    },
    {
      id: "m6",
      title: "Final submission",
      date: iso(24 * 56),
      status: "upcoming",
      description: "Report + code + presentation + viva.",
    },
  ];
}

function makeFiles(): RepoFile[] {
  return [
    { id: "f1", path: "docs", type: "folder", updatedAt: iso(-24), updatedBy: "Ada" },
    { id: "f2", path: "src", type: "folder", updatedAt: iso(-6), updatedBy: "Alan" },
    { id: "f3", path: "designs", type: "folder", updatedAt: iso(-48), updatedBy: "Marie" },
    { id: "f4", path: "research", type: "folder", updatedAt: iso(-72), updatedBy: "Grace" },
    {
      id: "f5",
      path: "README.md",
      type: "file",
      kind: "md",
      sizeKb: 4,
      updatedAt: iso(-2),
      updatedBy: "Ada",
      preview:
        "# Project overview\n\nThis repository holds all deliverables for our capstone.\n\n## Team\n- Ada (Leader)\n- Alan (Dev)\n- Grace (Research)\n\n## Milestones\n1. Proposal ✅\n2. Literature review ✅\n3. Prototype 🚧",
    },
    {
      id: "f6",
      path: "docs/proposal.pdf",
      type: "file",
      kind: "pdf",
      sizeKb: 812,
      updatedAt: iso(-24 * 30),
      updatedBy: "Ada",
    },
    {
      id: "f7",
      path: "docs/literature-review.pdf",
      type: "file",
      kind: "pdf",
      sizeKb: 1450,
      updatedAt: iso(-24 * 14),
      updatedBy: "Grace",
    },
    {
      id: "f8",
      path: "src/index.tsx",
      type: "file",
      kind: "code",
      sizeKb: 2,
      updatedAt: iso(-3),
      updatedBy: "Alan",
      preview:
        "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)",
    },
    {
      id: "f9",
      path: "designs/system-architecture.png",
      type: "file",
      kind: "image",
      sizeKb: 640,
      updatedAt: iso(-12),
      updatedBy: "Marie",
    },
    {
      id: "f10",
      path: "research/interview-notes.docx",
      type: "file",
      kind: "doc",
      sizeKb: 96,
      updatedAt: iso(-24 * 5),
      updatedBy: "Grace",
    },
  ];
}

function makeCommits(members: ProjectMember[]): Commit[] {
  const msgs = [
    "feat: kanban drag-and-drop wired up",
    "docs: literature review draft",
    "chore: bump deps and lockfile",
    "fix: mobile nav safe-area inset",
    "feat: auth screens hi-fi mocks",
    "test: contract tests for /tasks",
    "refactor: split project workspace tabs",
    "feat: CI preview deploys via workflow",
    "docs: architecture diagram v2",
    "chore: seed mock data for demo",
  ];
  return msgs.map((m, i) => {
    const author = members[i % members.length];
    return {
      id: `c${i + 1}`,
      message: m,
      authorId: author.id,
      authorName: author.name,
      at: iso(-i * 6 - 2),
      filesChanged: 1 + (i % 5),
      additions: 20 + i * 7,
      deletions: 3 + i * 2,
    };
  });
}

const baseProjects: Array<
  Omit<
    WorkspaceProject,
    "members" | "milestones" | "files" | "commits" | "tasks" | "archived" | "createdAt"
  > & { memberIds: string[] }
> = [
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
    team: [],
    tasksTotal: 48,
    tasksDone: 34,
    meetingsThisWeek: 3,
    guide: "Dr. Ramesh Kumar",
    subject: "Capstone Project",
    semester: "Semester 8",
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
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
    team: [],
    tasksTotal: 62,
    tasksDone: 25,
    meetingsThisWeek: 2,
    guide: "Prof. Neha Sharma",
    subject: "Embedded Systems",
    semester: "Semester 6",
    memberIds: ["u1", "u5", "u6", "u4"],
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
    team: [],
    tasksTotal: 27,
    tasksDone: 25,
    meetingsThisWeek: 1,
    guide: "Dr. Aisha Patel",
    subject: "Product Management",
    semester: "Semester 4",
    memberIds: ["u1", "u7", "u2"],
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
    team: [],
    tasksTotal: 22,
    tasksDone: 4,
    meetingsThisWeek: 0,
    guide: "Prof. Daniel Fischer",
    subject: "Environmental Science",
    semester: "Semester 5",
    memberIds: ["u1", "u3", "u6"],
  },
];

export const seedProjects: WorkspaceProject[] = baseProjects.map((p) => {
  const members = p.memberIds.map((id) => {
    const src = seedMembers.find((m) => m.id === id)!;
    return { ...src };
  });
  const team = members.map((m) => ({ id: m.id, name: m.name }));
  return {
    ...p,
    team,
    members,
    archived: false,
    createdAt: iso(-24 * 45),
    milestones: makeMilestones(),
    files: makeFiles(),
    commits: makeCommits(members),
    tasks: makeTasks(
      p.id,
      members.map((m) => m.id),
    ),
  } satisfies WorkspaceProject;
});

export const availablePeople = seedMembers;

export const taskLabelTone: Record<TaskLabel, string> = {
  frontend: "bg-info/15 text-info border-info/20",
  backend: "bg-primary/15 text-primary border-primary/20",
  research: "bg-accent/15 text-accent-foreground border-accent/20",
  design: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  docs: "bg-muted text-muted-foreground border-border/60",
  bug: "bg-destructive/15 text-destructive border-destructive/20",
  review: "bg-warning/15 text-warning border-warning/20",
};

export const priorityTone: Record<TaskPriority, string> = {
  low: "bg-muted text-muted-foreground border-border/60",
  medium: "bg-info/15 text-info border-info/20",
  high: "bg-warning/15 text-warning border-warning/20",
  urgent: "bg-destructive/15 text-destructive border-destructive/20",
};

export const statusMeta: Record<
  TaskStatus,
  { label: string; accent: string; description: string }
> = {
  backlog: {
    label: "Backlog",
    accent: "text-muted-foreground",
    description: "Not started yet",
  },
  todo: { label: "To Do", accent: "text-info", description: "Ready to pick up" },
  in_progress: {
    label: "In Progress",
    accent: "text-primary",
    description: "Actively worked on",
  },
  review: { label: "Review", accent: "text-warning", description: "Waiting for approval" },
  done: { label: "Done", accent: "text-success", description: "Shipped" },
};

export const STATUS_ORDER: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
