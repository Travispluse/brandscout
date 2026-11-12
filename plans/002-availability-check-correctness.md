# Plan 002: DNS ENODATA and LinkedIn bot-blocks no longer read as "available", "unknown" results are retryable, and empty names are rejected

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat c7dca7c..HEAD -- src/lib/domain-check.ts src/lib/username-check.ts src/lib/input-parser.ts src/app/api/search/route.ts src/app/api/v1/check/route.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.
> **Permitted predecessor changes (not drift):** other maintainer-approved
> changes may already have added lines near the top of the route handlers in
> `src/app/api/search/route.ts` and `src/app/api/v1/check/route.ts`. If the
> `parseInput(...)` call sites and the `src/lib/*` excerpts quoted below are
> unchanged, proceed. Stop only on changes to those quoted lines.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-verification-baseline.md` (needs `npm test` / Vitest to exist)
- **Category**: bug
- **Planned at**: commit `c7dca7c`, 2026-11-11

## Why this matters

Scope note: this plan fixes the four specific defects below. It does not
re-validate every platform's heuristic against live sites. Those remain as
they are.

BrandScout's whole value is telling users whether a name is free. Four defects
in the check pipeline make it report wrong answers:

1. When the RDAP lookup fails, the DNS fallback treats `ENODATA` as "available".
   `ENODATA` means *the name exists in DNS but has no A record* (e.g. a
   registered domain that only has MX/TXT records). Verified with Node:
   `dns.resolve("_dmarc.google.com")` rejects with `ENODATA`, while a
   non-existent name rejects with `ENOTFOUND`. A registered domain is shown as
   available. A false "available" is the worst error this product can make,
   because a user may build a brand on it.
2. LinkedIn returns HTTP **999** to requests it classifies as bots, whether or
   not the profile exists. The code maps 999 to "available".
3. Results with status `"unknown"` are cached for 5 min (domains) or 10 min
   (usernames). The UI shows a **Retry** button only on `"unknown"` rows, and a
   retry within the TTL gets the same cached "unknown" back, so Retry does
   nothing.
4. Input that is non-empty but has no letters or digits (e.g. `"!!!"` or
   `"---"`) passes validation, then `parseInput` normalizes it to `""`. The
   API then checks the domain `".com"` and the profile `https://github.com/`,
   and returns a meaningless result and score instead of a 400.

## Current state

Files:
- `src/lib/domain-check.ts`: RDAP lookup, DNS fallback, and caching for 7 TLDs.
- `src/lib/username-check.ts`: per-platform HTTP profile checks and caching.
- `src/lib/input-parser.ts`: zod schema plus `parseInput` (normalizes the query).
- `src/app/api/search/route.ts`: `POST /api/search`, used by the website UI.
- `src/app/api/v1/check/route.ts`: public `GET`/`POST /api/v1/check`.
- `src/lib/cache.ts`: in-memory TTL cache. Exports `cache` (with `.get`, `.set`, `.clear()`).

`src/lib/domain-check.ts:30-58`:
```ts
async function checkDNS(domain: string): Promise<DomainStatus> {
  try {
    await dns.resolve(domain);
    return "taken";
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") return "available";
    return "unknown";
  }
}

export async function checkDomain(name: string, tld: string): Promise<DomainResult> {
  ...
  const result = { domain, tld, status, source };
  cache.set(cacheKey, result, DOMAIN_CACHE_TTL);
  return result;
}
```

`src/lib/username-check.ts:113-122` (LinkedIn entry in `PLATFORMS`):
```ts
  {
    name: "LinkedIn",
    urlTemplate: "https://www.linkedin.com/in/{}",
    method: "HEAD",
    checkFn: (res: Response) => {
      if (res.status === 404 || res.status === 999)
        return { status: "available" as UsernameStatus, confidence: 0.8 };
      if (res.ok) return { status: "taken" as UsernameStatus, confidence: 0.8 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
```

