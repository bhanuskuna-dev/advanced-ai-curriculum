## The model responds to what's actually on the page

The single most common prompting mistake is assuming the model will infer intent it was never actually given. If a requirement isn't stated in the prompt, the model doesn't have access to it — it can only work from what's in its context, plus general knowledge. "Be more specific" as an instruction to yourself, applied to prompt-writing, fixes more output-quality problems than any specific technique below.

## Be explicit about the task, the format, and the constraints

Three things a prompt should almost always make explicit, because a model will otherwise guess plausibly rather than correctly:

- **The task itself**, stated directly rather than implied. "Review this code" is ambiguous between "find bugs," "suggest style improvements," and "explain what it does." "Find correctness bugs in this function; ignore style" removes the ambiguity.
- **The output format.** If you need a bulleted list, say so. If you need exactly three items, say three. If you need JSON, say JSON (and see the Structured Output lesson for how to make that a hard guarantee rather than a request).
- **Constraints that matter.** Length limits, tone, what to exclude, what audience the output is for. A model asked to "explain this" for a beginner and one asked to "explain this" for a senior engineer should produce different answers — but only if the prompt tells it which audience it's writing for.

## Context beats cleverness

Giving the model the actual information it needs to do the task well — relevant background, the specific constraints of the situation, examples of what "good" looks like — moves output quality more reliably than searching for a clever phrasing of the instruction itself. A prompt that says "write a product update email" produces something generic. One that includes the actual feature being shipped, the actual audience, and a past example of the team's email style produces something usable. This is the same instinct behind grounding a model in retrieved documents (from a RAG pipeline) rather than trusting it to answer from general knowledge — provide the specific material the task actually depends on.

## Examples are one of the highest-leverage tools available

Showing the model one or two examples of exactly the input/output pattern you want — "few-shot prompting" — is often more reliable than describing the pattern in the abstract, especially for tasks with a specific format or style that's easier to demonstrate than to explain. A single well-chosen example of a correctly formatted output frequently outperforms several paragraphs of formatting instructions, because it removes ambiguity about edge cases the instructions didn't anticipate.

## Positive instructions over negative ones

"Don't be verbose" leaves the model to guess what "not verbose" actually means in this context. "Respond in 2-3 sentences" gives it a concrete target. Wherever possible, state what you want rather than what you don't want — a positive, concrete instruction is easier for the model to satisfy exactly than a negative, open-ended one.

## Structure your prompt so a human could follow it too

A useful sanity check: if a new team member, unfamiliar with the task, read your prompt cold, could they produce roughly the right output? If the prompt is ambiguous to a careful human reader, it will be ambiguous to the model too — the model isn't reading for hidden intent, it's reading the same words a person would. Clear section breaks (plain paragraphs, or XML-style tags like `<context>` and `<task>` for longer prompts) help both a human reviewer and the model parse where one part of the instruction ends and the next begins.

## This is a skill you iterate on, not a skill you finish

Nobody writes the optimal prompt on the first try for anything non-trivial. The discipline that actually produces good results over time is treating a prompt as a draft you test and revise against real examples — covered in depth in "Iterating & Testing Prompts" — rather than a one-shot artifact you write once and never revisit.
