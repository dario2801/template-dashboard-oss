<div align="center">

# Nova Analytics

**Turn raw data into clear decisions.**

A whitelabel analytics dashboard with a public landing page and working authentication.

[Live demo](https://nova-analytics-dashboard.vercel.app) · [Health check](https://nova-analytics-dashboard.vercel.app/api/health)

</div>

---

## What this is

Nova Analytics is a data dashboard product: a public marketing page, a real sign-in and sign-up flow, and a
metrics dashboard behind a session.

It is built on a fork of the Apache 2.0 licensed
[`tremorlabs/template-dashboard-oss`](https://github.com/tremorlabs/template-dashboard-oss). The dashboard
internals are the upstream template's. The brand, the landing page, the authentication and the deployment are
this project's work. See [License and attribution](#license-and-attribution).

## Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Framework | Next.js 14 (App Router), React 18, TypeScript   |
| Styling   | Tailwind CSS 3, Tremor Raw, Radix               |
| Charts    | Recharts                                        |
| Auth      | Clerk                                           |
| Testing   | Jest, React Testing Library                     |
| Analytics | Vercel Analytics, plus an `/api/health` endpoint |
| Deploy    | Vercel, with Git integration                    |

The app boots without a database. All dashboard data is mock data in `src/data/`.

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then fill in your Clerk keys
pnpm dev                     # http://localhost:3000
```

Create a Clerk application at [clerk.com](https://clerk.com) and copy its two keys into `.env.local`. Without
them the app still builds and the landing page renders, but sign-in and sign-up will not work.

### Environment variables

`.env.example` is the contract. Every variable the app reads is listed there.

| Variable                                          | Required | Purpose                                                               |
| ------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`               | yes      | Clerk client key. Safe to expose.                                     |
| `CLERK_SECRET_KEY`                                | yes      | Clerk server key. Never commit this.                                  |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                   | no       | Where Clerk mounts sign-in. Defaults to `/sign-in`.                   |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                   | no       | Where Clerk mounts sign-up.                                           |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | no       | Landing spot after sign-in, when the request carries no `redirect_url`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | no       | The same, after sign-up.                                              |
| `NEXT_PUBLIC_SITE_URL`                            | no       | Public origin for `metadataBase` and the Open Graph tags. Defaults to the brand domain. Set it per environment so preview deployments do not advertise the production origin. |

`.env*.local` is gitignored. No secret is committed to this repository.

## Scripts

```bash
pnpm dev                 # development server
pnpm build               # production build
pnpm start               # serve the production build
pnpm lint                # eslint
pnpm exec tsc --noEmit   # typecheck
pnpm test                # jest, or pnpm test:watch
pnpm test:ci             # jest with coverage, for CI
```

## Testing

60 integration tests across 8 suites, run with `pnpm test`. They do not chase a coverage number. Each one
guards an invariant this project can plausibly break.

| Suite                  | What it protects                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whitelabel.test.ts`   | No trace of the original product reaches the UI. Scans every `.ts` and `.tsx` file under `src/`, allowing only the upstream attribution comments Apache 2.0 requires. |
| `chart-colors.test.ts` | `chartColors` exposes `brand` first, and `getColorClassName` still falls back to gray on an unknown key.                                                                |
| `site-config.test.ts`  | The brand config stays the single source of truth, and the public origin is a real https URL that carries no trace of the upstream template.                            |
| `demo-data.test.ts`    | Every demo identity is unique and lives on the Nova domain.                                                                                                            |
| `brand-logo.test.tsx`  | A caller can override the wordmark color.                                                                                                                              |
| `landing.test.tsx`     | The signed-out landing routes to sign-in and sign-up, and spends its one white pill in the hero.                                                                        |
| `settings-profile.test.tsx` | The profile section renders the signed-in user, never the demo identity.                                                                                           |
| `health-route.test.ts` | `/api/health` reports the live instance and never serves a build-time snapshot.                                                                                         |

Three of those deserve an explanation, because they encode bugs this project actually hit.

**`chart-colors.test.ts`.** The chart palette keys are a public API: `DashboardChartCard` passes them as
plain strings. `getColorClassName` falls back to gray on an unknown key, so renaming the accent key without
updating a call site yields a gray primary series with a clean typecheck and a green build. The test asserts
both the rename and the fallback.

**`brand-logo.test.tsx`.** `BrandLogo` used to pin its wordmark color on the inner span, where a caller's
`className` could not override it through `twMerge`. On the landing's black canvas with a light dashboard
theme, the brand name rendered black on black. The test renders it with an override and asserts the default
is gone.

**`settings-profile.test.tsx`.** The profile section used to render `siteConfig.sampleUser`, so every signed-in
user saw the demo identity instead of their own account. Nothing caught it, because no test looked at that
page. It now reads the session, and the suite asserts the demo identity is absent.

## Architecture notes

**Brand identity has one home.** `src/app/siteConfig.ts` holds the name, tagline, description, URL, support
address and route table. Nothing hardcodes a brand string. The accent is a `brand` Tailwind token backed by
CSS variables, not a hex value scattered across components.

**Authorization lives in the resource, not the middleware.** `src/middleware.ts` runs `clerkMiddleware()`
with no auth checks. `src/app/(main)/layout.tsx` calls `await auth.protect()`, and every dashboard route
passes through it. Clerk deprecated `createRouteMatcher` for a reason worth repeating: middleware path
matching can diverge from how Next resolves routes, and leave protected resources reachable.

**The app shell never wraps the public pages.** The root layout holds only providers, fonts and metadata.
`(main)/layout.tsx` owns the sidebar. `settings` sits inside the `(main)` route group, which leaves its URL
at `/settings` while placing it behind the same single guard.

**The marketing surface is its own visual system.** The landing and the auth screens render on a fixed dark
canvas with an editorial serif, independent of the dashboard's light and dark themes.

## Monitoring

`GET /api/health` returns `{ status, name, timestamp }` and is deliberately dynamic, so an uptime probe
observes the running instance rather than a build artifact. Vercel Analytics is wired into the root layout.

## Reviewer credentials

A sample account exists for `admin@novaanalytics.io`. Its password is shared in the submission email rather
than committed here. You can also create your own account through the sign-up flow.

## Known limitations and shortcuts

These are deliberate, given the scope of the exercise.

- **The dashboard data is mock data.** There is no database and no ingestion. `src/data/` is static.
- **The settings page is read-only.** It renders the signed-in user's real name and email, but the fields
  cannot be edited and the notification toggles hold local state and persist nothing.
- **Account management stops at Clerk's own surface.** Sign-out returns to the landing page.
- **The dashboard was not restyled** to match the landing's dark editorial system. Rebranding the upstream
  primitives was out of scope, and marketing and product intentionally read differently.
- **The demo `owner` names in `src/data/data.ts`** are generic person names. They carry no email, domain or
  brand, so they are not traces of the original product, and replacing them would be churn.
- **No end-to-end browser test.** The suite is integration level. The auth flow through a real browser
  session was verified by hand.

Natural next steps: a Playwright pass over the landing to dashboard flow, real data ingestion, and persisting
the settings page against a user store.

## License and attribution

This project is derived from
[`tremorlabs/template-dashboard-oss`](https://github.com/tremorlabs/template-dashboard-oss), licensed under
Apache 2.0. `LICENSE.md` is retained in full, and the upstream copyright and the `// Tremor Raw` attribution
comments in `src/lib/` and `src/components/` are kept intentionally. Apache 2.0 requires that attribution, and
it belongs in the source rather than in the product UI.
