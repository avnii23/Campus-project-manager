import { useState } from "react";
import { Activity, CheckSquare, MessageSquare, Paperclip, Send } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectsStore } from "@/stores/projects-store";
import { timeFromNow } from "@/lib/mock/data";
import {
  priorityTone,
  STATUS_ORDER,
  statusMeta,
  taskLabelTone,
  type BoardTask,
  type TaskPriority,
  type TaskStatus,
  type WorkspaceProject,
} from "@/lib/mock/workspace";

export function TaskDetailSheet({
  task,
  project,
  open,
  onOpenChange,
}: {
  task: BoardTask | null;
  project: WorkspaceProject;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const updateTask = useProjectsStore((s) => s.updateTask);
  const toggleSubtask = useProjectsStore((s) => s.toggleSubtask);
  const addComment = useProjectsStore((s) => s.addComment);
  const [comment, setComment] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-xl">
        {task ? (
          <>
            <SheetHeader className="text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                {task.labels.map((l) => (
                  <Badge key={l} className={`border text-[10px] ${taskLabelTone[l]}`}>
                    {l}
                  </Badge>
                ))}
                <Badge className={`border text-[10px] ${priorityTone[task.priority]}`}>
                  {task.priority}
                </Badge>
              </div>
              <SheetTitle className="font-display text-xl">{task.title}</SheetTitle>
              <SheetDescription>
                Created {timeFromNow(task.createdAt)} · due {timeFromNow(task.dueDate)}
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <MetaControl label="Status">
                <Select
                  value={task.status}
                  onValueChange={(v) =>
                    updateTask(project.id, task.id, { status: v as TaskStatus })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusMeta[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </MetaControl>
              <MetaControl label="Priority">
                <Select
                  value={task.priority}
                  onValueChange={(v) =>
                    updateTask(project.id, task.id, { priority: v as TaskPriority })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["low", "medium", "high", "urgent"] as TaskPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </MetaControl>
              <MetaControl label="Due date">
                <Input
                  type="date"
                  className="h-8"
                  value={task.dueDate.slice(0, 10)}
                  onChange={(e) =>
                    updateTask(project.id, task.id, {
                      dueDate: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </MetaControl>
              <MetaControl label="Assignees">
                <div className="flex flex-wrap gap-1">
                  {project.members.map((m) => {
                    const active = task.assigneeIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() =>
                          updateTask(project.id, task.id, {
                            assigneeIds: active
                              ? task.assigneeIds.filter((id) => id !== m.id)
                              : [...task.assigneeIds, m.id],
                          })
                        }
                        className={`rounded-full border px-2 py-0.5 text-[10px] transition ${
                          active
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {m.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </MetaControl>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {task.description || "No description yet."}
              </p>
            </div>

            <Separator />

            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <CheckSquare className="h-3.5 w-3.5" /> Subtasks
              </h3>
              <ul className="mt-2 space-y-2">
                {task.subtasks.length === 0 && (
                  <li className="text-xs text-muted-foreground">No subtasks yet.</li>
                )}
                {task.subtasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={s.done}
                      onCheckedChange={() => toggleSubtask(project.id, task.id, s.id)}
                    />
                    <span className={s.done ? "text-muted-foreground line-through" : ""}>
                      {s.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {task.attachments.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Paperclip className="h-3.5 w-3.5" /> Attachments
                </h3>
                <ul className="mt-2 space-y-2">
                  {task.attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-2.5 text-xs"
                    >
                      <span className="truncate">{a.name}</span>
                      <span className="text-muted-foreground">{a.sizeKb} KB</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Separator />

            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" /> Comments · {task.comments.length}
              </h3>
              <ul className="mt-3 space-y-3">
                {task.comments.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-semibold">
                      {c.authorName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1 rounded-xl border border-border/60 bg-background/40 p-2.5 text-xs">
                      <p className="flex items-center justify-between">
                        <span className="font-medium">{c.authorName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {timeFromNow(c.at)}
                        </span>
                      </p>
                      <p className="mt-1 text-muted-foreground">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  addComment(project.id, task.id, "You", comment.trim());
                  setComment("");
                }}
                className="mt-3 flex gap-2"
              >
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment…"
                  className="h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> Activity
              </h3>
              <ul className="mt-2 space-y-2 text-xs">
                {task.activity.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between border-l-2 border-border/60 pl-3"
                  >
                    <span>
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.verb}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">{timeFromNow(a.at)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function MetaControl({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
