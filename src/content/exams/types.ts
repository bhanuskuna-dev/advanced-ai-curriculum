import type { Module } from "@/lib/curriculum";

export interface ExamQuestion {
  id: string;
  /** Module slug this question belongs to. */
  domain: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  description: string;
  questions: ExamQuestion[];
}

export const PASS_SCORE = 720;
export const MAX_SCORE = 1000;

export function scaledScore(correct: number, total: number): number {
  return Math.round((correct / total) * MAX_SCORE);
}

export function domainBreakdown(
  exam: MockExam,
  answers: Record<string, number>
): { domain: string; correct: number; total: number }[] {
  const byDomain = new Map<string, { correct: number; total: number }>();
  for (const q of exam.questions) {
    const entry = byDomain.get(q.domain) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answers[q.id] === q.correctIndex) entry.correct += 1;
    byDomain.set(q.domain, entry);
  }
  return [...byDomain.entries()].map(([domain, v]) => ({ domain, ...v }));
}

export type DomainWeights = Record<Module["slug"], number>;
