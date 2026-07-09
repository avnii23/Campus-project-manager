import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/stores/projects-store";
import {
  STATUS_ORDER,
  statusMeta,
  type BoardTask,
  type TaskStatus,
  type WorkspaceProject,
} from "@/lib/mock/workspace";
import { TaskCard } from "@/components/app/projects/kanban/task-card";
import { TaskDetailSheet } from "@/components/app/projects/kanban/task-detail-sheet";
import { toast } from "sonner";

export function KanbanBoard({ project }: { project: WorkspaceProject }) {
  const moveTask = useProjectsStore((s) => s.moveTask);
  const addTask = useProjectsStore((s) => s.addTask);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const columns = useMemo(() => {
    const map: Record<TaskStatus, BoardTask[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    project.tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [project.tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const overId = e.over?.id;
    if (!overId) return;
    const target = STATUS_ORDER.find((s) => s === overId || overId === `col-${s}`) as
      TaskStatus | undefined;
    if (!target) return;
    const task = project.tasks.find((t) => t.id === e.active.id);
    if (!task || task.status === target) return;
    moveTask(project.id, task.id, target);
    toast(`Moved to ${statusMeta[target].label}`);
  }

  const openTask = openTaskId ? (project.tasks.find((t) => t.id === openTaskId) ?? null) : null;
  const activeTask = activeId ? project.tasks.find((t) => t.id === activeId) : null;

  return (
    <div>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="scrollbar-thin -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={columns[status]}
              onOpenTask={setOpenTaskId}
              onAdd={() =>
                addTask(project.id, {
                  title: "New task",
                  description: "",
                  status,
                  priority: "medium",
                  labels: [],
                  assigneeIds: [],
                  dueDate: new Date(Date.now() + 7 * 86400_000).toISOString(),
                  subtasks: [],
                  comments: [],
                  attachments: [],
                })
              }
              members={project.members}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} members={project.members} dragging /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailSheet
        task={openTask}
        project={project}
        open={Boolean(openTask)}
        onOpenChange={(o) => !o && setOpenTaskId(null)}
      />
    </div>
  );
}

function Column({
  status,
  tasks,
  onOpenTask,
  onAdd,
  members,
}: {
  status: TaskStatus;
  tasks: BoardTask[];
  onOpenTask: (id: string) => void;
  onAdd: () => void;
  members: WorkspaceProject["members"];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` });
  const meta = statusMeta[status];
  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-2xl border border-border/60 bg-surface/30 transition ${
        isOver ? "border-primary/40 bg-primary/5" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full bg-current ${meta.accent}`} />
          <h3 className="text-xs font-semibold uppercase tracking-wide">{meta.label}</h3>
          <Badge variant="outline" className="border-border/60 text-[10px]">
            {tasks.length}
          </Badge>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 space-y-2 px-2 pb-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <SortableTask key={t.id} task={t} members={members} onOpen={() => onOpenTask(t.id)} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-[11px] text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTask({
  task,
  members,
  onOpen,
}: {
  task: BoardTask;
  members: WorkspaceProject["members"];
  onOpen: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-40" : ""}
    >
      <TaskCard task={task} members={members} />
    </div>
  );
}
