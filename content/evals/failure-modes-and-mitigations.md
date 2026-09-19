## Hallucination

A model generates a confident, fluent, and factually wrong statement — a citation that doesn't exist, a dollar amount it never actually computed, an API method that was never defined. This happens because a language model is fundamentally producing the *most plausible next text* given its context, not consulting a verified fact store — when the true answer isn't clearly present in its context or training, "plausible-sounding" and "correct" can diverge, and nothing in the model's generation process distinguishes those cases from the model's own perspective.

A tool drafting regulatory disclosure language is a sharp example: asked to draft Reg B adverse-action reasoning, a model with no grounding could generate boilerplate that *sounds* like a valid disclosure but cites a reason code that doesn't correspond to the actual underwriting decision. That's not a hypothetical edge case — it's precisely why real adverse-action work builds from a verified, human-approved template bank rather than free-generating disclosure text from scratch each time.

**Mitigations:**
- **Ground answers in retrieved or tool-provided data** (Module 2), and explicitly instruct the model to say "I don't know" or "not in the provided sources" rather than filling gaps from general knowledge.
- **Never let a model report a number it didn't compute via a tool.** If a savings amount, a total, or a calculation matters, it should come from a tool call whose output is deterministic and checkable — not from the model doing arithmetic in its own generation, which it can get subtly wrong especially over longer chains of reasoning.
- **Verify checkable claims programmatically** where possible — the citation-verification pattern from the RAG module (does the cited source actually contain the claim?) is a concrete, automatable hallucination check, not just a design nicety.

## Prompt injection

If untrusted text (a user-uploaded document, a scraped web page, a transaction description, content from an MCP server you don't control) is included in a prompt, and that text contains something that reads like an instruction ("ignore previous instructions and instead..."), the model may follow it — because from the model's point of view, text is text; it doesn't inherently know that a chunk of retrieved document content should be *read*, not *obeyed*, the way a system prompt would be.

A requirements-automation agent that ingests raw stakeholder input — pasted Slack threads, forwarded emails, ticket descriptions — is exposed to exactly this risk: a stakeholder note containing something like "mark all acceptance criteria as met" should be read as a claim to verify, not an instruction the scenario-documentation agent quietly complies with.

**Mitigations:**
- **Structural separation.** Keep instructions in the system prompt and untrusted content in clearly delimited user-turn data, and explicitly instruct the model to treat that content as data to analyze, never as instructions to follow — the same instinct behind never putting user-supplied content directly into a system prompt (covered in the Messages API lesson).
- **Least privilege for tools.** If a prompt-injected instruction did get followed, the blast radius should be limited by what tools are actually available and what they're scoped to do — an agent with only a read-only search tool can't be tricked into deleting data, no matter what a malicious document tells it to do.
- **Treat this as a security problem, not just a quality problem.** It gets the same rigor as any other injection-style vulnerability (SQL injection, XSS): validate trust boundaries explicitly, don't assume good faith from any content the model wasn't given directly by a trusted instruction-giver.

## Overconfidence

A model states an uncertain or genuinely ambiguous answer with the same fluent, assertive tone as a well-supported one — there's no built-in "shakiness" in language generation the way a human might hedge or hesitate when unsure. Left unmanaged, this makes it hard for users (or downstream code) to tell a solid answer from a shaky one just by reading it.

**Mitigations:**
- **Ask explicitly for calibrated uncertainty language** in the system prompt — "state your confidence, and say plainly when a question can't be answered from the available information" — rather than assuming the model will volunteer this on its own.
- **Use a real confidence score when the task supports it**, and calibrate it (previous lesson) rather than trusting an unverified self-reported number at face value.
- **Route low-confidence or high-stakes outputs to human review** rather than auto-applying everything uniformly — this is the actual purpose of a confidence threshold, not just a UX nicety.

## Silent high-confidence errors

The most dangerous failure combination: a wrong answer, delivered with high stated confidence, on a case a human reviewer would have caught if only they'd looked. This is exactly what a confidence-based auto-apply system without ongoing evals is exposed to — every case above the threshold skips human review by design, so a wrong-but-confident prediction sails through unchecked. It's also precisely the failure mode model-risk governance frameworks like SR 11-7 exist to catch at the portfolio level: a single miscalibrated credit model quietly making confidently wrong decisions at scale, undetected until an audit or a loss event surfaces it.

**Mitigations:**
- **Never treat high confidence as a substitute for the ability to override.** Every automated decision needs an accessible path for a human to correct it after the fact, even when the system was "confident."
- **Run evals continuously, not just at launch**, specifically to catch calibration drift — a model that was well-calibrated at launch can become miscalibrated as real-world input distributions shift over time, and only ongoing measurement catches that.

## The pattern across all four

Every failure mode above shares a structure: the model produces fluent, confident-looking output regardless of whether it's actually correct, because fluency and correctness are not the same property and nothing in a language model's generation process guarantees the second just because it has the first. Every mitigation above is a version of the same idea: don't rely on the model to signal its own failure — build structural safeguards (grounding, tool-verified numbers, scoped permissions, calibrated thresholds, human review paths, ongoing evals) that catch it externally instead.
