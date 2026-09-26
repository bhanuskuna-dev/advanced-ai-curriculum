export function DiagramCard({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-4 sm:px-6 py-6 mb-6">
      <div className="w-full overflow-x-auto">{children}</div>
      <p className="text-xs text-slate-400 text-center mt-3">{caption}</p>
    </div>
  );
}

export function ArrowMarker({ id, className = "fill-slate-300" }: { id: string; className?: string }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" className={className} />
    </marker>
  );
}
