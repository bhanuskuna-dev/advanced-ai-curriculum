## The problem: context grows, and everything in it gets resent

Every tool result and every turn you append to a conversation stays there for the rest of the session and gets re-sent — and re-billed — on every subsequent request. A long-running agent doing many tool calls will, left unmanaged, accumulate stale intermediate results until the context is dominated by noise rather than the information that's actually still relevant to the current step. Past a point, this doesn't just cost more — it can measurably reduce accuracy, because the model has to work harder to find the signal in an increasingly cluttered history.

## Summarize once a result has done its job

Once a tool result has informed a decision, you often don't need its raw form anymore. Replacing a bulky result with a short summary before the next turn — or dropping it entirely if it's fully superseded — keeps the context lean without losing anything the model still needs. A scenario-documentation agent working through a large feature doesn't need every previous scenario's full text in context to write the next one; a one-line summary of what's already been covered is usually enough to avoid duplication without paying to resend the full text of everything written so far.

## Return less from tools in the first place

This is a tool-design decision that pays off directly here: a tool that returns a compact, structured summary costs far less accumulated context over a long run than one that returns full underlying records. Fixing this at the tool-design layer is more effective than trying to compress bloated results after the fact — the cheapest context to manage is the context you never generated.

## Prune or compact at a length threshold

For conversations or agent runs that can run long, replace the oldest N turns with a short summary message once the conversation crosses a token or turn-count threshold, keeping recent context verbatim (where precision matters most) and older context compressed (where a gist is usually sufficient). Some current models support server-side compaction, which automatically summarizes earlier context as it approaches a size trigger — when using it, the compaction block the API returns must be appended back into your message history on the next request, not just the plain text extracted from it, or the compacted state is lost.

## Memory across sessions is not automatic — and that's deliberate

"Memory" that persists between separate conversations doesn't exist by default: a new conversation starts with zero knowledge of a previous one. If an agent needs to remember facts across sessions, that's a system you build explicitly — extract durable facts at the end of a session, store them somewhere (a database, a file, a vector store), and inject the relevant ones into the next session's system prompt or an early user turn. This is a deliberate design boundary, not a missing feature: an agent that silently accumulates unbounded cross-session memory is one whose behavior becomes progressively harder to predict and audit.

## A concrete failure mode this prevents

An agent processing a long queue of similar tasks — reviewing many model-governance submissions in one continuous run, say — that keeps every prior submission's full documentation in context will, by submission fifty, be spending most of its context budget re-reading the first forty-nine rather than reasoning about the fiftieth. Summarizing completed items down to a one-line disposition ("submission #12: approved, standard risk tier") as you go keeps the context budget spent on what's actually still in play, not on an ever-growing archive of finished work.

## The underlying principle

Every technique here is an application of the same idea: context is a scarce, costly resource that gets resent in full on every turn, so the discipline is to keep in it only what the *current* step of reasoning actually needs — summarized, pruned, or never generated in bulk in the first place — rather than treating context as a free-to-grow transcript of everything that's ever happened.
