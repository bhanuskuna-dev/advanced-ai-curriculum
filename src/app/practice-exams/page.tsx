"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, GraduationCap } from "lucide-react";
import { EXAMS, PASS_SCORE, MAX_SCORE } from "@/content/exams";
import { useExamProgress } from "@/hooks/useExamProgress";
import clsx from "@/lib/clsx";

export default function PracticeExamsPage() {
  const { hydrated, getResult } = useExamProgress();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
        <GraduationCap className="w-3.5 h-3.5" />
        Claude Certified Architect – Foundations prep
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Practice Exams</h1>
      <p className="text-slate-500 leading-relaxed mb-8">
        Three distinct 60-question mock exams, each domain-weighted to match the real exam (27% Agentic Architecture,
        18% Tool Design &amp; MCP, 20% Claude Code, 20% Prompt Engineering, 15% Context &amp; Reliability). A scaled
        score of {PASS_SCORE}/{MAX_SCORE} is a pass, same as the real exam. Answers and explanations are revealed
        only after you submit — take it under real conditions.
      </p>

      <div className="space-y-4">
        {EXAMS.map((exam) => {
          const result = hydrated ? getResult(exam.id) : undefined;
          return (
            <Link
              key={exam.id}
              href={`/practice-exams/${exam.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-6"
            >
              <div className="flex-1">
                <div className="font-bold text-slate-900 mb-1">{exam.title}</div>
                <div className="text-sm text-slate-500">{exam.description}</div>
                {result && (
                  <div
                    className={clsx(
                      "inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-2.5 py-1 rounded-full",
                      result.passed ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"
                    )}
                  >
                    {result.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Best score: {result.score}/{MAX_SCORE} ({result.correct}/{result.total} correct) —{" "}
                    {result.passed ? "Pass" : "Below pass line"}
                  </div>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
