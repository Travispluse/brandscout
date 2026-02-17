export const metadata = {
  title: "API Documentation | Developer & AI Integration Guide",
  description: "BrandScout API documentation for developers and AI agents. Free REST API to check domain and username availability programmatically. OpenAPI spec included.",
  openGraph: {
    title: "API Documentation | BrandScout",
    description: "Free REST API to check domain and username availability. Docs, examples, and OpenAPI spec for developers and AI agents.",
  },
};

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {title && (
        <div className="bg-muted px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
          {title}
        </div>
      )}
      <pre className="bg-zinc-950 text-zinc-100 p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-xl font-semibold mb-4 mt-10">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  const baseUrl = "https://brandscout.dev";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">BrandScout API</h1>
      <p className="text-muted-foreground mb-8">
        Check domain and social media username availability for any brand name. Free, open, and AI-friendly.
      </p>

      {/* TOC */}
      <nav className="mb-10 p-4 rounded-lg border border-border bg-muted/50">
        <p className="font-medium mb-2 text-sm">On this page</p>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li><a href="#overview" className="hover:text-foreground">Overview</a></li>
          <li><a href="#endpoints" className="hover:text-foreground">Endpoints</a></li>
          <li><a href="#response" className="hover:text-foreground">Response Format</a></li>
          <li><a href="#filtering" className="hover:text-foreground">Filtering</a></li>
          <li><a href="#rate-limits" className="hover:text-foreground">Rate Limits</a></li>
          <li><a href="#auth" className="hover:text-foreground">Authentication</a></li>
          <li><a href="#examples" className="hover:text-foreground">Examples</a></li>
          <li><a href="#openapi" className="hover:text-foreground">OpenAPI Spec</a></li>
          <li><a href="#errors" className="hover:text-foreground">Error Handling</a></li>
        </ul>
      </nav>

      <Section id="overview" title="Overview">
        <p className="text-muted-foreground mb-2">
          Base URL: <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{baseUrl}</code>
        </p>
        <p className="text-muted-foreground">
          All responses are JSON. CORS is enabled for all origins. No authentication required (API key support coming soon).
        </p>
      </Section>

      <Section id="endpoints" title="Endpoints">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-sm font-mono mr-2">GET</span>
              <code className="text-sm">/api/v1/check?q=brandname</code>
            </h3>
            <p className="text-muted-foreground text-sm">Quick check via query parameter. Ideal for curl and AI agents.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">
              <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded text-sm font-mono mr-2">POST</span>
              <code className="text-sm">/api/v1/check</code>
            </h3>
            <p className="text-muted-foreground text-sm mb-2">Check with JSON body.</p>
            <CodeBlock title="Request Body">{`{
  "query": "mybrandname"
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section id="response" title="Response Format">
        <CodeBlock title="200 OK">{`{
  "query": "mybrandname",
  "name": "mybrandname",
  "score": 75,
  "description_for_ai": "Brand \\"mybrandname\\": mybrandname.com is available; usernames taken on GitHub, Reddit.",
  "domains": [
    { "domain": "mybrandname.com", "tld": ".com", "status": "available" },
    { "domain": "mybrandname.io", "tld": ".io", "status": "taken" }
  ],
  "usernames": [
    { "platform": "GitHub", "username": "mybrandname", "status": "available", "profileUrl": "https://github.com/mybrandname" },
    { "platform": "Reddit", "username": "mybrandname", "status": "taken", "profileUrl": "https://www.reddit.com/user/mybrandname" }
  ],
  "suggestions": ["mybrandname_", "getmybrandname", "mybrandnamehq"]
}`}</CodeBlock>
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <p><strong>score</strong> — 0-100, higher means more available across domains & platforms</p>
          <p><strong>description_for_ai</strong> — Natural language summary for LLMs</p>
          <p><strong>status</strong> — <code>"available"</code>, <code>"taken"</code>, or <code>"unknown"</code></p>
        </div>
      </Section>

      <Section id="filtering" title="Filtering">
        <p className="text-muted-foreground mb-3 text-sm">Filter results by TLD or platform using query parameters:</p>
        <CodeBlock title="Filter examples">{`# Only check .com and .io
GET /api/v1/check?q=mybrand&tlds=com,io

# Only check GitHub and Reddit
GET /api/v1/check?q=mybrand&platforms=github,reddit

# Combine filters
GET /api/v1/check?q=mybrand&tlds=com&platforms=github`}</CodeBlock>
        <div className="mt-3 text-sm text-muted-foreground">
          <p><strong>Available TLDs:</strong> com, net, org, co, io, ai, app</p>
          <p><strong>Available platforms:</strong> GitHub, Reddit, Pinterest, Twitch, Medium, Vimeo</p>
        </div>
      </Section>

      <Section id="rate-limits" title="Rate Limits">
        <p className="text-muted-foreground text-sm">
          <strong>30 requests per minute</strong> per IP address. If exceeded, you&apos;ll receive a <code>429</code> response. No API key required.
        </p>
      </Section>

      <Section id="auth" title="Authentication">
        <p className="text-muted-foreground text-sm">
          Currently no authentication is required. You can optionally pass an <code className="bg-muted px-1 py-0.5 rounded">X-API-Key</code> header — it will be recognized in the future for higher rate limits.
        </p>
      </Section>

      <Section id="examples" title="Examples">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 text-sm">curl</h3>
            <CodeBlock>{`# GET
curl "${baseUrl}/api/v1/check?q=mybrandname"

# POST
curl -X POST ${baseUrl}/api/v1/check \\
  -H "Content-Type: application/json" \\
  -d '{"query": "mybrandname"}'

# With filters
curl "${baseUrl}/api/v1/check?q=mybrand&tlds=com,io&platforms=github"`}</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm">Python</h3>
            <CodeBlock title="python">{`import requests

# GET
r = requests.get("${baseUrl}/api/v1/check", params={"q": "mybrandname"})
data = r.json()
print(data["description_for_ai"])

# POST
r = requests.post("${baseUrl}/api/v1/check", json={"query": "mybrandname"})
data = r.json()
for d in data["domains"]:
    print(f"{d['domain']}: {d['status']}")`}</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm">JavaScript / fetch</h3>
            <CodeBlock title="javascript">{`// GET
const res = await fetch("${baseUrl}/api/v1/check?q=mybrandname");
const data = await res.json();
console.log(data.description_for_ai);

// POST
const res = await fetch("${baseUrl}/api/v1/check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "mybrandname" }),
});
const data = await res.json();`}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section id="openapi" title="OpenAPI Spec">
        <p className="text-muted-foreground text-sm mb-3">
          A full OpenAPI 3.0 spec is available for AI agents, ChatGPT plugins, and code generation:
        </p>
        <ul className="text-sm space-y-1">
          <li>
            <code className="bg-muted px-1.5 py-0.5 rounded"><a href="/api/openapi.json" className="hover:underline">/api/openapi.json</a></code> — OpenAPI 3.0 spec
          </li>
          <li>
            <code className="bg-muted px-1.5 py-0.5 rounded"><a href="/.well-known/ai-plugin.json" className="hover:underline">/.well-known/ai-plugin.json</a></code> — ChatGPT plugin manifest
          </li>
        </ul>
      </Section>

      <Section id="errors" title="Error Handling">
        <CodeBlock title="Error response format">{`{
  "error": "Missing required query parameter: q"
}

// Status codes:
// 400 — Bad request (missing/invalid parameters)
// 429 — Rate limit exceeded
// 500 — Server error`}</CodeBlock>
      </Section>
    </div>
  );
}
