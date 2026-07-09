# Nova Analytics — Trial execution plan

## Context

Technical trial for the **AI Agent Engineer** role. The assignment (see `docs/instructions.md`): take an
open-source dashboard, rebrand it under the fictional identity **Nova Analytics** (whitelabel), add a public
landing page with functional login/signup, and deploy it to a public URL with HTTPS. All done with Claude
Code, and documenting the process.

**Real employer (for the questionnaire):** **Dot Com Media** (signs the email). Do NOT confuse it with **Nova
Analytics**, which is the *fictional* client of the exercise. Q11 of the questionnaire ("what excites you about
working with our company specifically") is answered about Dot Com Media, not about Nova Analytics.

**Chosen base repo:** `tremorlabs/template-dashboard-oss`, Apache 2.0, Next.js 14.2.23 (App Router),
React 18, TypeScript, Tailwind 3, Tremor Raw + Radix + Recharts. It boots without a database using mock data.
It is an analytics dashboard by design, so it fits thematically with "Nova Analytics" and its whitelabel is
clean (branding can be centralized). Apache 2.0 permits whitelabel and redistribution (it only requires keeping
the license and copyright in the repo, not in the visible UI).

**Current state:** `c:\Users\gonza\Desktop\test` contains only `docs/` (CONTEXT.md, instructions.md, the PDF
of the questionnaire). It is NOT a git repo yet. The fork does not exist yet. Tooling verified: git 2.40, gh CLI
authenticated as `dario2801` (scopes repo + workflow), node 20.19, npm 10.8, pnpm 10.33. GitHub, Vercel and
Clerk: the owner confirms he has all three accounts ready.

**Why this plan:** the owner asked to (1) work right here reusing `test`, renaming the project to
**nova-analytics**; (2) keep `docs/` and organize the ideas by milestones; (3) archive each completed milestone
in `docs/completed/`; (4) apply SOLID; (5) NOT commit without explicit permission; (6) no commit/PR
with Claude as co-author; (7) create a `CLAUDE.md` with the policies and requirements.

---

## Work policies (govern the whole execution)

Derived from `docs/CONTEXT.md` + the owner's new instructions. They are materialized in the M0 `CLAUDE.md`.

1. **Do not commit without explicit permission.** Every `git commit` requires a "yes" in the current prompt. The
   permission does not carry across prompts. `git push`, merge to `main`, and history rewriting: never without
   permission.
2. **No commit or PR with Claude as co-author.** Do not add `Co-Authored-By: Claude`, nor "Generated with
   Claude Code", nor any AI attribution in commit messages, PR bodies or footers. The author is
   Dario Auda. This rule is written explicitly in the M0 `CLAUDE.md`; when processing `docs/CONTEXT.md`
   in M0, if it carries any leftover AI co-authorship, it is removed.
12. **Commits reflect "Nova Analytics", not "Tremor".** The git history is visible in the public repo.
    From the first commit (M0), the messages describe the Nova Analytics work, not "Tremor template".
    History is not rewritten; the messages are simply born correct.
3. **Step-by-step mode.** Complete a milestone, show what changed, wait for OK before the next one.
4. **Secrets.** Never read `.env.local`. Every new env var goes to `.env.example` (name only) in the same
   change. Clerk keys never in logs, responses or URLs.
5. **SOLID proportional to scope.** Single-responsibility components, presentation separated from logic.
   No "god" components, no enterprise ceremony. The simplest thing that meets 100% of the requirements.
6. **Do not rewrite the fork.** Whitelabel + landing + auth + deploy is the whole scope. No multi-tenancy,
   RLS or API-key-per-endpoint (they do not apply).
7. **Comments:** only the non-obvious "why". No noise.
8. **UI copy without em-dash (—).** Use a period, comma or colon.
9. **Language:** chat in Spanish; code, commits, README, PRs in English.
10. **Descriptive commits**, convention `type: description` (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`).
11. **Archiving:** when closing each milestone, write `docs/completed/Mx-<name>.md` with what was delivered,
    files touched, acceptance criteria met and notes.

---

## Target folder structure

The project lives at the root `c:\Users\gonza\Desktop\test` (reused, no subfolder). The fork is cloned
here and `docs/` is kept inside the repo.

```
test/                         (git repo root = the Nova Analytics fork)
├── CLAUDE.md                 (policies + requirements — created in M0)
├── PLAN.md                   (living copy of this plan inside the repo)
├── README.md                 (rewritten for Nova Analytics)
├── LICENSE.md                (Apache 2.0 — kept)
├── .env.example              (environment contract)
├── docs/
│   ├── CONTEXT.md            (kept)
│   ├── instructions.md       (kept)
│   ├── Behavioral & Work Style Questionnaire.pdf
│   └── completed/            (one .md per closed milestone)
│       ├── M0-setup.md
│       ├── M1-brand-foundation.md
│       └── ...
├── src/app/ src/components/ src/data/ src/lib/  (fork code)
└── public/
```

**Method note for "reusing test":** `gh repo fork --clone` clones into a new subfolder. To have
the repo at the root without losing `docs/`, the approach is: fork with `gh repo fork ... --clone=false`, then
`git init` in `test/`, `git remote add origin <fork>`, `git fetch`, `git checkout` the content over the
current root (which already has `docs/`). A cleaner alternative: clone into a temp folder, move its content
(including `.git`) to the root, and keep `docs/`. It is decided in M0 and permission is requested for the fork action.

---

## Key architecture (design decisions)

### A. Brand Single-Source-of-Truth → extended `src/app/siteConfig.ts`
All of Nova Analytics's identity lives in ONE single module. We extend the existing `siteConfig.ts` (already
the canonical place in the template) instead of creating a new module, so as not to duplicate sources of truth:

```ts
export const siteConfig = {
  name: "Nova Analytics",
  tagline: "...",              // hero copy, sin em-dash
  url: "https://<vercel-url>",
  description: "...",
  supportEmail: "hello@novaanalytics.io",
  sampleUser: "admin@novaanalytics.io",
  baseLinks: { home: "/", overview: "/overview", signIn: "/sign-in", signUp: "/sign-up", ... },
}
```
Any brand string in components references `siteConfig`, never scattered literals.

### B. Color system → brand token in Tailwind + CSS variables (DRY light/dark)
Today the accent is `indigo` / `#6366F1` hardcoded and scattered. A Nova Analytics palette is introduced as a
**semantic token** so that color is DRY and whitelabel-able in one place:
- In `globals.css`: CSS variables `--brand-50 … --brand-950` (and foreground) with values for light and dark.
- In `tailwind.config.ts`: `theme.extend.colors.brand = { 50: 'var(--brand-50)', … , DEFAULT: 'var(--brand-500)' }`.
- Refactor: replace UI `indigo-*` uses with `brand-*`, and the logo's `#6366F1` with the token.
- Proposed palette (definable by us, the brief allows it): a deep blue-violet of the "Nova" type
  (e.g. base `#4F46E5`→`#6D28D9` family), to be confirmed visually in M1.

### C. Logo → new component `<BrandLogo/>` (single place for the brand)
`public/DatabaseLogo.tsx` renders the word "Database" in SVG. It is replaced by
`src/components/brand/brand-logo.tsx`: a single component (SRP) that renders the Nova Analytics brand (SVG
icon + wordmark), with a `variant` prop (full / icon) and color via the `brand` token. It is used in: landing
header, dashboard sidebar, and `not-found.tsx`. The favicon/OG are regenerated from the same mark.

### D. Clerk auth (M3) — Next.js 14 App Router pattern
- `pnpm add @clerk/nextjs`. Verify the version on install; use the current pattern for Next 14.
- `src/app/layout.tsx`: wrap with `<ClerkProvider>` outside the next-themes `<ThemeProvider>`.
- `src/middleware.ts`: `clerkMiddleware` + `createRouteMatcher` that protects `/overview`, `/details`,
  `/settings` and leaves `/`, `/sign-in`, `/sign-up` public. Clerk's standard `config.matcher`.
  (If on install the version marks `createRouteMatcher` as deprecated, use the current equivalent protection
  pattern; implementation decision in M3, does not block the plan.)
- Sign-in / sign-up: catch-all routes `src/app/sign-in/[[...sign-in]]/page.tsx` and
  `src/app/sign-up/[[...sign-up]]/page.tsx` with `<SignIn/>` / `<SignUp/>` styled with the brand token.
- Post-login redirect to `/overview` via `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (and sign-up).
- Replace `UserProfile.tsx` / `DropdownUserProfile.tsx` (hardcoded "Emma Stone", emma.stone@acme.com) with
  Clerk's `<UserButton/>` / `useUser()`. The rest of the dashboard stays intact (the fork is not rewritten).
- Env vars (all to `.env.example`): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
  `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`,
  `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/overview`,
  `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/overview`.

### E. Landing page (M4) — SOLID, single-responsibility components
`/` is free (there is no `app/page.tsx`; today it 404s). The public landing is created there:
- `src/app/page.tsx` — composes the landing (no logic, just layout).
- `src/components/landing/` — one component per section (SRP):
  `landing-header.tsx` (logo + sign-in/sign-up CTA), `hero.tsx`, `features.tsx` (benefits grid),
  `cta.tsx` (final signup call), `landing-footer.tsx` (Nova Analytics credits, no trace of Tremor).
- Reuses Tremor's `Button` and the color/typography tokens for visual consistency with the dashboard.
- Responsive/mobile-first with Tailwind utilities. CTAs link to `/sign-up` and `/sign-in`.
- The `not-found.tsx` "home" button now points to the landing.

### F. Deploy (M5) — Vercel Git integration
- Deploy via **Vercel + Git integration** (automatic deploy on push to `main`), not CLI only: it gives the
  stable public HTTPS URL that the review needs and fits the CI/CD extra credit.
- Clerk env vars are loaded in the Vercel dashboard (Production + Preview).
- Requires explicit permission for `git push` (policy 1). Before the deploy: `pnpm build` green locally.

### G. Tests + extra credit (M6)
- **Tests (leanest meaningful):** minimal Playwright e2e that loads the landing, verifies the hero + CTA, and
  navigates to `/sign-in` checking that Clerk mounts. Optionally a unit test of the `siteConfig`/brand (that no
  strings of the original product remain). The most viable one with Clerk in CI is chosen.
- **CI/CD:** GitHub Actions that runs `pnpm lint` + `pnpm build` (+ tests) on push/PR. Vercel handles the
  deploy; Actions validates quality. They do not conflict.
- **Analytics/monitoring:** Vercel Analytics (free tier) or an `/api/health` endpoint. The simplest one is
  chosen.
- **Custom domain:** optional, only if the owner has a domain; if not, it is documented as a "future improvement".

---

## Milestones

Each milestone: when closing it, `docs/completed/Mx-<name>.md` is written and permission is requested before committing.

### M0 — Setup: fork, clone at root, CLAUDE.md, boot verify
**Goal:** have the Nova Analytics fork as a git repo at the root `test/`, booting locally, with the
policies written.
- **Requires permission:** `gh repo fork tremorlabs/template-dashboard-oss` (creates a public repo in `dario2801`).
- Bring the code to the root keeping `docs/` (method in "Target folder structure").
- Create `CLAUDE.md` (policies + requirements of this plan). **Without any Claude co-authorship line**
  (`Co-Authored-By`, "Generated with Claude Code", etc.). Copy the plan as `PLAN.md`.
- Process `docs/CONTEXT.md`: if it contains any leftover AI attribution, remove it.
- Create `docs/completed/`.
- **Early secrets verification:** confirm that the fork's `.gitignore` already ignores `.env.local` (and
  `.env*.local`) BEFORE creating any `.env.local` with real keys. If it does not ignore it, add it first.
- **Verify real strings/paths with grep:** confirm the exact literals to sweep in M2 (e.g.
  "Retail Analytics", "Database", "Tremor", "yourname", "Emma Stone") and the real dashboard index route
  (expected `/overview`, not `/dashboard`) over the already-cloned code, so as not to chase ghosts.
- `pnpm install` && `pnpm run dev` → verify that the dashboard comes up on localhost:3000 without a DB.
- **Acceptance:** git repo at root with a remote to the fork; `docs/` intact; `CLAUDE.md` present and without AI
  co-authorship; `.env.local` confirmed in `.gitignore`; dashboard index route verified; `pnpm dev` renders
  the dashboard; `pnpm build` green.

### M1 — Brand foundation: color token + BrandLogo + siteConfig
**Goal:** centralized brand infrastructure (color, logo, identity) ready for the sweep.
- Extend `src/app/siteConfig.ts` with the Nova Analytics identity (A).
- Add brand CSS variables in `globals.css` + `brand` token in `tailwind.config.ts` (B).
- Create `src/components/brand/brand-logo.tsx`; delete/retire `public/DatabaseLogo.tsx` (C).
- **Acceptance:** `pnpm build` + `pnpm tsc --noEmit` green; the `brand` token compiles; `<BrandLogo/>` renders.

### M2 — Whitelabel sweep: zero traces of the original product in the UI
**Goal:** no visible reference to Tremor/Database/Retail Analytics; demo data with Nova identity.
- Replace `indigo-*` / `#6366F1` accents with `brand-*` across the whole UI.
- Replace placeholder metadata in `layout.tsx` (metadataBase, authors "yourname", twitter "@tremorlabs").
- Regenerate favicon + opengraph-image with the Nova Analytics mark.
- Rewrite demo data: `src/data/data.ts` (users/emails → Nova identities, incl. `admin@novaanalytics.io`),
  `UserProfile.tsx`, `DropdownUserProfile.tsx`, `MobileSidebar.tsx` ("Retail Analytics"→"Nova Analytics"),
  `SidebarWorkspacesDropdown.tsx`, `ModalAddWorkspace.tsx`.
- **Acceptance (the 4 mandatory ones from the email: logo, favicon, app name, footer credits):**
  - `grep -rEi "tremor|database logo|retail analytics|yourname|emma stone|acme\.com" src/ public/`
    → zero results in the visible UI (the Apache license/copyright in LICENSE.md is kept).
  - **Favicon (binary, not covered by grep):** explicit visual verification that the browser tab icon
    is the Nova Analytics mark, not Tremor's. Same for the opengraph-image.
  - `pnpm build` green; visual review of the dashboard with no traces of the original product.

### M3 — Clerk auth: functional login/signup + protected dashboard
**Goal:** real authentication flow; `/overview` protected; post-login redirect to the dashboard.
- Install `@clerk/nextjs`; `ClerkProvider` in `layout.tsx`; `src/middleware.ts` (D).
- Catch-all routes `/sign-in` and `/sign-up` styled with brand.
- Replace `UserProfile`/`DropdownUserProfile` with `<UserButton/>`/`useUser()`.
- All env vars to `.env.example`. Real keys only in `.env.local` (never committed, gitignore
  verified).
- **Requires from the owner:** the Clerk keys (requested when the time comes; not read from files).
- **Acceptance:** signup creates an account; login redirects to `/overview`; direct access to `/overview` without
  a session redirects to `/sign-in`; `pnpm build` green.
- **Verify the real redirect (do not assume):** `FALLBACK_REDIRECT_URL` only applies if there is NO `redirect_url` in
  the URL. Test BOTH paths: (a) login from the landing → ends at `/overview`; (b) a user without a session
  goes directly to `/overview`, Clerk sends them to `/sign-in`, and after authenticating returns to the dashboard.
  Confirm that both end at the dashboard; if path (b) does not return on its own, adjust the Clerk config.

### M4 — Public landing page, responsive, polished
**Goal:** public entry at `/` with hero, features and CTA to login/signup; mobile-friendly.
- `src/app/page.tsx` + `src/components/landing/*` (E).
- Reuse Tremor's Button/tokens. No em-dash in the copy.
- Adjust `not-found.tsx` "home" → landing.
- **Acceptance:** `/` renders the landing with hero + features + CTA; responsive at 375px and desktop; CTAs navigate to
  `/sign-up`/`/sign-in`; `pnpm build` green.

### M5 — Deploy on Vercel (HTTPS, public, stable)
**Goal:** live public URL over HTTPS, stable for the review.
- **Requires permission:** `git push` of the work to the fork.
- Connect the fork to Vercel (Git integration); load the Clerk env vars in Vercel.
- Configure the production URLs in Clerk (Vercel domain) so that auth works in prod.
- **Acceptance:** public HTTPS URL loads the landing; signup/login work in prod; `/overview` protected in
  prod; stable deploy.

### M6 — Extra credit + README + polish
**Goal:** bonus points and submission deliverables.
- README for Nova Analytics: setup, stack, env vars, test credentials, notes/limitations.
- CI/CD: `.github/workflows/ci.yml` (lint + build + tests).
- Tests: minimal Playwright e2e (+ brand config unit).
- Analytics/monitoring: Vercel Analytics or `/api/health`.
- (Optional) custom domain if a domain is available.
- **Claude Code evidence (bonus, must live IN the repo or the reviewer does not see it):** folder
  `docs/claude-evidence/` with `PROMPTS.md` (the prompts given per milestone) + screenshots/terminal history.
  The reviewer only sees the repo and the deploy; if the evidence is not in the repo, it does not exist for them.
- **Behavioral questionnaire:** the PDF is not fillable (text only). It is delivered as
  `docs/behavioral-questionnaire-answers.md` (or a separate PDF/doc as the submission requires), written with
  the owner's real data. Q11 is answered about **Dot Com Media** (the real employer).
- **Acceptance:** green CI on GitHub; tests pass; complete README; analytics/health active;
  `docs/claude-evidence/` present; questionnaire answers written.

---

## End-to-end verification (at the end)

1. `pnpm install && pnpm build && pnpm tsc --noEmit && pnpm lint` → all green locally.
2. `pnpm dev` → walk through: `/` (landing) → click CTA → `/sign-up` → create account → redirects to `/overview` →
   rebranded dashboard; logout; direct access to `/overview` without a session → redirects to `/sign-in`.
3. Whitelabel sweep: `grep -rEi "tremor|database logo|retail analytics|emma stone|acme\.com|yourname" src/ public/`
   → zero hits in the UI (LICENSE.md keeps the Apache attribution, which is correct).
4. Responsive: test the landing and the dashboard at 375px and at desktop.
5. Prod: open the Vercel URL, repeat the auth flow over HTTPS, confirm stability.
5b. **Smoke test in prod RIGHT before delivering** (the email requires "stable during the review window", it says
    so twice): confirm that the deploy is still alive, that the *Production* Clerk keys (not just Preview)
    work, and that the real login ends at the dashboard. The prod keys are sometimes misconfigured between Preview and
    Production; this check avoids delivering a broken deploy.
6. **Submission checklist (all the deliverables from the email, none optional):**
   - [ ] GitHub fork URL (public or with access for the reviewing team).
   - [ ] Live deploy URL (landing + login working over HTTPS).
   - [ ] Test credentials (`admin@novaanalytics.io` + password) so the reviewer can enter without registering.
   - [ ] Link to the 5-10 min walkthrough video (the owner records it).
   - [ ] Notes on limitations / shortcuts / future improvements (in README).
   - [ ] **Behavioral questionnaire answered and sent** (a hard deliverable from the email; it is written in M6 with
         the owner's real data). Do NOT forget it in the submission.
   - [ ] Smoke test in prod executed right before sending (deploy alive + prod login OK).
   - [ ] (Bonus) Claude Code evidence in `docs/claude-evidence/` (PROMPTS.md + screenshots), CI/CD, tests,
         analytics, custom domain.

---

## Decisions already confirmed by the owner

- **"Reuse test" method (M0):** `git init` at the root. Fork without cloning
  (`gh repo fork --clone=false`) → `git init` in `test/` → remote to the fork → `fetch` → `checkout` of the code
  over the root, keeping `docs/`. The root ends up as the repo with `.git` and `docs/` intact.
- **Nova Analytics palette (M1):** I define it. I propose a cohesive palette in M1 with samples and the owner
  adjusts it if needed.
- **Behavioral questionnaire:** done in M6, with the owner's real data. I ask him questions about his
  experience and write honest drafts that he edits. His story is not invented.
