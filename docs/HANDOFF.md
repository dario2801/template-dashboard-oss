# HANDOFF — Nova Analytics trial

Contexto completo para retomar el trabajo en una sesión nueva. Léelo entero antes de tocar nada.

---

## 1. Qué es esto

Trial técnico para el puesto de **AI Agent Engineer**.

- **Empleador real: Dot Com Media** (quien evalúa; firma el correo del brief).
- **Nova Analytics** es la **cliente ficticia** del ejercicio. No confundir. La P11 del cuestionario
  behavioral ("what excites you about working with our company") se responde sobre **Dot Com Media**.
- **Owner:** Dario Auda. GitHub `dario2801`. Chat en español; código/commits/README/PRs en inglés.

**El encargo** (ver `docs/instructions.md`, el brief íntegro): forkear un dashboard open-source, rebrandearlo
a Nova Analytics (whitelabel), añadir landing pública con login/signup funcional, deployar a URL pública con
HTTPS, y grabar un video walkthrough. Todo hecho con Claude Code, documentando el proceso.

**Repo base:** fork de `tremorlabs/template-dashboard-oss` (Apache 2.0). Next.js 14.2.23 App Router, React 18,
TypeScript, Tailwind 3, Tremor Raw + Radix + Recharts. Arranca sin DB, con datos mock.

---

## 2. Documentos que DEBES leer (en este orden)

| Archivo | Qué contiene |
| --- | --- |
| `CLAUDE.md` (raíz) | **Políticas de operación.** Guardrails inviolables. Léelo primero. |
| `docs/PLAN.md` | El plan completo por milestones (M0-M6), arquitectura y criterios de aceptación. |
| `docs/instructions.md` | El brief original del correo (requisitos duros + extra credit). |
| `docs/completed/M0-setup.md` | Qué se hizo en M0 + inventario de strings a barrer. |
| `docs/completed/M1-brand-foundation.md` | Qué se hizo en M1 + decisiones de paleta. |
| `docs/contexto.md` | Contexto operativo previo del owner (versión larga, en español). |
| `docs/Behavioral & Work Style Questionnaire.pdf` | 15 preguntas personales, 5 secciones. Entregable duro. |

---

## 3. Reglas inviolables (NO las rompas)

1. **NUNCA `git commit` sin permiso explícito en el prompt actual.** El permiso NO se acumula entre prompts.
   Cada commit se pide de nuevo.
2. **NUNCA `git push`, merge a `main`, ni reescribir historia** sin permiso explícito en el prompt actual.
3. **CERO coautoría de IA.** Nada de `Co-Authored-By: Claude`, "Generated with Claude Code", ni ninguna
   atribución a la IA en commits, PRs o footers. El autor es **Dario Auda `<gonzalezdauda@gmail.com>`**
   (ya configurado en `git config --local` de este repo).
4. **Modo paso a paso.** Un milestone a la vez. Al cerrarlo: escribir `docs/completed/Mx-<nombre>.md`,
   mostrar qué cambió, y PEDIR PERMISO para commitear.
5. **Nunca leer `.env.local`.** Toda env var nueva va a `.env.example` (solo el nombre) en el mismo cambio.
   Claves de Clerk nunca en logs ni respuestas.
6. **No reescribir el fork.** Whitelabel + landing + auth + deploy es TODO el alcance. Nada de multi-tenancy,
   RLS, ni API-key-por-endpoint.
7. **SOLID proporcional al alcance.** Componentes de responsabilidad única. Lo más simple que cumpla el 100%.
8. **Comentarios:** solo el "por qué" no obvio. Sin ruido.
9. **Copy de UI sin em-dash (—).** Usar punto, coma o dos puntos.
10. **Commits descriptivos**, convención `tipo: descripción`, reflejando "Nova Analytics" (nunca "Tremor").

---

## 4. Estado actual del repo

**Ubicación:** `c:\Users\gonza\Desktop\test` (la raíz ES el repo git; `docs/` vive dentro).

```
Branch: main  ->  origin/main (ahead 2, SIN PUSH todavía)
Working tree: LIMPIO

f245afa  feat: add Nova Analytics brand foundation (palette, logo, siteConfig)   <- M1
075233d  docs: add project policies (CLAUDE.md), plan and trial docs             <- M0
a20f619  update deps                                                             <- base del fork
```

