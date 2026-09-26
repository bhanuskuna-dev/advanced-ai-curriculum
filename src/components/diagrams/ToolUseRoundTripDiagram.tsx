import { DiagramCard } from "./DiagramCard";
import clsx from "@/lib/clsx";

interface Row {
  index: number;
  role: "user" | "assistant";
  label: string;
  content: string;
  synthetic?: boolean;
}

const ROWS: Row[] = [
  { index: 0, role: "user", label: "user", content: "“What’s the weather in Austin?”" },
  { index: 1, role: "assistant", label: "assistant", content: "tool_use → get_weather({ city: “Austin” })" },
  { index: 2, role: "user", label: "user", content: "tool_result → { temp: 72 }", synthetic: true },
  { index: 3, role: "assistant", label: "assistant", content: "“It’s 72°F in Austin.”" },
];

export function ToolUseRoundTripDiagram() {
  return (
    <DiagramCard caption="The messages[] array for one tool-use round trip — note the tool_result is packaged as a user turn.">
      <div className="max-w-md mx-auto space-y-2.5">
        {ROWS.map((row) => (
          <div key={row.index} className={clsx("flex items-start gap-2", row.role === "assistant" ? "flex-row-reverse" : "")}>
            <div className="w-16 shrink-0 text-[10px] font-mono text-slate-300 pt-2 text-center">[{row.index}]</div>
            <div
              className={clsx(
                "flex-1 rounded-xl px-3.5 py-2 text-xs font-mono leading-relaxed",
                row.role === "assistant" ? "bg-brand-50 text-brand-800" : row.synthetic ? "bg-slate-100 text-slate-500 border border-dashed border-slate-300" : "bg-slate-50 text-slate-700"
              )}
            >
              <div className="text-[10px] uppercase tracking-wide font-sans font-semibold opacity-60 mb-0.5">
                {row.label}
                {row.synthetic && " (tool result, not human text)"}
              </div>
              {row.content}
            </div>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}
