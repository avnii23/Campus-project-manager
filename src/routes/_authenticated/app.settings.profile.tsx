import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/app/settings/profile")({
  head: () => ({ meta: [{ title: "Profile — Settings" }, { name: "robots", content: "noindex" }] }),
  component: ProfileSettings,
});

function ProfileSettings() {
  const { data } = useCurrentUser();
  const [name, setName] = useState(data?.profile?.full_name ?? "");
  const [bio, setBio] = useState("Final year CSE student · AI/ML · captain of Team Aurora.");
  const [college, setCollege] = useState("CampusPM University");
  const [department, setDepartment] = useState("Computer Science & Engineering");

  const initials = (name || data?.user?.email || "?")
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Profile saved");
      }}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Public profile</h2>
        <p className="text-xs text-muted-foreground">Shown across your workspace and portfolio.</p>
        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-lg font-semibold text-primary">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground hover:text-foreground"
              aria-label="Change avatar"
              onClick={() => toast.info("Avatar upload coming soon")}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold">{name || "Your name"}</div>
            <div className="text-xs text-muted-foreground">{data?.user?.email}</div>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={data?.user?.email ?? ""} disabled className="mt-1" />
          </div>
          <div>
            <Label>College</Label>
            <Input value={college} onChange={(e) => setCollege(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
      </section>
      <div className="flex justify-end">
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
