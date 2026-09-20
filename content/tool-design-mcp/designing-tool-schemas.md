## The schema is a contract, not documentation

A tool's `input_schema` isn't a comment describing what the tool accepts — it's the actual constraint the model's output has to satisfy, and it doubles as the clearest signal you can give about what the tool does and doesn't do. Treating schema design as an afterthought after the "real" tool function is written produces tools that get called incorrectly more often, because the model has less to work with when deciding whether and how to call them.

## Narrow beats broad

A tool named `run_query` with a single free-text `sql` parameter is maximally flexible and maximally risky: it gives the model latitude to construct arbitrary queries, which means it can also construct wrong or dangerous ones, and there's no way to review what's allowed short of reviewing every possible query. Compare that to `find_top_savings_opportunities` or `check_governance_status` — a narrow tool with a fixed, well-typed set of inputs. Narrow tools are:

- **Easier for the model to select correctly**, because the description only has to cover one job.
- **Easier to secure**, because the space of possible calls is bounded and reviewable in advance.
- **Easier to test in isolation**, because there's a small, enumerable set of inputs to check.

When a task feels like it needs one flexible do-anything tool, that's usually a sign to decompose it into several narrow ones instead — the same instinct behind splitting a monolithic "handle underwriting" tool into `check_credit_policy`, `flag_adverse_action_trigger`, and `draft_disclosure_language`, each independently reviewable rather than buried inside one opaque function.

## Required fields and enums do real work

Marking a field `required` and constraining a string to an `enum` isn't just schema hygiene — it eliminates entire classes of malformed calls before they happen. A `category` parameter constrained to your actual sixteen categories can't come back with a typo'd or hallucinated seventeenth one; a free-text string can. Where the valid input space is enumerable, enumerate it in the schema rather than validating it after the fact in your tool function — the schema constraint prevents the bad call from ever forming; post-hoc validation only catches it after the model has already committed to a wrong answer.

## `strict` mode and validated arguments

Where your SDK supports it, a `strict: true` flag on a tool definition (paired with `additionalProperties: false` and a complete `required` list) guarantees the returned `input` validates exactly against your schema — no missing fields, no unexpected ones. This closes a real gap: without it, a model can produce arguments that are syntactically valid JSON but semantically incomplete, and your tool function has to defensively check for that on every call. Strict mode moves that guarantee earlier, into the contract itself.

## Schema versioning is a real operational concern

A tool schema that ships to production and then changes shape — a field renamed, a required field added — can silently break anything that cached the old schema, replayed an old conversation, or hard-coded assumptions about the tool's shape. Treat a breaking schema change the same way you'd treat a breaking API change: version the tool name (`check_governance_status_v2`) or plan a migration window, rather than mutating a live tool's contract out from under callers who haven't updated.

## Descriptions are part of the schema, not separate from it

Everything above governs the *shape* of valid input; the `description` field governs *whether and when* the model reaches for the tool at all. A schema that's technically well-formed but paired with a vague description ("looks up model information") will still get called at the wrong times or missed when it should have been used. Precise, bounded descriptions — including an explicit statement of what the tool does *not* do, when that boundary matters — are as much a part of good tool design as the JSON Schema itself.
