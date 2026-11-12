# Plan 001: The repo has a one-command test suite and a CI workflow that gates pull requests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat c7dca7c..HEAD -- package.json package-lock.json tsconfig.json .github/workflows src/lib/scoring.ts src/lib/suggestions.ts src/lib/input-parser.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `c7dca7c`, 2026-11-11

## Why this matters

The repo has no tests, no `typecheck` script, and no CI that runs on pull
requests. The only workflow (`.github/workflows/daily-blog.yml`) is a daily
content job that pushes straight to the default branch. A broken change
therefore reaches production with nothing checking it first. Every other plan
in `plans/` needs a way to show its fix works. This plan adds that baseline:
Vitest, a first set of characterization tests for the pure scoring and
parsing logic, and a CI workflow that runs typecheck, tests and build on every
PR.

## Current state

- `package.json` `scripts` (full block, as of `c7dca7c`):
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "blog:generate": "node scripts/generate-daily-blog.mjs",
    "blog:generate:dry-run": "node scripts/generate-daily-blog.mjs --dry-run",
    "start": "next start",
    "lint": "eslint"
  },
  ```
- Tooling: Next.js 16.1.6 (App Router), React 19, TypeScript 5.9.3 with `"strict": true` and `"noEmit": true` (`tsconfig.json`), path alias `"@/*": ["./src/*"]`, ESLint 9 flat config (`eslint.config.mjs`), npm with `package-lock.json`.
- `tsconfig.json` `include` already contains `"**/*.ts"`, `"**/*.tsx"` and `"**/*.mts"`, so new test files and a `vitest.config.mts` will be typechecked automatically.
- No test files exist: `git ls-files | grep -E '\.(test|spec)\.'` prints nothing.
- Baseline measured by the advisor on a clean copy at `c7dca7c` (Node 26, npm 11.20):
  - `npx tsc --noEmit` → exit 0.
  - `npm run build` → exit 0.
  - `npm run lint` → **fails with 46 problems (27 errors, 19 warnings), all pre-existing.** Errors by rule: `react-hooks/set-state-in-effect` 10, `react/no-unescaped-entities` 6, `@next/next/no-html-link-for-pages` 5, `@typescript-eslint/no-explicit-any` 3, `react-hooks/error-boundaries` 2, `react-hooks/immutability` 1. This plan does **not** fix them (see Scope), so CI runs lint as a non-blocking step for now.
- Pure functions to characterize (no I/O):
  - `src/lib/scoring.ts`: `calculateScore({ domainResults, usernameResults, name })`. Weights are 40 platform + 30 domain (TLD-weighted, total weight 12) + 20 readability + 10 length, rounded.
  - `src/lib/suggestions.ts`: `generateSuggestions(name)`. It builds 7 prefixed variants, then 8 suffixed variants, then (for names longer than 6 characters) 2 abbreviations, and returns `.slice(0, 8)`. In practice only the 7 prefixes and the `hq` suffix are ever returned (see the Maintenance note).
  - `src/lib/input-parser.ts`: `parseInput(query)` and the zod `searchSchema`.
- Code style: double quotes, semicolons, 2-space indent, named exports, `@/` imports in app code and relative imports inside `src/lib`.

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Install   | `npm ci`             | exit 0 |
| Typecheck | `npm run typecheck`  | exit 0 (added in Step 1) |
| Tests     | `npm test`           | exit 0, all pass (added in Step 1) |
| Build     | `npm run build`      | exit 0, ends with the route table |
| Lint      | `npm run lint`       | currently exits non-zero with 27 pre-existing errors. Your change must not increase the error count. |

## Scope

**In scope** (the only files you should modify or create):
- `package.json` (add `devDependencies.vitest` and the scripts `typecheck`, `test`, `test:watch`)
- `package-lock.json` (updated only by `npm install`)
- `vitest.config.mts` (create)
- `src/lib/scoring.test.ts` (create)
- `src/lib/suggestions.test.ts` (create)
- `src/lib/input-parser.test.ts` (create)
- `.github/workflows/ci.yml` (create)

**Out of scope** (do NOT touch):
- Any file under `src/` other than the three new test files. These tests *pin* current behavior, including odd behavior. Do not "fix" `generateSuggestions` or `calculateScore`.
- The 27 existing lint errors. They need a separate, reviewed change, because several are React hook-ordering rules where a mechanical fix can change behavior.
- `.github/workflows/daily-blog.yml`.
- Any other dependency upgrade. Install only `vitest`.

## Git workflow

- Branch: `advisor/001-verification-baseline`
- Conventional commits (the repo's automation uses `chore: ...`). Example: `test: add vitest and characterization tests for scoring`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add Vitest and scripts

Run `npm install --save-dev vitest@^3.2.4`. Then add these scripts to `package.json` and keep the existing ones:
```json
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:watch": "vitest"
```
Create `vitest.config.mts` at the repo root:
```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

**Verify**: `npm run typecheck` exits 0. `npx vitest --version` prints a 3.x version.

### Step 2: Characterization tests for `calculateScore`

Create `src/lib/scoring.test.ts`. Import with `import { describe, it, expect } from "vitest";` (no globals). Build inputs from the 7 TLDs `[".com", ".net", ".org", ".co", ".io", ".ai", ".app"]` and 20 synthetic platforms (`{ platform: "p" + i, status }`). The advisor computed these values against `c7dca7c`, and they must hold exactly:

| Case | domains | usernames (20) | name | expected |
|------|---------|----------------|------|----------|
| best case | all `available` | all `available` | `"brandly"` | `95` |
| worst case | all `taken` | all `taken` | `"brandly"` | `25` |
| only .com free | `.com` available, rest `taken` | all `taken` | `"acme"` | `34` |
| no platforms | all `taken` | `[]` (empty array) | `"mybrand"` | `25` |
| digits in name | all `taken` | all `taken` | `"brand24"` | `20` |

Also add: `calculateScore` returns an integer (`Number.isInteger`) for the best case.

**Verify**: `npm test` → 6 passing tests in `scoring.test.ts`.

### Step 3: Characterization tests for `generateSuggestions`

Create `src/lib/suggestions.test.ts`:
- `generateSuggestions("acme")` deep-equals `["goacme","getacme","tryacme","useacme","myacme","theacme","heyacme","acmehq"]`.
- `generateSuggestions("BrandScout")` deep-equals `["gobrandscout","getbrandscout","trybrandscout","usebrandscout","mybrandscout","thebrandscout","heybrandscout","brandscouthq"]`. This shows input is lowercased.
- The result length is at most 8 for any input.
- The result never contains the cleaned input itself.

**Verify**: `npm test` → all suggestion tests pass.

### Step 4: Tests for `parseInput` / `searchSchema`

Create `src/lib/input-parser.test.ts`:
- `parseInput("Acme.com")` → `{ type: "domain", value: "acme" }`
- `parseInput("my-brand.io")` → `{ type: "domain", value: "my-brand" }`
- `parseInput("My Brand")` → `{ type: "name", value: "mybrand" }`
- `parseInput("  ACME  ")` → `{ type: "name", value: "acme" }`
- `parseInput("!!!")` → `{ type: "name", value: "" }`. Pins current behavior; plan 002 adds a guard at the API layer.
- `searchSchema.safeParse({ query: "" }).success` → `false`
- `searchSchema.safeParse({ query: "a".repeat(64) }).success` → `false`
- `searchSchema.safeParse({ query: "acme" }).success` → `true`

**Verify**: `npm test` → all pass. Total count is about 18 tests in 3 files.

### Step 5: Add a PR CI workflow

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - name: Lint (non-blocking until existing errors are fixed)
        run: npm run lint
        continue-on-error: true
      - run: npm run build
```
The default branch is `main` (confirmed with `git remote show origin` at planning time).

**Verify**: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo ok` prints `ok`. If PyYAML is missing, use `npx --yes yaml-lint .github/workflows/ci.yml` or check the indentation by eye against the block above.

### Step 6: Full local run

**Verify**, in order:
- `npm run typecheck` → exit 0
- `npm test` → exit 0
- `npm run build` → exit 0
- `npm run lint 2>&1 | tail -1` → still reports `27 errors` (or fewer). It must not report more.

## Test plan

This plan *is* the test infrastructure. New tests: `scoring.test.ts` (6),
`suggestions.test.ts` (4), `input-parser.test.ts` (8). They are characterization
tests: they record what the code does today, so later refactors can't change
it silently. When a later plan deliberately changes behavior, that plan updates
the matching expectation and says why.

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` exits 0 and reports 3 test files, ≥18 tests, 0 failed
- [ ] `npm run build` exits 0
- [ ] `npm run lint` reports ≤27 errors
- [ ] `node -e "const p=require('./package.json');process.exit(p.scripts.test&&p.scripts.typecheck&&p.devDependencies.vitest?0:1)"` exits 0
- [ ] `test -f .github/workflows/ci.yml && grep -q 'npm test' .github/workflows/ci.yml` succeeds
- [ ] `git status --porcelain` lists only in-scope files and `plans/README.md`
- [ ] `plans/README.md` status row for 001 updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any characterization value in Step 2 or Step 3 does not match. The code has drifted, or the advisor's numbers are wrong. Report the actual value; do not just update the expectation.
- `npm install --save-dev vitest@^3.2.4` changes the version of any existing dependency in `package-lock.json` (check `git diff package-lock.json | grep '"version"'` for entries outside `vitest`/`@vitest/*`/`vite`/their transitive deps).
- `npm run typecheck` fails after adding `vitest.config.mts` or test files and the fix would need edits to `tsconfig.json`.
- `npm run build` fails on a clean checkout before you change anything. That is a pre-existing break; report it.

## Maintenance notes

- **Suggestion bug, recorded but not fixed here**: `generateSuggestions`
  (`src/lib/suggestions.ts:21`) does `slice(0, 8)` after adding 7 prefixes
  first. As a result the suffixes `app, hub, lab, co, io, now, dev` and the
  abbreviations are never returned. A follow-up fix should change the
  suggestions test on purpose.
- When the 27 lint errors are fixed, remove `continue-on-error: true` from
  the lint step in `ci.yml` so lint becomes blocking.
- `npm` ≥ 11.20 asks for approval before running install scripts (prisma,
  sharp). Typecheck and build passed without them on the advisor's machine. If
  `@prisma/client` types go missing locally, run `npx prisma generate`. CI on
  Node 22 uses npm 10, which runs install scripts normally.
- Reviewer: confirm that only `vitest` and its transitive dependencies were
  added to the lockfile.
