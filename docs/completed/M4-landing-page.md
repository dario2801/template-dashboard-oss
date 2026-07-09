# M4 — Public landing page

Landing at `/`, applying the design system from `docs/DESIGN/`. Branch: `feat/m3-m4-auth-and-landing`.

---

## 1. The redirect that was blocking `/`

`next.config.mjs` had a redirect `/` -> `/overview` with `permanent: true` (**HTTP 308**). It was removed.

> The 308 is cached aggressively by the browser. If testing the landing shows the dashboard,
> **open an incognito window** or clear the site's cache. It is not a code bug.

---

## 2. How `docs/DESIGN/` was applied

The system is an extraction from `slash.com`: dark fintech, copper accent, serif/sans collision. It was used as
a **system of tokens and rules**, without copying content or copy from that site, and without its name appearing
in the product.

Three decisions made with the owner:

1. **Scope: landing + auth.** The dashboard stays as M2 left it, with its light/dark `ThemeProvider`.
   Redesigning the dashboard would have meant rewriting the fork's primitives, which `CLAUDE.md` §3.4 forbids.
   Dark marketing and light product is the pattern of Vercel, Linear, and Stripe.
2. **Copper editorial only.** The chromatic accent `copper` (`#cc9166`) is used in eyebrows and editorial
   links. Nova's mark stays in `brand-600` and acts as a brand signature over the black.
   `icon.svg`, the OG image, and the dashboard were not touched.
3. **Playfair Display** replaces Ivy Presto, which is a commercial font by Ivy Foundry and cannot be
   used. It is the first substitute that the doc itself recommends. It is loaded with `next/font/google`, without
   new dependencies.

### 2.1 Translation to Tailwind 3

`CSS.md` and `TOKENS.md` bring a `@theme` block, which is **Tailwind v4** syntax. This project uses
**Tailwind 3.4**, where `@theme` does not exist. The tokens were declared in `tailwind.config.ts`:

- Colors: `obsidian`, `onyx`, `carbon`, `graphite`, `slate`, `smoke`, `ash`, `steel`, `fog`, `mist`,
  `silver`, `bone`, `paper-white`, `copper`.
- `fontFamily.display` -> `var(--font-playfair)`.
- `backgroundImage.gilded` -> the golden gradient.
- `maxWidth.page` -> `1216px`.

> `slate` overrides Tailwind's `slate-50..950` scale. It was verified that **nothing in `src/` uses `slate-N`**
> before declaring it. If someone writes `slate-500` in the future, it will not exist.

---

## 3. Components

One per section, presentation without logic (`CLAUDE.md` §3.5):

```
src/app/page.tsx                        composes
src/components/landing/styles.ts        shared control shapes
src/components/landing/landing-header.tsx
src/components/landing/hero.tsx
src/components/landing/revenue-chart.tsx
src/components/landing/features.tsx
src/components/landing/stats.tsx
src/components/landing/cta.tsx
src/components/landing/landing-footer.tsx
```

The landing is auth-aware: it uses Clerk's `<Show when="signed-in" fallback={...}>`. Without a session it offers
"Get started" and "Sign in"; with a session, "Go to dashboard".

> `SignedIn` and `SignedOut` **no longer exist** in `@clerk/nextjs` v7. The replacement is `<Show>`, an async
> server component with `when` and `fallback`.

---

## 4. Deliberate deviations from the doc

- **No email capture in the hero.** The reference captures leads with an email input. We have
  Clerk: a field that discards whatever the user types would be dishonest. It was replaced by the two real CTAs,
  which lead to `/sign-up` and `/sign-in`.
- **A single white pill per viewport**, as the doc mandates ("it is a scarce visual resource"). The white goes
  to the hero. The header uses the ghost outline. The final CTA section, which is in another viewport, uses
  the white again.
- **The golden gradient appears only once**, in the sparkline of `revenue-chart.tsx`, which is the only
  data-visualization context. The doc explicitly reserves it for that.

---

## 5. Bug found and fixed: `BrandLogo`

The wordmark hardcoded `text-gray-900 dark:text-gray-50` on the **inner span**. The caller's `className`
reaches the **outer** span, so `cx` (which is `twMerge(clsx())`) could not override it: the child's color
won by element specificity.

Over the landing's black canvas, with the dashboard theme in light mode, the name "Nova Analytics" would have
come out **black on black**. The color was moved to the container.

---

## 6. Verification

| Check | Result |
| --- | --- |
| `/` responds | 200 |
| Sidebar on the landing | Zero occurrences |
| Tokens in the served HTML | `bg-obsidian`, `bg-onyx`, `text-paper-white`, `text-copper`, `border-graphite`, `font-display` |
| `--font-playfair` resolves | Yes, to `'__Playfair_Display_...'` in `layout.css`. Does not fall back |
| Footer credits | `© 2026 Nova Analytics. All rights reserved.` |
| Auth links | 3 to `/sign-in`, 4 to `/sign-up` |
| Golden gradient | 1 single occurrence, in the chart |
| Em-dash in copy | Zero across all of `src/` |
| `tsc`, `lint`, `build` | Green |

**Pending owner visual verification.** The HTML, the tokens, and the fonts are checked
programmatically, but the real appearance of the landing and of the Clerk screens needs a browser.

---

## 7. Notes for M5

- The landing is `ƒ` (dynamic) because `<Show>` reads the session. This is expected.
- When deploying, the six Clerk env vars must be loaded into Vercel, in **Production and Preview**, and
  the production URLs must be configured in the Clerk dashboard.
- Test the landing in **incognito** because of the cached 308.
