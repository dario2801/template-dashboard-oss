# M0 — Setup: fork, repo en raíz, políticas, boot verify

**Estado:** completado.

## Qué se hizo

- **Fork** de `tremorlabs/template-dashboard-oss` a la cuenta `dario2801`:
  `https://github.com/dario2801/template-dashboard-oss`.
- **Repo git en la raíz** `c:\Users\gonza\Desktop\test` conservando `docs/`. Método: `gh repo fork
  --clone=false` -> `git init` -> `git remote add origin <fork>` + `upstream <original>` -> `git fetch origin`
  -> `git checkout -b main origin/main`. El código del fork quedó trackeado; `docs/` convive como untracked.
- **CLAUDE.md** creado en la raíz con las políticas y requerimientos. Sin ninguna línea de coautoría de IA.
- **Plan** guardado en `docs/PLAN.md` (fuente viva). Carpeta `docs/completed/` creada.

## Verificaciones de aceptación

| Check | Resultado |
| --- | --- |
| Repo git en raíz con remote al fork | OK (`origin` -> dario2801, `upstream` -> tremorlabs) |
| `docs/` intacta | OK (contexto.md, instructions.md, PDF, PLAN.md, completed/) |
| CLAUDE.md presente y sin coautoría de IA | OK |
| `docs/contexto.md` sin coautoría de IA | OK (grep confirmó cero rastros reales) |
| `.env.local` ignorado por git | OK (`.gitignore` trae `.env*.local`; `git check-ignore` lo confirma) |
| Ruta index del dashboard | **`/overview`** confirmada (no `/dashboard`) |
| `node_modules` / `.next` ignorados | OK |
| `pnpm install` | OK (pnpm 10.33) |
| `pnpm build` | Verde. 8 páginas estáticas. Boot sin DB confirmado |
| `pnpm dev` en localhost:3000 | Ready en ~2s. `/overview` -> HTTP 200 |

## Strings de marca a barrer en M2 (grep real, con líneas)

UI visible (hay que reemplazar):
- `src/app/layout.tsx`: `name: "yourname"` (L22), `creator: "yourname"` (L26),
  `title: "Tremor OSS Dashboard"` (L37), `creator: "@tremorlabs"` (L38).
- `src/app/siteConfig.ts`: `url: "https://dashboard.tremor.so"` (L3), `name: "Dashboard"`.
- `src/data/data.ts`: `name: "Emma Stone"` (L97), emails `@acme.com` (L117, L123).
- `src/app/not-found.tsx`: import + uso de `DatabaseLogo` (L4, L11).
- `src/components/ui/icons/TremorPlaceholder.tsx` + usos en `settings/page.tsx` y `(main)/details/page.tsx`.
- `src/components/ui/navigation/DropdownUserProfile.tsx`: `emma.stone@acme.com` (L49).
- `src/components/ui/navigation/MobileSidebar.tsx`: `Retail Analytics` (L81).
- `src/components/ui/navigation/UserProfile.tsx`: `Emma Stone` (L27).
- `src/components/ui/navigation/SidebarWorkspacesDropdown.tsx`: `value: "retail-analytics"` (L19).
- `src/components/ui/navigation/ModalAddWorkspace.tsx`: "Database region" (L121), "Database configuration" (L147).

NO es UI visible (se conserva como atribución de origen, Apache 2.0):
- Comentarios `// Tremor Raw ...` en `src/lib/utils.ts`, `chartUtils.ts`, `useOnWindowResize.tsx`.
- `LICENSE.md` (Apache 2.0, copyright Tremor Labs). Se mantiene.

## Hallazgo que ajusta M4

`next.config.mjs` tiene un **redirect `/` -> `/overview`** con `permanent: true` (HTTP 308). El root NO está
simplemente libre: para poner la landing en `/` habrá que **eliminar ese redirect** en M4. Como el 308 es
permanente y se cachea fuerte en el navegador, probar la landing en ventana de incógnito.

## Notas

- Rama actual: `main` (trackea `origin/main`). Commit base: `a20f619 update deps`.
- Warning benigno de pnpm: build script `unrs-resolver` ignorado (opcional, no afecta).
- Pendiente de permiso: commit inicial de `CLAUDE.md` + `docs/`.
