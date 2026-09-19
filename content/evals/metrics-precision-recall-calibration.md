## Accuracy alone hides a lot

Overall accuracy — the percentage of predictions that were correct — is the natural first metric, and it's also the easiest one to be misled by. A classifier with 16 categories where one category ("Income") makes up 40% of transactions can hit 85% overall accuracy while getting almost every "Entertainment" transaction wrong, simply because Entertainment is rare enough that its errors barely move the aggregate number. Overall accuracy tells you the system is *broadly* okay; it tells you almost nothing about *which* specific behaviors are broken.

## Precision and recall, per category

For any given category, there are four possible outcomes for a prediction: it correctly said this category (true positive), it incorrectly said this category (false positive), it correctly did *not* say this category (true negative), and it incorrectly failed to say this category when it should have (false negative). Two metrics summarize the balance:

- **Precision** = true positives / (true positives + false positives) — *of everything the model labeled "Dining," how much was actually Dining?* High precision, low recall means the model is cautious: when it says Dining, it's usually right, but it misses a lot of actual Dining transactions by calling them something else.
- **Recall** = true positives / (true positives + false negatives) — *of everything that was actually Dining, how much did the model correctly find?* High recall, low precision means the opposite: it catches most real Dining transactions, but also incorrectly labels a lot of non-Dining transactions as Dining too.

These two numbers trade off against each other, and which one matters more depends on the cost of each error type. In a spam filter, a false positive (a real email marked spam) is often worse than a false negative (a spam email that slips through) — so you'd tune for higher precision even at some cost to recall. In a medical screening context, missing a real case (false negative) is typically far worse than a false alarm (false positive) — so you'd tune for higher recall. An adverse-action flagging system sits closer to the medical-screening end: failing to flag a decision that legally required an adverse-action notice (a false negative) is a compliance exposure, while over-flagging a borderline case for extra review (a false positive) just costs some reviewer time — so that system is deliberately tuned toward higher recall, accepting more false alarms to avoid missing a real one.

**F1 score** — the harmonic mean of precision and recall — is a single number summarizing both when you don't have a strong reason to prioritize one over the other, useful for a quick per-category comparison without carrying two numbers around.

## Reading a confusion matrix

A confusion matrix is a grid: actual category on one axis, predicted category on the other, each cell showing how many examples fell into that combination. The diagonal is correct predictions; everything off the diagonal is a specific kind of mistake. The value of the matrix over a single accuracy number is that it shows you *which* categories get confused with *which others* — if "Auto & Transportation" and "Travel" are frequently confused with each other but nothing else, that's a specific, actionable signal (their category definitions or examples probably overlap) that an aggregate accuracy score would never surface.

## Calibration: does confidence mean what it claims to mean?

Many classification systems return a confidence score alongside each prediction. **Calibration** asks: when the model says "85% confident," is it actually right about 85% of the time at that confidence level? A well-calibrated model shows accuracy that increases monotonically with stated confidence — predictions in the 90%+ confidence bucket are right more often than those in the 60–70% bucket. A poorly calibrated model might claim 95% confidence on predictions that are only right 70% of the time, which is actively dangerous if you're using confidence to decide what to auto-apply without human review.

This isn't an analogy borrowed for teaching purposes — it's the literal definition of a **PD (Probability of Default) model**: a PD model's entire output *is* a calibration claim. A model that assigns a 5% probability of default to a segment of borrowers is only correct if roughly 5% of that segment actually defaults. Model-risk governance under SR 11-7 exists specifically to validate that claim on an ongoing basis — the same calibration chart described below for an LLM's confidence score is, in credit risk, a formal, audited validation exercise on which real lending decisions and capital reserves depend.

The practical use: plot accuracy per confidence bucket (a calibration chart). If the 0.85+ confidence bucket shows less than about 90% actual accuracy, an auto-apply threshold set at 0.85 is too permissive and needs to be raised. If the 0.60–0.74 bucket already shows 80%+ accuracy, the threshold could safely be lowered to reduce unnecessary human review. This is exactly how a confidence-based auto-apply threshold should be set — empirically, from a calibration chart, not chosen arbitrarily and left unexamined.

## Putting it together

None of these metrics replace each other — they answer different questions. Overall accuracy answers "is this broadly working?" Per-category precision/recall answers "which specific behaviors are broken, and in which direction?" A confusion matrix answers "which categories get confused with which?" Calibration answers "can I trust the confidence score enough to automate decisions on it?" A serious eval report includes all four, because a change that improves one can easily be hiding a regression in another.
