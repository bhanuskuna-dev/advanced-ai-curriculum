## Regressions in AI systems are silent by default

When you change traditional code and break something, you usually find out fast: a test fails, an error throws, a type check rejects the build. When you change a prompt, swap a model version, or adjust a confidence threshold in an AI feature, none of that machinery exists by default. The system keeps running, keeps returning plausible-looking outputs, and keeps returning a *wrong* answer with exactly the same fluent confidence as a right one. Nothing crashes. Nothing looks different in a quick manual check. The only way you find out is when a user notices, or — worse — when nobody notices at all and the product is just quietly a little worse.

This is the core reason evals exist: **they turn a silent failure mode into a measured one.** An eval suite is, at its simplest, a set of inputs where you already know the correct answer, run automatically against your current system, scored against that known answer. It's a test suite, for a kind of system where "correct" is fuzzier than a traditional unit test's exact-equality check — but the discipline is the same one: catch regressions before they reach users, not after.

## A concrete worked example

Consider a transaction categorizer: given a bank transaction description, classify it into one of 16 spending categories. You ship it, it looks great in your own manual testing, and it goes to production. Three weeks later, you tweak the prompt to fix one specific miscategorization you noticed (`COSTCO WHOLESALE` was landing in "Shopping" instead of "Groceries"). Without an eval suite, you have no way to know whether that fix also broke five other categories that were working fine before — you'd only find out from user complaints, if you find out at all. With an eval suite, you re-run your 30 labeled examples after the prompt change and immediately see: overall accuracy held steady, but recall on "Auto & Transportation" dropped ten points, because your fix's new instruction accidentally pulled gas-station transactions toward "Shopping" too. That's not a hypothetical — it's the exact shape of failure evals are designed to catch, and it's invisible without them.

## What an eval run actually measures

At minimum, three things:

1. **Overall accuracy (or an equivalent aggregate score)** — the headline number, useful for tracking trend over time.
2. **Per-category or per-case-type breakdown** — the aggregate number can hold steady while a specific important slice quietly gets worse; only a breakdown catches that.
3. **Cost and latency** — a prompt or model change that improves accuracy by two points while tripling cost or latency is not a free win; evals should report enough to make that tradeoff visible, not just accuracy in isolation.

## Evals as a gate, not just a dashboard

The real value isn't a dashboard you glance at occasionally — it's a **gate**: explicit, written acceptance criteria that a change must clear before shipping. For example: "overall accuracy must not regress more than 3 percentage points from baseline," "no individual category's recall may drop below 75%," "cost per request must not increase more than 20%." Written down in advance, these turn "does this change look okay?" — a subjective judgment call made under time pressure — into a checkable fact. This is the same instinct as a CI test suite blocking a merge; it just took the industry longer to build equivalent tooling for AI-specific quality dimensions like calibration and per-category recall.

## When to run evals

- **Before shipping any prompt change** — the change that "obviously" only affects one thing is exactly the kind that most often has an unintended side effect elsewhere.
- **After any model version update** — a newer model version is not guaranteed to be strictly better on your specific task; it can shift behavior in ways that help some cases and hurt others.
- **When a leading indicator drifts** — for a categorizer with human review, a rising override rate (users correcting the AI's suggestion more often than usual) is a sign the model's real-world accuracy has drifted from what your eval baseline assumed, and it's worth re-running the eval to confirm and quantify.

## The habit this lesson is really teaching

Evals are not a one-time project you complete and move past — they're a habit you build into how you ship AI-powered features at all, the same way tests are a habit rather than a checkbox. The next four lessons cover how to build a good eval dataset, what to measure, the specific failure modes evals help you catch, and the judgment calls no eval score can make for you.
