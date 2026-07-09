# M3 — Clerk auth

Functional login and signup, protected dashboard. Branch: `feat/m3-m4-auth-and-landing` (together with M4).

---

## 1. What was done

- `pnpm add @clerk/nextjs` (v7.5.14). Only new dependency. It is in the stack of `CLAUDE.md` §2.
- `src/middleware.ts`: `clerkMiddleware()` **with no authorization checks**, keeping `config.matcher`.
- `src/app/layout.tsx`: `<ClerkProvider>` wraps the `<html>`, outside the `ThemeProvider`.
- `src/app/(main)/layout.tsx`: **new**. Contains `await auth.protect()` and the dashboard shell.
- Catch-all routes: `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`.
- `src/components/auth/auth-shell.tsx` and `clerk-appearance.ts`: the auth screens over the dark canvas of the
  design system, without adding `@clerk/themes`.
- `UserProfile.tsx` no longer reads `siteConfig.sampleUser` and uses `useUser()`. The initials are derived from
  the real name of the session.
- `DropdownUserProfile.tsx` shows the session email and "Sign out" now runs
  `signOut({ redirectUrl: "/" })` via `useClerk()`.
- `.env.example` with the six variable names. `.env.local` is gitignored and was never read.

---

## 2. Two findings that changed the plan

### 2.1 `createRouteMatcher` is deprecated

The handoff asked to verify it, and indeed it is in 7.5.14:

> `@deprecated` This function will be removed in the next major version. Use resource-based auth checks
> instead. Middleware-based auth checks rely on path matching, which can diverge from how Next.js routes
> requests and **leave protected resources reachable**.

For that reason the middleware decides **nothing**. Authorization lives in `(main)/layout.tsx`, which is the only
point through which `/overview`, `/details` and `/settings` pass.

### 2.2 `auth.protect()` returns 404, not a redirect, depending on the request type

The web guide says "redirects them to the sign-in page". The `.d.ts` is more precise:

> Throws a Nextjs notFound error if user is not authenticated or authorized.
> \*For **non-document requests**, such as API requests, `auth.protect()` returns a `404`.

A plain `curl` to `/overview` returns **404**, not a redirect. It is not a bug: it is the contract. A real
navigation (with `Sec-Fetch-Dest: document`) does redirect. Verifying it with a bare curl would have given a
false negative, and "fixing" it would have broken the correct behavior for API requests.

---

## 3. Structural change: the sidebar showed up on the landing

`src/app/layout.tsx` (the root) rendered `<Sidebar />` and `<main className="lg:pl-72">`. Since the root layout
wraps **all** routes, the public landing and the login screens would have shown up with the dashboard sidebar on
top.

Solution:

- The root layout keeps `ClerkProvider`, `ThemeProvider`, fonts and metadata. No product UI.
- `(main)/layout.tsx` takes over the `Sidebar`, the `<main>` and the `max-w-screen-2xl`, and adds `auth.protect()`.
- `src/app/settings` was moved with `git mv` to `src/app/(main)/settings`. **The URL is still `/settings`**:
  route groups do not affect the path. Now the three dashboard routes share a single access control point,
  instead of having `settings` as a top-level sibling with its own layout.
- The `<h1>` that lived in `settings/layout.tsx` moved to `settings/page.tsx` and the layout was removed.

---

## 4. Verification

Against the development server, not just the build.

| Check | Result |
| --- | --- |
| `/`, `/sign-in`, `/sign-up` public | 200 |
| `/overview` without session, real navigation | 307 handshake, chain of 4 hops |
| Final destination of that chain | `/sign-in?redirect_url=%2Foverview` with 200 |
| `/overview` without session, API-type request | 404 (Clerk contract, correct) |
| `/settings` still responds at `/settings` after the `git mv` | Yes |
| Sidebar on `/`, `/sign-in`, `/nope` | Zero occurrences |
| `tsc --noEmit`, `pnpm lint`, `pnpm build` | Green |
| `.env.local` in git | No, ignored by `.gitignore:29` |
| Keys in the diff | Zero |

The **path (a)** of the handoff (login from the landing and land on `/overview` via
`SIGN_IN_FALLBACK_REDIRECT_URL`) requires a real browser session. The variable is set, but **this remains pending
manual verification by the owner**, together with the visual appearance of the Clerk screens.

---

## 5. Debt and notes

- The original `DropdownUserProfile` brought three dead items with no `href`: "Changelog", "Documentation" and
  **"Join Slack community"**, a leftover from the community of the original template. The M2 grep did not catch
  them because they do not contain the word "tremor". They were removed here.
- `siteConfig.sampleUser` still exists, but **no component consumes it**. It only declares the reviewer's
  credential, and `tests/demo-data.test.ts` uses it as a contract against the first user of the dataset.
  (In M6 `settings/page.tsx` was fixed, which did render it and showed the demo identity to the logged-in user.)
- **The `sk_test` was shared over chat.** Before delivery it must be **rotated in Clerk** and redacted in
  `docs/claude-evidence/PROMPTS.md`, or the secret stays published in a public repo.
