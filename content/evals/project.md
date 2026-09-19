## Objective

Build a small eval harness for a prompt or agent you already have — ideally the tool-using agent or RAG pipeline you built in the earlier modules' projects, but any prompt-based feature works. The goal is a repeatable, scorable process, not a one-off manual check.

## Milestones

1. **Build a golden dataset of at least 15–20 examples** covering your feature's real behavior space, deliberately weighted toward edge cases (see "Building a Golden Dataset"). Each example needs an input, a correct/expected output, and a one-sentence rationale for why that's correct.
2. **Write a scoring script** that runs every example through your actual system and compares the output to the expected one. For exact-match tasks (classification), this is a simple equality check. For open-ended generation, define a concrete, checkable proxy for correctness (does the output contain a required fact? does a cited source actually support the claim? does a required field parse correctly?) rather than eyeballing each result.
3. **Report per-category or per-case-type breakdown**, not just an aggregate score — confirm your report would actually catch a regression localized to one category, not just an overall drop.
4. **Set explicit acceptance criteria** in writing before you make any further changes: e.g., "overall score must not regress more than X," "no case-type's score may drop below Y."
5. **Deliberately introduce a regression** (change your prompt in a way you suspect will help one thing and might hurt another) and confirm your eval harness actually catches it. If it doesn't, your dataset or scoring is missing something — go back and fix that before trusting the harness on anything else.

## Stretch goals

- If your feature returns a confidence score, plot a calibration chart (accuracy per confidence bucket) and use it to justify a specific auto-apply threshold.
- Track cost and latency per eval run alongside accuracy, and report all three together.
- Wire the eval script into a place you'd actually re-run it before shipping a change (a pre-commit check, a CI step, or even just a documented "run this before you ship" habit).

## What "done" looks like

You can run your eval script on demand, get a report broken down by category or case type (not just one aggregate number), and you've proven — via the deliberate-regression step — that the harness actually catches a real regression rather than just producing a number that always looks fine.

Bring your dataset, your scoring approach, and the regression you introduced (and whether your harness caught it) to the project mentor chat — it's a good place to sanity-check whether your scoring proxy actually measures what you think it measures, which is the most common way eval harnesses end up giving false confidence.
