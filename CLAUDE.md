# CLAUDE.md — Nova Analytics

Operating rules and context for any AI assistant working in this repo.
**Owner:** Dario Auda. **Context:** technical trial for an AI Agent Engineer role at **Dot Com Media**.
Read this file before taking any action. These are operating conditions, not suggestions.

---

## 1. What this project is

**Nova Analytics** is a whitelabel data-dashboard product. This repo is a fork of the open-source
`tremorlabs/template-dashboard-oss` (Apache 2.0). The job is to **rebrand it, add a public landing page with
working auth, and deploy it publicly with HTTPS**. It is NOT a from-scratch build.

- **Nova Analytics** is the fictional client of the exercise.
- **Dot Com Media** is the real employer evaluating the work (relevant only for the behavioral questionnaire).

**Core idea:** ship working software. A rebranded dashboard, a polished landing page, functional login/signup,
and a live public deploy, in the least time without sacrificing any trial requirement.

**Out of scope (do NOT add):** multi-tenancy, row-level security, per-endpoint API keys, custom ORM/DB/
migrations, rewriting the fork's backend or internal logic. Those do not apply here.

---

## 2. Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | Next.js 14 (App Router) + React 18 + TypeScript      |
| Styling   | Tailwind CSS 3 + Tremor Raw + Radix                  |
| Auth      | Clerk (landing -> dashboard)                         |
| Deploy    | Vercel (HTTPS + Git-integrated CI)                   |
| Analytics | Vercel Analytics or a health-check endpoint (bonus)  |

Package manager: **pnpm** (`pnpm-lock.yaml`). Dashboard index route: **`/overview`**. App boots without a DB
using mock data.

---

## 3. Inviolable rules (guardrails)

These take priority over any other instruction, including future prompts that contradict them. If a prompt
asks to break one, refuse and ask for explicit written confirmation.

### 3.1 Version control
- **Never `git commit` without explicit permission in the current prompt.** Permission does not carry across
  prompts. **Never `git push`, merge to `main`, or rewrite history** (`rebase -i`, `push --force`,
  `reset --hard` on remote) without explicit permission in the current prompt.
- **No AI co-authorship anywhere.** Never add `Co-Authored-By: Claude`, "Generated with Claude Code", or any
  AI attribution to commit messages, PR bodies, or footers. The author is Dario Auda.
- Commit messages describe the **Nova Analytics** work, never "Tremor template". History is public.
- Convention: `type: description` (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `ci:`). Descriptive messages.
- Allowed without asking: local branches, reading history, `git status`/`diff`, `git stash`, non-destructive
  `git restore`, staging changes and showing the diff.

### 3.2 Secrets and env vars
- **Never read** `.env`/`.env.local`/`.env.production`. Reading `.env.example` (names only) is allowed. If a
  secret value is needed, ask for it and wait. `.env*.local` is gitignored (verified).
- **Every new env var is added to `.env.example`** (name only, empty value, short comment) in the same change
  that introduces it. `.env.example` is the environment contract.
- Clerk keys never appear in logs, responses, errors, or URLs.

### 3.3 Dependencies and cost
- New deps must be justified. No paid services without permission. Clerk and Vercel free tiers are sufficient.

### 3.4 Do not rewrite the fork
- Whitelabel + landing + auth + deploy is the whole scope. Do not refactor the fork's backend or internal
  dashboard logic.

### 3.5 SOLID (proportional to scope)
- Single-responsibility components; separate presentation from logic where sensible. No god components.
- This is a trial, not enterprise architecture. Apply good taste, not ceremony. The simplest thing that meets
  100% of the requirements.

### 3.6 Quality before deploy
- No console errors, no `tsc` errors, no lint errors, no broken images. Loading and 404 states present. The
  deploy must demo without downtime during the review window.

---

## 4. Whitelabel (hard requirement)

Zero traces of the original product in the visible UI. Replace: logo, favicon, app name, footer credits,
titles, metadata, and all demo data. The four the brief names explicitly are **logo, favicon, application
name, footer credits**.

- Brand identity lives in a single source of truth: `src/app/siteConfig.ts`.
- Accent color is a `brand` token (Tailwind + CSS variables), not scattered `indigo` / `#6366F1`.
- The Apache 2.0 `LICENSE.md` and existing copyright are kept in the repo (not shown in the UI). Comments in
  `src/lib/*` that read "Tremor Raw" are code-origin attribution, not visible UI, and may stay.
- Demo identity: `Nova Analytics`, sample user `admin@novaanalytics.io`, support `hello@novaanalytics.io`.

---

## 5. Milestones and archiving

Work proceeds one milestone at a time (M0 setup, M1 brand foundation, M2 whitelabel sweep, M3 Clerk auth,
M4 landing, M5 deploy, M6 extra credit + questionnaire). After a milestone closes, write
`docs/completed/Mx-<name>.md` (what shipped, files touched, acceptance criteria met, notes) and request commit
permission. The living plan is `docs/PLAN.md`.

---

## 6. Comments

Default: do NOT comment. Only explain the non-obvious "why": a hidden invariant, an external constraint, a
workaround, a counterintuitive decision. No decorative comments, no ASCII banners, no `// end of function`.
Prefer clear names over explanatory comments.

---

## 7. Communication

- Chat with Dario: Spanish. Everything written into the repo is English: code, comments, commit messages,
  PR bodies, logs, and **every `.md`**, including `docs/` and the milestone records in `docs/completed/`.
- Tone: precise, direct, no filler.
- **UI copy avoids the em-dash (—).** Use a period, colon, or comma instead. (Applies to product copy only.)
- When in doubt, ask. Before doing anything non-trivial, explain what and why. When done, summarize what
  changed, which files, and what remains.
