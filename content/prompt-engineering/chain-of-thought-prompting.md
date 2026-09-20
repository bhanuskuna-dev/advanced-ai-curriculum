## What chain-of-thought prompting actually does

Asking a model to work through a problem step by step before giving a final answer — "think through this carefully, then answer" — measurably improves accuracy on tasks that genuinely require multi-step reasoning: multi-part math, logic puzzles, anything where the correct answer depends on correctly chaining several intermediate deductions. The mechanism is straightforward: generating intermediate reasoning steps gives the model's own output a chance to catch an error before it commits to a final answer, the same way a person is less likely to make an arithmetic mistake writing out each step than trying to do it all in their head.

## When it helps and when it's just added cost

Chain-of-thought is not a universal quality booster. On tasks that don't actually require multi-step reasoning — simple classification, straightforward extraction, a question with a single-lookup answer — asking for step-by-step reasoning adds output tokens (and therefore cost and latency) without improving accuracy, because there's no chain to think through in the first place. The judgment call: does getting this right actually require chaining several intermediate steps, or is the answer effectively a single inference away from the input? If it's the latter, skip the reasoning request and ask for the answer directly.

## Extended thinking vs. prompted chain-of-thought

Current Claude models support built-in extended thinking (`thinking: { type: "adaptive" }`), which lets the model reason internally before responding, with the depth controlled by an `effort` setting rather than a manually engineered prompt. This has mostly superseded the older pattern of manually instructing "think step by step" in the prompt text — for models and tasks where extended thinking is available, reaching for the `thinking` parameter and an appropriate `effort` level is the more reliable lever than hand-crafting a chain-of-thought instruction. The underlying judgment call is unchanged: reserve higher effort/deeper reasoning for tasks that actually benefit from it (multi-step planning, agentic tool selection, hard synthesis), and use lower effort for tasks that don't (simple classification, terse confirmations, narrow extraction) — spending reasoning tokens on a task that doesn't need them is pure cost with no quality return.

## Showing your reasoning is also a debugging tool

Independent of whether it improves the final answer, asking a model to state its reasoning (or reading its thinking output, where available) gives you visibility into *why* it reached a conclusion — which matters enormously when a result looks wrong and you need to know whether the error was in understanding the task, applying a rule incorrectly, or a straightforward factual mistake. This is the same instinct as agent transcript logging from the Agentic Architecture module: visible intermediate reasoning is what turns "the model got this wrong" into a specific, actionable finding about *where* it went wrong.

## A failure mode to watch for: reasoning that doesn't match the answer

Occasionally a model's stated reasoning will lay out one conclusion and then give a final answer that doesn't actually follow from it — a sign the reasoning was generated somewhat independently of the answer-selection process rather than genuinely driving it. When reasoning is visible and load-bearing for your use case (you're using it to justify or audit a decision, not just to improve accuracy), it's worth spot-checking that the stated reasoning and the final answer are actually consistent, rather than assuming visible reasoning is automatically faithful reasoning.

## Practical guidance

- Use step-by-step reasoning (prompted, or via extended thinking) for genuinely multi-step tasks: planning, multi-part analysis, agentic tool selection under ambiguity.
- Skip it for single-inference tasks: classification, simple extraction, direct lookups — the added tokens buy nothing.
- When reasoning is visible, treat it as a debugging and audit tool, not just a quality lever — and don't assume it's automatically faithful to the final answer without spot-checking.
