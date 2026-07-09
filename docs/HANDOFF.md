# HANDOFF — Nova Analytics trial

Full context to resume the work in a new session. Read it all before touching anything.

---

## 1. What this is

Technical trial for the **AI Agent Engineer** role.

- **Real employer: Dot Com Media** (who evaluates; signs the brief email).
- **Nova Analytics** is the **fictional client** of the exercise. Do not confuse them. Question 11 of the
  behavioral questionnaire ("what excites you about working with our company") is answered about **Dot Com Media**.
- **Owner:** Dario Auda. GitHub `dario2801`. Chat in Spanish; code/commits/README/PRs in English.

**The assignment** (see `docs/instructions.md`, the full brief): fork an open-source dashboard, rebrand it
to Nova Analytics (whitelabel), add a public landing page with working login/signup, deploy to a public URL with
HTTPS, and record a walkthrough video. All done with Claude Code, documenting the process.

**Base repo:** fork of `tremorlabs/template-dashboard-oss` (Apache 2.0). Next.js 14.2.23 App Router, React 18,
TypeScript, Tailwind 3, Tremor Raw + Radix + Recharts. Boots without a DB, with mock data.

---

## 2. Documents you MUST read (in this order)

| Archivo | Qué contiene |
| --- | --- |
| `CLAUDE.md` (root) | **Operating policies.** Inviolable guardrails. Read it first. |
| `docs/PLAN.md` | The complete plan by milestones (M0-M6), architecture and acceptance criteria. |
| `docs/instructions.md` | The original brief from the email (hard requirements + extra credit). |
| `docs/completed/M0-setup.md` | What was done in M0 + inventory of strings to sweep. |
| `docs/completed/M1-brand-foundation.md` | What was done in M1 + palette decisions. |
| `docs/CONTEXT.md` | Prior operating context from the owner (long version, in Spanish). |
| `docs/Behavioral & Work Style Questionnaire.pdf` | 15 personal questions, 5 sections. Hard deliverable. |

---

## 3. Inviolable rules (do NOT break them)

1. **NEVER `git commit` without explicit permission in the current prompt.** Permission does NOT accumulate
   between prompts. Each commit is requested anew.
