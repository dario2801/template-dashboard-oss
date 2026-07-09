# Claude Code evidence: prompts and process

This project was built with [Claude Code](https://claude.com/claude-code). This file records how.

**On fidelity.** The prompts below were given in Spanish and are translated here, since the project's
documentation is in English. They are reproduced faithfully, including the ones that corrected Claude.
Milestones M0 and M1 predate the transcripts kept for this record; they are summarized from
`docs/completed/M0-setup.md` and `docs/completed/M1-brand-foundation.md` rather than quoted.

**On secrets.** One prompt in M3 contained live Clerk API keys. They are redacted below as `[REDACTED]`.
The publishable key is safe to expose by design. The secret key must be rotated in the Clerk dashboard
before this repository is shared, precisely because it once passed through a prompt. Nothing in this
repository, in any commit, contains a real secret.

**On method.** The operating rules live in [`CLAUDE.md`](../../CLAUDE.md) and were loaded into every
session. The three that shaped the work most: never commit without permission in the current prompt, never
attribute anything to the AI, and work one milestone at a time, archiving each in `docs/completed/`.

---

## M0: setup

Fork `tremorlabs/template-dashboard-oss`, make the repository root the working tree without losing `docs/`,
write the operating rules into `CLAUDE.md`, and verify the app boots on mock data.

Claude verified before assuming: that `.gitignore` already ignored `.env*.local` **before** any key existed,
and that the dashboard's index route was `/overview` rather than `/dashboard`. It also grepped the real
brand strings so M2 would not chase ghosts.

## M1: brand foundation

Build the brand infrastructure: a `brand` Tailwind token backed by CSS variables, a `<BrandLogo>` component
as the single home of the mark, and an extended `siteConfig.ts` as the single source of truth for identity.
Delete `public/DatabaseLogo.tsx`.

## M2: whitelabel sweep

> Read the handoff document `docs/HANDOFF.md`, create a new branch from `main`, and let's do the next big
> task.

The prompt also carried the results of a prior automated review of the M1 pull request, which had flagged a
dead link and an imprecise commit message.

**What Claude did.** Before creating the branch it checked the assumptions in the handoff, and found one was
stale: the handoff claimed M1 sat unpushed on a branch, but the pull request had since been merged. It also
found two traces the handoff's inventory had missed, `package.json` still named
`template-dashboard-open-source-version`, and a `README.md` whose banner embedded an asset the sweep was
about to delete, which would have left a broken image.

It ran the sweep as a multi-agent workflow: ten agents with strictly disjoint file ownership, then a build
gate, then four adversarial review lenses.

**Three findings worth recording.**

The `chartColors` map used `indigo` as a **key**, not merely a class string, and `getColorClassName` falls
back to gray on an unknown key. Renaming the key without updating `colors={["indigo", "gray"]}` in
`DashboardChartCard.tsx` would have turned the primary chart series gray, with a clean typecheck and a green
build. Claude flagged this before editing anything, and it is now guarded by `tests/chart-colors.test.ts`.

The workflow's first build gate died on an API error, so its self-repair branch never ran and the four review
lenses evaluated a red build, reporting zero findings. The final gate caught the real failure. The lesson: a
green review over a red build is not a review.

That failure was `pnpm build` breaking on the `/opengraph-image` prerender. The Node build of `@vercel/og`
resolves its default font through `fileURLToPath`, which throws `TypeError: Invalid URL` on Windows paths at
import time. `runtime = "edge"` fixes it, and the reason is now a comment in the source, because the line
looks cosmetic and is not.

> commit everything and let's move on to m3 when you finish

> to move on to m3, put yourself back on main and wait for me to merge

> create the PR and merge it yourself, you didn't create the PR for me

The last one was a fair correction. Claude had committed but not pushed, because `CLAUDE.md` requires
explicit permission for `git push` in the current prompt, and "commit everything" did not grant it. With
permission given, it pushed, opened the pull request, merged it, and then verified that `main` still built,
rather than trusting the merge as clean.

## M3 and M4: authentication and the landing page

> here are the Clerk keys `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[REDACTED_FAKE_DATA]` `CLERK_SECRET_KEY=[REDACTED_FAKE_DATA]`
> and then for M4 both in the same PR, use this .md as the design reference, read the documentation and
> what's inside DESIGN, that's what you're going to apply

Claude wrote the keys straight into the gitignored `.env.local`, never echoed them, and flagged that a
secret pasted into chat would end up published if this very evidence file reproduced it. That flag is why
the keys above are redacted, and why rotating the secret key is a release step rather than an afterthought.

**Three findings that changed the plan.**

`createRouteMatcher` is deprecated in `@clerk/nextjs` v7. Rather than trust the web guide, Claude read the
type definitions in `node_modules` and found the reason stated plainly: middleware path matching can diverge
from how Next resolves routes and leave protected resources reachable. Authorization moved into
`(main)/layout.tsx`.

`auth.protect()` returned 404 instead of redirecting. A plain `curl` to `/overview` looked like a bug. The
type definition was more precise than the documentation website: for non-document requests, 404 is the
contract. Claude re-tested with `Sec-Fetch-Dest: document` and got the correct redirect chain, landing on
`/sign-in?redirect_url=%2Foverview`. Trusting the first test would have meant "fixing" correct behavior.

The root layout rendered the dashboard sidebar on **every** route, so the landing page and the auth screens
would have shipped with the app shell on top of them. Claude restructured the layouts and moved `settings`
into the `(main)` route group, which leaves its URL unchanged while placing all three dashboard routes behind
one guard.

**On the design reference.** Claude read `docs/DESIGN/` and stopped to ask before writing code, because three
things conflicted with the repository. The reference ships Tailwind v4 `@theme` syntax and this project is on
Tailwind 3.4. Its display serif, Ivy Presto, is commercial and cannot be used. And its copper accent
contradicted the `brand` token that M1 and M2 had already built the mark, the favicon and the OG image
around. The owner chose: dark system on the landing and auth only, copper as an editorial accent with the
Nova mark keeping `brand-600` as its signature, and Playfair Display as the serif.

Two deviations from the reference were deliberate and are documented in `docs/completed/M4-landing-page.md`:
the hero drops the reference's email capture, because a field that discards what the user types would be
dishonest when Clerk is one click away, and the white pill appears once per viewport, as the reference itself
demands.

**A bug found on the way.** `BrandLogo` pinned its wordmark color on the inner span, where a caller's
`className` could not override it through `twMerge`. On the landing's black canvas with a light dashboard
theme, "Nova Analytics" would have rendered black on black. It is now guarded by `tests/brand-logo.test.tsx`.

## M5: deploy

Deployed to Vercel with Git integration by the owner, who also confirmed the live site renders correctly.

Claude verified that `pnpm build` succeeds with **no** Clerk keys present. No route is prerendered through a
Clerk call, because `auth.protect()` and `<Show>` make them dynamic. Two consequences: a CI pipeline needs no
secrets to validate the build, and a missing environment variable will surface at request time rather than
failing the deploy, so the Clerk keys must be confirmed present in Vercel for **both** Production and Preview.

## M6: tests, analytics and documentation

> the real url is template-dashboard-oss-rose.vercel.app, write me the integration tests using jest, document
> it, the tests would be for the functionality that exists, add the analytics, create the PROMPTS evidence,
> create the README, the prompts and documentation must be in English, I already did the deploy, the visuals
> are fine, first close out the code-related things

The real URL mattered more than it looked. `siteConfig.url` still held a guessed subdomain, and
`metadataBase` derives the absolute Open Graph URLs from it, so social previews would have pointed at a site
that did not exist.

Claude wrote 52 tests, then **mutation-tested the suite** rather than trusting a green run: it injected
`Emma Stone`, `acme.com` and `indigo-600` into a source file, confirmed three tests failed, and reverted. A
test that has never failed proves nothing.

One test failed honestly on the first run, and it was the test that was wrong, not the code:
`footer p:last-of-type` does not select the last paragraph in the footer, it selects the last of each sibling
group, and it had matched the tagline.

> create a PR and push it, but I see an error: when you enter the system, in settings the profile section
> refers to nova and not to the user who signed in

The owner found this by using the application, which is the point. `/settings` rendered
`siteConfig.sampleUser`, so every signed-in user saw the demo identity. Worse, Claude had written it into the
README's limitations section as **deliberate**. It was a bug, and calling it a limitation is what hid it. Two
more defects surfaced while fixing it: the read-only inputs used `defaultValue`, which an uncontrolled input
keeps from mount and would never update once Clerk resolved the user, and the workspace avatar borrowed the
*user's* initials, invisible only because both happened to be `NA`.

No test caught any of this, because no test looked at that page. `tests/settings-profile.test.tsx` now does,
and reintroducing the bug fails all six of its assertions.

---

## What Claude got wrong, and what caught it

Worth recording, since the exercise is about working with an AI agent rather than about the AI being right.

- **A curl-shaped false negative.** `/overview` returning 404 looked like broken auth. Reading the type
  definition, instead of the documentation website, revealed the contract. Verifying with the wrong tool
  produces confident wrong conclusions.
- **A green review over a red build.** An agent crash silently skipped a repair step, and four reviewers then
  reported zero findings against a build that did not compile. The final gate caught it. Independent
  verification has to run on the artifact you are actually shipping.
- **A stale handoff.** The document said the previous pull request was unmerged. It had been merged. Checking
  `git` beat trusting the note.
- **Formatting churn.** Running Prettier across `src/` reformatted two files unrelated to the change, because
  the repository uses `prettier-plugin-tailwindcss`. Reverted, to keep the diff honest about what it changes.
