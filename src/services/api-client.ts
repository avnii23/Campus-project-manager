/**
 * API base URL. Reads from VITE_API_BASE_URL when connecting to a real
 * backend (Express + Prisma + Postgres). When unset, `mockDelay()` +
 * imports from `@/lib/mock/*` back every service call, so the UI works
 * offline and every screen already talks to the service layer.
 *
 * To switch to a real backend:
 * 1. Set VITE_API_BASE_URL in `.env`.
 * 2. Replace each service function's mock branch with a `request(...)` call.
 * 3. Nothing in the UI or hooks needs to change.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const USE_MOCKS = !API_BASE_URL;

export function mockDelay(min = 120, max = 320): Promise<void> {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((r) => setTimeout(r, ms));
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Thin fetch wrapper. Backend swap-in point. */
export async function request<T>(
  path: string,
  init: RequestInit & { as?: "json" | "text" } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, res.statusText, body);
  }
  if (init.as === "text") return (await res.text()) as unknown as T;
  return (await res.json()) as T;
}
