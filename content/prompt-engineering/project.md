## Objective

Build a small tool that extracts structured, schema-validated data from messy, realistic unstructured text — and prove it's reliable with a test set that includes genuinely tricky inputs, not just clean ones.

Good candidate ideas:
- Extract structured fields (vendor, amount, due date, line items) from varied invoice or receipt text.
- Extract structured requirements (actor, action, expected outcome) from raw discovery notes or stakeholder emails.
- Extract a structured risk classification (category, severity, rationale) from free-text incident or governance-review descriptions.

## Milestones

1. **Design the output schema first.** Decide exactly what fields you need, which are required vs. optional, and what should happen when the input doesn't actually contain extractable data (see "Structured Output & Schemas" for the negative-case design).
2. **Implement extraction using a schema-guaranteed mechanism** — a tool-based approach with `strict: true`, or native structured outputs — not a plain-text "respond in JSON" instruction.
3. **Write a system prompt** that separates persistent extraction rules from the per-request text, following the system-prompt/user-turn split.
4. **Build a test set of at least 10 inputs**, deliberately including: a clean, easy case; an input missing some of the target fields; an input with no extractable data at all; and at least one adversarial or oddly-formatted input that might trip up a naive extractor.
5. **Run your test set and check both dimensions**: does every output validate against the schema (structural correctness), and are the extracted values actually right (semantic correctness)? These are different checks — confirm you're doing both, not just the first.

## Stretch goals

- Add a confidence signal to your schema, and manually assess whether it's well-calibrated on your test set (does high confidence actually mean fewer errors?).
- Compare a chain-of-thought version of your extraction prompt (ask the model to reason before extracting) against a direct version on your hardest test cases, and note whether it actually helped.
- Keep a short written log of at least two prompt iterations you tried, what changed, and what your test set showed.

## What "done" looks like

You have a working extractor, a test set that includes real edge cases (not just easy ones), and you can say specifically — not just "it works" — which of your test cases it handles well and which it still gets wrong.

Bring your schema, your test set, and at least one case it gets wrong to the project mentor chat — it's a good place to figure out whether a wrong extraction is a schema problem, a prompt problem, or a genuinely hard case worth accepting as a known limitation.
