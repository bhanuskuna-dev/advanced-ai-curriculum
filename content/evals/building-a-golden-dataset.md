## What a golden dataset is

A golden dataset is a set of inputs paired with correct, human-verified outputs — the ground truth your eval suite scores against. For a classifier, that's `(input, correct_label)` pairs. For a RAG system, that might be `(question, correct_answer, which_source_should_be_cited)`. For an agent, it might be `(task, expected_final_state or expected_tool_calls)`. Whatever the shape, the dataset's quality is the ceiling on your eval suite's usefulness — a sloppy or unrepresentative dataset gives you a confident-looking accuracy number that doesn't actually tell you much about real-world performance.

## Size: smaller and well-chosen beats large and lazy

There's no universal right size — it depends on how many distinct categories or behaviors you need to cover, and how much signal you need to detect a meaningful regression. A useful lower bound: enough examples that every category or behavior you care about has *at least a few* representative cases, so a single mislabeled example doesn't swing that category's score wildly. Thirty carefully chosen examples covering sixteen categories, each with a written rationale, is far more useful than three hundred randomly sampled examples where most categories are over-represented by easy cases and rare categories barely appear at all.

## Edge cases are worth more than easy cases

This is the single highest-leverage idea in dataset construction. A model correctly classifying `NETFLIX.COM` as a subscription and `CHEVRON GAS STATION` as auto tells you almost nothing — of course it gets those right, they're unambiguous. What actually tells you something:

- `COSTCO WHOLESALE` → should be **Groceries**, not **Shopping** (Costco is primarily a grocery retailer, even though it also sells general merchandise) — a case that requires domain knowledge, not just pattern matching on the merchant name.
- `UBER TRIP` vs. `UBER EATS` → **Auto & Transportation** vs. **Dining** — same brand name, opposite category, distinguishable only by a substring most naive rules would miss.
- `PAYPAL *ADOBE INC` → **Subscriptions**, not **Transfers** — PayPal is a payment intermediary, not the actual merchant; a naive rule matching on "PAYPAL" alone would misclassify this and everything else routed through PayPal.

A dataset built entirely from easy cases will show 98% accuracy right up until production traffic — full of exactly this kind of ambiguity — reveals the real number is much lower. Deliberately seek out and include the confusing cases; they're where a model's real quality is actually visible.

Credit underwriting golden sets follow the identical logic. A PD (Probability of Default) model correctly scoring a borrower with a long, clean, high-income credit history tells you almost nothing — that's the easy case. What actually validates the model: a thin-file applicant with limited credit history but strong income, or a borrower with one old delinquency but years of clean payments since. Those are the profiles where a miscalibrated model actually reveals itself, exactly the way `COSTCO WHOLESALE` reveals a categorizer's real handling of ambiguity that unambiguous merchants never would.

## Write down *why*, not just the label

Every labeled example should include a short note explaining the reasoning behind its correct label — not just for documentation's sake, but because it forces precision in the labeling decision itself. If you can't articulate *why* `COSTCO WHOLESALE` is Groceries rather than Shopping in a sentence, you probably haven't thought it through enough to trust the label. This note also massively speeds up debugging later: when the model gets a case wrong, the rationale tells you immediately whether the model's reasoning was actually unreasonable, or whether it made a defensible call on a genuinely ambiguous case that your dataset happens to have decided one way.

This is exactly the discipline SR 11-7 already demands of model-risk documentation: every model decision needs a documented rationale a reviewer can audit later, not just a label. Writing the "why" for a golden-dataset example and writing the "why" for a model's risk-tier classification in a governance review are the same underlying skill.

## Datasets go stale

A golden dataset built once and never revisited slowly stops representing real usage: your product's user base shifts, new categories of input appear, merchants rebrand, users start asking new kinds of questions. Treat the dataset as a living artifact — update it quarterly, or immediately whenever a production failure reveals a case type it didn't cover. A dataset that never grows past its original creation is measuring an increasingly outdated version of the problem.

## A common trap: building the dataset from the model's own outputs

If you generate candidate examples by asking the model to produce them, or by sampling only cases the model already handled confidently, you bake the model's existing blind spots into the "ground truth" — it will look artificially good at exactly the things it's already good at, and your dataset will systematically under-represent the cases where it currently fails. Real user data (or examples deliberately designed to be hard, independent of what the model currently does) makes for a far more honest dataset than anything bootstrapped from the model's own behavior.

## A minimal checklist

1. Cover every category/behavior you care about, with multiple examples each.
2. Deliberately include ambiguous, edge-case examples — not just the obvious ones.
3. Write a short rationale for every label.
4. Source examples from real usage where possible, not the model's own outputs.
5. Revisit and expand the dataset on a schedule, and whenever production reveals a gap.
