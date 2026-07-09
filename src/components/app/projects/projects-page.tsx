import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, LayoutGrid, Rows3, FolderKanban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProjectDialog } from "@/components/app/projects/create-project-dialog";
import { ProjectCard } from "@/components/app/projects/project-card";
import { useProjectsStore } from "@/stores/projects-store";

type Filter = "active" | "archived" | "all";

export function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("active");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter === "active" && p.archived) return false;
      if (filter === "archived" && !p.archived) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(needle) ||
        p.code.toLowerCase().includes(needle) ||
        p.subject.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [projects, q, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1600px] space-y-6"
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.filter((p) => !p.archived).length} active ·{" "}
            {projects.filter((p) => p.archived).length} archived
          </p>
        </div>
        <CreateProjectDialog
          trigger={
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              <Plus className="mr-2 h-4 w-4" /> New project
            </Button>
          }
        />
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/40 p-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, codes, tags…"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="h-9">
              <TabsTrigger value="active" className="text-xs">
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" className="text-xs">
                Archived
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="hidden rounded-lg border border-border/60 p-0.5 md:flex">
            <Button
              size="icon"
              variant={view === "grid" ? "secondary" : "ghost"}
              className="h-7 w-7"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant={view === "list" ? "secondary" : "ghost"}
              className="h-7 w-7"
              onClick={() => setView("list")}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onOpen={() => setQ("")} hasQuery={Boolean(q)} />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ hasQuery, onOpen }: { hasQuery: boolean; onOpen: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/60 bg-surface/30 p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FolderKanban className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">
        {hasQuery ? "No matches" : "No projects yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasQuery
          ? "Try a different search or clear the filter."
          : "Create your first project to unlock the workspace."}
      </p>
      <div className="mt-5 flex justify-center gap-2">
        {hasQuery ? (
          <Button variant="outline" onClick={onOpen}>
            Clear search
          </Button>
        ) : (
          <CreateProjectDialog
            trigger={
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Create project
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
