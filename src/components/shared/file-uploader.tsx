import { useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Archive,
  File as FileIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatBytes, uploadsService, type StoredFile } from "@/services";

type UploadStatus = "pending" | "uploading" | "done" | "error";

type UploadItem = {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  stored?: StoredFile;
  error?: string;
};

function iconFor(mime: string) {
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("video/")) return Film;
  if (mime.includes("zip") || mime.includes("compressed")) return Archive;
  if (
    mime.includes("pdf") ||
    mime.includes("word") ||
    mime.includes("presentation") ||
    mime.includes("document")
  )
    return FileText;
  return FileIcon;
}

/**
 * Drag-and-drop uploader. Mock-backed today via `uploadsService.upload`,
 * ready to swap to Supabase Storage / S3 without touching this component.
 */
export function FileUploader({
  scope = "attachments",
  accept,
  multiple = true,
  maxSizeMb = 100,
  onUploaded,
  className,
}: {
  scope?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  onUploaded?: (file: StoredFile) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const rejected = arr.filter((f) => f.size > maxSizeMb * 1024 * 1024);
      if (rejected.length) {
        toast.error(`${rejected.length} file(s) exceed the ${maxSizeMb}MB limit`);
      }
      const accepted = arr.filter((f) => f.size <= maxSizeMb * 1024 * 1024);
      const newItems: UploadItem[] = accepted.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        status: "pending",
        progress: 0,
      }));
      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => {
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "uploading" } : x)));
        uploadsService
          .upload(
            item.file,
            (pct) => {
              setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: pct } : x)));
            },
            scope,
          )
          .then((stored) => {
            setItems((prev) =>
              prev.map((x) =>
                x.id === item.id ? { ...x, status: "done", stored, progress: 100 } : x,
              ),
            );
            onUploaded?.(stored);
          })
          .catch((err: Error) => {
            setItems((prev) =>
              prev.map((x) =>
                x.id === item.id ? { ...x, status: "error", error: err.message } : x,
              ),
            );
            toast.error(`Failed to upload ${item.file.name}`);
          });
      });
    },
    [maxSizeMb, onUploaded, scope],
  );

  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border/60 bg-surface/30 hover:border-primary/40 hover:bg-primary/5",
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        aria-label="Upload files"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Upload className="h-6 w-6" />
        </div>
        <div className="mt-3 text-sm font-semibold">Drop files here, or click to browse</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {accept ? `Accepts ${accept}` : "PDF, DOCX, PPTX, images, video, ZIP"} · up to {maxSizeMb}{" "}
          MB
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon = iconFor(item.file.type);
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-3 py-2"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background/60 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium">{item.file.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatBytes(item.file.size)}
                    </span>
                  </div>
                  {item.status === "uploading" && (
                    <Progress value={item.progress} className="mt-1.5 h-1" />
                  )}
                  {item.status === "error" && (
                    <div className="mt-1 text-[10px] text-destructive">{item.error}</div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {item.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {item.status === "done" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => remove(item.id)}
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
