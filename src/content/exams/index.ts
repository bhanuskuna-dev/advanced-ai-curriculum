import type { ExamQuestion, MockExam } from "./types";
import { AGENTIC_ARCHITECTURE_EXAM_1, AGENTIC_ARCHITECTURE_EXAM_2, AGENTIC_ARCHITECTURE_EXAM_3 } from "./questions/agentic-architecture";
import { TOOL_DESIGN_MCP_EXAM_1, TOOL_DESIGN_MCP_EXAM_2, TOOL_DESIGN_MCP_EXAM_3 } from "./questions/tool-design-mcp";
import { CLAUDE_CODE_WORKFLOWS_EXAM_1, CLAUDE_CODE_WORKFLOWS_EXAM_2, CLAUDE_CODE_WORKFLOWS_EXAM_3 } from "./questions/claude-code-workflows";
import { PROMPT_ENGINEERING_EXAM_1, PROMPT_ENGINEERING_EXAM_2, PROMPT_ENGINEERING_EXAM_3 } from "./questions/prompt-engineering";
import { CONTEXT_RELIABILITY_EXAM_1, CONTEXT_RELIABILITY_EXAM_2, CONTEXT_RELIABILITY_EXAM_3 } from "./questions/context-reliability";

export type { ExamQuestion, MockExam };
export { PASS_SCORE, MAX_SCORE, scaledScore, domainBreakdown } from "./types";

/** Interleaves question sets round-robin so an exam isn't blocked into one domain at a time. */
function interleave(sets: ExamQuestion[][]): ExamQuestion[] {
  const result: ExamQuestion[] = [];
  const maxLen = Math.max(...sets.map((s) => s.length));
  for (let i = 0; i < maxLen; i++) {
    for (const set of sets) {
      if (set[i]) result.push(set[i]);
    }
  }
  return result;
}

export const EXAMS: MockExam[] = [
  {
    id: "exam-1",
    title: "Practice Exam 1",
    description: "60 scenario-based questions, domain-weighted to match the real Claude Certified Architect – Foundations exam.",
    questions: interleave([
      AGENTIC_ARCHITECTURE_EXAM_1,
      TOOL_DESIGN_MCP_EXAM_1,
      CLAUDE_CODE_WORKFLOWS_EXAM_1,
      PROMPT_ENGINEERING_EXAM_1,
      CONTEXT_RELIABILITY_EXAM_1,
    ]),
  },
  {
    id: "exam-2",
    title: "Practice Exam 2",
    description: "A second, fully distinct 60-question set covering the same 5 domains — use it to check whether you've generalized or just memorized exam 1.",
    questions: interleave([
      AGENTIC_ARCHITECTURE_EXAM_2,
      TOOL_DESIGN_MCP_EXAM_2,
      CLAUDE_CODE_WORKFLOWS_EXAM_2,
      PROMPT_ENGINEERING_EXAM_2,
      CONTEXT_RELIABILITY_EXAM_2,
    ]),
  },
  {
    id: "exam-3",
    title: "Practice Exam 3",
    description: "A third distinct 60-question set — take this one last, closest to when you plan to sit the real exam.",
    questions: interleave([
      AGENTIC_ARCHITECTURE_EXAM_3,
      TOOL_DESIGN_MCP_EXAM_3,
      CLAUDE_CODE_WORKFLOWS_EXAM_3,
      PROMPT_ENGINEERING_EXAM_3,
      CONTEXT_RELIABILITY_EXAM_3,
    ]),
  },
];

export function getExam(examId: string): MockExam | undefined {
  return EXAMS.find((e) => e.id === examId);
}
