# M0 — Setup: fork, repo at root, policies, boot verify

**Status:** completed.

## What was done

- **Fork** of `tremorlabs/template-dashboard-oss` to the `dario2801` account:
  `https://github.com/dario2801/template-dashboard-oss`.
- **Git repo at the root** `c:\Users\gonza\Desktop\test` keeping `docs/`. Method: `gh repo fork
  --clone=false` -> `git init` -> `git remote add origin <fork>` + `upstream <original>` -> `git fetch origin`
  -> `git checkout -b main origin/main`. The fork's code ended up tracked; `docs/` coexists as untracked.
- **CLAUDE.md** created at the root with the policies and requirements. Without any AI co-authorship line.
- **Plan** saved in `docs/PLAN.md` (living source). Folder `docs/completed/` created.

## Acceptance verifications

| Check | Result |
| --- | --- |
| Git repo at root with remote to the fork | OK (`origin` -> dario2801, `upstream` -> tremorlabs) |
| `docs/` intact | OK (CONTEXT.md, instructions.md, PDF, PLAN.md, completed/) |
| CLAUDE.md present and without AI co-authorship | OK |
| `docs/CONTEXT.md` without AI co-authorship | OK (grep confirmed zero real traces) |
| `.env.local` ignored by git | OK (`.gitignore` brings `.env*.local`; `git check-ignore` confirms it) |
| Dashboard index route | **`/overview`** confirmed (not `/dashboard`) |
| `node_modules` / `.next` ignored | OK |
| `pnpm install` | OK (pnpm 10.33) |
| `pnpm build` | Green. 8 static pages. Boot without DB confirmed |
| `pnpm dev` on localhost:3000 | Ready in ~2s. `/overview` -> HTTP 200 |

## Brand strings to sweep in M2 (real grep, with lines)

Visible UI (must be replaced):
- `src/app/layout.tsx`: `name: "yourname"` (L22), `creator: "yourname"` (L26),
  `title: "Tremor OSS Dashboard"` (L37), `creator: "@tremorlabs"` (L38).
- `src/app/siteConfig.ts`: `url: "https://dashboard.tremor.so"` (L3), `name: "Dashboard"`.
- `src/data/data.ts`: `name: "Emma Stone"` (L97), emails `@acme.com` (L117, L123).
- `src/app/not-found.tsx`: import + use of `DatabaseLogo` (L4, L11).
- `src/components/ui/icons/TremorPlaceholder.tsx` + uses in `settings/page.tsx` and `(main)/details/page.tsx`.
- `src/components/ui/navigation/DropdownUserProfile.tsx`: `emma.stone@acme.com` (L49).
- `src/components/ui/navigation/MobileSidebar.tsx`: `Retail Analytics` (L81).
- `src/components/ui/navigation/UserProfile.tsx`: `Emma Stone` (L27).
- `src/components/ui/navigation/SidebarWorkspacesDropdown.tsx`: `value: "retail-analytics"` (L19).
- `src/components/ui/navigation/ModalAddWorkspace.tsx`: "Database region" (L121), "Database configuration" (L147).

NOT visible UI (kept as origin attribution, Apache 2.0):
- Comments `// Tremor Raw ...` in `src/lib/utils.ts`, `chartUtils.ts`, `useOnWindowResize.tsx`.
- `LICENSE.md` (Apache 2.0, copyright Tremor Labs). Kept.

## Finding that adjusts M4

`next.config.mjs` has a **redirect `/` -> `/overview`** with `permanent: true` (HTTP 308). The root is NOT
simply free: to put the landing at `/` we will have to **remove that redirect** in M4. Since the 308 is
permanent and heavily cached in the browser, test the landing in an incognito window.

## Notes

- Current branch: `main` (tracks `origin/main`). Base commit: `a20f619 update deps`.
- Benign pnpm warning: build script `unrs-resolver` ignored (optional, no impact).
- Pending permission: initial commit of `CLAUDE.md` + `docs/`.
