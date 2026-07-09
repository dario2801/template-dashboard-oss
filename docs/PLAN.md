# Nova Analytics — Plan de ejecución del trial

## Context

Trial técnico para el puesto de **AI Agent Engineer**. El encargo (ver `docs/instructions.md`): tomar un
dashboard open-source, rebrandearlo bajo la identidad ficticia **Nova Analytics** (whitelabel), añadir una
landing page pública con login/signup funcional, y desplegarlo a una URL pública con HTTPS. Todo hecho con
Claude Code, y documentando el proceso.

**Empleador real (para el cuestionario):** **Dot Com Media** (firma el correo). NO confundir con **Nova
Analytics**, que es la cliente *ficticia* del ejercicio. La P11 del cuestionario ("what excites you about
working with our company specifically") se responde sobre Dot Com Media, no sobre Nova Analytics.

**Repo base elegido:** `tremorlabs/template-dashboard-oss` — Apache 2.0, Next.js 14.2.23 (App Router),
React 18, TypeScript, Tailwind 3, Tremor Raw + Radix + Recharts. Arranca sin base de datos con datos mock.
Es un dashboard de analytics por diseño, así que encaja temáticamente con "Nova Analytics" y su whitelabel es
limpio (branding centralizable). Apache 2.0 permite whitelabel y redistribución (solo exige conservar la
licencia y el copyright en el repo, no en la UI visible).

**Estado actual:** `c:\Users\gonza\Desktop\test` contiene solo `docs/` (contexto.md, instructions.md, el PDF
del cuestionario). NO es un repo git todavía. El fork aún no existe. Tooling verificado: git 2.40, gh CLI
autenticado como `dario2801` (scopes repo + workflow), node 20.19, npm 10.8, pnpm 10.33. GitHub, Vercel y
Clerk: el owner confirma que tiene las tres cuentas listas.

**Por qué este plan:** el owner pidió (1) trabajar aquí mismo reutilizando `test`, renombrando el proyecto a
**nova-analytics**; (2) dejar `docs/` y organizar las ideas por milestones; (3) cada milestone completado se
archiva en `docs/completed/`; (4) aplicar SOLID; (5) NO commitear sin permiso explícito; (6) ningún commit/PR
con Claude como coautor; (7) crear un `CLAUDE.md` con las políticas y requerimientos.

---

## Políticas de trabajo (rigen toda la ejecución)

Derivadas de `docs/contexto.md` + instrucciones nuevas del owner. Se materializan en el `CLAUDE.md` de M0.

1. **No commitear sin permiso explícito.** Cada `git commit` requiere un "sí" en el prompt actual. El permiso
   no se acumula entre prompts. `git push`, merge a `main`, y reescritura de historia: nunca sin permiso.
2. **Ningún commit ni PR con Claude como coautor.** No añadir `Co-Authored-By: Claude`, ni "Generated with
   Claude Code", ni ninguna atribución a la IA en mensajes de commit, cuerpos de PR ni footers. El autor es
   Dario Auda. Esta regla se escribe explícitamente en el `CLAUDE.md` de M0; al procesar `docs/contexto.md`
   en M0, si trae cualquier resto de coautoría de la IA, se elimina.
12. **Commits reflejan "Nova Analytics", no "Tremor".** El historial de git es visible en el repo público.
    Desde el primer commit (M0), los mensajes describen el trabajo de Nova Analytics, no "Tremor template".
    No se reescribe historia; simplemente los mensajes nacen correctos.
3. **Modo paso a paso.** Completar un milestone, mostrar qué cambió, esperar OK antes del siguiente.
4. **Secretos.** Nunca leer `.env.local`. Toda env var nueva va a `.env.example` (solo el nombre) en el mismo
   cambio. Claves de Clerk nunca en logs, respuestas ni URLs.
5. **SOLID proporcional al alcance.** Componentes de responsabilidad única, presentación separada de lógica.
   Sin componentes "dios", sin ceremonia enterprise. Lo más simple que cumpla el 100% de los requisitos.
6. **No reescribir el fork.** Whitelabel + landing + auth + deploy es todo el alcance. Nada de multi-tenancy,
   RLS ni API-key-por-endpoint (no aplican).
7. **Comentarios:** solo el "por qué" no obvio. Sin ruido.
8. **Copy de UI sin em-dash (—).** Usar punto, coma o dos puntos.
9. **Idioma:** chat en español; código, commits, README, PRs en inglés.
10. **Commits descriptivos**, convención `tipo: descripción` (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`).
11. **Archivado:** al cerrar cada milestone, se escribe `docs/completed/Mx-<nombre>.md` con lo entregado,
    archivos tocados, criterios de aceptación cumplidos y notas.

---

## Estructura de carpetas objetivo

El proyecto vive en la raíz `c:\Users\gonza\Desktop\test` (reutilizada, sin subcarpeta). El fork se clona
aquí y `docs/` se conserva dentro del repo.

```
test/                         (raíz del repo git = el fork de Nova Analytics)
├── CLAUDE.md                 (políticas + requerimientos — creado en M0)
├── PLAN.md                   (copia viva de este plan dentro del repo)
├── README.md                 (reescrito para Nova Analytics)
├── LICENSE.md                (Apache 2.0 — se conserva)
├── .env.example              (contrato de entorno)
├── docs/
│   ├── contexto.md           (se conserva)
│   ├── instructions.md       (se conserva)
│   ├── Behavioral & Work Style Questionnaire.pdf
│   └── completed/            (un .md por milestone cerrado)
│       ├── M0-setup.md
│       ├── M1-brand-foundation.md
│       └── ...
├── src/app/ src/components/ src/data/ src/lib/  (código del fork)
└── public/
```

**Nota de método para "reutilizar test":** `gh repo fork --clone` clona en una subcarpeta nueva. Para tener
el repo en la raíz sin perder `docs/`, el enfoque es: fork con `gh repo fork ... --clone=false`, luego
`git init` en `test/`, `git remote add origin <fork>`, `git fetch`, `git checkout` del contenido sobre la
raíz actual (que ya tiene `docs/`). Alternativa más limpia: clonar en carpeta temporal, mover su contenido
(incluida `.git`) a la raíz, y conservar `docs/`. Se decide en M0 y se pide permiso para la acción de fork.

---

## Arquitectura clave (decisiones de diseño)

### A. Brand Single-Source-of-Truth → `src/app/siteConfig.ts` extendido
Toda la identidad de Nova Analytics vive en UN solo módulo. Se extiende el `siteConfig.ts` existente (ya es
el lugar canónico del template) en vez de crear un módulo nuevo, para no duplicar fuentes de verdad:

```ts
export const siteConfig = {
  name: "Nova Analytics",
  tagline: "...",              // hero copy, sin em-dash
  url: "https://<vercel-url>",
  description: "...",
  supportEmail: "hello@novaanalytics.io",
  sampleUser: "admin@novaanalytics.io",
  baseLinks: { home: "/", overview: "/overview", signIn: "/sign-in", signUp: "/sign-up", ... },
}
```
Cualquier string de marca en componentes referencia `siteConfig`, nunca literales dispersos.

### B. Color system → token de marca en Tailwind + CSS variables (DRY light/dark)
Hoy el acento es `indigo` / `#6366F1` hardcodeado y disperso. Se introduce una paleta Nova Analytics como
**token semántico** para que el color sea DRY y whitelabel-able en un punto:
- En `globals.css`: variables CSS `--brand-50 … --brand-950` (y foreground) con valores para light y dark.
- En `tailwind.config.ts`: `theme.extend.colors.brand = { 50: 'var(--brand-50)', … , DEFAULT: 'var(--brand-500)' }`.
- Refactor: reemplazar usos `indigo-*` de la UI por `brand-*`, y el `#6366F1` del logo por el token.
- Paleta propuesta (definible por nosotros, el brief lo permite): azul-violeta profundo tipo "Nova"
  (p. ej. base `#4F46E5`→`#6D28D9` familia), a confirmar visualmente en M1.

### C. Logo → nuevo componente `<BrandLogo/>` (single place para la marca)
`public/DatabaseLogo.tsx` renderiza la palabra "Database" en SVG. Se sustituye por
`src/components/brand/brand-logo.tsx`: un componente único (SRP) que renderiza la marca Nova Analytics (icono
SVG + wordmark), con prop `variant` (full / icon) y color vía token `brand`. Se usa en: header de la landing,
sidebar del dashboard, y `not-found.tsx`. El favicon/OG se regeneran a partir del mismo mark.

### D. Clerk auth (M3) — patrón Next.js 14 App Router
- `pnpm add @clerk/nextjs`. Verificar versión al instalar; usar el patrón vigente para Next 14.
- `src/app/layout.tsx`: envolver con `<ClerkProvider>` por fuera del `<ThemeProvider>` de next-themes.
- `src/middleware.ts`: `clerkMiddleware` + `createRouteMatcher` que protege `/overview`, `/details`,
  `/settings` y deja público `/`, `/sign-in`, `/sign-up`. `config.matcher` estándar de Clerk.
  (Si al instalar la versión marca `createRouteMatcher` como deprecado, usar el patrón de protección vigente
  equivalente; decisión de implementación en M3, no bloquea el plan.)
- Sign-in / sign-up: catch-all routes `src/app/sign-in/[[...sign-in]]/page.tsx` y
  `src/app/sign-up/[[...sign-up]]/page.tsx` con `<SignIn/>` / `<SignUp/>` estilados con el token brand.
- Redirect post-login a `/overview` vía `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (y sign-up).
- Reemplazar `UserProfile.tsx` / `DropdownUserProfile.tsx` (hardcode "Emma Stone", emma.stone@acme.com) por
  `<UserButton/>` / `useUser()` de Clerk. El resto del dashboard queda intacto (no se reescribe el fork).
- Env vars (todas a `.env.example`): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
  `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`,
  `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/overview`,
  `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/overview`.

### E. Landing page (M4) — SOLID, componentes de responsabilidad única
`/` está libre (no hay `app/page.tsx`; hoy 404ea). Se crea la landing pública ahí:
- `src/app/page.tsx` — compone la landing (sin lógica, solo layout).
- `src/components/landing/` — un componente por sección (SRP):
  `landing-header.tsx` (logo + CTA sign-in/sign-up), `hero.tsx`, `features.tsx` (grid de beneficios),
  `cta.tsx` (llamado final a signup), `landing-footer.tsx` (créditos Nova Analytics, sin rastro de Tremor).
- Reutiliza el `Button` de Tremor y los tokens de color/tipografía para consistencia visual con el dashboard.
- Responsive/mobile-first con utilidades Tailwind. CTAs enlazan a `/sign-up` y `/sign-in`.
- El botón "home" de `not-found.tsx` ahora apunta a la landing.

### F. Deploy (M5) — Vercel Git integration
- Deploy vía **Vercel + integración Git** (deploy automático en push a `main`), no solo CLI: da la URL
  pública estable con HTTPS que el review necesita y encaja con el CI/CD extra credit.
- Env vars de Clerk se cargan en el dashboard de Vercel (Production + Preview).
- Requiere permiso explícito para `git push` (política 1). Antes del deploy: `pnpm build` verde local.

### G. Tests + extra credit (M6)
- **Tests (leanest meaningful):** Playwright e2e mínimo que cargue la landing, verifique el hero + CTA, y
  navegue a `/sign-in` comprobando que Clerk monta. Opcionalmente un test unit del `siteConfig`/brand (que no
  queden strings del producto original). Se elige el más viable con Clerk en CI.
- **CI/CD:** GitHub Actions que corra `pnpm lint` + `pnpm build` (+ tests) en push/PR. Vercel maneja el
  deploy; Actions valida calidad. No conflictúan.
- **Analytics/monitoring:** Vercel Analytics (tier gratis) o un endpoint `/api/health`. Se elige el más
  simple.
- **Custom domain:** opcional, solo si el owner tiene un dominio; si no, se documenta como "mejora futura".

---

## Milestones

Cada milestone: al cerrarlo se escribe `docs/completed/Mx-<nombre>.md` y se pide permiso antes de commitear.

### M0 — Setup: fork, clone en raíz, CLAUDE.md, boot verify
**Meta:** tener el fork de Nova Analytics como repo git en la raíz `test/`, arrancando localmente, con las
políticas escritas.
- **Requiere permiso:** `gh repo fork tremorlabs/template-dashboard-oss` (crea repo público en `dario2801`).
- Traer el código a la raíz conservando `docs/` (método en "Estructura de carpetas objetivo").
- Crear `CLAUDE.md` (políticas + requerimientos de este plan). **Sin ninguna línea de coautoría de Claude**
  (`Co-Authored-By`, "Generated with Claude Code", etc.). Copiar el plan como `PLAN.md`.
- Procesar `docs/contexto.md`: si contiene cualquier resto de atribución a la IA, eliminarlo.
- Crear `docs/completed/`.
- **Verificación temprana de secretos:** confirmar que `.gitignore` del fork ya ignora `.env.local` (y
  `.env*.local`) ANTES de crear cualquier `.env.local` con claves reales. Si no lo ignora, añadirlo primero.
- **Verificar strings/rutas reales con grep:** confirmar los literales exactos a barrer en M2 (p. ej.
  "Retail Analytics", "Database", "Tremor", "yourname", "Emma Stone") y la ruta index real del dashboard
  (esperado `/overview`, no `/dashboard`) sobre el código ya clonado, para no perseguir fantasmas.
- `pnpm install` && `pnpm run dev` → verificar que el dashboard levanta en localhost:3000 sin DB.
- **Aceptación:** repo git en raíz con remote al fork; `docs/` intacta; `CLAUDE.md` presente y sin coautoría
  de IA; `.env.local` confirmado en `.gitignore`; ruta index del dashboard verificada; `pnpm dev` renderiza
  el dashboard; `pnpm build` verde.

### M1 — Brand foundation: color token + BrandLogo + siteConfig
**Meta:** infraestructura de marca centralizada (color, logo, identidad) lista para el barrido.
- Extender `src/app/siteConfig.ts` con la identidad Nova Analytics (A).
- Añadir variables CSS de marca en `globals.css` + token `brand` en `tailwind.config.ts` (B).
- Crear `src/components/brand/brand-logo.tsx`; eliminar/retirar `public/DatabaseLogo.tsx` (C).
- **Aceptación:** `pnpm build` + `pnpm tsc --noEmit` verdes; el token `brand` compila; `<BrandLogo/>` renderiza.

### M2 — Whitelabel sweep: cero rastros del producto original en la UI
**Meta:** ninguna referencia visible a Tremor/Database/Retail Analytics; datos demo con identidad Nova.
- Reemplazar acentos `indigo-*` / `#6366F1` por `brand-*` en toda la UI.
- Reemplazar metadata placeholder en `layout.tsx` (metadataBase, authors "yourname", twitter "@tremorlabs").
- Regenerar favicon + opengraph-image con el mark Nova Analytics.
- Reescribir datos demo: `src/data/data.ts` (usuarios/emails → identidades Nova, incl. `admin@novaanalytics.io`),
  `UserProfile.tsx`, `DropdownUserProfile.tsx`, `MobileSidebar.tsx` ("Retail Analytics"→"Nova Analytics"),
  `SidebarWorkspacesDropdown.tsx`, `ModalAddWorkspace.tsx`.
- **Aceptación (los 4 obligatorios del correo: logo, favicon, app name, footer credits):**
  - `grep -rEi "tremor|database logo|retail analytics|yourname|emma stone|acme\.com" src/ public/`
    → cero resultados en UI visible (la licencia/copyright de Apache en LICENSE.md se conserva).
  - **Favicon (binario, no lo cubre el grep):** verificación visual explícita de que el icono del tab del
    navegador es el mark de Nova Analytics, no el de Tremor. Igual para la opengraph-image.
  - `pnpm build` verde; revisión visual del dashboard sin rastros del producto original.

### M3 — Clerk auth: login/signup funcional + dashboard protegido
**Meta:** flujo de autenticación real; `/overview` protegido; redirect post-login al dashboard.
- Instalar `@clerk/nextjs`; `ClerkProvider` en `layout.tsx`; `src/middleware.ts` (D).
- Catch-all routes `/sign-in` y `/sign-up` estilados con brand.
- Reemplazar `UserProfile`/`DropdownUserProfile` por `<UserButton/>`/`useUser()`.
- Todas las env vars a `.env.example`. Claves reales solo en `.env.local` (nunca commiteado, gitignore
  verificado).
- **Requiere del owner:** las claves de Clerk (se piden cuando toque; no se leen de archivos).
- **Aceptación:** signup crea cuenta; login redirige a `/overview`; acceso directo a `/overview` sin sesión
  redirige a `/sign-in`; `pnpm build` verde.
- **Verificar el redirect real (no asumir):** `FALLBACK_REDIRECT_URL` solo aplica si NO hay `redirect_url` en
  la URL. Probar los DOS caminos: (a) login desde la landing → termina en `/overview`; (b) usuario sin sesión
  entra directo a `/overview`, Clerk lo manda a `/sign-in`, y tras autenticarse vuelve al dashboard. Confirmar
  que ambos terminan en el dashboard; si el camino (b) no vuelve solo, ajustar la config de Clerk.

### M4 — Landing page pública, responsive, pulida
**Meta:** entrada pública en `/` con hero, features y CTA a login/signup; mobile-friendly.
- `src/app/page.tsx` + `src/components/landing/*` (E).
- Reusar Button/tokens de Tremor. Sin em-dash en el copy.
- Ajustar `not-found.tsx` "home" → landing.
- **Aceptación:** `/` renderiza landing con hero + features + CTA; responsive a 375px y desktop; CTAs navegan a
  `/sign-up`/`/sign-in`; `pnpm build` verde.

### M5 — Deploy en Vercel (HTTPS, público, estable)
**Meta:** URL pública live sobre HTTPS, estable para el review.
- **Requiere permiso:** `git push` del trabajo al fork.
- Conectar el fork a Vercel (Git integration); cargar env vars de Clerk en Vercel.
- Configurar en Clerk las URLs de producción (dominio de Vercel) para que auth funcione en prod.
- **Aceptación:** URL pública HTTPS carga landing; signup/login funcionan en prod; `/overview` protegido en
  prod; deploy estable.

### M6 — Extra credit + README + polish
**Meta:** puntos de bonus y entregables de submission.
- README para Nova Analytics: setup, stack, env vars, credenciales de prueba, notas/limitaciones.
- CI/CD: `.github/workflows/ci.yml` (lint + build + tests).
- Tests: Playwright e2e mínimo (+ unit de brand config).
- Analytics/monitoring: Vercel Analytics o `/api/health`.
- (Opcional) custom domain si hay dominio disponible.
- **Evidencia de Claude Code (bonus, debe vivir EN el repo o el revisor no la ve):** carpeta
  `docs/claude-evidence/` con `PROMPTS.md` (los prompts dados por milestone) + screenshots/terminal history.
  El revisor solo ve el repo y el deploy; si la evidencia no está en el repo, no existe para ellos.
- **Cuestionario behavioral:** el PDF no es rellenable (solo texto). Se entrega como
  `docs/behavioral-questionnaire-answers.md` (o PDF/doc aparte según pida el submission), redactado con datos
  reales del owner. La P11 se responde sobre **Dot Com Media** (el empleador real).
- **Aceptación:** CI verde en GitHub; tests pasan; README completo; analytics/health activo;
  `docs/claude-evidence/` presente; respuestas del cuestionario redactadas.

---

## Verificación end-to-end (al final)

1. `pnpm install && pnpm build && pnpm tsc --noEmit && pnpm lint` → todo verde localmente.
2. `pnpm dev` → recorrer: `/` (landing) → click CTA → `/sign-up` → crear cuenta → redirige a `/overview` →
   dashboard rebrandeado; logout; acceso directo a `/overview` sin sesión → redirige a `/sign-in`.
3. Barrido whitelabel: `grep -rEi "tremor|database logo|retail analytics|emma stone|acme\.com|yourname" src/ public/`
   → cero hits en UI (LICENSE.md conserva la atribución Apache, que es correcto).
4. Responsive: probar la landing y el dashboard a 375px y a desktop.
5. Prod: abrir la URL de Vercel, repetir el flujo de auth sobre HTTPS, confirmar estabilidad.
5b. **Smoke test en prod JUSTO antes de entregar** (el correo exige "stable during the review window", lo dice
    dos veces): confirmar que el deploy sigue vivo, que las claves de Clerk de *Production* (no solo Preview)
    funcionan, y que el login real termina en el dashboard. Las claves prod a veces quedan mal entre Preview y
    Production; este check evita entregar un deploy caído.
6. **Submission checklist (todos los entregables del correo, ninguno opcional):**
   - [ ] URL del fork de GitHub (público o con acceso al equipo revisor).
   - [ ] URL live del deploy (landing + login funcionando sobre HTTPS).
   - [ ] Credenciales de prueba (`admin@novaanalytics.io` + password) para que el revisor entre sin registrarse.
   - [ ] Link del video walkthrough 5-10 min (lo graba el owner).
   - [ ] Notas de limitaciones / atajos / mejoras futuras (en README).
   - [ ] **Cuestionario behavioral respondido y enviado** (entregable duro del correo; se redacta en M6 con
         datos reales del owner). NO olvidar en el submission.
   - [ ] Smoke test en prod ejecutado justo antes de enviar (deploy vivo + login prod OK).
   - [ ] (Bonus) evidencia de Claude Code en `docs/claude-evidence/` (PROMPTS.md + screenshots), CI/CD, tests,
         analytics, custom domain.

---

## Decisiones ya confirmadas por el owner

- **Método de "reutilizar test" (M0):** `git init` en la raíz. Fork sin clonar
  (`gh repo fork --clone=false`) → `git init` en `test/` → remote al fork → `fetch` → `checkout` del código
  sobre la raíz, conservando `docs/`. La raíz queda como el repo con `.git` y `docs/` intactos.
- **Paleta de Nova Analytics (M1):** la defino yo. Propongo una paleta cohesiva en M1 con muestras y el owner
  la ajusta si hace falta.
- **Cuestionario conductual:** se hace en M6, con datos reales del owner. Le hago preguntas sobre su
  experiencia y redacto borradores honestos que él edita. No se inventa su historia.
```