## Objective

Wrap a real external system as a tool an agent can call — either as a hand-rolled tool or as an MCP server (build one, or connect to an existing one) — and connect it to a small agent that uses it to answer real questions or perform a real task.

Good candidate ideas:
- Wrap a public API (GitHub, a weather service, a search API) as an MCP server, then connect an agent to it and compare the integration effort against writing the same tool by hand.
- Build a `check_governance_status`-style read-only tool against a mock internal dataset (even a JSON file standing in for a real system), scoped narrowly and schema-validated.
- Wrap a side-effecting operation (creating a record in a mock database, sending a notification to a test endpoint) with proper idempotency protection.

## Milestones

1. **Design the schema first, in writing**, before implementing the tool function: name, description (including what it explicitly does *not* do), and a fully-typed `input_schema` with `required` fields and enums wherever the input space is enumerable.
2. **Implement the tool function** with real input validation — don't trust the schema alone to guarantee sane arguments.
3. **Handle at least one realistic failure mode**: a rate limit, a timeout, or a not-found case, returned as a structured `tool_result` with `is_error: true` rather than an unhandled exception.
4. **If your tool has a side effect**, add idempotency protection and demonstrate that calling it twice with the same key doesn't duplicate the effect.
5. **Connect it to an agent** and test with at least 3 questions that require the agent to decide, on its own, whether and how to call your tool.

## Stretch goals

- Build the same capability twice — once as a hand-rolled tool, once as an MCP server — and write a short comparison of the integration effort and reusability tradeoff.
- Add a second tool with a different (narrower or broader) permission scope, and explain in writing why you drew the boundary where you did.

## What "done" looks like

You can point to your tool's schema and describe, in a sentence, why each required field is required and why the description draws the boundary it does — and you have a transcript showing the agent handling your simulated failure case without crashing the loop.

Bring your schema, your failure-handling code, and a transcript to the project mentor chat for a review of whether your tool boundaries and error handling would hold up in a real integration.
