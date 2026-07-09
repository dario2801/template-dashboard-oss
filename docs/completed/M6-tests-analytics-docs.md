# M6 — Tests, analytics and documentation

Branch: `feat/m6-tests-analytics-docs`. Closes the **code** part of the extra credit and the documentation
deliverables. The behavioral questionnaire is left out: it needs real data from the owner.

---

## 1. The real URL

`siteConfig.url` had `https://nova-analytics.vercel.app`, an **assumption** from M1. The real one is
`https://template-dashboard-oss-rose.vercel.app`.

It is not cosmetic. `layout.tsx` does `metadataBase: new URL(siteConfig.url)`, and that is where the absolute
URLs for `og:image` and `og:url` come from. With the old value, the social media previews would have pointed
to a nonexistent domain. Verified in the served HTML: the real domain already appears.

---

## 2. Integration tests with Jest

`jest.config.mjs` uses `next/jest`, which resolves the `@/` alias and Next's transformations without
configuring Babel by hand. `jest.setup.ts` loads `@testing-library/jest-dom` and injects **fake** Clerk keys,
which never leave the test process.

**60 tests, 8 suites.** They do not chase coverage. Each one protects an invariant that this project can
actually break.

| Suite | What it protects |
| --- | --- |
| `whitelabel.test.ts` | Zero traces of the original product. It walks the file system and allows only the attribution comments that Apache 2.0 requires |
| `chart-colors.test.ts` | `brand` is the first key of `chartColors`, and `getColorClassName` still falls back to gray for an unknown key |
| `site-config.test.ts` | The brand config is still the single source, and `url` points to a real https |
| `demo-data.test.ts` | Unique identities and all in the Nova domain |
| `brand-logo.test.tsx` | A caller can override the wordmark color |
| `landing.test.tsx` | The signed-out landing routes to sign-in and sign-up, and spends its only white pill on the hero |
| `settings-profile.test.tsx` | The profile renders the session user, never the demo identity |
| `health-route.test.ts` | `/api/health` reports the live instance and never a build snapshot |

### 2.1 Two tests that encode real bugs

`chart-colors.test.ts` keeps the trap from M2: the map keys are public API, and `getColorClassName` falls
back to gray for an unknown key. Renaming without updating the call site gives a gray chart with clean `tsc`
and a green build. The test asserts **both things**: that the rename happened and that the fallback is still
alive.

`brand-logo.test.tsx` keeps the bug from M4: the wordmark color lived in the inner span, where `twMerge`
could not override it. On the black canvas with the light theme, "Nova Analytics" came out black on black.

### 2.2 Mutation: proving that the tests fail

A test that never failed proves nothing. `Emma Stone`, `acme.com` and `indigo-600` were injected into a file
in `src/` and it was confirmed that **3 tests failed**. Restored, the 16 in that suite pass again.

### 2.3 A bug the tests did not catch, because nobody was looking at that page

The owner found, by using the app, that `/settings` showed **`Nova Admin` / `admin@novaanalytics.io`** in the
Profile section, instead of the user who had signed in. The page rendered `siteConfig.sampleUser`, a leftover
from M2, when M3 already had the session available.

It had been written into the README's limitations section as "deliberate". It was not: it was a bug, and the
label is what hid it.

- `useSessionIdentity()` was extracted from `UserProfile.tsx` into `src/lib/useSessionIdentity.ts`, and now
  the sidebar and the settings page both use it. Before, the initials logic was duplicated.
- The `Input`s went from `defaultValue` to `value` + `readOnly`. An **uncontrolled** input keeps the value it
  mounted with, so `defaultValue` would have kept the empty string that was there before Clerk resolved the
  user.
- The workspace avatar was borrowing the **user's initials**. Now it derives them from `siteConfig.name`.
  They matched at `NA` by coincidence, which made it invisible.
- `tests/settings-profile.test.tsx` keeps it. Reintroducing the bug, its 6 tests fail.

### 2.4 A test that was wrong

`footer p:last-of-type` does not select the last `<p>` of the footer: it selects the last of **each group of
siblings**, and it matched the tagline's `<p>`. The failure was in the test, not in the code. Fixed with
`getByText(/all rights reserved/i)`.

---

## 3. Analytics and monitoring

- `@vercel/analytics` (v2.0.1). It was verified that the `./next` subpath exists in the installed version
  before importing it, instead of assuming it. `<Analytics />` goes in the root layout.
- `src/app/api/health/route.ts` returns `{ status, name, timestamp }` with `dynamic = "force-dynamic"`.
  An uptime probe must observe the live instance, not a build artifact.

`clerkMiddleware()` runs over `/api/*` because of the matcher, but since it does no authorization checks, it
does not block. Verified with `curl` without a session: **200**.

---

## 4. The build does not need secrets

`.env.local` was moved out of the way and `pnpm build` was run: **green, exit 0**. No route is prerendered by
calling Clerk, because `auth.protect()` and `<Show>` make them dynamic.

Practical consequence: **a CI pipeline can validate lint, typecheck, tests and build without any secret.**

---

## 5. Documentation

- `README.md`: fully rewritten. Stack, setup, env vars table, scripts, the tests table with the why of the
  three that encode real bugs, architecture notes, monitoring, reviewer credentials, limitations and Apache
  2.0 attribution.
- `docs/claude-evidence/PROMPTS.md`: the prompts per milestone, translated into English, with the findings and
  a final honest section on **what Claude did wrong and what caught it**. The Clerk keys appear as
  `[REDACTED]`.

---

## 6. Verification

| Check | Result |
| --- | --- |
| `pnpm test` | 60 pass, 8 suites |
| Mutation of the whitelabel suite | 3 failures with the regression, 0 when restored |
| Mutation of the settings profile suite | 6 failures with the bug reintroduced, 0 when restored |
| `pnpm exec tsc --noEmit` | Clean, with the tests included in `tsconfig` |
| `pnpm lint` | No warnings |
| `pnpm build` with keys | Green |
| `pnpm build` **without** keys | Green, exit 0 |
| `GET /api/health` without session | 200, `{"status":"ok","name":"Nova Analytics",...}` |
| Real domain in the served HTML | `template-dashboard-oss-rose.vercel.app` |
| Secrets in the diff or in `PROMPTS.md` | Zero |

---

## 7. What remains

- **Rotate the `sk_test` in Clerk.** It went through a prompt. `PROMPTS.md` redacts it, but the repo is
  public and the key existed in plaintext in a conversation.
- **Create the `admin@novaanalytics.io` user in Clerk** with a password, so the reviewer can get in without
  signing up. The README says the password goes in the delivery email, not in the repo.
- **Behavioral questionnaire** (`docs/behavioral-questionnaire-answers.md`). Hard deliverable, not a bonus. It
  is written with real data from the owner. Q11 is about **Dot Com Media**.
- **CI/CD** (`.github/workflows/ci.yml`). It was not added here because it was not in the request. It is
  trivial now: the build does not need secrets.
- **Video walkthrough** and **smoke test in prod** right before sending.
