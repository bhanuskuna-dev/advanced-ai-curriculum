"use client";

import { useState } from "react";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import clsx from "@/lib/clsx";

export interface QuickCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function QuickCheck({ questions }: { questions: QuickCheckQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 py-6 mt-8">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-5">
        <Brain className="w-4 h-4 text-brand-600" />
        Quick check
      </div>
      <div className="space-y-6">
        {questions.map((q, qi) => {
          const selected = answers[qi];
          const showResult = selected !== undefined;
          return (
            <div key={qi}>
              <p className="text-sm font-medium text-slate-800 mb-2.5">{q.question}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = oi === q.correctIndex;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                      disabled={showResult}
                      className={clsx(
                        "w-full text-left text-sm px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5",
                        !showResult && "border-slate-200 hover:border-slate-300 text-slate-700",
                        showResult && isCorrect && "border-success-300 bg-success-50 text-success-800 font-medium",
                        showResult && isSelected && !isCorrect && "border-danger-300 bg-danger-50 text-danger-700",
                        showResult && !isSelected && !isCorrect && "border-slate-100 text-slate-400"
                      )}
                    >
                      {showResult && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {showResult && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{q.explanation}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
