## Objective

Take an agent you've already built (from an earlier module's project, or a new small one) and harden it for reliability: retries, structured-output validation with repair, and graceful degradation under failure.

## Milestones

1. **Add retry logic with backoff** for transient failures (simulate a rate-limit or timeout condition if you can't trigger a real one) — confirm retries happen for 429/5xx-style failures and not for a genuinely malformed request.
2. **Add a repair loop for structured output**: deliberately feed your agent an input likely to produce a validation failure, catch it, and send the failure back to the model for a corrected attempt rather than surfacing a raw error.
3. **Add idempotency protection** to at least one side-effecting tool (or simulate one), and demonstrate that calling it twice with the same key doesn't duplicate the effect.
4. **Define and implement a degraded mode**: what does your system do when its primary path is unavailable? Even a simple "temporarily unavailable, here's what I know" fallback counts — the point is that it's defined and tested, not left as an unhandled crash.
5. **Audit your error handling for silent failures**: find every place an error is caught, and confirm none of them are silently swallowed into a default value that looks like a valid result.

## Stretch goals

- Add structured logging of every tool call, result, and retry attempt, and use it to reconstruct a failure end to end.
- Measure and report how often your repair loop actually succeeds on a small adversarial test set, versus how often it fails twice and needs to surface an error.

## What "done" looks like

You can deliberately trigger each of the failure modes above (a transient error, a malformed output, a duplicate side-effect attempt) and show — not just claim — that your system handles each one the way you designed it to, rather than crashing or silently producing a wrong result.

Bring your failure-handling code and a transcript of at least one deliberately-triggered failure to the project mentor chat — it's a good place to check whether a "handled" failure is actually handled correctly, or just handled quietly.
