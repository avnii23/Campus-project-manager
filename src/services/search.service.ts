import { mockDelay, USE_MOCKS, request } from "./api-client";
import { mockProjects, mockTasks, mockMeetings } from "@/lib/mock/data";

export type SearchKind = "project" | "task" | "meeting" | "file" | "report" | "member";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href: string;
};

const seedMembers = [
  { id: "u1", name: "Ada Lovelace", email: "ada@campus.edu" },
  { id: "u2", name: "Alan Turing", email: "alan@campus.edu" },
  { id: "u3", name: "Grace Hopper", email: "grace@campus.edu" },
  { id: "u5", name: "Marie Curie", email: "marie@campus.edu" },
];

const seedFiles = [
  { id: "f1", name: "sensor-diagram.pdf", project: "Smart Campus IoT Grid", projectId: "p2" },
  { id: "f2", name: "flight-log-Q3.csv", project: "Autonomous Drone Delivery", projectId: "p1" },
  { id: "f3", name: "user-research.md", project: "Financial Literacy Chatbot", projectId: "p3" },
];

const seedReports = [
  { id: "r1", title: "Midterm progress report", projectId: "p1" },
  { id: "r2", title: "Sprint 6 retrospective", projectId: "p2" },
];

export const searchService = {
  async query(q: string): Promise<SearchHit[]> {
    if (USE_MOCKS) {
      await mockDelay(60, 160);
      const needle = q.trim().toLowerCase();
      if (!needle) return [];
      const hits: SearchHit[] = [];

      for (const p of mockProjects) {
        if (`${p.name} ${p.code} ${p.tags.join(" ")}`.toLowerCase().includes(needle)) {
          hits.push({
            id: p.id,
            kind: "project",
            title: p.name,
            subtitle: p.code,
            href: `/app/projects/${p.id}`,
          });
        }
      }
      for (const t of mockTasks) {
        if (t.title.toLowerCase().includes(needle)) {
          hits.push({
            id: t.id,
            kind: "task",
            title: t.title,
            subtitle: t.projectName,
            href: `/app/projects/${t.projectId}/board`,
          });
        }
      }
      for (const m of mockMeetings) {
        if (m.title.toLowerCase().includes(needle)) {
          hits.push({
            id: m.id,
            kind: "meeting",
            title: m.title,
            subtitle: m.projectName,
            href: `/app/meetings/${m.id}`,
          });
        }
      }
      for (const f of seedFiles) {
        if (f.name.toLowerCase().includes(needle)) {
          hits.push({
            id: f.id,
            kind: "file",
            title: f.name,
            subtitle: f.project,
            href: `/app/projects/${f.projectId}/repository`,
          });
        }
      }
      for (const r of seedReports) {
        if (r.title.toLowerCase().includes(needle)) {
          hits.push({ id: r.id, kind: "report", title: r.title, href: `/app/report` });
        }
      }
      for (const u of seedMembers) {
        if (`${u.name} ${u.email}`.toLowerCase().includes(needle)) {
          hits.push({
            id: u.id,
            kind: "member",
            title: u.name,
            subtitle: u.email,
            href: `/app/settings/workspace`,
          });
        }
      }
      return hits.slice(0, 24);
    }
    return request<SearchHit[]>(`/api/search?q=${encodeURIComponent(q)}`);
  },
};
