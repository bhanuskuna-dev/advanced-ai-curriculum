## Why "just ask for JSON" isn't reliable enough

Asking a model to "respond in JSON" in plain-text instructions usually works — until it doesn't: a stray markdown code fence around the JSON, an extra sentence of preamble before the object, a field the instructions implied but didn't explicitly require, and now your parser throws on production traffic. For anything downstream of the response that expects a specific shape (a database write, a UI render, another API call), you need a stronger guarantee than "the model usually formats it correctly."

## Two reliable mechanisms

**Tool-based structured output.** Define a tool whose `input_schema` *is* your desired output shape, and force or strongly encourage the model to call it instead of replying in free text. Because tool calls are already schema-validated (especially with `strict: true`), this reuses the same reliability guarantee tool use gives you, repurposed for structured extraction rather than an actual side-effecting action:

```typescript
const tools = [{
  name: "extract_invoice_data",
  description: "Extract structured invoice data from the provided text.",
  input_schema: {
    type: "object",
    properties: {
      vendor: { type: "string" },
      amount: { type: "number" },
      dueDate: { type: "string", description: "ISO 8601 date" },
    },
    required: ["vendor", "amount", "dueDate"],
    additionalProperties: false,
  },
  strict: true,
}];
```

The model's `tool_use.input` for this call is guaranteed to match the schema exactly — no markdown fences, no missing fields, no need to defensively re-parse free text.

**Native structured outputs.** Where available, `output_config: { format: { ... } }` constrains the response format directly at the API level, without needing to frame the task as a tool call at all. This is the more direct mechanism when the entire point of the request is producing a structured object, rather than taking an action.

Either way, the principle is the same: push the format guarantee into the request's contract with the API, rather than relying on the model's free-text compliance with an instruction.

## Validate anyway

A schema-constrained response guarantees *shape*, not semantic correctness — a `dueDate` field can validate as a well-formed string while still being a nonsensical or hallucinated date. Structured output eliminates an entire class of parsing failures; it does not eliminate the need to check whether the values inside that valid structure are actually right. Treat schema validation as a floor, not a substitute for the kind of grounding and verification covered elsewhere in this curriculum.

## Designing the schema for the downstream consumer, not just the model

A structured-output schema should be shaped around what the code receiving it actually needs, not around whatever's easiest to describe in a prompt. If a downstream system needs a category from a fixed set, use an `enum` in the schema rather than a free-text `string` field you'll validate afterward — the same narrow-schema instinct from tool design applies directly here, because a structured-output schema *is* a tool schema in every case that matters.

## Handling the case where extraction should fail

Not every input will actually contain the data you're trying to extract. A schema that has no way to represent "this document doesn't contain an invoice" will force the model to either hallucinate plausible-looking values or produce something that technically satisfies the schema but is meaningless. Design for the negative case explicitly — an optional `confidence` field, a `found: boolean` field, or an separate "extraction failed" response path — rather than assuming every input will have a happy-path answer.

## Where this connects to reliability

Structured output done well removes an entire category of the parsing-and-retry problem covered in "Reliability Patterns" — but it doesn't remove all of it. A model can still occasionally produce a malformed call under adversarial or unusual input, and production systems still need a repair-or-retry path for the cases schema validation alone doesn't prevent. Structured output narrows how often you need that path; it doesn't make it unnecessary.
