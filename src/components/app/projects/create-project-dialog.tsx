import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectsStore } from "@/stores/projects-store";
import type { ReactNode } from "react";

const schema = z.object({
  name: z.string().min(3, "Name is too short").max(80),
  code: z.string().min(2, "Course code required").max(20),
  subject: z.string().min(2, "Subject required"),
  semester: z.string().min(2, "Semester required"),
  guide: z.string().min(2, "Guide required"),
  dueDate: z.string().min(1, "Deadline required"),
  description: z.string().min(10, "Give a short description"),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const createProject = useProjectsStore((s) => s.createProject);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      subject: "",
      semester: "Semester 6",
      guide: "",
      dueDate: new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10),
      description: "",
      tags: "",
    },
  });

  function onSubmit(values: FormValues) {
    const p = createProject({
      name: values.name,
      code: values.code,
      subject: values.subject,
      semester: values.semester,
      guide: values.guide,
      dueDate: new Date(values.dueDate).toISOString(),
      description: values.description,
      tags: (values.tags ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    toast.success(`Created ${p.name}`);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Create a new project</DialogTitle>
          <DialogDescription>
            Set up the basics — you can invite the team and add tasks in a minute.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" placeholder="Autonomous Drone Delivery" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="code">Course code</Label>
              <Input id="code" placeholder="CS-491" {...form.register("code")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Capstone" {...form.register("subject")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" placeholder="Semester 8" {...form.register("semester")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="guide">Faculty guide</Label>
              <Input id="guide" placeholder="Dr. Ramesh Kumar" {...form.register("guide")} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dueDate">Deadline</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="What are you building and why?"
              {...form.register("description")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="AI/ML, Robotics" {...form.register("tags")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
