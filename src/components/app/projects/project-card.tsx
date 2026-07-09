import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MoreHorizontal, Archive, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectsStore } from "@/stores/projects-store";
import { timeFromNow, type ProjectHealth } from "@/lib/mock/data";
import type { WorkspaceProject } from "@/lib/mock/workspace";

const healthTone: Record<ProjectHealth, string> = {
  excellent: "bg-success/15 text-success border-success/20",
  good: "bg-info/15 text-info border-info/20",
  "at-risk": "bg-warning/15 text-warning border-warning/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
};

export function ProjectCard({ project, index = 0 }: { project: WorkspaceProject; index?: number }) {
  const archive = useProjectsStore((s) => s.archiveProject);
  const del = useProjectsStore((s) => s.deleteProject);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-surface/40 p-5 transition hover:border-border hover:bg-surface/60"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="border-border/60 bg-background/60 text-[10px]">
              {project.code}
            </Badge>
            <Badge className={`border text-[10px] ${healthTone[project.health]}`}>
              {project.health.replace("-", " ")}
            </Badge>
            {project.archived && (
              <Badge variant="outline" className="border-border/60 text-[10px]">
                archived
              </Badge>
            )}
          </div>
          <Link
            to="/app/projects/$projectId"
            params={{ projectId: project.id }}
            className="mt-2 block truncate font-display text-base font-semibold hover:text-primary"
          >
            {project.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/app/projects/$projectId" params={{ projectId: project.id }}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Open workspace
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                archive(project.id, !project.archived);
                toast(project.archived ? "Project restored" : "Project archived");
              }}
            >
              <Archive className="mr-2 h-3.5 w-3.5" />
              {project.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                del(project.id);
                toast.success("Project deleted");
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{project.progress}% complete</span>
          <span>
            {project.tasksDone}/{project.tasksTotal} tasks
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((m) => (
            <div
              key={m.id}
              title={`${m.name} · ${m.role}`}
              className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-surface-2 text-[9px] font-semibold"
            >
              {m.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
          ))}
          {project.members.length > 4 && (
            <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-surface-2 text-[9px]">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground">
          Due {timeFromNow(project.dueDate)}
        </span>
      </div>
    </motion.article>
  );
}
