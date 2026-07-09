import { Plus, Sparkles, Calendar, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: Plus, label: "New project", tone: "primary" },
  { icon: Sparkles, label: "AI report", tone: "accent" },
  { icon: Calendar, label: "Schedule meeting", tone: "info" },
  { icon: Upload, label: "Upload file", tone: "muted" },
  { icon: FileText, label: "New task", tone: "muted" },
];

/** Row of frequently-used shortcuts. */
export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((a) => (
        <Button
          key={a.label}
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-border/60 bg-surface/40 hover:bg-surface"
        >
          <a.icon className="mr-1.5 h-3.5 w-3.5" />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
