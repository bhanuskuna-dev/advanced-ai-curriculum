## A prompt is a versioned artifact, not a draft you write once

The instinct that serves you best with prompts is the same one that serves you with code: treat a prompt as something you change deliberately, test the change against real examples, and roll back if it regresses — not something you write once, eyeball, and ship. A prompt that "looks right" on the two or three examples you tried it on can easily fail on the shape of input that shows up in real traffic three weeks later.

## Testing a prompt change honestly

The single most common mistake in prompt iteration: testing a change only against the example that motivated it. If you tweak a prompt to fix one specific miscategorization you noticed, and only re-check that one case, you have no idea whether the fix also broke something that was working before. This is the exact discipline a golden dataset and an eval suite exist to provide — a small, representative, edge-case-weighted set of inputs you re-run every time the prompt changes, so "did this help" becomes a measured fact instead of a guess based on the one case you happened to look at.

## What to vary when testing

- **Realistic edge cases**, not just the clean examples that make the prompt look good. The hard, ambiguous inputs are where a prompt's actual behavior boundary lives.
- **Adversarial or unusual phrasing** of otherwise-normal requests — a real user rarely phrases things exactly the way you did when writing the prompt.
- **The volume and shape of real input**, where possible — a prompt tuned against three short examples can behave differently against a much longer or more cluttered real input.

## A/B comparison, not just before/after

When you have two candidate prompts and aren't sure which is better, running both against the same test set and comparing results side by side is more reliable than sequential "try one, then try the other, see which felt better" — sequential comparison is vulnerable to your own attention and mood shifting between the two attempts, in a way a fixed test set run twice, scored the same way, is not.

## Keep a record of what you tried and why

Prompt iteration without a written record tends to repeat the same failed experiments, because nobody remembers that a particular phrasing was already tried and didn't help. A short log — what changed, what test set it was run against, what the result was — turns prompt engineering from folklore ("I think shorter system prompts work better") into an accumulating, checkable body of evidence specific to your actual task.

## Know when to stop

Prompt iteration has diminishing returns, and it's possible to over-fit a prompt to your specific test set the same way a model can overfit to training data — a prompt tuned obsessively against ten examples can pick up quirks specific to those ten that don't generalize. If a change stops producing measurable improvement on a reasonably sized, representative test set, that's a signal to either expand the test set (if you suspect it's too narrow) or stop tuning the prompt and look at whether the actual bottleneck is somewhere else — the tool design, the retrieved context, or the task itself being genuinely hard for the model at its current capability level.

## The discipline this sets up

Everything in this lesson is, in miniature, the same discipline the Evals module philosophy applies at larger scale: a labeled test set, a way to score against it, and acceptance criteria decided before you make the change — not a subjective judgment call made under the pressure of "does this look better to me right now."