**Remotes:**
- `origin`  -> `https://github.com/dario2801/template-dashboard-oss.git` (el fork del owner)
- `upstream` -> `https://github.com/tremorlabs/template-dashboard-oss.git` (el original)

**Identidad git (local, ya configurada):** `Dario Auda <gonzalezdauda@gmail.com>`

**Tooling verificado:** git 2.40, gh CLI autenticado como `dario2801` (scopes repo+workflow), node 20.19,
pnpm 10.33. Owner confirma tener cuentas listas de **GitHub, Vercel y Clerk**.

**Comandos:** `pnpm install`, `pnpm dev` (localhost:3000), `pnpm build`, `pnpm lint`,
`pnpm exec tsc --noEmit`. Todo verde a día de hoy.

---

## 5. Milestones: hecho vs pendiente

| Milestone | Estado |
| --- | --- |
| **M0** Setup (fork, repo en raíz, CLAUDE.md, boot verify) | ✅ commiteado `075233d` |
| **M1** Brand foundation (paleta, token, BrandLogo, siteConfig) | ✅ commiteado `f245afa` |
| **M2** Whitelabel sweep | ⬜ **SIGUIENTE** |
| **M3** Clerk auth (login/signup, dashboard protegido) | ⬜ |
| **M4** Landing page pública en `/` | ⬜ |
| **M5** Deploy en Vercel (HTTPS, público) | ⬜ |
| **M6** Extra credit + README + cuestionario | ⬜ |

### Lo que ya existe (de M1)