`src/lib/username-check.ts:203-212` (inside `checkPlatform`; every HTTP result is cached, including `"unknown"`):
```ts
    const r: UsernameResult = {
      platform: platform.name,
      username,
      status: result.status,
      profileUrl: displayUrl,
      source: "http",
      confidence: result.confidence,
    };
    cache.set(cKey, r, USERNAME_CACHE_TTL);
    return r;
```

`src/lib/input-parser.ts:9-21`:
```ts
export function parseInput(query: string): { type: "name" | "domain"; value: string } {
  const trimmed = query.trim().toLowerCase();
  const domainRegex = /^[a-z0-9-]+\.[a-z]{2,}$/;
  if (domainRegex.test(trimmed)) {
    const parts = trimmed.split(".");
    return { type: "domain", value: parts[0] };
  }
  return { type: "name", value: trimmed.replace(/[^a-z0-9]/g, "") };
}
```
Note: a domain such as `---.com` matches `domainRegex` and yields `value: "---"`.
`checkAllDomains` keeps hyphens (`/[^a-z0-9-]/g`), so that value stays
non-empty but has no letters or digits.

`src/app/api/search/route.ts:18` calls `parseInput(parsed.data.query)` and uses
`value` immediately. `src/app/api/v1/check/route.ts:39` does the same inside
`handleCheck`. Both routes return errors as `NextResponse.json({ error: "<message>" }, { status })`.
In v1 this goes through the local helper `errorResponse(message, status)`
(`route.ts:19-21`), which adds CORS headers. Match each route's existing
pattern.

Conventions: TypeScript strict, double quotes, 2-space indent, semicolons,
`@/` alias for `src/`. Statuses are the string unions `"available" | "taken" | "unknown"`.

## Commands you will need

| Purpose   | Command                                   | Expected on success |
|-----------|-------------------------------------------|---------------------|
| Install   | `npm ci`                                  | exit 0              |
| Typecheck | `npm run typecheck`                       | exit 0 (script added by plan 001) |
| Tests     | `npm test`                                | all pass            |
| Lint      | `npm run lint`                            | no new errors in files you touched (compare with `git stash` baseline if unsure) |

If `npm run typecheck` or `npm test` does not exist, plan 001 has not landed. STOP.

## Scope

**In scope** (the only files you should modify or create):
- `src/lib/domain-check.ts`
- `src/lib/username-check.ts`
- `src/lib/input-parser.ts`
- `src/app/api/search/route.ts`
- `src/app/api/v1/check/route.ts`
- `src/lib/domain-check.test.ts` (create)
- `src/lib/username-check.test.ts` (create)
- `src/lib/input-parser.test.ts` (create, or extend if plan 001 already created it)

**Out of scope** (do NOT touch):
- `src/components/results-view.tsx`. The Retry buttons re-run the whole search; redesigning that is a separate change. This plan only makes Retry work by not caching "unknown".
- The confidence values and status mapping of every other platform in `PLATFORMS`. Only LinkedIn changes.
- The `ENOTFOUND` → "available" mapping. It stays; changing it is a product decision.
- `src/lib/http-client.ts` and `src/lib/cache.ts`.
- The response JSON shape of both API routes, except adding the new 400 error case.

## Git workflow

- Branch: `advisor/002-availability-check-correctness`
- Conventional commits, matching the repo's automation (`chore: publish daily BrandScout blog post`). Example: `fix: treat DNS ENODATA as taken, not available`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Map DNS `ENODATA` to "taken"

