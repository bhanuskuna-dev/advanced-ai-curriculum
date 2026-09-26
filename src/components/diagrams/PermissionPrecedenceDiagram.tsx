import { ArrowDown, Ban, HelpCircle, CheckCircle2 } from "lucide-react";
import { DiagramCard } from "./DiagramCard";

const TIERS = [
  { label: "deny", desc: "Blocked outright — wins no matter what else matches", icon: Ban, className: "bg-danger-50 border-danger-200 text-danger-700" },
  { label: "ask", desc: "Confirmation required, if nothing denied it", icon: HelpCircle, className: "bg-amber-50 border-amber-200 text-amber-700" },
  { label: "allow", desc: "Runs freely, only if nothing above matched", icon: CheckCircle2, className: "bg-success-50 border-success-200 text-success-700" },
];

export function PermissionPrecedenceDiagram() {
  return (
    <DiagramCard caption="Rules from every settings scope combine, then resolve in this fixed order — a broad allow can never override a specific deny.">
      <div className="max-w-sm mx-auto space-y-1">
        {TIERS.map((tier, i) => (
          <div key={tier.label}>
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${tier.className}`}>
              <tier.icon className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wide">{tier.label}</div>
                <div className="text-xs opacity-80">{tier.desc}</div>
              </div>
            </div>
            {i < TIERS.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}
