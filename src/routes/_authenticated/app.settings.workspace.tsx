import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/app/settings/workspace")({
  head: () => ({
    meta: [{ title: "Workspace — Settings" }, { name: "robots", content: "noindex" }],
  }),
  component: WorkspaceSettings,
});

const SEED_MEMBERS = [
  { id: "u1", name: "Ada Lovelace", email: "ada@campus.edu", role: "Owner" },
  { id: "u2", name: "Alan Turing", email: "alan@campus.edu", role: "Admin" },
  { id: "u3", name: "Grace Hopper", email: "grace@campus.edu", role: "Member" },
  { id: "u5", name: "Marie Curie", email: "marie@campus.edu", role: "Member" },
];

const ROLE_TONE: Record<string, string> = {
  Owner: "bg-primary/20 text-primary border-primary/30",
  Admin: "bg-info/20 text-info border-info/30",
  Member: "bg-muted text-muted-foreground border-border",
};

function WorkspaceSettings() {
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [workspace, setWorkspace] = useState("Team Aurora");

  const invite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, name: email.split("@")[0], email, role },
    ]);
    setEmail("");
    toast.success(`Invitation sent to ${email}`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Workspace</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Team name</Label>
            <Input
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value="team-aurora" disabled className="mt-1" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Invite members</h2>
        <p className="text-xs text-muted-foreground">
          Members join with their email and the role you assign.
        </p>
        <form onSubmit={invite} className="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_150px_auto]">
          <Input
            placeholder="teammate@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <Plus className="mr-1.5 h-4 w-4" /> Invite
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Members</h2>
          <span className="text-xs text-muted-foreground">{members.length} people</span>
        </div>
        <ul className="mt-4 divide-y divide-border/40">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/15 text-xs text-primary">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.name}</div>
                <div className="truncate text-xs text-muted-foreground">{m.email}</div>
              </div>
              <Badge variant="outline" className={ROLE_TONE[m.role] ?? ROLE_TONE.Member}>
                {m.role}
              </Badge>
              <Button size="icon" variant="ghost" aria-label="Member options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
