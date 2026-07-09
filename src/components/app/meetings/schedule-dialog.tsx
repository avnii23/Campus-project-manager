import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMeetingsStore } from "@/stores/meetings-store";
import { useProjectsStore } from "@/stores/projects-store";
import type { Meeting } from "@/lib/mock/meetings";

const schema = z.object({
  projectId: z.string().min(1, "Select a project"),
  title: z.string().min(3, "Add a meeting title"),
  description: z.string(),
  provider: z.enum(["campus-live", "google-meet", "zoom", "in-person"]),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  durationMin: z.coerce.number().min(10).max(240),
});

type FormValues = z.infer<typeof schema>;

export function ScheduleMeetingDialog({
  defaultProjectId,
  trigger,
}: {
  defaultProjectId?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const allProjects = useProjectsStore((s) => s.projects);
  const projects = useMemo(() => allProjects.filter((p) => !p.archived), [allProjects]);
  const schedule = useMeetingsStore((s) => s.schedule);

  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: defaultProjectId ?? projects[0]?.id ?? "",
      title: "",
      description: "",
      provider: "campus-live",
      date: defaultDate,
      time: "14:00",
      durationMin: 30,
    },
  });

  const [agenda, setAgenda] = useState<{ title: string; minutes: number }[]>([
    { title: "Progress update", minutes: 10 },
    { title: "Blockers & risks", minutes: 10 },
    { title: "Next commitments", minutes: 10 },
  ]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const projectId = form.watch("projectId");
  const currentProject = projects.find((p) => p.id === projectId);

  const suggestAgenda = () => {
    setAgenda([
      { title: "Wins from last week", minutes: 5 },
      { title: "Milestone progress review", minutes: 15 },
      { title: "Risks & blockers", minutes: 5 },
      { title: "Decisions & next steps", minutes: 5 },
    ]);
    toast.success("AI drafted a 30-minute agenda");
  };

  const onSubmit = (values: FormValues) => {
    if (!currentProject) return;
    const startsAt = new Date(`${values.date}T${values.time}:00`).toISOString();
    const participants = currentProject.members
      .filter((m) => selectedIds.has(m.id) || selectedIds.size === 0)
      .map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: (m.role === "Leader" ? "host" : "member") as Meeting["participants"][number]["role"],
      }));

    schedule({
      projectId: currentProject.id,
      projectName: currentProject.name,
      title: values.title,
      description: values.description,
      provider: values.provider,
      startsAt,
      durationMin: values.durationMin,
      participants,
      agenda,
      hostId: participants.find((p) => p.role === "host")?.id ?? participants[0]?.id ?? "",
    });

    toast.success("Meeting scheduled", {
      description: `${values.title} on ${new Date(startsAt).toLocaleString()}`,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gradient-primary text-primary-foreground">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Schedule a meeting</DialogTitle>
          <DialogDescription>
            Invite your team and set the agenda. AI will summarise it afterwards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Project</Label>
              <Select
                value={form.watch("projectId")}
                onValueChange={(v) => form.setValue("projectId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Provider</Label>
              <Select
                value={form.watch("provider")}
                onValueChange={(v) => form.setValue("provider", v as FormValues["provider"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus-live">CampusLive (built-in)</SelectItem>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Title</Label>
            <Input placeholder="Weekly sync — sprint 4" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              rows={2}
              placeholder="What are we aligning on?"
              {...form.register("description")}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-1.5">
              <Label>Date</Label>
              <Input type="date" {...form.register("date")} />
            </div>
            <div className="grid gap-1.5">
              <Label>Time</Label>
              <Input type="time" {...form.register("time")} />
            </div>
            <div className="grid gap-1.5">
              <Label>Duration (min)</Label>
              <Input type="number" min={10} max={240} step={5} {...form.register("durationMin")} />
            </div>
          </div>

          {currentProject && (
            <div className="grid gap-2">
              <Label className="flex items-center justify-between">
                <span>Participants</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {selectedIds.size === 0 ? "All team members" : `${selectedIds.size} selected`}
                </span>
              </Label>
              <div className="scrollbar-none flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border/60 bg-background/40 p-2">
                {currentProject.members.map((m) => {
                  const active = selectedIds.has(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(m.id)) next.delete(m.id);
                          else next.add(m.id);
                          return next;
                        });
                      }}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                        active
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Checkbox checked={active} className="pointer-events-none h-3 w-3" />
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label className="flex items-center justify-between">
              <span>Agenda</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={suggestAgenda}
                className="h-6 text-xs"
              >
                <Sparkles className="mr-1 h-3 w-3 text-primary" /> AI suggest
              </Button>
            </Label>
            <div className="grid gap-1.5">
              {agenda.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={a.title}
                    onChange={(e) =>
                      setAgenda(
                        agenda.map((x, j) => (i === j ? { ...x, title: e.target.value } : x)),
                      )
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={1}
                    className="w-20"
                    value={a.minutes}
                    onChange={(e) =>
                      setAgenda(
                        agenda.map((x, j) =>
                          i === j ? { ...x, minutes: Number(e.target.value) } : x,
                        ),
                      )
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setAgenda(agenda.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAgenda([...agenda, { title: "", minutes: 5 }])}
                className="h-8 border-dashed border-border/60"
              >
                <Plus className="mr-1 h-3 w-3" /> Add agenda item
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Schedule meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
