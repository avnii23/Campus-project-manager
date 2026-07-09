import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  FolderKanban,
  Calendar,
  ListTodo,
  FileText,
  File as FileIcon,
  Users,
  Sparkles,
  Settings,
  History,
  ArrowRight,
  Presentation,
  ClipboardCheck,
  BarChart3,
  Briefcase,
  GraduationCap,
  Loader2,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/queries";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import type { SearchKind } from "@/services";

const KIND_ICON: Record<SearchKind, React.ComponentType<{ className?: string }>> = {
  project: FolderKanban,
  task: ListTodo,
  meeting: Calendar,
  file: FileIcon,
  report: FileText,
  member: Users,
};

const KIND_LABEL: Record<SearchKind, string> = {
  project: "Projects",
  task: "Tasks",
  meeting: "Meetings",
  file: "Files",
  report: "Reports",
  member: "Team members",
};

const QUICK_NAV = [
  { label: "Dashboard", icon: BarChart3, href: "/app" },
  { label: "Projects", icon: FolderKanban, href: "/app/projects" },
  { label: "Meetings", icon: Calendar, href: "/app/meetings" },
  { label: "AI Studio", icon: Sparkles, href: "/app/ai" },
  { label: "AI Presentation", icon: Presentation, href: "/app/ppt" },
  { label: "AI Report", icon: FileText, href: "/app/report" },
  { label: "Viva Assistant", icon: GraduationCap, href: "/app/viva" },
  { label: "Submission Checklist", icon: ClipboardCheck, href: "/app/submission" },
  { label: "Insights", icon: BarChart3, href: "/app/insights" },
  { label: "Portfolio", icon: Briefcase, href: "/app/portfolio" },
  { label: "Settings", icon: Settings, href: "/app/settings" },
];

/** ⌘K global search: navigate, jump to entities, and revisit recents. */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: hits, isFetching } = useSearch(query);
  const { items: recents, push: pushRecent, clear: clearRecents } = useRecentSearches();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (href: string) => {
    if (query.trim()) pushRecent(query);
    onOpenChange(false);
    navigate({ to: href });
  };

  const grouped = (hits ?? []).reduce<Record<SearchKind, NonNullable<typeof hits>>>(
    (acc, h) => {
      const bucket = acc[h.kind] ?? (acc[h.kind] = []);
      bucket.push(h);
      return acc;
    },
    {} as Record<SearchKind, NonNullable<typeof hits>>,
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="relative">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search projects, tasks, meetings, files, reports, people…"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <CommandList>
        <CommandEmpty>
          {query
            ? "No results — try a different keyword."
            : "Type to search across your workspace."}
        </CommandEmpty>

        {!query && recents.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recents.map((r) => (
                <CommandItem key={r} onSelect={() => setQuery(r)}>
                  <History className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{r}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </CommandItem>
              ))}
              <CommandItem onSelect={clearRecents} className="text-muted-foreground">
                Clear recent searches
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {(Object.keys(grouped) as SearchKind[]).map((kind) => (
          <CommandGroup key={kind} heading={KIND_LABEL[kind]}>
            {grouped[kind]?.map((h) => {
              const Icon = KIND_ICON[h.kind];
              return (
                <CommandItem key={`${h.kind}-${h.id}`} onSelect={() => go(h.href)}>
                  <Icon className="mr-2 h-4 w-4 text-primary" />
                  <span className="flex-1 truncate">{h.title}</span>
                  {h.subtitle && (
                    <span className="ml-2 text-[10px] text-muted-foreground">{h.subtitle}</span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}

        {!query && (
          <CommandGroup heading="Navigate">
            {QUICK_NAV.map((n) => (
              <CommandItem key={n.href} onSelect={() => go(n.href)}>
                <n.icon className="mr-2 h-4 w-4" />
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
