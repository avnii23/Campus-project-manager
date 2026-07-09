import { mockDelay, USE_MOCKS, request } from "./api-client";

export type StoredFile = {
  id: string;
  name: string;
  sizeBytes: number;
  mime: string;
  url: string;
  uploadedAt: string;
};

/**
 * Upload facade. Today: mock progress via setInterval and returns a blob URL.
 * Swap to Supabase Storage or S3 by replacing `upload()` — the UI never changes.
 */
export const uploadsService = {
  async upload(
    file: File,
    onProgress?: (pct: number) => void,
    scope: string = "attachments",
  ): Promise<StoredFile> {
    if (USE_MOCKS) {
      return new Promise((resolve) => {
        let pct = 0;
        const t = setInterval(() => {
          pct = Math.min(100, pct + 8 + Math.random() * 14);
          onProgress?.(Math.round(pct));
          if (pct >= 100) {
            clearInterval(t);
            resolve({
              id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: file.name,
              sizeBytes: file.size,
              mime: file.type || "application/octet-stream",
              url: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString(),
            });
          }
        }, 120);
      });
    }
    const form = new FormData();
    form.append("file", file);
    form.append("scope", scope);
    return request<StoredFile>("/api/uploads", {
      method: "POST",
      body: form as unknown as BodyInit,
      headers: {},
    });
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCKS) {
      await mockDelay();
      return;
    }
    await request(`/api/uploads/${id}`, { method: "DELETE" });
  },
};

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
