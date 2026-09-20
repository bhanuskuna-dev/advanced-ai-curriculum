"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { MockExam } from "@/content/exams";
import { PASS_SCORE, MAX_SCORE, scaledScore, domainBreakdown } from "@/content/exams";
import { getModule } from "@/lib/curriculum";
import { useExamProgress } from "@/hooks/useExamProgress";
import clsx from "@/lib/clsx";

export function ExamRunner({ exam }: { exam: MockExam }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { saveResult } = useExamProgress();

  const total = exam.questions.length;
  const answeredCount = Object.keys(answers).length;
  const current = exam.questions[index];

  const result = useMemo(() => {
    if (!submitted) return null;
    const correct = exam.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    return { correct, total, score: scaledScore(correct, total), breakdown: domainBreakdown(exam, answers) };
  }, [submitted, exam, answers, total]);

  function selectAnswer(optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function handleSubmit() {
    const correct = exam.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = scaledScore(correct, total);
    setSubmitted(true);
    saveResult({
      examId: exam.id,
      score,
      correct,
      total,
      passed: score >= PASS_SCORE,
      completedAt: new Date().toISOString(),
    });
    setIndex(0);
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    setIndex(0);
  }

  if (submitted && result) {
    const passed = result.score >= PASS_SCORE;
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/practice-exams" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          All practice exams
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 sm:px-8 py-8 mb-6 text-center">
          <div className={clsx("text-5xl font-extrabold tracking-tight mb-2", passed ? "text-success-600" : "text-danger-600")}>
            {result.score}
            <span className="text-xl text-slate-300">/{MAX_SCORE}</span>
          </div>
          <div className={clsx("inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full mb-3", passed ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700")}>
            {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {passed ? `Pass (${PASS_SCORE}+ required)` : `Below pass line (${PASS_SCORE}+ required)`}
          </div>
          <p className="text-sm text-slate-500">
            {result.correct} of {result.total} correct
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 sm:px-8 py-6 mb-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Domain breakdown</h2>
          <div className="space-y-3">
            {result.breakdown.map(({ domain, correct, total: domainTotal }) => {
              const mod = getModule(domain);
              const pct = Math.round((correct / domainTotal) * 100);
              return (
                <div key={domain}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{mod?.title ?? domain}</span>
                    <span className="text-slate-400 tabular-nums">
                      {correct}/{domainTotal} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={clsx("h-full rounded-full", pct >= 70 ? "bg-success-500" : "bg-danger-400")} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={retake}
          className="w-full mb-8 inline-flex items-center justify-center gap-2 bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow px-4 py-3 text-sm font-semibold text-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          Retake this exam
        </button>

        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Answer review</h2>
        <div className="space-y-4">
          {exam.questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const wasCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-card px-5 py-4">
                <div className="flex items-start gap-2 mb-2">
                  {wasCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-slate-800">
                    {i + 1}. {q.question}
                  </p>
                </div>
                <div className="ml-6 space-y-1 mb-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={clsx(
                        "text-sm px-3 py-1.5 rounded-lg",
                        oi === q.correctIndex
                          ? "bg-success-50 text-success-800 font-medium"
                          : oi === userAnswer
                            ? "bg-danger-50 text-danger-700"
                            : "text-slate-500"
                      )}
                    >
                      {opt}
                      {oi === q.correctIndex && <span className="ml-2 text-xs">(correct)</span>}
                      {oi === userAnswer && oi !== q.correctIndex && <span className="ml-2 text-xs">(your answer)</span>}
                    </div>
                  ))}
                </div>
                <p className="ml-6 text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <Link href="/practice-exams" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit exam
        </Link>
        <span className="text-xs font-semibold text-slate-400 tabular-nums">
          Question {index + 1} / {total} · {answeredCount} answered
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-6">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 sm:px-8 py-8 mb-6">
        <p className="text-base font-semibold text-slate-900 leading-relaxed mb-6">{current.question}</p>
        <div className="space-y-2.5">
          {current.options.map((opt, oi) => {
            const selected = answers[current.id] === oi;
            return (
              <button
                key={oi}
                onClick={() => selectAnswer(oi)}
                className={clsx(
                  "w-full text-left text-sm px-4 py-3 rounded-xl border transition-colors",
                  selected ? "border-brand-400 bg-brand-50 text-brand-800 font-medium" : "border-slate-200 hover:border-slate-300 text-slate-700"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 disabled:opacity-30 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {index < total - 1 ? (
          <button
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < total}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 transition-colors"
          >
            Submit exam
          </button>
        )}
      </div>
      {index === total - 1 && answeredCount < total && (
        <p className="text-center text-xs text-slate-400 mt-3">Answer all {total} questions to submit.</p>
      )}
    </main>
  );
}