2. **NEVER `git push`, merge to `main`, or rewrite history** without explicit permission in the current prompt.
3. **ZERO AI co-authorship.** No `Co-Authored-By: Claude`, "Generated with Claude Code", or any
   attribution to the AI in commits, PRs, or footers. The author is **Dario Auda `<gonzalezdauda@gmail.com>`**
   (already configured in this repo's `git config --local`).
4. **Step-by-step mode.** One milestone at a time. On closing it: write `docs/completed/Mx-<nombre>.md`,
   show what changed, and ASK FOR PERMISSION to commit.
5. **Never read `.env.local`.** Every new env var goes to `.env.example` (name only) in the same change.
   Clerk keys never in logs or responses.
6. **Do not rewrite the fork.** Whitelabel + landing + auth + deploy is the WHOLE scope. No multi-tenancy,
   RLS, or API-key-per-endpoint.
7. **SOLID proportional to scope.** Single-responsibility components. The simplest thing that meets 100%.
8. **Comments:** only the non-obvious "why". No noise.
9. **UI copy without the em-dash (`—`).** Use a period, comma, or colon.
10. **Descriptive commits**, `type: description` convention, reflecting "Nova Analytics" (never "Tremor").

---

## 4. Current repo state

**Location:** `c:\Users\gonza\Desktop\test` (the root IS the git repo; `docs/` lives inside).

```
Branch: main  ->  origin/main (ahead 2, NO PUSH yet)
Working tree: CLEAN

f245afa  feat: add Nova Analytics brand foundation (palette, logo, siteConfig)   <- M1
075233d  docs: add project policies (CLAUDE.md), plan and trial docs             <- M0
a20f619  update deps                                                             <- fork base
```

**Remotes:**
- `origin`  -> `https://github.com/dario2801/template-dashboard-oss.git` (the owner's fork)
- `upstream` -> `https://github.com/tremorlabs/template-dashboard-oss.git` (the original)

**Git identity (local, already configured):** `Dario Auda <gonzalezdauda@gmail.com>`

**Verified tooling:** git 2.40, gh CLI authenticated as `dario2801` (scopes repo+workflow), node 20.19,
pnpm 10.33. Owner confirms having accounts ready for **GitHub, Vercel and Clerk**.

**Commands:** `pnpm install`, `pnpm dev` (localhost:3000), `pnpm build`, `pnpm lint`,
`pnpm exec tsc --noEmit`. All green as of today.

---

## 5. Milestones: done vs pending

| Milestone | Estado |
| --- | --- |
| **M0** Setup (fork, repo at root, CLAUDE.md, boot verify) | ✅ committed `075233d` |
| **M1** Brand foundation (palette, token, BrandLogo, siteConfig) | ✅ committed `f245afa` |
| **M2** Whitelabel sweep | ⬜ **NEXT** |
| **M3** Clerk auth (login/signup, protected dashboard) | ⬜ |
| **M4** Public landing page at `/` | ⬜ |
| **M5** Deploy on Vercel (HTTPS, public) | ⬜ |
| **M6** Extra credit + README + questionnaire | ⬜ |

### What already exists (from M1)

- `src/app/globals.css` -> CSS variables `--brand-50 … --brand-950` (blue-violet, accent `600` = #4F46E5).
- `tailwind.config.ts` -> `brand` token (`theme.extend.colors.brand`, format
  `rgb(var(--brand-N) / <alpha-value>)`, `DEFAULT` = 500). Usable as `brand-600`, `brand-500/50`.
- `src/app/siteConfig.ts` -> **single source of truth** for the identity:
  `name`, `tagline`, `description`, `url`, `supportEmail` (hello@novaanalytics.io),
  `sampleUser` (admin@novaanalytics.io), `baseLinks` (includes `signIn: "/sign-in"`, `signUp: "/sign-up"`),
  and `externalLink.blocks` (temporary, points to `/overview`; see technical debt below).
- `src/components/brand/brand-logo.tsx` -> `<BrandLogo variant="full" | "icon">`. Original mark: rounded
  `brand-600` square with three ascending bars. It is the ONLY place where the brand lives.
- `src/app/not-found.tsx` -> already uses `<BrandLogo>` and `text-brand-*`.
- `public/DatabaseLogo.tsx` -> **removed**.

---

## 6. M2 — Whitelabel sweep (the next milestone)

**Goal:** zero visible traces of the original product. The 4 mandatory ones from the brief are
**logo, favicon, application name, footer credits**.

### 6.1 Brand strings to replace (real grep, with line)

```
src/app/layout.tsx:22           name: "yourname"
src/app/layout.tsx:26           creator: "yourname"
src/app/layout.tsx:37           title: "Tremor OSS Dashboard"
src/app/layout.tsx:38           creator: "@tremorlabs"
src/app/layout.tsx               metadataBase: "https://yoururl.com"  (placeholder)
src/data/data.ts:97             name: "Emma Stone"
src/data/data.ts:117            email: "a.flow@acme.com"
src/data/data.ts:123            email: "t.palstein@acme.com"
src/components/ui/navigation/UserProfile.tsx:27              "Emma Stone"  (+ initials "ES")
src/components/ui/navigation/DropdownUserProfile.tsx:49      "emma.stone@acme.com"
src/components/ui/navigation/MobileSidebar.tsx:81            <DrawerTitle>Retail Analytics</DrawerTitle>
src/components/ui/navigation/SidebarWorkspacesDropdown.tsx:19  value: "retail-analytics"  (+ "Retail analytics", initials "RA")
src/components/ui/navigation/ModalAddWorkspace.tsx:121        "Database region"
src/components/ui/navigation/ModalAddWorkspace.tsx:147        "Database configuration"
```

In addition, `src/data/data.ts` has more demo names/emails: "Sarah Johnson", "John Doe", "Jane Smith",
"Alejandro Garcia", "Wei Zhang", domains `@gmail.com`, `@bluewin.ch`. All must be changed to Nova Analytics
identities (use `admin@novaanalytics.io` as the brief's sample user).

### 6.2 Color: `indigo` -> `brand`

**29 occurrences of `indigo` across 14 files.** Replace the visible-UI ones with `brand-*`:

```
src/app/layout.tsx, src/app/(main)/overview/page.tsx
src/components/Badge.tsx, Calendar.tsx, ProgressBar.tsx, RadioCard.tsx
src/components/ui/overview/DashboardCategoryBarCard.tsx, DashboardProgressBarCard.tsx, DashboardChartCard.tsx
src/components/ui/navigation/MobileSidebar.tsx, sidebar.tsx, SidebarWorkspacesDropdown.tsx
src/lib/utils.ts (3), src/lib/chartUtils.ts (5)   <- REVIEW: focus rings and chart colors
```

Watch out for `src/lib/chartUtils.ts`: it defines the charts' palette. Decide whether the primary chart uses
`brand`. And `src/lib/utils.ts`: the `focusInput`/`focusRing` use indigo; changing them to `brand` gives coherence.

### 6.3 Favicon and OG image

- `src/app/favicon.ico` and `src/app/opengraph-image.png` are still Tremor's. **Regenerate them** with the
  mark from `<BrandLogo variant="icon">` (`brand-600` square + 3 bars).
- `public/og_github.jpg` is also from the template.
- **The grep does NOT detect binaries.** Favicon acceptance is **visual verification** of the icon in the
  browser tab.

### 6.4 Paywall pages (M1 technical debt)

`src/app/(main)/details/page.tsx` and `src/app/settings/page.tsx` are template placeholders: they show
`<TremorPlaceholder>` and a "Get full template here" button that linked to `blocks.tremor.so`.

In M1, `siteConfig.externalLink.blocks` was restored pointing to `/overview` only to avoid breaking `tsc`.
**In M2 a decision is needed:** rebrand those pages with Nova Analytics's own content, or remove them.
And delete `src/components/ui/icons/TremorPlaceholder.tsx`.

### 6.5 Do NOT touch (legitimate attribution)

- `// Tremor Raw ...` comments in `src/lib/utils.ts`, `chartUtils.ts`, `useOnWindowResize.tsx`. They are
  code-origin attribution, NOT visible UI. Apache 2.0 allows it and it is correct to keep them.
- `LICENSE.md` (Apache 2.0, copyright Tremor Labs). **Kept intact.**

### 6.6 M2 acceptance criteria

```bash
grep -rEi "tremor|database logo|retail analytics|yourname|emma stone|acme\.com" src/ public/
# -> zero results in visible UI (the "Tremor Raw" comments in src/lib/* are OK)
```
+ visual verification of the favicon in the tab
+ `pnpm build` green, `pnpm exec tsc --noEmit` clean
+ visual review of the dashboard with no traces

---

## 7. Critical findings for future milestones

### M4 — the root is NOT free
`next.config.mjs` has a **redirect `/` -> `/overview` with `permanent: true` (HTTP 308)**.
To put the landing at `/` that redirect must be **removed**. Since the 308 is cached hard in the browser,
**test the landing in an incognito window**.

There is no `src/app/page.tsx`. Current routes: `/overview` (real dashboard),
`/details` and `/settings` (placeholders). **`settings` is NOT in the `(main)` route group**, it is a
top-level sibling with its own layout. It matters for the Clerk middleware matcher.

### M3 — Clerk
- `pnpm add @clerk/nextjs`. **There is no auth or `middleware.ts` today.** Clean slate.
- `ClerkProvider` goes in `src/app/layout.tsx`, outside the next-themes `ThemeProvider` (which already exists).
- `src/middleware.ts` (Next 14 uses `middleware.ts`, not `proxy.ts`): protect `/overview`, `/details`,
  `/settings`; leave `/`, `/sign-in`, `/sign-up` public.
  Pattern for Next 14: `clerkMiddleware` + `createRouteMatcher` + `auth.protect()`.
  **Verify on install** whether the version marks `createRouteMatcher` as deprecated and use the current pattern.
- Catch-all routes: `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`.
- Replace `UserProfile.tsx` / `DropdownUserProfile.tsx` (hardcoded "Emma Stone") with `<UserButton/>` /
  `useUser()`.
- **Env vars (all to `.env.example`, names only):**
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/overview
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/overview
  ```
- **`.gitignore` already ignores `.env*.local`** (verified in M0). The real keys are requested from the owner;
  never read them from files.
- **Verify BOTH redirect paths** (the `FALLBACK_REDIRECT_URL` only applies if there is no `redirect_url`
  in the URL): (a) login from the landing -> `/overview`; (b) go without a session directly to `/overview` ->
  Clerk sends to `/sign-in` -> after authenticating it must return to the dashboard.

### M4 — landing (SOLID structure)
`src/app/page.tsx` composes; one component per section in `src/components/landing/`:
`landing-header.tsx`, `hero.tsx`, `features.tsx`, `cta.tsx`, `landing-footer.tsx`.
Reuse the Tremor `Button` and the `brand` tokens. Mobile-first. No em-dash.
Update the "home" button in `not-found.tsx` to point to the landing.

### M5 — deploy
Vercel + Git integration (automatic deploy on push to `main`). Load the Clerk env vars into Vercel
(**Production and Preview**). Configure the production URLs in Clerk. **Requires permission for `git push`.**

### M6 — extra credit and submission
- Nova Analytics README: setup, stack, env vars, test credentials, limitations.
- CI/CD: `.github/workflows/ci.yml` (lint + build + tests).
- Tests: minimal Playwright e2e (landing -> sign-in -> dashboard) + unit test of the brand config.
- Analytics: Vercel Analytics or `/api/health`.
- **`docs/claude-evidence/`** with `PROMPTS.md` + screenshots. **It must live IN the repo**: the reviewer only
  sees the repo and the deploy; if the evidence is not there, it does not exist for them.
- **Behavioral questionnaire** -> `docs/behavioral-questionnaire-answers.md`. The PDF is not fillable.
  It is written **with the owner's real data** (ask him questions; do NOT invent his story).
  Question 11 is about **Dot Com Media**.

---

## 8. Submission checklist (hard deliverables from the email)

- [ ] GitHub fork URL (public or with access for the reviewing team)
- [ ] Live deploy URL (landing + login working over HTTPS)
- [ ] Test credentials (`admin@novaanalytics.io` + password)
- [ ] Walkthrough video link 5-10 min (recorded by the owner)
- [ ] Notes on limitations / shortcuts / future improvements (in README)
- [ ] **Behavioral questionnaire answered and submitted** (hard deliverable, do NOT forget)
- [ ] **Smoke test in prod JUST before submitting** (live deploy + prod login OK; the brief demands
      "stable during the review window" twice)
- [ ] (Bonus) `docs/claude-evidence/`, CI/CD, tests, analytics, custom domain

---

## 9. How to start the new session

1. Read `CLAUDE.md`, then `docs/PLAN.md`, then this file.
2. `pnpm install` if `node_modules` is not present.
3. Confirm state: `git log --oneline -3` and `git status`.
4. Start **M2** following section 6.
5. On closing M2: write `docs/completed/M2-whitelabel-sweep.md`, show the diff, and **ask for permission to
   commit**. Do not commit without the owner's "yes" in that same prompt.
