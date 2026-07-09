# M2 — Whitelabel sweep

Objective: zero visible traces of the original product. The four mandatory ones from the brief
(**logo, favicon, application name, footer credits**) are covered.

Branch: `feat/m2-whitelabel-sweep` (from `main`, which already contained M1 via the merge of PR #1).

---

## 1. What was done

### 1.1 Identity and metadata

- `src/app/layout.tsx`: `metadataBase` changes from `https://yoururl.com` to `new URL(siteConfig.url)`.
  `authors` and `creator` are no longer `"yourname"`. `twitter.title` is no longer `"Tremor OSS Dashboard"`,
  `twitter.creator` is no longer `"@tremorlabs"`. Added `twitter.description` and `keywords`.
  Removed the `icons: { icon: "/favicon.ico" }` block so Next 14 auto-wires `src/app/icon.svg`.
- `package.json`: `name` changes from `template-dashboard-open-source-version` to `nova-analytics`.
  No dependency touched. `pnpm-lock.yaml` intact.
- `README.md`: rewritten for Nova Analytics. Removed the banner that embedded `public/og_github.jpg`
  (that file is deleted in this milestone, keeping it would have been a broken image). The Apache 2.0
  attribution to the original template is kept, which is correct and required by the license.

### 1.2 Single source of identity

`src/app/siteConfig.ts`:

- `sampleUser` changes from `string` to `{ name, initials, email }`. It is consumed by `UserProfile.tsx`,
  `DropdownUserProfile.tsx` and `settings/page.tsx`, which previously hardcoded `"Emma Stone"` / `"ES"` /
  `"emma.stone@acme.com"`.
- **`externalLink` removed.** It was technical debt from M1: it pointed to `/overview` only so as not to break
  `tsc` after removing the Tremor URL. Its only consumer were the two paywall pages, now rewritten.

### 1.3 Placeholder pages

M2 decision (section 6.4 of the handoff left it open): **real content**, not an empty state.

- `src/app/settings/page.tsx`: a real settings page. Sections Profile (reads from `siteConfig.sampleUser`),
  Notifications (three accessible toggles with `role="switch"` and `aria-checked`), Workspace and Support
  (mailto to `siteConfig.supportEmail`). The `<h1>` is provided by `settings/layout.tsx`, it is not duplicated.
- `src/app/(main)/details/page.tsx`: a real table of workspace members over the mock data in
  `src/data/data.ts`, with `Badge` for the role.
- `src/components/ui/icons/TremorPlaceholder.tsx`: **removed**. Nothing else imported it.
- The "Get full template here" CTA disappears, and with it the dead link the review had flagged.

### 1.4 Color: `indigo` -> `brand`

One-to-one migration, preserving the shade number (`indigo-600` -> `brand-600`).

- `src/lib/utils.ts`: `focusInput` and `focusRing`. Gives branded focus state across the whole app.
- `src/lib/chartUtils.ts`: the `indigo` key of the `chartColors` map is renamed to `brand` and is kept
  **first**, so that `AvailableChartColors` leaves the primary series on the accent.
- `src/components/`: `Badge`, `Calendar`, `ProgressBar`, `RadioCard`.
- `src/components/ui/navigation/`: `sidebar`, `MobileSidebar`, `SidebarWorkspacesDropdown`.
- `src/components/ui/overview/`: the three dashboard cards.
- `src/app/(main)/overview/page.tsx` and `src/app/layout.tsx` (`selection:`).

> Trap avoided: `chartColors` uses `indigo` as a **key**, not just as a class. `getColorClassName`
> falls back to gray on an unknown key, so renaming the key without updating
> `colors={["indigo", "gray"]}` in `DashboardChartCard.tsx` would have put the primary series in gray
> **with no type error and a green build**. The call site was updated.

### 1.5 Demo data

`src/data/data.ts`:

- `users[]`: the 7 identities replaced. The first is the brief's sample user
  (`Nova Admin` / `NA` / `admin@novaanalytics.io`, role `admin`).
- `invitedUsers[]`: `@gmail.com` and `@bluewin.ch` emails migrated to `@novaanalytics.io`.
- **Bug fixed**: the original dataset repeated `a.stone@gmail.com` on two different users.
  The 9 emails are now unique, which also allows using them as React `key` in the table.

### 1.6 Navigation

- `MobileSidebar.tsx`: `<DrawerTitle>` uses `siteConfig.name` instead of `"Retail Analytics"`.
- `SidebarWorkspacesDropdown.tsx`: the workspace changes to `nova-analytics` / `"Nova Analytics"` / `NA`,
  in the three places where it was hardcoded.
- `ModalAddWorkspace.tsx`: the copy said `"Database region"` and `"Database configuration"` in a modal for
  **creating a workspace**. Rewritten to `"Workspace region"` / `"Workspace configuration"`, with the internal
  `const` `databases` renamed to `workspaceTiers`.

### 1.7 Favicon and OG image

- **Deleted**: `src/app/favicon.ico`, `src/app/opengraph-image.png`, `public/og_github.jpg`.
  `favicon.ico` had to go: in the Next 14 app dir it takes precedence over `icon.svg`.
- **Created** `src/app/icon.svg`: the `BrandLogo` mark (rounded square `#4F46E5` = `brand-600`,
  three ascending bars). Vector, crisp at 16x16.
- **Created** `src/app/opengraph-image.tsx`: generates the 1200x630 PNG with `ImageResponse` from `next/og`
  (already ships with Next 14, zero new dependencies). Reads `name`, `tagline` and `url` from `siteConfig`.

> `runtime = "edge"` is mandatory here, not cosmetic. The node build of `@vercel/og` resolves its default font
> with `fileURLToPath`, which throws `TypeError: Invalid URL` on Windows paths when importing the
> module. It broke `pnpm build` in the prerender of `/opengraph-image`. The edge build does not do that
> resolution. The colors go in literal hex because Satori does not read CSS vars or Tailwind classes; the four
> values (`#4F46E5`, `#3730A3`, `#1E1B4B`, `#C7D2FE`) are exactly `brand-600/800/950/200` from `globals.css`.

---

## 2. Acceptance criteria

| Criterion | Status |
| --- | --- |
| `grep -rEi "tremor\|retail analytics\|yourname\|emma stone\|acme.com\|indigo"` in `src/` `public/` | Zero hits in UI. Only `// Tremor Raw` comments and `tremor-id` attributes |
| `pnpm exec tsc --noEmit` | Clean |
| `pnpm lint` | `No ESLint warnings or errors` |
| `pnpm build` | Green |
| Favicon verified | `/icon.svg` -> 200 `image/svg+xml`; `<link rel="icon">` points to it |
| OG image verified | `/opengraph-image` -> 200 `image/png`, real PNG 1200x630 |
| Routes | `/overview` `/details` `/settings` -> 200; nonexistent route -> 404 |
| Rendered HTML without traces | `curl` of the three routes: zero hits |
| No new dependencies | `pnpm-lock.yaml` intact; `package.json` only changes `name` |
| `LICENSE.md` | Intact |
| No em-dash in product copy | Zero hits in `src/` |
| No AI co-authorship | Zero hits in the diff |

Verification done against the real development server, not just with the build.

---

## 3. Kept on purpose

- `// Tremor Raw ...` comments in `src/lib/*` and in the primitives of `src/components/*`, and the
  `tremor-id="tremor-raw"` DOM attributes of `DatePicker.tsx` and `Drawer.tsx`. They are origin attribution
  of the code, not visible UI. Apache 2.0 allows it and keeping them is the right thing.
- `LICENSE.md` in full.

---

## 4. Known debt entering M3+

- **The 52 `owner` values of `usage[]`** in `src/data/data.ts` (`"John Doe"`, `"Wei Zhang"`, ...) are still
  generic names. They are not traces of the original product: they carry no email, domain or brand. They were
  left on purpose. Replacing 52 neutral names with another 52 neutral ones is churn with no whitelabel value.
- `UserProfile.tsx` and `DropdownUserProfile.tsx` read `siteConfig.sampleUser`. **M3 replaces them** with
  `<UserButton/>` and `useUser()` from Clerk, so that coupling is deliberately temporary.
- The `<h1>` of `/settings` lives in `settings/layout.tsx`. `settings` remains outside the `(main)` route group.
  It matters for the Clerk middleware matcher in M3.
- `next.config.mjs` keeps the redirect `/` -> `/overview` with `permanent: true` (308). M4 must
  remove it and test the landing in incognito, because the 308 is cached hard.
