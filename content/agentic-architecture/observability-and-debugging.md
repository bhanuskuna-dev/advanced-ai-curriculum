## Why agent transcripts are the primary debugging tool

When a single API call produces a wrong answer, you can inspect the prompt and the response and usually see why. When an eight-step agentic loop produces a wrong answer, the mistake could be in any of the eight steps, and the final output alone won't tell you which one. The full transcript — every tool call, every tool result, every intermediate piece of the model's reasoning you asked it to surface — is the only artifact that lets you find where things actually went wrong instead of guessing.

This means observability isn't an operations afterthought for agents the way it sometimes is for simpler features. It's a design requirement from the start: if you can't reconstruct what an agent did and why, you can't debug it, you can't improve it, and you can't explain its behavior to anyone who asks.

## What to log, specifically

- **Every tool call and its full arguments** — not just that a tool was called, but exactly what it was called with. A wrong argument is a common failure mode, and you can't see it without the actual input.
- **Every tool result, including errors** — an `is_error: true` result that gets silently swallowed instead of logged looks, from the outside, identical to a tool that succeeded quietly. You need to be able to tell the difference after the fact.
- **The model's stated reasoning, if you asked for it** — a system prompt that requests a brief "why I'm calling this tool" statement before each call turns an opaque decision into a reviewable one. Cheap to add, and it's often the single fastest way to spot *why* a reasonable-looking tool choice was actually wrong for the situation.
- **Stop reason and iteration count** — did the loop end on `end_turn`, get forced to a final answer at the iteration cap, or hit an unexpected error? These three outcomes look identical from a user's perspective but mean very different things about whether the agent actually finished its job.

## Debugging a specific wrong answer

The practical workflow: pull the full transcript for the failing run, and walk it forward step by step asking "given only what the model had seen up to this point, was this a reasonable next action?" Often the mistake isn't in the final step at all — it's an earlier tool call that returned technically-correct-but-misleading data, or a tool description ambiguous enough that the model picked a plausible-but-wrong tool three steps earlier, and everything downstream compounds from there. Without the full transcript, you'd only ever see the final wrong answer and have no way to find the actual point of failure.

## Observability feeds back into tool and prompt design

A pattern worth watching for across many transcripts, not just one: if the same *type* of misstep shows up repeatedly (the same tool getting called when it shouldn't, the same ambiguous case tripping up the same decision point), that's a signal the tool's description or the system prompt's instructions are underspecified — not that the model is unreliable in general. Observability data is what turns "the agent seems flaky" into a specific, fixable claim about one tool's description or one instruction's ambiguity.

## This connects directly to evals-style thinking

Treating a collection of transcripts as a dataset — tagging which ones succeeded, which failed, and why — is the same discipline as building a golden dataset for a classifier: specific failure cases are worth more than a pile of successful runs, because they're where the actual behavior boundary lives. An agent architecture that makes transcripts easy to collect, tag, and review isn't just good for firefighting one incident — it's the raw material for systematically improving the agent over time.
