## The problem MCP solves

Before MCP, every AI application that wanted to connect Claude to, say, GitHub or a filesystem or a database, wrote its own bespoke integration: its own tool definitions, its own auth handling, its own way of calling out to that system. If you built five AI apps that all needed GitHub access, you wrote the GitHub integration five times, and none of it was reusable across vendors or frameworks.

The **Model Context Protocol** standardizes the *interface* between an AI application and external systems, the same way HTTP standardized how browsers talk to servers. An MCP **server** exposes tools, resources (readable data, like files or database rows), and prompts, over a well-defined protocol. An MCP **client** — the AI application, like Claude Code or a custom agent — connects to any MCP server and gets a uniform way to discover and call what it offers, without knowing anything about that system's actual implementation.

## Servers, clients, and where Claude fits

- **MCP server**: a process that wraps a real capability (a GitHub API, a local filesystem, a Postgres database, an internal company tool) and exposes it via MCP's tool/resource/prompt primitives.
- **MCP client**: the host application that talks to one or more MCP servers and surfaces their tools to the model. Claude Code is an MCP client; so is any custom agent you build using the Agent SDK with MCP support wired in.
- **The model (Claude)** never talks to MCP directly — it sees a normal tool definition (name, description, schema), exactly like the hand-rolled tools from the previous two lessons. MCP is a protocol between *your application* and *the systems it connects to*; from Claude's point of view, an MCP-provided tool and a tool you defined by hand in code look identical.

This is the detail that trips people up: **MCP doesn't change how Claude thinks about tools.** It changes how *your application* acquires and manages the tools it exposes to Claude.

## When MCP beats hand-rolled tools

Write your own tool function when:
- It's specific to your app's own logic (a `calculate_snowball_projection` function that only makes sense inside your product).
- It needs tight control over what data leaves the client (client-side-only tools that never touch a server, as seen in privacy-sensitive apps).

Reach for an MCP server when:
- You're integrating with a system that already has a community or vendor-maintained MCP server (GitHub, Slack, a database) — don't rebuild what already exists and is maintained.
- You want the *same* integration usable across multiple AI applications or frameworks, not locked into one codebase.
- You're building a tool that's genuinely a reusable capability (a company-internal API that multiple internal AI tools should be able to call) rather than app-specific glue code.

## A minimal mental model of the wire protocol

MCP servers and clients exchange JSON-RPC messages over a transport (commonly stdio for local servers, or HTTP/SSE for remote ones). A client typically does, in order:

1. **Initialize** — handshake, exchange capabilities.
2. **List tools/resources** — ask the server what it offers.
3. **Call a tool** — same shape as any tool call: a name and structured arguments, structured result back.

You rarely hand-write this protocol layer yourself; you use an MCP SDK (available for TypeScript, Python, and other languages) that implements the message-passing, and you focus on either (a) writing the handler functions for a server you're building, or (b) configuring which servers a client connects to.

## Security implications

Because an MCP server can expose real, consequential actions (writing to a filesystem, calling a paid API, modifying a database), connecting a client to a new MCP server is equivalent to granting a new agent authority to your systems. Two practices matter in practice:

- **Scope servers narrowly.** Prefer a server that only exposes read access to what an agent needs, over a general-purpose one with broad write access, unless the write access is the actual point.
- **Treat tool descriptions from third-party servers as untrusted input to the model**, not as your own code. A malicious or compromised MCP server can supply a tool description crafted to manipulate the model's behavior (a form of prompt injection) — the same caution you'd apply to any external data reaching the model applies here too.

## Where this fits in the bigger picture

MCP is an integration and distribution mechanism, not a new capability. It doesn't make an agent smarter or change the reasoning loop from the previous lesson. What it changes is the economics of building agents that need to talk to many external systems: instead of N apps each writing M integrations, you get N clients and M servers, and any client can use any server.
