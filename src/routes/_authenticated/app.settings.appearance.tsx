import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Moon, Sun, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/settings/appearance")({
  head: () => ({
    meta: [{ title: "Appearance — Settings" }, { name: "robots", content: "noindex" }],
  }),
  component: AppearanceSettings,
});

const ACCENTS = [
  { id: "violet", label: "Violet", swatch: "#7c3aed" },
  { id: "blue", label: "Blue", swatch: "#3b82f6" },
  { id: "emerald", label: "Emerald", swatch: "#10b981" },
  { id: "rose", label: "Rose", swatch: "#f43f5e" },
  { id: "amber", label: "Amber", swatch: "#f59e0b" },
];

const DENSITIES = [
  { id: "comfortable", label: "Comfortable" },
  { id: "cozy", label: "Cozy" },
  { id: "compact", label: "Compact" },
];

function AppearanceSettings() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState("violet");
  const [density, setDensity] = useState("cozy");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Theme</h2>
        <p className="text-xs text-muted-foreground">System auto-syncs with your device.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { id: "dark", label: "Dark", icon: Moon },
            { id: "light", label: "Light", icon: Sun },
            { id: "system", label: "System", icon: Monitor },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as typeof theme)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition",
                theme === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 hover:border-primary/40",
              )}
            >
              <span className="flex items-center gap-2">
                <t.icon className="h-4 w-4" /> {t.label}
              </span>
              {theme === t.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Accent color</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition",
                accent === a.id
                  ? "border-primary bg-primary/10"
                  : "border-border/60 hover:border-primary/40",
              )}
              aria-label={`Set accent to ${a.label}`}
            >
              <span
                className="h-4 w-4 rounded-full ring-2 ring-background"
                style={{ background: a.swatch }}
              />
              {a.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">Density</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {DENSITIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDensity(d.id)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm transition",
                density === d.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 hover:border-primary/40",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
        <Label className="mt-4 block text-[11px] text-muted-foreground">
          Density controls table row height and list padding across the app.
        </Label>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Appearance saved")}>Save preferences</Button>
      </div>
    </div>
  );
}
