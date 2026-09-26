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
  /** Exam weight, as a percent of the Claude Certified Architect – Foundations exam this domain covers. */
  weight: number;
  description: string;
  lessons: Lesson[];
  project: Project;
}

export const CURRICULUM: Module[] = [
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering & Structured Output",
    weight: 20,
    description:
      "Writing prompts that reliably produce the behavior and format you want, from plain instructions through structured, schema-validated output. Start here — every later module builds on talking to Claude well.",
    lessons: [
      {
        slug: "prompt-engineering-fundamentals",
        title: "Prompt Engineering Fundamentals",
        summary: "Clear instructions, context, and examples — the levers that move output quality the most.",
      },
      {
        slug: "system-prompts-and-roles",
        title: "System Prompts & Role Design",
        summary: "Separating persistent behavior from the task at hand, and designing a persona that holds up under pressure.",
      },
      {
        slug: "chain-of-thought-prompting",
        title: "Chain-of-Thought & Reasoning Prompts",
        summary: "When asking a model to reason step by step actually helps, and when it's just added cost.",
      },
      {
        slug: "structured-output-and-schemas",
        title: "Structured Output & Schemas",
        summary: "Getting reliable, parseable output: schema-constrained generation, tool-based extraction, and validation.",
      },
      {
        slug: "iterating-and-testing-prompts",
        title: "Iterating & Testing Prompts",
        summary: "Treating a prompt as a versioned artifact you test changes against, not a one-time draft.",
      },
    ],
    project: {
      title: "Build a Structured-Output Extraction Tool",
      summary:
        "Build a small tool that extracts structured, schema-validated data from messy unstructured text, with a test set of tricky inputs.",
    },
  },
  {
    slug: "context-reliability",
    title: "Context Management & Reliability",
    weight: 15,
    description:
      "Token and context-window mechanics, prompt caching, and the reliability patterns that keep an agent working under real-world failure conditions — the substrate everything you build next runs on.",
    lessons: [
      {
        slug: "context-window-fundamentals",
        title: "Context Window & Token Fundamentals",
        summary: "The stateless Messages API, token usage, and why conversation length is a cost and quality variable.",
      },
      {
        slug: "managing-long-running-context",
        title: "Managing Long-Running Context",
        summary: "Summarizing, pruning, and minimizing tool payloads so long agent runs don't degrade.",
      },
      {
        slug: "prompt-caching-and-cost",
        title: "Prompt Caching, Cost & Latency",
        summary: "The economics of agents in production: prompt caching, batching, model tiering, and where money actually goes.",
      },
      {
        slug: "reliability-patterns",
        title: "Reliability Patterns: Retries & Fallbacks",
        summary: "Handling malformed output, rate limits, and transient failures without silently corrupting results.",
      },
    ],
    project: {
      title: "Harden an Agent for Reliability",
      summary:
        "Take an existing agent and add retries, structured-output validation with repair, and graceful degradation under rate limits.",
    },
  },
  {
    slug: "tool-design-mcp",
    title: "Tool Design & MCP Integration",
    weight: 18,
    description:
      "Defining reliable tools, the tool-use round trip, and when to reach for the Model Context Protocol instead of hand-rolled integrations — the next capability once you can prompt well.",
    lessons: [
      {
        slug: "tool-use-loop",
        title: "Tool Use & the Tool-Use Loop",
        summary: "Defining tools, the tool_use / tool_result round trip, parallel tool calls, and common failure modes.",
      },
      {
        slug: "designing-tool-schemas",
        title: "Designing Tool Schemas",
        summary: "Narrow vs. broad tools, JSON Schema design decisions, and schemas as a security boundary.",
      },
      {
        slug: "mcp-model-context-protocol",
        title: "MCP: The Model Context Protocol",
        summary: "What MCP actually standardizes, when it beats hand-rolled tools, and how servers/clients fit together.",
      },
      {
        slug: "integrating-external-systems",
        title: "Integrating External Systems Safely",
        summary: "Auth, rate limits, and idempotency for tools that have real side effects on real systems.",
      },
    ],
    project: {
      title: "Build an MCP-Integrated Tool",
      summary:
        "Wrap a real external system as an MCP server (or a hand-rolled tool, compared against MCP) and connect it to an agent.",
    },
  },
  {
    slug: "agentic-architecture",
    title: "Agentic Architecture & Orchestration",
    weight: 27,
    description:
      "Agent design patterns, the agentic loop, multi-agent orchestration, and the production system architecture around them — composing the tools from the last module into something that acts on its own. The largest single domain on the Claude Certified Architect exam.",
    lessons: [
      {
        slug: "agent-design-fundamentals",
        title: "Agent Design Fundamentals",
        summary: "What makes something an agent instead of a pipeline or a chatbot, and when the extra complexity actually earns its keep.",
      },
      {
        slug: "the-agentic-loop",
        title: "The Agentic Loop & Stopping Conditions",
        summary: "The tool-use loop that underlies every agent, iteration caps, and forcing a clean final answer.",
      },
      {
        slug: "multi-agent-orchestration",
        title: "Multi-Agent Orchestration Patterns",
        summary: "Orchestrator/worker, pipelines, and debate patterns — and when a second agent is worth the complexity.",
      },
      {
        slug: "production-agent-architecture",
        title: "Production Agent System Architecture",
        summary: "How an agent fits into a real system: trust boundaries, privacy architecture, state, and deployment concerns.",
      },
      {
        slug: "observability-and-debugging",
        title: "Observability & Debugging Agents",
        summary: "Why agent transcripts are your primary debugging tool, and what to log to make failures diagnosable.",
      },
    ],
    project: {
      title: "Build a Tool-Using Agent",
      summary:
        "Build a small Claude-powered agent with 2–3 real tools that solves an end-to-end task, complete with a proper tool-use loop and error handling.",
    },
  },
  {
    slug: "claude-code-workflows",
    title: "Claude Code Configuration & Workflows",
    weight: 20,
    description:
      "Configuring and automating Claude Code itself: CLAUDE.md, settings and permissions, hooks, subagents, and running it headlessly in CI — the capstone module, applying everything from prompting through agents to a real, complete agentic tool.",
    lessons: [
      {
        slug: "what-is-claude-code",
        title: "What Claude Code Is",
        summary: "How Claude Code differs from raw API usage and from the Claude Agent SDK, and its core capabilities.",
      },
      {
        slug: "claude-md-and-settings",
        title: "CLAUDE.md & settings.json",
        summary: "Project memory, permission rules, and configuration scope — project, user, and local settings.",
      },
      {
        slug: "hooks-and-automation",
        title: "Hooks & Workflow Automation",
        summary: "Intercepting tool calls and lifecycle events to enforce policy and automate checks.",
      },
      {
        slug: "slash-commands-and-subagents",
        title: "Slash Commands & Subagents",
        summary: "Packaging repeatable workflows as commands, and delegating focused work to subagents.",
      },
      {
        slug: "headless-and-ci-workflows",
        title: "Headless Mode & CI Workflows",
        summary: "Running Claude Code non-interactively for scripting, automation, and continuous integration.",
      },
    ],
    project: {
      title: "Configure a Claude Code Workflow",
      summary:
        "Set up a real project with a CLAUDE.md, scoped permissions, at least one hook, and a headless automation script.",
    },
  },
];

export function getModule(moduleSlug: string): Module | undefined {
  return CURRICULUM.find((m) => m.slug === moduleSlug);
}

/** 1-indexed position of a module in the recommended learning sequence. */
export function getModuleNumber(moduleSlug: string): number {
  return CURRICULUM.findIndex((m) => m.slug === moduleSlug) + 1;
}

/** The next module in the recommended sequence, or undefined if this is the last one. */
export function getNextModule(moduleSlug: string): Module | undefined {
  const idx = CURRICULUM.findIndex((m) => m.slug === moduleSlug);
  return idx >= 0 && idx < CURRICULUM.length - 1 ? CURRICULUM[idx + 1] : undefined;
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
