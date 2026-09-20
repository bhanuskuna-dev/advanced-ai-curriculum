## Objective

Build a small command-line or single-page agent that uses **2–3 real tools** to accomplish an end-to-end task you actually care about — not a toy "get the weather" demo. Pick something with a genuine multi-step shape: the right answer should require the agent to call a tool, look at the result, and decide what to do next based on it.

Good candidate ideas (pick one, or bring your own of similar shape):
- A research agent that searches a small local set of documents (or calls a search API) and a calculator tool, then answers quantitative questions that require both retrieval and computation.
- A personal-finance-style agent (in the spirit of this course's sibling project, SpendScanner) with tools like `get_transactions`, `categorize`, and `calculate_total`, that answers free-form questions about a sample dataset.
- A GitHub-repo agent (using an MCP server, per the MCP lesson, or hand-rolled tools against the GitHub API) that answers questions like "what changed in the last 5 merged PRs touching `src/auth`?"
- A model-governance intake triage agent, in the spirit of a real AI-model-oversight platform: tools like `check_governance_status` (has this model been classified under a policy framework?), `flag_missing_documentation`, and `draft_governance_summary`, that walks through a small sample set of "models" (even a mock dataset you make up) and produces a triage recommendation with its reasoning.

## Milestones

1. **Define your tools first, in plain English, before writing code.** For each tool, write its name, a one-sentence description, and its input schema. Ask yourself: could someone unfamiliar with your codebase tell from the description alone when this tool should and shouldn't be called?
2. **Implement the tool-use loop** (see the "Tool Use & the Tool-Use Loop" lesson) with a hard iteration cap and a forced final-answer fallback if the cap is hit.
3. **Handle at least one realistic failure**: a tool that can fail (bad input, no results found, a network error) and returns `is_error: true` with a useful message, rather than throwing. Verify the agent recovers sensibly — it should not just give up on the first error.
4. **Write a system prompt that shapes behavior**, not just tone: when to use which tool, how to handle ambiguous requests, what to do when tools return no results.
5. **Test it on 5 questions you didn't design the tools around** — questions a real user might ask that stress the agent's judgment about *which* tool(s) to use and in what order.

## Stretch goals

- Add prompt caching to your system prompt and tool definitions, and confirm (via the `usage` field across turns) that later requests show a reduced input-token cost.
- Convert one hand-rolled tool into an MCP-server-backed tool, or vice versa, and compare how much integration code each approach required.
- Add a second, cheaper-model worker agent that handles one narrow sub-task (e.g., extracting structured data from unstructured text) and have your main agent call it as a tool.

## What "done" looks like

You can describe, in a sentence, why your agent needed to be an agent (multi-step, adaptive to intermediate results) rather than a fixed pipeline or a single prompt — and you have a transcript of it handling at least one case where the second tool call depended on what the first one returned.

Bring your code, your system prompt, and a transcript of a real run to the project mentor chat for a review — it can point out where your tool descriptions are ambiguous, where your error handling has gaps, or where a fixed pipeline would have been simpler than what you built.