In `src/lib/domain-check.ts` `checkDNS`, change the catch block so that:
- `ENOTFOUND` returns `"available"` (unchanged),
- `ENODATA` returns `"taken"`, with the comment `// ENODATA: the name exists in DNS but has no A record, so it is registered` **on its own line directly above** the `if` (not trailing on the same line, or the Verify grep below won't see the `if`),
- anything else returns `"unknown"` (unchanged).

**Verify**: `grep -n 'ENODATA' src/lib/domain-check.ts | grep -v '//'` prints exactly one line, `if (code === "ENODATA") return "taken";`. `grep -nE 'ENOTFOUND.*ENODATA|ENODATA.*ENOTFOUND' src/lib/domain-check.ts` prints nothing.

### Step 2: Map LinkedIn 999 to "unknown"

In `src/lib/username-check.ts`, in the LinkedIn `checkFn`, only `404` maps to `available`.
Add a branch *before* the `res.ok` check:
`if (res.status === 999) return { status: "unknown" as UsernameStatus, confidence: 0.2 };`
with a comment `// 999 = LinkedIn bot-block; says nothing about the profile`.

**Verify**: `grep -n '999' src/lib/username-check.ts` shows a line returning `"unknown"`, and no line where 999 and `available` appear together.

### Step 3: Do not cache "unknown" results

- `src/lib/domain-check.ts` `checkDomain`: call `cache.set(...)` only when `status !== "unknown"`.
- `src/lib/username-check.ts` `checkPlatform`: call `cache.set(...)` only when `result.status !== "unknown"`.

**Verify**: `grep -n -B2 'cache.set' src/lib/domain-check.ts src/lib/username-check.ts` shows each `cache.set` guarded by an `!== "unknown"` condition.

### Step 4: Reject queries that normalize to nothing usable

In `src/lib/input-parser.ts`, keep `parseInput`'s signature and behavior unchanged. Add and export:
```ts
export function hasCheckableName(value: string): boolean {
  return /[a-z0-9]/.test(value);
}
```
Then, in both routes, right after `parseInput(...)`, return a 400 if `!hasCheckableName(value)`:
- `src/app/api/search/route.ts`: `return NextResponse.json({ error: "Please enter a name containing letters or numbers" }, { status: 400 });`
- `src/app/api/v1/check/route.ts`: `handleCheck` returns the result object, so do the check in `GET` and `POST` *before* calling `handleCheck`: call `parseInput(q.trim())` (or `parseInput(query.trim())`), and if `!hasCheckableName(...)` return `errorResponse("Query must contain letters or numbers", 400)`. Leave `handleCheck` unchanged.

**Verify**: `npm run typecheck` exits 0.

### Step 5: Add tests (see Test plan), then run everything

**Verify**: `npm test` passes, including the new test files. `npm run typecheck` exits 0.

## Test plan

Use Vitest (set up by plan 001). Model the files on the first test file plan 001
created (for example `src/lib/scoring.test.ts`). In every test file call
`cache.clear()` (import `{ cache }` from `./cache`) in `beforeEach`, so cached
results do not leak between tests.

`src/lib/domain-check.test.ts`: mock DNS with `vi.mock("dns/promises", () => ({ default: { resolve: vi.fn() } }))`, then `import dns from "dns/promises";` and drive it with, for example, `vi.mocked(dns.resolve).mockRejectedValue(Object.assign(new Error("x"), { code: "ENODATA" }))` or `.mockResolvedValue(["1.2.3.4"] as never)`. Mock `fetch` with `const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);`, and build RDAP replies with `new Response(null, { status: 404 })` (statuses 200–599 are fine with `new Response`). Restore with `vi.unstubAllGlobals()` and `vi.resetAllMocks()` in `afterEach`. Use a distinct name per `it` block (or rely on `cache.clear()` in `beforeEach`) so cached results never leak between cases.
- RDAP 404 → `status: "available"`, `source: "rdap"`.
- RDAP 200 → `"taken"`.
- RDAP 500, DNS resolves → `"taken"`, `source: "dns"`.
- RDAP 500, DNS rejects with `{ code: "ENODATA" }` → `"taken"`. **This is the regression test.**
- RDAP 500, DNS rejects with `{ code: "ENOTFOUND" }` → `"available"`.
- RDAP 500, DNS rejects with `{ code: "ETIMEOUT" }` → `"unknown"`, `source: "fallback"`.
- No caching of "unknown": RDAP 500 and DNS `ETIMEOUT` on the first call, then RDAP 404 on a second `checkDomain("x", ".com")` call → the second result is `"available"`, and `fetch` was called twice.
- Caching of known results: two calls with RDAP 404 → `fetch` called once.

`src/lib/username-check.test.ts`: mock the HTTP layer with `vi.mock("./http-client", () => ({ smartFetch: vi.fn() }))`, so tests skip the real 200–500 ms throttling. Use `checkSinglePlatform("LinkedIn", "acme")`. Get at the mock with `import { smartFetch } from "./http-client";` and `vi.mocked(smartFetch).mockResolvedValueOnce(...)`.
**Important:** Node's `Response` constructor only accepts statuses 200–599, so `new Response(null, { status: 999 })` throws `RangeError` inside the test. For 999, use a stub: `({ status: 999, ok: false } as Response)`. For 200 and 404, `new Response(null, { status: 200 })` / `{ status: 404 }` is fine (LinkedIn uses HEAD, so the body is never read).
- LinkedIn 999 (stub) → `"unknown"`. **Regression test.**
- LinkedIn 404 → `"available"`.
- LinkedIn 200 → `"taken"`.
- No caching of "unknown": first call returns the 999 stub, second returns `new Response(null, { status: 200 })` → second result `"taken"`, and `smartFetch` was called twice.
- GitHub (default check) 404 → `"available"`; GitHub 200 → `"taken"`. Put these in **separate `it` blocks**, because the cache would otherwise serve the first result to the second call.

`src/lib/input-parser.test.ts`:
- `hasCheckableName("")` → false; `("---")` → false; `("acme")` → true; `("a1")` → true.
- `parseInput("!!!").value` → `""`; `parseInput("Acme.com")` → `{ type: "domain", value: "acme" }`; `parseInput("My Brand")` → `{ type: "name", value: "mybrand" }`. These pin the existing behavior.

Run `npm test` → all pass, with the new files listed.

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` exits 0, and the output lists `domain-check.test.ts`, `username-check.test.ts` and `input-parser.test.ts`
- [ ] `grep -nE 'ENOTFOUND.*ENODATA|ENODATA.*ENOTFOUND' src/lib/domain-check.ts` returns no matches
- [ ] `grep -nE '999.*available|available.*999' src/lib/username-check.ts` returns no matches
- [ ] `grep -c 'hasCheckableName' src/app/api/search/route.ts src/app/api/v1/check/route.ts` reports ≥1 for each file
- [ ] `git status --porcelain` lists only in-scope files and `plans/README.md`
- [ ] `plans/README.md` status row for 002 updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the locations in "Current state" doesn't match the excerpts.
- `npm test` / `npm run typecheck` scripts do not exist (plan 001 not landed).
- Mocking `dns/promises` with a default export fails because the module is imported differently than `import dns from "dns/promises"`. Report the actual import line instead of rewriting the import.
- Making the tests pass appears to require changing `src/lib/cache.ts` or `src/lib/http-client.ts`.
- Any existing test (from plan 001) starts failing.

## Maintenance notes

- Not caching "unknown" means bursts of failing lookups are retried on every
  request. If upstream rate-limiting gets worse, consider caching "unknown"
  for a short TTL (≈15 s) instead of not at all. Don't go back to the full TTL,
  or Retry stops working again.
- Every new platform added to `PLATFORMS` should get a test case for its
  "available" signal. Bot-block statuses (999, 429, 403) must never map to
  "available".
- Reviewer: check that no API response shape changed, other than the new 400.
- Deferred: making the UI Retry re-check a single domain or platform instead of
  re-running the whole search (`src/components/results-view.tsx:597-625`).
