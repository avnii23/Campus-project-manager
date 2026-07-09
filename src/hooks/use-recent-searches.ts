import { useEffect, useState } from "react";

/** Persisted recent-search list, backed by localStorage. Backend-ready. */
export function useRecentSearches(limit = 6) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("campuspm.recentSearches");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const push = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setItems((prev) => {
      const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, limit);
      try {
        localStorage.setItem("campuspm.recentSearches", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    try {
      localStorage.removeItem("campuspm.recentSearches");
    } catch {
      /* ignore */
    }
  };

  return { items, push, clear };
}
