// Mock data shared by Phase 6 AI features. Backend-ready — swap for
// server functions later without touching the UI.

export type PptTheme = {
  id: string;
  name: string;
  gradient: string;
  accent: string;
  swatch: string[];
};

export const PPT_THEMES: PptTheme[] = [
  {
    id: "aurora",
    name: "Aurora",
    gradient: "from-primary via-primary/70 to-info",
    accent: "hsl(var(--primary))",
    swatch: ["#7c3aed", "#4f46e5", "#0ea5e9"],
  },
  {
    id: "ivory",
    name: "Ivory",
    gradient: "from-amber-100 via-white to-slate-50",
    accent: "#0f172a",
    swatch: ["#fef3c7", "#ffffff", "#e2e8f0"],
  },
  {
    id: "midnight",
    name: "Midnight",
    gradient: "from-slate-900 via-slate-800 to-black",
    accent: "#22d3ee",
    swatch: ["#0f172a", "#1e293b", "#22d3ee"],
  },
  {
    id: "sunrise",
    name: "Sunrise",
    gradient: "from-orange-400 via-rose-500 to-fuchsia-600",
    accent: "#ffffff",
    swatch: ["#fb923c", "#f43f5e", "#c026d3"],
  },
];

export type PptSlideKind =
  | "cover"
  | "problem"
  | "objectives"
  | "architecture"
  | "workflow"
  | "features"
  | "stack"
  | "results"
  | "conclusion"
  | "future"
  | "thanks";

export type PptSlide = {
  id: string;
  kind: PptSlideKind;
  title: string;
  bullets: string[];
};

export type PptInputs = {
  title: string;
  problem: string;
  objectives: string;
  methodology: string;
  stack: string;
  features: string;
  results: string;
  future: string;
};

export const DEFAULT_PPT_INPUTS: PptInputs = {
  title: "Autonomous Drone Delivery",
  problem:
    "Last-mile logistics in dense campuses are slow, error-prone, and expensive to operate manually.",
  objectives:
    "Cut delivery time by 60%. Enable obstacle-aware routing. Provide a live operator dashboard.",
  methodology:
    "LiDAR mapping, ROS 2 control stack, reinforcement-tuned PID loops, cloud telemetry.",
  stack: "React, TanStack Start, Supabase, ROS 2, PyTorch, MQTT",
  features: "Live tracking, geo-fenced routes, autonomous obstacle avoidance, admin analytics.",
  results:
    "Achieved 92% success rate over 240 test flights. Average latency of 210ms per waypoint.",
  future: "Multi-drone coordination, swarm rebalancing, and a public API for campus delivery apps.",
};

export function buildSlides(inputs: PptInputs): PptSlide[] {
  const split = (v: string) =>
    v
      .split(/[\n•·]|(?:\.\s+)/)
      .map((s) => s.trim().replace(/^[-–•]\s*/, ""))
      .filter(Boolean)
      .slice(0, 5);
  return [
    {
      id: "s1",
      kind: "cover",
      title: inputs.title || "Project title",
      bullets: ["Presented by your team", "CampusPM · Final Year Project"],
    },
    { id: "s2", kind: "problem", title: "Problem Statement", bullets: split(inputs.problem) },
    { id: "s3", kind: "objectives", title: "Objectives", bullets: split(inputs.objectives) },
    {
      id: "s4",
      kind: "architecture",
      title: "System Architecture",
      bullets: ["Client → API → Services → Data", "Realtime via WebSockets", "Edge cache + CDN"],
    },
    {
      id: "s5",
      kind: "workflow",
      title: "Workflow",
      bullets: ["Ingest", "Process", "Decide", "Actuate", "Observe"],
    },
    { id: "s6", kind: "features", title: "Key Features", bullets: split(inputs.features) },
    { id: "s7", kind: "stack", title: "Tech Stack", bullets: split(inputs.stack) },
    { id: "s8", kind: "results", title: "Results", bullets: split(inputs.results) },
    {
      id: "s9",
      kind: "conclusion",
      title: "Conclusion",
      bullets: ["Objectives met", "Measurable impact", "Ready for pilot"],
    },
    { id: "s10", kind: "future", title: "Future Scope", bullets: split(inputs.future) },
    { id: "s11", kind: "thanks", title: "Thank you", bullets: ["Questions?", "campuspm.app"] },
  ];
}

