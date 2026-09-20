"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "aac:exam-results";

export interface ExamResult {
  examId: string;
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

function readResults(): Record<string, ExamResult> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useExamProgress() {
  const [results, setResults] = useState<Record<string, ExamResult>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResults(readResults());
    setHydrated(true);
  }, []);

  const saveResult = useCallback((result: ExamResult) => {
    setResults((prev) => {
      const existing = prev[result.examId];
      // Keep the best attempt, not just the most recent one.
      const next = {
        ...prev,
        [result.examId]: existing && existing.score >= result.score ? existing : result,
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — result just won't persist
      }
      return next;
    });
  }, []);

  const getResult = useCallback((examId: string) => results[examId], [results]);

  return { hydrated, results, saveResult, getResult };
}
