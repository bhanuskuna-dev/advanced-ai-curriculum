## Why use more than one agent

A single agent with a big system prompt and many tools can start to struggle for a specific reason: its context window fills with the details of every sub-task, and its instructions have to cover every situation at once, which makes the prompt harder to get right and the model's attention more diluted. Splitting work across multiple agents — each with a narrower job, its own context, and its own focused instructions — trades orchestration complexity for per-agent simplicity. It's a real tradeoff, not a strict upgrade: more agents means more coordination code, more latency (multiple round trips), and more places for something to go subtly wrong.

Reach for multi-agent patterns when a single agent's context or instructions are genuinely straining under the task's breadth — not by default.

## Orchestrator / worker

One agent (the orchestrator) breaks a task into sub-tasks and dispatches each to a worker agent (or a worker call using a different, often cheaper, model). The orchestrator sees only the workers' outputs, not their internal reasoning or intermediate tool calls — keeping its own context small and focused on integration, not execution detail.

```
Orchestrator (Sonnet)
  ├─ dispatch → Worker A (Haiku): "extract every date mentioned in this doc"
  ├─ dispatch → Worker B (Haiku): "extract every dollar amount"
  └─ synthesize A + B into a final structured answer
```

This is the same shape as the code-review or research-delegation patterns in agentic coding tools: a coordinating agent hands bounded, well-specified sub-tasks to workers and integrates their results, rather than doing everything itself in one enormous context.

It's also the real shape of a sub-agents-and-skills system built to automate a requirements lifecycle: an orchestrator agent breaks "turn this discovery conversation into a shipped feature spec" into discrete worker tasks — one skill drafts the feature definition, another generates test scenarios, another checks the output against documentation standards — and the orchestrator only sees each worker's finished output, not the reasoning that produced it. That's what made the 25% efficiency gain possible: narrow, focused sub-agents doing one job well, coordinated by something that only had to worry about integration.

## Pipeline

Fixed sequence, each agent's output feeding the next's input — draft → critique → revise, or extract → categorize → summarize. Unlike orchestrator/worker, there's no dynamic dispatch decision; the sequence is hard-coded because the *order* of operations doesn't depend on intermediate results, only their content does. This is often the simplest multi-agent pattern to reason about and debug, because each stage has one clear input and output contract.

## Debate / verification

Two agents take adversarial roles — one proposes an answer, another is instructed specifically to find flaws in it — before a final answer is produced (either by the second agent or a third judge). This pattern earns its cost on high-stakes outputs where a single pass is prone to a specific class of error (overconfident claims, unverified numbers) and the cost of a second full pass is worth it to catch that class of error before it reaches a user.

A model-governance platform overseeing hundreds of production AI/ML models is a legitimate place for this pattern: one agent drafts a risk assessment for a newly onboarded credit-underwriting model, a second agent is instructed specifically to check that draft against the relevant policy language (does it actually address every applicable control?) before a human reviewer ever sees it. The second agent's whole job is to be skeptical of the first — worth the extra pass precisely because a missed control on a production credit model is a much more expensive mistake than the cost of a second LLM call.

## The coordination tax

Every pattern above pays a real cost:

- **Latency stacks.** Sequential agent calls add up — three sequential Sonnet calls at ~2s each is 6s minimum, before considering tool use inside any of them.
- **Context handoff is lossy by design.** A worker agent doesn't see the orchestrator's full reasoning, and the orchestrator doesn't see a worker's intermediate tool calls — only its final output. If a worker's answer is wrong because of something in its process, the orchestrator can't see why; it can only see that the output looks off. Design worker outputs to be self-explanatory (include brief reasoning, not just a bare answer) so failures are debuggable one level up.
- **Cost multiplies, not adds.** N agent calls isn't N times the cost of one — it's N times a call that itself might include several tool-use round trips. This is where model tiering (next lesson) earns its keep: cheap, fast models for narrow worker tasks; the more expensive reasoning model reserved for the orchestrator or the final synthesis step.

## A decision rule

Before reaching for multiple agents, ask: *can a single agent with better tool design or a clearer prompt do this in one context?* For the requirements-automation system, the answer to that question was genuinely no — discovery, feature definition, and scenario documentation each need meaningfully different context and produce artifacts a single sprawling prompt would blur together. For a simpler internal tool, though, the same question might well come back "yes" — and building three coordinated agents for a job one well-designed agent could do is complexity spent for no return. Multi-agent architectures are justified when sub-tasks are genuinely independent (parallelizable, so the latency cost buys you something), when they need meaningfully different instructions or models (a narrow extraction task suits a cheap model; the final synthesis needs a stronger one), or when a single context would otherwise become unmanageably large. If none of those apply, a single well-designed agent is almost always the better engineering choice — it's easier to build, debug, and reason about failures in.
