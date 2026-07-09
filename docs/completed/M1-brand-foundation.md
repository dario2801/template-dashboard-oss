# M1 — Brand foundation: color token, BrandLogo, siteConfig

**Status:** completed. Palette approved by the owner.

## What was done

Centralized brand infrastructure so that color, logo, and identity have a single source of truth.

- **Nova Analytics palette** in `src/app/globals.css`: scale `--brand-50 … --brand-950` as CSS variables
  (`R G B` format to support alpha). Deep blue-violet family ("Nova"). The primary accent is `600`
  (#4F46E5), hover `700` (#4338CA).
- **`brand` token** in `tailwind.config.ts` (`theme.extend.colors.brand`), with format
  `rgb(var(--brand-N) / <alpha-value>)` so opacity utilities work (`brand-500/50`).
  `DEFAULT` = 500. Now the UI uses `brand-*` instead of `indigo-*` / `#6366F1`.
- **Centralized identity** in `src/app/siteConfig.ts`: `name`, `tagline`, `description`, `url`,
  `supportEmail` (hello@novaanalytics.io), `sampleUser` (admin@novaanalytics.io), and `baseLinks` extended with
  `signIn`/`signUp` (for M3/M4). Copy without em-dash.
- **Own logo** in `src/components/brand/brand-logo.tsx`: `<BrandLogo>` (SRP), variants `full` (icon +
  wordmark) and `icon`. Original mark: rounded square `brand-600` with three ascending bars (analytics
  reading). The favicon and the lockup share geometry.
- **`src/app/not-found.tsx`** updated: uses `<BrandLogo>` and `text-brand-600/500` (previously `DatabaseLogo` +
  `indigo`).
- **`public/DatabaseLogo.tsx` removed** (zero references after the change).

## Acceptance verifications

| Check | Result |
| --- | --- |
| `pnpm exec tsc --noEmit` | Clean, no errors |
| `pnpm build` | Green. 8 static pages |
| `brand` token compiles and is usable | OK (`brand-600`, `brand-500/opacity`) |
| `<BrandLogo>` renders (full + icon) | OK |
| Zero references to `DatabaseLogo` | OK |
| Palette reviewed by the owner (artifact) | Approved |

## Notes / decisions

- The `brand` scale matches Tailwind's `indigo` family. Deliberate: an accessible transition from the
  template, and since everything goes through the token, changing the 11 hex values in `globals.css` re-skins
  the whole product.
- **Known adjustment for M2:** I removed `externalLink` from siteConfig when rewriting it, which broke
  `details/page.tsx` and `settings/page.tsx` (the template's paywall pages). `externalLink.blocks` was restored
  pointing temporarily to `/overview`. In M2 the real destination of those pages is decided (rebrand or retire)
  and the `TremorPlaceholder` is cleaned up.
- The `brand` variables work the same in light and dark because they are identical for both (the contrast comes
  from the components' `dark:` utilities, not the scale). If needed in M2/M4, they can be overridden under
  `.dark`.

## Pending

- M2 (whitelabel sweep): replace the remaining `indigo-*` with `brand-*` in the rest of the components,
  metadata, favicon/OG, and demo data.
