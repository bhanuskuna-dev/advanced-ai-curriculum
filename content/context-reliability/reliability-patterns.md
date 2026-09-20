## Production systems fail in ways demos don't

A prompt that works reliably in testing will still, at real volume, occasionally hit a rate limit, a transient network error, a malformed structured-output response, or an overloaded model endpoint. Reliability engineering for an LLM-powered system means designing for these cases explicitly, before they show up in production as a confusing one-off bug report — not patching them in after the first incident.

## Retries with backoff for transient failures

Rate limits (429) and server errors (5xx) are typically transient — retrying after a short delay often succeeds. Most official SDKs retry these automatically by default (commonly 2 retries, covering 408/409/429/5xx and connection errors), which covers the simplest case. For anything beyond the default, exponential backoff — doubling the delay between attempts, with a cap — avoids hammering an already-struggling endpoint with immediate retries that make the underlying problem worse. What should *not* be retried automatically: 400-class errors from a malformed request, which will fail identically every time and need a code fix, not a retry.

## Repairing malformed structured output

Even with schema-constrained tool use or structured outputs (see the Prompt Engineering module), a model can occasionally produce output that fails validation under unusual or adversarial input. A production-grade pattern: catch the validation failure, and — rather than surfacing a raw error to the user — send the malformed output back to the model in a follow-up turn with a clear description of what validation failed and a request to correct it. This "ask it to fix its own mistake" repair loop resolves a large share of structured-output failures without a human ever seeing them, at the cost of one extra round trip.

## Fallback models and graceful degradation

For latency- or availability-sensitive paths, a fallback strategy — routing to a different model, or to a simpler non-agentic path, when the primary path fails or times out — keeps a system partially functional instead of fully down. The design question worth asking explicitly: if the primary agentic path is unavailable, is there a degraded-but-functional path (a simpler rule-based answer, a cached previous result, an honest "temporarily unavailable" message), or does the entire feature go dark? A system with no degraded mode fails completely the moment its one path fails; a system with even a minimal fallback fails partially.

## Idempotency for retried side effects

When a retry follows a side-effecting action (a tool call that writes data, sends a message, or charges a payment) whose success is uncertain — did the timeout happen before or after the write completed? — retrying blindly risks duplicating the effect. Side-effecting tools should be designed to be idempotent (setting an absolute state rather than incrementing) or to accept an idempotency key that lets a retried call be recognized and safely ignored if it already succeeded. This is the same concern raised in tool design for external systems, and it applies with particular force to retry logic specifically, since retries are exactly the situation where a duplicate call becomes likely.

## Never let a silent failure look like a success

The single worst reliability failure mode: an error that gets caught, logged nowhere useful, and replaced with an empty or default value that a downstream consumer treats as a valid result. A tool call that fails should propagate as a visible, structured error — either back to the model as `is_error: true`, or up to a human-visible log — never silently swallowed into something that looks like it succeeded. This connects directly to the failure-mode discipline elsewhere in this curriculum: fluent, confident-looking output and *actually correct* output are not the same property, and a silently-defaulted failure produces exactly that gap.

## A minimal reliability checklist

1. Transient errors (429, 5xx) retry with backoff; 400-class errors don't.
2. Malformed structured output gets a repair-loop retry before surfacing as a failure.
3. Side-effecting tools are idempotent or key-protected against retries.
4. There's a defined degraded mode, not just a happy path and a crash.
5. Every failure is visible somewhere — never caught and silently discarded.
