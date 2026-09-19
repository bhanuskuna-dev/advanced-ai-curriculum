import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { CURRICULUM, getModule, getLesson } from "@/lib/curriculum";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new Anthropic();

interface ChatContext {
  moduleSlug?: string;
  lessonSlug?: string;
  isProject?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function readContentFile(moduleSlug: string, fileSlug: string): string | undefined {
  try {
    return fs.readFileSync(path.join(process.cwd(), "content", moduleSlug, `${fileSlug}.md`), "utf-8");
  } catch {
    return undefined;
  }
}

function curriculumOutline(): string {
  return CURRICULUM.map(
    (mod) =>
      `### ${mod.title}\n${mod.description}\n` +
      mod.lessons.map((l) => `- ${l.title}: ${l.summary}`).join("\n") +
      `\n- Project — ${mod.project.title}: ${mod.project.summary}`
  ).join("\n\n");
}

function buildSystemPrompt(context?: ChatContext): string {
  const base = `You are the AI tutor for "Advanced AI Curriculum", a self-paced course teaching advanced AI practitioners how to build with the Claude API and Agent SDK, RAG/retrieval systems, and evals/safety practices.

Your job:
1. Answer clearly and precisely, at the level of someone who already knows general programming but is new to these specific AI-engineering topics.
2. Use concrete examples and, where useful, short code snippets.
3. When relevant, point the user to which lesson in the curriculum covers a topic in more depth.
4. If asked to review code or give project feedback, be specific and actionable — name the exact change, not just general advice.
5. Keep answers focused: a few paragraphs or a short list, not an exhaustive essay, unless the user asks for depth.

Full curriculum outline, for your reference:

${curriculumOutline()}`;

  if (!context?.moduleSlug) return base;

  const mod = getModule(context.moduleSlug);
  if (!mod) return base;

  if (context.isProject) {
    const projectContent = readContentFile(context.moduleSlug, "project");
    return `${base}\n\n---\n\nThe user is currently working on the hands-on project for the "${mod.title}" module: "${mod.project.title}". Here is the full project brief they're working from:\n\n${projectContent ?? mod.project.summary}\n\nGround your answers in this brief. Act like a hands-on mentor: ask what they've tried, give hints before full solutions unless they explicitly ask for a solution, and reference specific milestones from the brief.`;
  }

  if (context.lessonSlug) {
    const lesson = getLesson(context.moduleSlug, context.lessonSlug);
    const lessonContent = readContentFile(context.moduleSlug, context.lessonSlug);
    if (lesson && lessonContent) {
      return `${base}\n\n---\n\nThe user is currently reading the lesson "${lesson.title}" in the "${mod.title}" module. Here is the full lesson content:\n\n${lessonContent}\n\nGround your answers in this lesson's content and terminology. It's fine to go beyond it if the user asks a follow-up that isn't covered, but stay consistent with what the lesson already taught.`;
    }
  }

  return `${base}\n\n---\n\nThe user is currently in the "${mod.title}" module.`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY environment variable." },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[]; context?: ChatContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const { messages, context } = body;
  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(context),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = message.content
      .filter((block): block is Anthropic.Messages.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat request failed." },
      { status: 500 }
    );
  }
}