// -------- Report --------
export type ReportSection = {
  id: string;
  title: string;
  body: string;
};

export const DEFAULT_REPORT: ReportSection[] = [
  {
    id: "abstract",
    title: "Abstract",
    body: "This project introduces an autonomous drone delivery platform designed for dense campus environments. By combining LiDAR mapping with reinforcement-tuned PID controllers, our system reduces average last-mile delivery time by 60% while maintaining a 92% success rate across 240 test flights.",
  },
  {
    id: "introduction",
    title: "Introduction",
    body: "Last-mile logistics remain a substantial bottleneck for campus operations, driving up costs and delaying critical deliveries. Prior work has explored partial autonomy but rarely accounts for the density of pedestrians and moving obstacles unique to campus settings.",
  },
  {
    id: "literature",
    title: "Literature Review",
    body: "We surveyed 32 papers across autonomous UAV routing, LiDAR SLAM, and last-mile logistics. Recurring themes include the trade-off between compute budget and obstacle-avoidance responsiveness, and the underexplored area of multi-agent rebalancing.",
  },
  {
    id: "objectives",
    title: "Objectives",
    body: "1) Cut average delivery time by 60%. 2) Enable obstacle-aware autonomous routing. 3) Provide a live operator dashboard. 4) Publish an open-source reference implementation.",
  },
  {
    id: "methodology",
    title: "Methodology",
    body: "The system is composed of a ROS 2 flight stack, a cloud telemetry layer, and a React operator dashboard. Waypoint decisions are governed by a policy trained via proximal policy optimisation on 2M simulated flights.",
  },
  {
    id: "design",
    title: "System Design",
    body: "The architecture follows a hexagonal pattern with a clear separation between the flight controller, the routing service, and the observability plane. Realtime updates flow via MQTT and are surfaced to operators through a Supabase-backed dashboard.",
  },
  {
    id: "implementation",
    title: "Implementation",
    body: "Implementation was delivered across 14 sprints. The team used trunk-based development with feature flags, and every merge triggered a full simulation suite before shipping to the test fleet.",
  },
  {
    id: "results",
    title: "Results",
    body: "Across 240 test flights, the platform achieved a 92% success rate with an average latency of 210ms per waypoint. Operator satisfaction scored 4.7 out of 5 in a post-pilot survey.",
  },
  {
    id: "conclusion",
    title: "Conclusion",
    body: "The project demonstrates that campus-scale autonomous delivery is feasible with commodity hardware and open-source software. The measured impact meets or exceeds every objective set at kickoff.",
  },
  {
    id: "references",
    title: "References",
    body: "[1] Smith et al., 2023. LiDAR SLAM in dynamic environments.\n[2] Chen & Rao, 2022. Autonomous last-mile UAVs.\n[3] Kumar, 2024. Reinforcement learning for flight control.",
  },
];

// -------- Viva --------
export type VivaDifficulty = "easy" | "medium" | "hard";
export type VivaTopic = {
  id: string;
  name: string;
  questions: VivaQuestion[];
};
export type VivaQuestion = {
  id: string;
  q: string;
  a: string;
  difficulty: VivaDifficulty;
};

