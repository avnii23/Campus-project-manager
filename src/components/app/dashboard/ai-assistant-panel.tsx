import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suggestions = [
  "Draft this week's status update",
  "Summarize yesterday's meeting notes",
  "Generate a submission checklist",
  "Score contributions per teammate",
];

/** Compact AI assistant panel on the dashboard. */
export function AiAssistantPanel() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface/40 to-transparent p-5">
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <header className="mb-3 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold">AI Assistant</h2>
          <p className="text-[11px] text-muted-foreground">Powered by CampusPM AI</p>
        </div>
      </header>
      <div className="relative space-y-2">
        <ul className="space-y-1.5">
          {suggestions.map((s) => (
            <li key={s}>
              <button className="w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-primary/5">
                {s}
              </button>
            </li>
          ))}
        </ul>
        <form className="mt-3 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Ask anything about your projects…" className="bg-background/60" />
          <Button size="icon" className="shrink-0" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
