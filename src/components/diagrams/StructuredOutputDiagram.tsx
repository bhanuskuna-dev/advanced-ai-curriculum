import { ArrowDown, XCircle, CheckCircle2 } from "lucide-react";
import { DiagramCard } from "./DiagramCard";

export function StructuredOutputDiagram() {
  return (
    <DiagramCard caption="Both approaches usually work — only one of them guarantees it.">
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 text-center w-full">
            &quot;Please respond in JSON&quot;
          </div>
          <ArrowDown className="w-4 h-4 text-slate-300" />
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 text-center w-full font-mono">
            free-text output
          </div>
          <ArrowDown className="w-4 h-4 text-slate-300" />
          <div className="bg-danger-50 border border-danger-200 rounded-xl px-3 py-2.5 text-xs text-danger-700 text-center w-full flex items-center justify-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            can fail to parse
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-xs text-brand-700 text-center w-full">
            tool schema / structured output
          </div>
          <ArrowDown className="w-4 h-4 text-slate-300" />
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-xs text-brand-700 text-center w-full font-mono">
            schema-validated JSON
          </div>
          <ArrowDown className="w-4 h-4 text-slate-300" />
          <div className="bg-success-50 border border-success-200 rounded-xl px-3 py-2.5 text-xs text-success-700 text-center w-full flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            guaranteed to parse
          </div>
        </div>
      </div>
    </DiagramCard>
  );
}
