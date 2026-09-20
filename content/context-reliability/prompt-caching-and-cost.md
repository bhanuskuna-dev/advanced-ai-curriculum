## Where the money actually goes

For any non-trivial agent, the dominant cost isn't the interesting final answer — it's the accumulated input tokens from re-sending conversation history and tool results on every single turn. A 10-turn agentic conversation with growing tool-result context can spend far more on turns 8–10 (re-processing everything that came before) than on the actual new reasoning happening in those turns. Understanding this reframes the optimization target: the highest-leverage cost lever is usually reducing what gets re-sent, not shortening any one response.

## Prompt caching

Anthropic's prompt caching lets you mark a prefix of your request — typically the system prompt, and sometimes a large stable block like a tool-result-heavy history or reference document — as cacheable:

```typescript
system: [
  {
    type: "text",
    text: LONG_SYSTEM_PROMPT,
    cache_control: { type: "ephemeral" },
  },
],
```

On the first request, the marked prefix is processed and cached (a slightly higher cost, called a cache write). On subsequent requests within the cache's lifetime that share the same prefix exactly, Claude reads from the cache instead of reprocessing it (a much lower cost, called a cache hit) — commonly around a 90% reduction on the cached portion's input-token cost. This is why the same system prompt across many requests (a chat session, or many independent calls that share a long, unchanging tool-definition block) benefits enormously, while a system prompt that changes on every single call gets no benefit at all.

The practical rule: **put the parts of your prompt that don't change (persona, instructions, tool definitions, reference documents) before the parts that do (the user's actual message), and mark the stable prefix as cacheable.** Order matters — caching only helps the shared prefix, so anything variable needs to come after the cached block, not interleaved with it.

A model-governance platform reviewing hundreds of models against the same body of SR 11-7 guidance is close to the ideal case for this: the guidance text itself doesn't change between one model's review and the next, so it belongs in the cached prefix, with only the specific model's documentation varying per request. Cache that once, and every subsequent review pays the 90%-reduced rate on the policy text instead of reprocessing the same guidance hundreds of times over.

## Batching

If you have many independent requests that don't need an immediate response — categorizing 500 transactions overnight, generating summaries for a backlog of documents — the Batches API processes them asynchronously at a substantial discount versus the same volume of synchronous calls. The tradeoff is turnaround time (results arrive within a window, not instantly) for cost. This only makes sense for workloads that were never latency-sensitive in the first place; it's the wrong tool for anything a user is waiting on.

## Model tiering

Not every step in an agent needs the same model. A useful default heuristic:

| Task shape | Model tier | Why |
|---|---|---|
| Classification, extraction, simple formatting | Smaller/faster (e.g. Haiku-class) | The task doesn't require deep reasoning; quality plateaus quickly, so a bigger model just costs more for the same output |
| Multi-step planning, synthesis, nuanced judgment calls | Larger/more capable (e.g. Sonnet-class) | The task benefits from stronger reasoning; a smaller model's mistakes here are expensive to have missed |

A common production pattern: run cheap classification across a large volume with a fast model, route only the ambiguous or low-confidence cases to a stronger model or a human, and reserve the most capable (and most expensive) model for the step that actually needs deep reasoning — like a planning or synthesis agent sitting on top of several cheap worker calls. Defaulting everything to the most capable model is the single most common way agent costs balloon without a matching quality improvement.

Picture triaging incoming model-governance submissions: a fast, cheap model can handle the first pass — sorting hundreds of intake submissions by declared risk tier and flagging obviously incomplete documentation — while the expensive model is reserved for the step that actually needs judgment: synthesizing a governance narrative a senior leader will read and act on. Running the expensive model on every intake submission just to sort them by tier would be paying reasoning-model prices for a classification-model job.

## Confidence thresholds as a cost/quality knob

When a model returns a confidence score alongside a classification, that score isn't just informational — it's a lever. Auto-applying above a calibrated threshold and routing below it to human review (or a stronger model) turns "how much do we trust the cheap path" into a tunable parameter you can adjust as you gather more data on where it's actually accurate. This connects directly to the evals module: you can't set this threshold responsibly without measuring whether confidence at a given level actually correlates with correctness.

This is the same tradeoff a $12B+ credit portfolio's decisioning system has to make explicitly: the credit decisioning models themselves run on tightly governed, low-latency infrastructure, while a customer-facing servicing or explanation layer built on an LLM can afford to reason more expansively — because it's operating on a decision that already happened, not making one.

## The measurement habit

None of these levers are worth pulling blind. Track token usage (`usage.input_tokens`, `usage.output_tokens`) and latency per request type, broken down by which step in your pipeline generated them. Without that breakdown, "the agent is expensive" has no obvious next action; with it, you can usually point at one specific step — often an oversized tool result or an uncached repeated system prompt — that accounts for most of the cost.
