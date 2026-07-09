import { CheckSquare, MessageSquare, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { timeFromNow } from "@/lib/mock/data";
import {
  priorityTone,
  taskLabelTone,
  type BoardTask,
  type WorkspaceProject,
} from "@/lib/mock/workspace";

export function TaskCard({
  task,
  members,
  dragging,
}: {
  task: BoardTask;
  members: WorkspaceProject["members"];
  dragging?: boolean;
}) {
  const assignees = task.assigneeIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean) as WorkspaceProject["members"];
  const subsDone = task.subtasks.filter((s) => s.done).length;

  return (
    <article
      className={`cursor-pointer rounded-xl border border-border/60 bg-background/70 p-3 shadow-sm transition ${
        dragging
          ? "rotate-2 border-primary/40 shadow-lg"
          : "hover:border-border hover:bg-background"
      }`}
    >
      <div className="flex flex-wrap items-center gap-1">
        {task.labels.slice(0, 3).map((l) => (
          <Badge key={l} className={`border text-[9px] ${taskLabelTone[l]}`}>
            {l}
          </Badge>
        ))}
      </div>
      <h4 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug">{task.title}</h4>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        {task.subtasks.length > 0 && (
          <span className="flex items-center gap-1">
            <CheckSquare className="h-3 w-3" />
            {subsDone}/{task.subtasks.length}
          </span>
        )}
        {task.comments.length > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {task.comments.length}
          </span>
        )}
        {task.attachments.length > 0 && (
          <span className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            {task.attachments.length}
          </span>
        )}
        <span className="ml-auto">{timeFromNow(task.dueDate)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge className={`border text-[9px] ${priorityTone[task.priority]}`}>
          {task.priority}
        </Badge>
        <div className="flex -space-x-1.5">
          {assignees.slice(0, 3).map((m) => (
            <div
              key={m.id}
              title={m.name}
              className="grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-surface-2 text-[8px] font-semibold"
            >
              {m.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