- `src/app/globals.css` -> variables CSS `--brand-50 … --brand-950` (azul-violeta, acento `600` = #4F46E5).
- `tailwind.config.ts` -> token `brand` (`theme.extend.colors.brand`, formato
  `rgb(var(--brand-N) / <alpha-value>)`, `DEFAULT` = 500). Usable como `brand-600`, `brand-500/50`.
- `src/app/siteConfig.ts` -> **single source of truth** de la identidad:
  `name`, `tagline`, `description`, `url`, `supportEmail` (hello@novaanalytics.io),
  `sampleUser` (admin@novaanalytics.io), `baseLinks` (incluye `signIn: "/sign-in"`, `signUp: "/sign-up"`),
  y `externalLink.blocks` (temporal, apunta a `/overview`; ver deuda técnica abajo).
- `src/components/brand/brand-logo.tsx` -> `<BrandLogo variant="full" | "icon">`. Mark original: cuadrado
  redondeado `brand-600` con tres barras ascendentes. Es el ÚNICO lugar donde vive la marca.
- `src/app/not-found.tsx` -> ya usa `<BrandLogo>` y `text-brand-*`.
- `public/DatabaseLogo.tsx` -> **eliminado**.

---

## 6. M2 — Whitelabel sweep (el siguiente milestone)

**Meta:** cero rastros visibles del producto original. Los 4 obligatorios del brief son
**logo, favicon, application name, footer credits**.

### 6.1 Strings de marca a reemplazar (grep real, con línea)

```
src/app/layout.tsx:22           name: "yourname"
src/app/layout.tsx:26           creator: "yourname"
src/app/layout.tsx:37           title: "Tremor OSS Dashboard"
src/app/layout.tsx:38           creator: "@tremorlabs"
src/app/layout.tsx               metadataBase: "https://yoururl.com"  (placeholder)
src/data/data.ts:97             name: "Emma Stone"
src/data/data.ts:117            email: "a.flow@acme.com"
src/data/data.ts:123            email: "t.palstein@acme.com"
src/components/ui/navigation/UserProfile.tsx:27              "Emma Stone"  (+ iniciales "ES")
src/components/ui/navigation/DropdownUserProfile.tsx:49      "emma.stone@acme.com"
src/components/ui/navigation/MobileSidebar.tsx:81            <DrawerTitle>Retail Analytics</DrawerTitle>
src/components/ui/navigation/SidebarWorkspacesDropdown.tsx:19  value: "retail-analytics"  (+ "Retail analytics", iniciales "RA")
src/components/ui/navigation/ModalAddWorkspace.tsx:121        "Database region"
src/components/ui/navigation/ModalAddWorkspace.tsx:147        "Database configuration"
```

Además, `src/data/data.ts` tiene más nombres/emails demo: "Sarah Johnson", "John Doe", "Jane Smith",
"Alejandro Garcia", "Wei Zhang", dominios `@gmail.com`, `@bluewin.ch`. Todos deben pasar a identidades
Nova Analytics (usar `admin@novaanalytics.io` como el sample user del brief).

### 6.2 Color: `indigo` -> `brand`

**29 ocurrencias de `indigo` en 14 archivos.** Reemplazar las de UI visible por `brand-*`:

```
src/app/layout.tsx, src/app/(main)/overview/page.tsx
src/components/Badge.tsx, Calendar.tsx, ProgressBar.tsx, RadioCard.tsx
src/components/ui/overview/DashboardCategoryBarCard.tsx, DashboardProgressBarCard.tsx, DashboardChartCard.tsx
src/components/ui/navigation/MobileSidebar.tsx, sidebar.tsx, SidebarWorkspacesDropdown.tsx
src/lib/utils.ts (3), src/lib/chartUtils.ts (5)   <- REVISAR: focus rings y chart colors
```

Ojo con `src/lib/chartUtils.ts`: define la paleta de los charts. Decidir si el chart primario usa `brand`.
Y `src/lib/utils.ts`: los `focusInput`/`focusRing` usan indigo; cambiarlos a `brand` da coherencia.

### 6.3 Favicon y OG image

- `src/app/favicon.ico` y `src/app/opengraph-image.png` siguen siendo los de Tremor. **Regenerarlos** con el
  mark de `<BrandLogo variant="icon">` (cuadrado `brand-600` + 3 barras).
- `public/og_github.jpg` también es del template.
- **El grep NO detecta binarios.** La aceptación de favicon es **verificación visual** del icono en el tab del
  navegador.

### 6.4 Páginas paywall (deuda técnica de M1)

`src/app/(main)/details/page.tsx` y `src/app/settings/page.tsx` son placeholders del template: muestran
`<TremorPlaceholder>` y un botón "Get full template here" que enlazaba a `blocks.tremor.so`.

En M1 se restauró `siteConfig.externalLink.blocks` apuntando a `/overview` solo para no romper `tsc`.
**En M2 hay que decidir:** rebrandear esas páginas con contenido propio de Nova Analytics, o retirarlas.
Y eliminar `src/components/ui/icons/TremorPlaceholder.tsx`.

### 6.5 NO tocar (atribución legítima)

- Comentarios `// Tremor Raw ...` en `src/lib/utils.ts`, `chartUtils.ts`, `useOnWindowResize.tsx`. Son
  atribución de origen del código, NO UI visible. Apache 2.0 lo permite y es correcto conservarlos.
- `LICENSE.md` (Apache 2.0, copyright Tremor Labs). **Se conserva íntegro.**

### 6.6 Criterio de aceptación de M2

```bash
grep -rEi "tremor|database logo|retail analytics|yourname|emma stone|acme\.com" src/ public/
# -> cero resultados en UI visible (los comentarios "Tremor Raw" en src/lib/* son OK)
```
+ verificación visual del favicon en el tab
+ `pnpm build` verde, `pnpm exec tsc --noEmit` limpio
+ revisión visual del dashboard sin rastros

---

## 7. Hallazgos críticos para milestones futuros

### M4 — el root NO está libre
`next.config.mjs` tiene un **redirect `/` -> `/overview` con `permanent: true` (HTTP 308)**.
Para poner la landing en `/` hay que **eliminar ese redirect**. Como el 308 se cachea fuerte en el navegador,
**probar la landing en ventana de incógnito**.

No existe `src/app/page.tsx`. Rutas actuales: `/overview` (dashboard real),
`/details` y `/settings` (placeholders). **`settings` NO está en el route group `(main)`**, es un hermano
top-level con su propio layout. Importa para el matcher del middleware de Clerk.

### M3 — Clerk
- `pnpm add @clerk/nextjs`. **No hay auth ni `middleware.ts` hoy.** Clean slate.
- `ClerkProvider` va en `src/app/layout.tsx`, por fuera del `ThemeProvider` de next-themes (que ya existe).
- `src/middleware.ts` (Next 14 usa `middleware.ts`, no `proxy.ts`): proteger `/overview`, `/details`,
  `/settings`; dejar público `/`, `/sign-in`, `/sign-up`.
  Patrón para Next 14: `clerkMiddleware` + `createRouteMatcher` + `auth.protect()`.
  **Verificar al instalar** si la versión marca `createRouteMatcher` como deprecado y usar el patrón vigente.
- Rutas catch-all: `src/app/sign-in/[[...sign-in]]/page.tsx` y `src/app/sign-up/[[...sign-up]]/page.tsx`.
- Reemplazar `UserProfile.tsx` / `DropdownUserProfile.tsx` (hardcode "Emma Stone") por `<UserButton/>` /
  `useUser()`.
- **Env vars (todas a `.env.example`, nombres solamente):**
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/overview
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/overview
  ```
- **`.gitignore` ya ignora `.env*.local`** (verificado en M0). Las claves reales las pide el owner; nunca
  leerlas de archivos.
- **Verificar los DOS caminos del redirect** (el `FALLBACK_REDIRECT_URL` solo aplica si no hay `redirect_url`
  en la URL): (a) login desde la landing -> `/overview`; (b) entrar sin sesión directo a `/overview` -> Clerk
  manda a `/sign-in` -> tras autenticarse debe volver al dashboard.

### M4 — landing (estructura SOLID)
`src/app/page.tsx` compone; un componente por sección en `src/components/landing/`:
`landing-header.tsx`, `hero.tsx`, `features.tsx`, `cta.tsx`, `landing-footer.tsx`.
Reusar el `Button` de Tremor y los tokens `brand`. Mobile-first. Sin em-dash.
Actualizar el botón "home" de `not-found.tsx` para que apunte a la landing.

### M5 — deploy
Vercel + integración Git (deploy automático en push a `main`). Cargar las env vars de Clerk en Vercel
(**Production y Preview**). Configurar en Clerk las URLs de producción. **Requiere permiso para `git push`.**

### M6 — extra credit y submission
- README de Nova Analytics: setup, stack, env vars, credenciales de prueba, limitaciones.
- CI/CD: `.github/workflows/ci.yml` (lint + build + tests).
- Tests: Playwright e2e mínimo (landing -> sign-in -> dashboard) + unit del brand config.
- Analytics: Vercel Analytics o `/api/health`.
- **`docs/claude-evidence/`** con `PROMPTS.md` + screenshots. **Debe vivir EN el repo**: el revisor solo ve
  el repo y el deploy; si la evidencia no está ahí, no existe para ellos.
- **Cuestionario behavioral** -> `docs/behavioral-questionnaire-answers.md`. El PDF no es rellenable.
  Se redacta **con datos reales del owner** (hacerle preguntas; NO inventar su historia).
  La P11 va sobre **Dot Com Media**.

---

## 8. Submission checklist (entregables duros del correo)

- [ ] URL del fork de GitHub (público o con acceso al equipo revisor)
- [ ] URL live del deploy (landing + login funcionando sobre HTTPS)
- [ ] Credenciales de prueba (`admin@novaanalytics.io` + password)
- [ ] Link del video walkthrough 5-10 min (lo graba el owner)
- [ ] Notas de limitaciones / atajos / mejoras futuras (en README)
- [ ] **Cuestionario behavioral respondido y enviado** (entregable duro, NO olvidar)
- [ ] **Smoke test en prod JUSTO antes de enviar** (deploy vivo + login prod OK; el brief exige
      "stable during the review window" dos veces)
- [ ] (Bonus) `docs/claude-evidence/`, CI/CD, tests, analytics, custom domain

---

## 9. Cómo arrancar la sesión nueva

1. Lee `CLAUDE.md`, luego `docs/PLAN.md`, luego este archivo.
2. `pnpm install` si `node_modules` no está.
3. Confirma estado: `git log --oneline -3` y `git status`.
4. Arranca **M2** siguiendo la sección 6.
5. Al cerrar M2: escribe `docs/completed/M2-whitelabel-sweep.md`, muestra el diff, y **pide permiso para
   commitear**. No commitees sin el "sí" del owner en ese mismo prompt.
