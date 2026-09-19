"use client";

import { useCallback, useEffect, useState } from "react";
import { CURRICULUM, allProgressIds, progressId } from "@/lib/curriculum";

const STORAGE_KEY = "aac:progress";

function readStoredIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompleted(readStoredIds());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    setCompleted(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // localStorage unavailable (private mode, blocked storage) — progress just won't persist
    }
  }, []);

  const isComplete = useCallback((moduleSlug: string, itemSlug: string) => completed.has(progressId(moduleSlug, itemSlug)), [completed]);

  const toggleComplete = useCallback(
    (moduleSlug: string, itemSlug: string) => {
      const id = progressId(moduleSlug, itemSlug);
      const next = new Set(completed);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(next);
    },
    [completed, persist]
  );

  const percentForModule = useCallback(
    (moduleSlug: string) => {
      const mod = CURRICULUM.find((m) => m.slug === moduleSlug);
      if (!mod) return 0;
      const ids = [...mod.lessons.map((l) => progressId(mod.slug, l.slug)), progressId(mod.slug, "project")];
      const done = ids.filter((id) => completed.has(id)).length;
      return Math.round((done / ids.length) * 100);
    },
    [completed]
  );

  const overallPercent = useCallback(() => {
    const ids = allProgressIds();
    const done = ids.filter((id) => completed.has(id)).length;
    return Math.round((done / ids.length) * 100);
  }, [completed]);

  return { hydrated, isComplete, toggleComplete, percentForModule, overallPercent };
}
