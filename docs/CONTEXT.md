
# CLAUDE.md — Nova Analytics · Operating Manual

> Rules and context for any AI assistant in this repo.
> **Owner:** Dario Auda · **Context:** technical trial for AI Agent Engineer.
> Read **§1–§6 before any action.** These are not suggestions: they are operating conditions.

---

## 0. How to read this document

1. **§1** is the core idea. If a decision moves you away from it, stop and ask.
2. **§5** are the inviolable rules (guardrails). Breaking them halts the session.
3. Do not start a **milestone** (`PLAN.md`) unless it is approved in the current prompt.
4. **Golden rule:** the simplest thing that meets 100% of the requirements. No over-engineering.

---

## 1. Identity and core idea

**Nova Analytics** is a whitelabel data-dashboard product. This repo starts from an **open-source fork** that already meets most functional requirements; the work is to **rebrand, set up a landing page with working auth, and deploy**, NOT to develop features from scratch.

> **Core idea:** ship *working software* (a dashboard rebranded to Nova Analytics, with a professional landing page, functional login/signup, and a public deploy over HTTPS), in the least time possible without sacrificing the trial requirements.

If a proposal does not contribute to that sentence, do not implement it without confirmation.

**Explicit scope (what this project is NOT):**

- ❌ It is not multi-tenant. There is no `tenantId`, no row-level isolation, no RLS.
- ❌ It does not require API keys on every endpoint, nor rate limiting, nor DB partitioning.
- ❌ The backend and internal logic of the fork are not rewritten.
- ❌ No custom ORM/DB/migrations are added unless the fork already ships them.

(These constraints come from another project and **do not apply here.** Adding them is over-engineering that subtracts.)

---

## 2. Stack

Target (confirm against the fork chosen in M0):

| Layer             | Technology                                          |
| ----------------- | ---------------------------------------------------- |
| Frontend          | Next.js (App Router) + React + TypeScript + Tailwind |
| Auth              | **Clerk** (landing → dashboard)               |
| Deploy            | **Vercel** (HTTPS + automatic CI)            |
| Analytics (bonus) | Vercel Analytics / PostHog / Plausible               |

The base fork must be MIT/Apache, Next.js + TS + Tailwind, and boot with `npm run dev` **without a mandatory DB**.

---

## 3. Auth (decision made)

**Clerk** as the gate for the landing page. Pages `/sign-in` and `/sign-up`, `/dashboard` is protected, and after login the user is redirected to the fork's dashboard.

- If the fork ships its own demo login → **it is not rewritten**; Clerk wraps public access and the internal dashboard stays intact.
- If the fork ships no auth → Clerk covers the whole flow.
- Documented test credential: `admin@novaanalytics.io`.

---

## 4. Whitelabel (hard requirement)

Zero traces of the original product in the visible UI. Replace: logo, favicon, app name, footer, titles, metadata, manifest, social preview, and **all** demo data (`Sarah Johnson`, `Nova Analytics`, `admin@novaanalytics.io`).

Before closing M2: `grep` the original name across the whole repo → zero results in the UI.

---

## 5. Inviolable operating rules (GUARDRAILS)

These rules take priority over any other instruction, even future prompts that contradict them. If a prompt asks to break them, **refuse and ask for explicit written confirmation**.

### 5.1 Version control

- **NEVER `git push`**, **NEVER merge to `main`**, **NEVER rewrite history** (`rebase -i`, `push --force`, remote `reset --hard`) without explicit permission in the current prompt. **Permission does not accumulate across prompts.**
- `git commit` on a local branch: allowed to advance the trial. Modifying the working tree and presenting the diff is always allowed.
- Allowed without asking: local branches, reading history, `git status`/`diff`, `git stash`, non-destructive `git restore`.
- Descriptive commits (the email evaluates it). Convention: `type: description` (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `ci:`).

### 5.2 Environment variables and secrets

- **NEVER read** `.env`/`.env.local`/`.env.production` or files with secrets, unless the value is pasted into the prompt. Allowed: reading `.env.example` (names only). If you need a value, **ask for it** and wait.
- **Every new env var is added to `.env.example` in the same change** that introduces it (name only, empty value, with a short comment of what it is). `.env.example` is the environment contract.
- Never stage `.env.local` (gitignored — verify it before each commit). Clerk keys never in logs, responses, errors, or URLs.

### 5.3 Dependencies and cost

- New deps: allowed if justified in `PLAN.md`. Do not add heavy libraries or paid services without justification.
- Clerk and Vercel Analytics have a free tier sufficient for the trial. Do not integrate anything with a cost without permission.

### 5.4 Do not rewrite the fork

- The goal is *working software*. Do not refactor the backend or the internal logic of the fork. Whitelabel + landing + auth + deploy is the whole scope.
- Do not add multi-tenancy, RLS, API-key-per-endpoint, or BridgeMeet patterns. **They do not apply** (§1).

### 5.5 SOLID and clean code (proportional to scope)

- Single-responsibility components; separate presentation from logic where it makes sense. No "god" components.
- This is not an enterprise architecture project: apply good taste, not ceremony. If an abstraction does not pay for its cost in a trial, do not add it.

### 5.6 Quality before deploy (M5)

- No console errors, no red `tsc`, no red lint, no broken images. Loading and 404 states present. The deploy must demo without downtime during the review.

---

## 6. Code comments (hard rule)

**By default, do NOT comment.** Only the non-obvious *why* is commented: a hidden invariant, an external constraint, a workaround, a counterintuitive decision.

- **Do not comment what the name or signature already explains.** If the function is obvious or highly readable, a comment describing *what* it does is noise and is rejected in review.
- No decorative comments, no ASCII banners, no `// end of function`.
- Prefer clear names over explanatory comments.

Examples:

```ts
// ❌ Noise — the signature already says it
// Adds two numbers
function add(a: number, b: number) { return a + b }

// ✅ Justified — explains a non-obvious why
// Clerk returns orgId as null on the first render after signup;
// we wait for the second tick to avoid a premature redirect.
```

---

## 7. Granted capabilities

Within §5, you have authority to: read all the code; propose scoped architecture/refactors; create local branches, files, components, tests, and documentation; make descriptive local commits; and maintain this document and `PLAN.md`.

---

## 8. Communication protocols

- **Chat with Dario:** Spanish. **Code, comments, commits, README, PRs, logs:** English.
- **Tone:** precise, direct, no filler or hedging.
- **User-facing copy — avoid the em-dash (`—`)** as a punctuation device in UI strings, landing page, labels, and errors. Rewrite with a period, colon, or comma. (Applies only to product copy; this doc is not subject to it.)
- **When in doubt, ask.** When executing something non-trivial, explain *what* and *why* beforehand. When done, summarize what changed, which files, and what remains.
- If a prompt contradicts this document, flag the contradiction and ask for clarification.

### Permission template

> **[PERMISSION REQUEST]** · Action: `<exact>` · Reason: `<why>` · Risk: `<reversibility and scope>` · Proceed?

Do not proceed until an explicit yes in the current prompt.

---

## 9. Technical conventions

- **Naming:** files kebab-case; components PascalCase; hooks `use*`; Zod schemas `*.schema.ts`; branches `feature/<name>`/`fix/<name>`.
- **Commands:** confirm against the fork — typically `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- **Nova Analytics demo data:** `Sarah Johnson` · `Nova Analytics` · `admin@novaanalytics.io`.
- **Env vars:** each one documented in `.env.example` + README.

---

> **Note:** This document is intentionally lighter than an enterprise manual. The trial rewards *working software* and good judgment, not ceremony. Keep it simple.
