import { useState } from "react";
import { Mail, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ROLE_OPTIONS, useProjectsStore } from "@/stores/projects-store";
import type { MemberRole, WorkspaceProject } from "@/lib/mock/workspace";

export function TeamView({ project }: { project: WorkspaceProject }) {
  const removeMember = useProjectsStore((s) => s.removeMember);
  const updateMemberRole = useProjectsStore((s) => s.updateMemberRole);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-surface/40 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-base font-semibold">Team members</h2>
          <p className="text-xs text-muted-foreground">
            {project.members.length} people · {project.members.filter((m) => m.online).length}{" "}
            online
          </p>
        </div>
        <InviteDialog projectId={project.id} />
      </section>

      <section className="overflow-hidden rounded-3xl border border-border/60 bg-surface/40">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Member</th>
              <th className="hidden px-3 py-3 md:table-cell">Role</th>
              <th className="hidden px-3 py-3 md:table-cell">Contribution</th>
              <th className="hidden px-3 py-3 lg:table-cell">Tasks</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {project.members.map((m) => (
              <tr key={m.id} className="transition hover:bg-background/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold">
                        {m.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                      </div>
                      {m.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-success" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-3 md:table-cell">
                  <Select
                    value={m.role}
                    onValueChange={(v) => {
                      updateMemberRole(project.id, m.id, v as MemberRole);
                      toast(`Role updated for ${m.name.split(" ")[0]}`);
                    }}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="hidden w-56 px-3 py-3 md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={m.contribution} className="h-1.5 flex-1" />
                    <span className="w-8 text-right text-[11px] font-medium">
                      {m.contribution}%
                    </span>
                  </div>
                </td>
                <td className="hidden px-3 py-3 lg:table-cell">
                  <Badge variant="outline" className="border-border/60 text-[10px]">
                    {m.tasksDone}/{m.tasksAssigned}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      removeMember(project.id, m.id);
                      toast.success(`${m.name.split(" ")[0]} removed`);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {project.members.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No members yet. Invite someone to get started.
          </div>
        )}
      </section>
    </div>
  );
}

function InviteDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("Developer");
  const addMember = useProjectsStore((s) => s.addMember);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground shadow-glow">
          <UserPlus className="mr-1.5 h-4 w-4" /> Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Invite a teammate</DialogTitle>
          <DialogDescription>
            They'll get an email with a magic link to join this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Full name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@campus.edu"
                className="pl-9"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={() => {
              if (!name.trim() || !email.trim()) {
                toast.error("Name and email are required");
                return;
              }
              addMember(projectId, { name: name.trim(), email: email.trim(), role });
              toast.success(`Invited ${name}`);
              setOpen(false);
              setName("");
              setEmail("");
            }}
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
