## Why this lesson doesn't have a formula

Everything else in this course — tool-use loops, chunking strategy, calibration thresholds — has a right answer you can verify. Responsible use doesn't work that way. It's a set of judgment calls that depend on context, stakes, and who's affected, and an eval score of 98% accuracy tells you nothing about whether you *should* be automating a decision at all. This lesson is deliberately about the questions no metric answers for you.

## The stakes-appropriate scrutiny principle

Not every AI-powered feature deserves the same level of caution, and treating them all identically is itself a mistake — either over-engineering guardrails for a low-stakes feature (wasted effort, worse user experience) or under-engineering them for a high-stakes one (real harm). A useful lens: what happens when this is wrong, and who bears that cost?

- **Low stakes, easily correctable**: a suggested email subject line, a draft summary the user reviews before sending. A wrong output costs a few seconds of the user's attention. Light-touch review is proportionate.
- **Medium stakes, delayed correction**: a categorized expense that affects a monthly report, a code suggestion a developer will review before merging. A wrong output costs real but recoverable time or money. This is where confidence thresholds and human-review workflows (Module 3's earlier lessons) earn their complexity.
- **High stakes, hard to reverse**: a medical, legal, financial, or safety-relevant decision made autonomously; an agent with write access to production systems or real money. A wrong output can cause harm that isn't easily undone. This is where you should be asking not "how do we make this more accurate" but "should a human be in the loop for every instance of this, not just the low-confidence ones."

The mistake to avoid isn't using AI for high-stakes decisions — it's applying the *same* level of autonomy and trust to a high-stakes decision that you'd correctly apply to a low-stakes one.

This is exactly the line drawn in practice between a requirements-automation agent and a credit decisioning system serving a $12B+ card-member portfolio. The requirements agent operating with HITL checkpoints and 25% efficiency gains is appropriately medium-stakes — a wrong scenario document gets caught in review before it ships. A credit-line decision made autonomously against millions of customers is high-stakes by definition: it's why that system runs through governed, audited, SR 11-7-aligned oversight rather than "the model seemed confident, so we shipped it."

## Transparency as a design decision, not an afterthought

Users make better decisions about how much to trust an AI system's output when they can see *why* it produced that output — a cited source, a stated confidence level, a visible reasoning trace. Building this in from the start (as the RAG module's citation pattern and the calibration lesson's confidence scores both do) is meaningfully different from bolting on an explanation after the fact; it shapes what data and reasoning the system needs to produce in the first place, not just how it's displayed.

## Privacy and data minimization

A recurring, concrete pattern worth internalizing: **the least amount of sensitive data should leave a trust boundary that's still sufficient to accomplish the task.** A client-side tool that computes an aggregate locally and sends only that aggregate to a server-side model call — never the raw underlying records — is a design pattern, not a compliance checkbox: it means even if the server-side call is logged, intercepted, or misused, the raw sensitive data was never exposed to it in the first place. This same instinct — send derived, minimal, structured data rather than raw sensitive content whenever the task allows it — applies well beyond finance: user documents, health information, private conversations all benefit from the same discipline.

It's the same principle FACTA and Reg B already encode into regulatory practice: a credit decisioning workflow only surfaces the specific reason codes and data elements a disclosure legally requires, not a customer's entire underlying credit file. "Minimum necessary" isn't a new AI-era idea — it's a much older regulatory instinct that AI system design should inherit, not reinvent.

## Knowing what you don't know

Advanced AI users are the ones most at risk of a specific mistake: overestimating how much a model's fluent, confident output should be trusted, precisely because they understand the tooling well enough to build something that looks sophisticated. Two disciplines guard against this:

- **Read model and provider documentation on known limitations** for the specific capability you're building on — a model card or system card will often name known weaknesses (certain reasoning types, certain input types) more precisely than general intuition would predict.
- **Test with adversarial and edge-case inputs before shipping**, not just the inputs that make your feature look good in a demo — the same discipline as the golden-dataset lesson, extended to safety-relevant cases specifically: what happens with hostile input, with attempted prompt injection, with a user trying to extract something the system shouldn't reveal?

## The judgment this course can't hand you

Nothing in this curriculum can tell you, in the abstract, whether a specific feature you're about to build crosses from "fine to automate" into "needs a human in the loop," because that depends on details only you have: who your users are, what a wrong answer actually costs them, and how reversible that cost is. What this course *can* give you is the vocabulary and the concrete mechanisms — evals, calibration, grounding, scoped tool permissions, data minimization — to make that judgment call deliberately, with real information, instead of by default or by accident.