export const VIVA_TOPICS: VivaTopic[] = [
  {
    id: "arch",
    name: "System Architecture",
    questions: [
      {
        id: "q1",
        q: "Why did you choose a hexagonal architecture?",
        a: "It cleanly separates the flight controller, routing, and observability layers so each can evolve independently and be tested in isolation.",
        difficulty: "medium",
      },
      {
        id: "q2",
        q: "How does data flow from the drone to the dashboard?",
        a: "Telemetry is published to MQTT topics, buffered by an edge collector, and streamed to the dashboard through Supabase realtime channels.",
        difficulty: "easy",
      },
      {
        id: "q3",
        q: "What happens if the routing service is down?",
        a: "The flight controller falls back to a cached last-known-good plan and enters a conservative hover-and-return mode after 8 seconds of missed heartbeats.",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "ml",
    name: "Machine Learning",
    questions: [
      {
        id: "q4",
        q: "Why PPO instead of DQN?",
        a: "PPO handles continuous action spaces natively, which matches the pitch/roll/yaw control surface far better than DQN's discrete outputs.",
        difficulty: "medium",
      },
      {
        id: "q5",
        q: "How did you avoid overfitting to the simulator?",
        a: "We used domain randomisation on wind, lighting, and obstacle density, and evaluated every checkpoint on a held-out set of real flight logs.",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "eval",
    name: "Evaluation & Testing",
    questions: [
      {
        id: "q6",
        q: "How did you measure the 92% success rate?",
        a: "A flight is a success when the payload is delivered within 5m of the target and within 20% of the planned duration. We logged 240 flights across three campuses.",
        difficulty: "easy",
      },
      {
        id: "q7",
        q: "What is your biggest failure mode?",
        a: "Unexpected pedestrian clusters near the drop zone — resolved by adding a 3-second local re-planning window before descent.",
        difficulty: "medium",
      },
    ],
  },
];

// -------- Submission --------
export type SubmissionItem = {
  id: string;
  label: string;
  desc: string;
  done: boolean;
  required: boolean;
};

export const DEFAULT_SUBMISSION: SubmissionItem[] = [
  {
    id: "report",
    label: "Final report",
    desc: "Academic report (PDF) with all required sections.",
    done: true,
    required: true,
  },
  {
    id: "ppt",
    label: "Presentation",
    desc: "Slide deck exported to PDF or PPTX.",
    done: true,
    required: true,
  },
  {
    id: "code",
    label: "Source code",
    desc: "Repository link with README and setup instructions.",
    done: true,
    required: true,
  },
  {
    id: "docs",
    label: "Technical documentation",
    desc: "Architecture notes, API reference, and diagrams.",
    done: false,
    required: true,
  },
  {
    id: "demo",
    label: "Demo video",
    desc: "3-5 minute walkthrough hosted on YouTube or Drive.",
    done: false,
    required: true,
  },
  {
    id: "dataset",
    label: "Dataset / models",
    desc: "Training data, trained weights, and reproducibility notes.",
    done: false,
    required: false,
  },
  {
    id: "shots",
    label: "Screenshots",
    desc: "Hero screenshots for report and portfolio use.",
    done: true,
    required: false,
  },
  {
    id: "refs",
    label: "References",
    desc: "Bibliography and cited literature in a consistent format.",
    done: true,
    required: true,
  },
];

// -------- Insights --------
export const WEEKLY_VELOCITY = [
  { week: "W1", planned: 12, shipped: 10 },
  { week: "W2", planned: 14, shipped: 13 },
  { week: "W3", planned: 16, shipped: 14 },
  { week: "W4", planned: 15, shipped: 15 },
  { week: "W5", planned: 18, shipped: 16 },
  { week: "W6", planned: 18, shipped: 18 },
  { week: "W7", planned: 20, shipped: 19 },
  { week: "W8", planned: 20, shipped: 22 },
];

export const CONTRIBUTION_BREAKDOWN = [
  { name: "Ada", value: 32 },
  { name: "Alan", value: 24 },
  { name: "Grace", value: 18 },
  { name: "Linus", value: 14 },
  { name: "Others", value: 12 },
];

export const AI_RECOMMENDATIONS = [
  {
    id: "r1",
    tone: "risk",
    title: "Documentation lags 2 sprints behind code",
    detail: "Assign a docs owner for Sprint 9 or block the release checklist until closed.",
  },
  {
    id: "r2",
    tone: "opportunity",
    title: "Ada is over-allocated by 22%",
    detail: "Rebalance 3 high-priority tickets to Grace, who has 15% free capacity.",
  },
  {
    id: "r3",
    tone: "win",
    title: "Sprint velocity is trending +9% week over week",
    detail: "Lock this pace as the baseline for Q4 planning.",
  },
];
