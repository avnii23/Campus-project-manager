import { useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  File as FileIcon,
  FileCode2,
  FileImage,
  FileText,
  Folder,
  GitCommit,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeFromNow } from "@/lib/mock/data";
import type { RepoFile, WorkspaceProject } from "@/lib/mock/workspace";

function iconFor(kind?: RepoFile["kind"]) {
  if (kind === "image") return FileImage;
  if (kind === "code") return FileCode2;
  if (kind === "md" || kind === "doc" || kind === "pdf") return FileText;
  return FileIcon;
}

export function RepositoryView({ project }: { project: WorkspaceProject }) {
  const [path, setPath] = useState<string>(""); // current folder path
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo(() => {
    const prefix = path ? `${path}/` : "";
    const items = project.files.filter((f) => {
      if (!f.path.startsWith(prefix)) return false;
      const remainder = f.path.slice(prefix.length);
      return remainder.length > 0 && !remainder.includes("/");
    });
    return [...items].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.path.localeCompare(b.path);
    });
  }, [project.files, path]);

  const crumbs = path ? path.split("/") : [];
  const selected = selectedId ? project.files.find((f) => f.id === selectedId) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <section className="rounded-3xl border border-border/60 bg-surface/40">
          <header className="flex flex-col gap-3 border-b border-border/60 p-4 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap items-center gap-1 text-xs">
              <button
                onClick={() => setPath("")}
                className="rounded px-1.5 py-0.5 font-mono hover:bg-surface-2"
              >
                {project.code.toLowerCase().replace("-", "_")}
              </button>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <button
                    onClick={() => setPath(crumbs.slice(0, i + 1).join("/"))}
                    className="rounded px-1.5 py-0.5 font-mono hover:bg-surface-2"
                  >
                    {c}
                  </button>
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    toast.success(`Uploaded ${f.name} (mock)`);
                    e.target.value = "";
                  }
                }}
              />
              <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
              </Button>
              <Button size="sm" variant="outline">
                <Folder className="mr-1.5 h-3.5 w-3.5" /> New folder
              </Button>
            </div>
          </header>

          <ul className="divide-y divide-border/60">
            {entries.length === 0 && (
              <li className="p-10 text-center text-sm text-muted-foreground">
                This folder is empty.
              </li>
            )}
            {entries.map((f) => {
              const name = f.path.split("/").pop()!;
              const Icon = f.type === "folder" ? Folder : iconFor(f.kind);
              return (
                <li
                  key={f.id}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-surface/40"
                  onClick={() => {
                    if (f.type === "folder") setPath(f.path);
                    else setSelectedId(f.id);
                  }}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      f.type === "folder" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="min-w-0 flex-1 truncate">{name}</span>
                  <span className="hidden text-[11px] text-muted-foreground md:inline">
                    {f.updatedBy}
                  </span>
                  <span className="w-24 truncate text-right text-[11px] text-muted-foreground">
                    {timeFromNow(f.updatedAt)}
                  </span>
                  {f.type === "file" && (
                    <span className="hidden w-14 text-right text-[11px] text-muted-foreground md:inline">
                      {f.sizeKb} KB
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {selected && selected.type === "file" && (
          <section className="rounded-3xl border border-border/60 bg-surface/40">
            <header className="flex items-center justify-between border-b border-border/60 p-4">
              <div>
                <h3 className="font-mono text-sm">{selected.path}</h3>
                <p className="text-[11px] text-muted-foreground">
                  {selected.sizeKb} KB · updated {timeFromNow(selected.updatedAt)} by{" "}
                  {selected.updatedBy}
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              </Button>
            </header>
            <div className="p-4">
              {selected.kind === "image" ? (
                <div className="grid h-64 place-items-center rounded-xl border border-dashed border-border/60 bg-background/40 text-xs text-muted-foreground">
                  Image preview (mock)
                </div>
              ) : selected.preview ? (
                <pre className="max-h-80 overflow-auto rounded-xl bg-background/60 p-4 text-xs">
                  {selected.preview}
                </pre>
              ) : (
                <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
                  Preview not available. Download to view.
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-4">
        <section className="rounded-3xl border border-border/60 bg-surface/40 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <GitCommit className="h-4 w-4" /> Recent activity
          </h3>
          <ScrollArea className="mt-3 h-[420px] pr-2">
            <ol className="space-y-3">
              {project.commits.map((c) => (
                <li key={c.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <p className="line-clamp-2 text-xs font-medium">{c.message}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{c.authorName.split(" ")[0]}</span>
                    <span>{timeFromNow(c.at)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <Badge variant="outline" className="border-border/60">
                      {c.filesChanged} files
                    </Badge>
                    <span className="text-success">+{c.additions}</span>
                    <span className="text-destructive">-{c.deletions}</span>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollArea>
        </section>
      </aside>
    </div>
  );
}
