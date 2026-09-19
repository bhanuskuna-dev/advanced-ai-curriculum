import { ChatPanel } from "@/components/ChatPanel";
import { CURRICULUM } from "@/lib/curriculum";

export const metadata = {
  title: "AI Tutor — Advanced AI Curriculum",
  description: "Ask open-ended questions across the whole curriculum.",
};

export default function TutorPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">AI Tutor</h1>
      <p className="text-slate-500 leading-relaxed mb-6">
        Ask anything about {CURRICULUM.map((m) => m.title).join(", ")} — this isn&apos;t scoped to a single lesson,
        so feel free to jump between topics or ask how ideas from different modules connect.
      </p>
      <ChatPanel
        title="Curriculum tutor"
        placeholder="Ask a question about anything in the curriculum…"
        openingMessage="What would you like to understand better? I can explain a concept, compare approaches, or point you to the lesson that covers it in depth."
      />
    </main>
  );
}
