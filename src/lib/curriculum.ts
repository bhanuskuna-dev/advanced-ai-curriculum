export interface Lesson {
  slug: string;
  title: string;
  summary: string;
}

export interface Project {
  title: string;
  summary: string;
}

export interface Module {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  project: Project;
}

export const CURRICULUM: Module[] = [
  {
    slug: "agents",
    title: "Building with the Claude API & Agent SDK",
    description:
      "How Claude actually works under the hood as a product surface: the Messages API, tool use, the agentic loop, MCP, multi-agent orchestration, and the cost/latency levers that separate a toy demo from a production agent.",
    lessons: [
      {
        slug: "messages-api-fundamentals",
        title: "Messages API Fundamentals",
        summary: "Requests, system prompts, message roles, streaming, and token usage — the substrate everything else is built on.",
      },
      {
        slug: "tool-use-loop",
        title: "Tool Use & the Tool-Use Loop",
        summary: "Defining tools, the tool_use / tool_result round trip, parallel tool calls, and common failure modes.",
      },
      {
        slug: "agentic-loop-and-memory",
        title: "The Agentic Loop & Context Management",
        summary: "How single tool calls become multi-step agents, and how to manage context so long-running agents don't degrade.",
      },
      {
        slug: "mcp-model-context-protocol",
        title: "MCP: The Model Context Protocol",
        summary: "What MCP actually standardizes, when it beats hand-rolled tools, and how servers/clients fit together.",
      },
      {
        slug: "multi-agent-orchestration",
        title: "Multi-Agent Orchestration Patterns",
        summary: "Orchestrator/worker, pipelines, and debate patterns — and when a second agent is worth the complexity.",
      },
      {
        slug: "prompt-caching-and-cost",
        title: "Prompt Caching, Cost & Latency",
        summary: "The economics of agents in production: prompt caching, batching, model tiering, and where money actually goes.",
      },
    ],
    project: {
      title: "Build a Tool-Using Agent",
      summary:
        "Build a small Claude-powered agent with 2–3 real tools that solves an end-to-end task, complete with a proper tool-use loop and error handling.",
    },
  },
  {
    slug: "rag",
    title: "RAG & Retrieval",
    description:
      "Why retrieval exists, how embeddings and vector search actually work, and how to build (and improve) a retrieval-augmented generation pipeline.",
    lessons: [
      {
        slug: "why-retrieval",
        title: "Why Retrieval Exists",
        summary: "Context window limits, grounding, hallucination reduction, and freshness — the four problems RAG solves.",
      },
      {
        slug: "embeddings-and-similarity",
        title: "Embeddings & Similarity Search",
        summary: "What an embedding actually is, how cosine similarity works, and why 'semantic search' is just nearest-neighbor lookup.",
      },
      {
        slug: "vector-databases-and-chunking",
        title: "Vector Databases & Chunking Strategy",
        summary: "Chunk size tradeoffs, overlap, metadata filtering, and how vector indexes (HNSW, IVF) make search fast at scale.",
      },
      {
        slug: "building-a-rag-pipeline",
        title: "Building a Retrieve → Augment → Generate Pipeline",
        summary: "Wiring the three stages together end-to-end, including prompt construction and citation formatting.",
      },
      {
        slug: "advanced-rag-patterns",
        title: "Advanced RAG Patterns",
        summary: "Re-ranking, hybrid search, query rewriting, and why naive top-k retrieval breaks down in practice.",
      },
    ],
    project: {
      title: "Build a RAG-Powered Q&A App",
      summary:
        "Build a small app that answers questions over a handful of your own documents, with retrieval, grounded generation, and visible citations.",
    },
  },
  {
    slug: "evals",
    title: "Evals, Safety & Quality",
    description:
      "How to make AI quality measurable instead of vibes-based: golden datasets, metrics, calibration, failure modes, and responsible-use judgment.",
    lessons: [
      {
        slug: "why-evals-matter",
        title: "Why Evals Matter",
        summary: "AI regressions are silent by default. Evals are how you find out before your users do.",
      },
      {
        slug: "building-a-golden-dataset",
        title: "Building a Golden Dataset",
        summary: "Labeling philosophy, why edge cases matter more than easy cases, and how to keep a dataset useful over time.",
      },
      {
        slug: "metrics-precision-recall-calibration",
        title: "Metrics: Accuracy, Precision/Recall & Calibration",
        summary: "Reading a confusion matrix, per-class recall, and why a well-calibrated confidence score is a feature, not a nicety.",
      },
      {
        slug: "failure-modes-and-mitigations",
        title: "Failure Modes & Mitigations",
        summary: "Hallucination, prompt injection, and overconfidence — how each actually happens and what to do about it.",
      },
      {
        slug: "responsible-use-and-safety",
        title: "Responsible Use & Safety Judgment",
        summary: "The judgment calls an advanced AI user has to make that no eval score will make for you.",
      },
    ],
    project: {
      title: "Build an Eval Harness",
      summary:
        "Build a small eval harness for one of your own prompts or agents: a labeled dataset, a scoring script, and a regression gate.",
    },
  },
];

export function getModule(moduleSlug: string): Module | undefined {
  return CURRICULUM.find((m) => m.slug === moduleSlug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return getModule(moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);
}

export function getAdjacentLessons(moduleSlug: string, lessonSlug: string) {
  const mod = getModule(moduleSlug);
  if (!mod) return { prev: undefined, next: undefined };
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: idx > 0 ? mod.lessons[idx - 1] : undefined,
    next: idx >= 0 && idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : undefined,
  };
}

export function progressId(moduleSlug: string, itemSlug: string): string {
  return `${moduleSlug}:${itemSlug}`;
}

export function allProgressIds(): string[] {
  return CURRICULUM.flatMap((m) => [
    ...m.lessons.map((l) => progressId(m.slug, l.slug)),
    progressId(m.slug, "project"),
  ]);
}
