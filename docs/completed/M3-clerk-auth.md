# M3 — Clerk auth

Login y signup funcionales, dashboard protegido. Rama: `feat/m3-m4-auth-and-landing` (junto con M4).

---

## 1. Qué se hizo

- `pnpm add @clerk/nextjs` (v7.5.14). Única dependencia nueva. Está en el stack de `CLAUDE.md` §2.
- `src/middleware.ts`: `clerkMiddleware()` **sin checks de autorización**, conservando `config.matcher`.
- `src/app/layout.tsx`: `<ClerkProvider>` envuelve el `<html>`, por fuera del `ThemeProvider`.
- `src/app/(main)/layout.tsx`: **nuevo**. Contiene `await auth.protect()` y el shell del dashboard.
- Rutas catch-all: `src/app/sign-in/[[...sign-in]]/page.tsx` y `src/app/sign-up/[[...sign-up]]/page.tsx`.
- `src/components/auth/auth-shell.tsx` y `clerk-appearance.ts`: las pantallas de auth sobre el canvas
  oscuro del sistema de diseño, sin añadir `@clerk/themes`.
- `UserProfile.tsx` deja de leer `siteConfig.sampleUser` y usa `useUser()`. Las iniciales se derivan del
  nombre real de la sesión.
- `DropdownUserProfile.tsx` muestra el email de la sesión y "Sign out" ahora ejecuta
  `signOut({ redirectUrl: "/" })` via `useClerk()`.
- `.env.example` con los seis nombres de variable. `.env.local` está gitignoreado y nunca se leyó.

---

## 2. Dos hallazgos que cambiaron el plan

### 2.1 `createRouteMatcher` está deprecado

El handoff pedía verificarlo, y efectivamente lo está en la 7.5.14:

> `@deprecated` This function will be removed in the next major version. Use resource-based auth checks
> instead. Middleware-based auth checks rely on path matching, which can diverge from how Next.js routes
> requests and **leave protected resources reachable**.

Por eso el middleware **no** decide nada. La autorización vive en `(main)/layout.tsx`, que es el único
punto por el que pasan `/overview`, `/details` y `/settings`.

### 2.2 `auth.protect()` devuelve 404, no redirect, según el tipo de petición

La guía web dice "redirects them to the sign-in page". El `.d.ts` es más preciso:

> Throws a Nextjs notFound error if user is not authenticated or authorized.
> \*For **non-document requests**, such as API requests, `auth.protect()` returns a `404`.

Un `curl` plano a `/overview` devuelve **404**, no un redirect. No es un bug: es el contrato. Una
navegación real (con `Sec-Fetch-Dest: document`) sí redirige. Verificarlo con curl a secas habría dado
un falso negativo, y "arreglarlo" habría roto el comportamiento correcto para peticiones API.

---

## 3. Cambio estructural: el sidebar salía en la landing

`src/app/layout.tsx` (el root) renderizaba `<Sidebar />` y `<main className="lg:pl-72">`. Como el root
layout envuelve **todas** las rutas, la landing pública y las pantallas de login habrían salido con el
sidebar del dashboard encima.

Solución:

- El root layout se queda con `ClerkProvider`, `ThemeProvider`, fuentes y metadata. Nada de UI de producto.
- `(main)/layout.tsx` se lleva el `Sidebar`, el `<main>` y el `max-w-screen-2xl`, y añade `auth.protect()`.
- `src/app/settings` se movió con `git mv` a `src/app/(main)/settings`. **La URL sigue siendo `/settings`**:
  los route groups no afectan al path. Ahora las tres rutas del dashboard comparten un único punto de
  control de acceso, en vez de tener `settings` como hermano top-level con su propio layout.
- El `<h1>` que vivía en `settings/layout.tsx` pasó a `settings/page.tsx` y el layout se eliminó.

---

## 4. Verificación

Contra el servidor de desarrollo, no solo el build.

| Comprobación | Resultado |
| --- | --- |
| `/`, `/sign-in`, `/sign-up` públicas | 200 |
| `/overview` sin sesión, navegación real | 307 handshake, cadena de 4 saltos |
| Destino final de esa cadena | `/sign-in?redirect_url=%2Foverview` con 200 |
| `/overview` sin sesión, petición tipo API | 404 (contrato de Clerk, correcto) |
| `/settings` sigue respondiendo en `/settings` tras el `git mv` | Sí |
| Sidebar en `/`, `/sign-in`, `/nope` | Cero ocurrencias |
| `tsc --noEmit`, `pnpm lint`, `pnpm build` | Verde |
| `.env.local` en git | No, ignorado por `.gitignore:29` |
| Claves en el diff | Cero |

El **camino (a)** del handoff (login desde la landing y aterrizar en `/overview` por
`SIGN_IN_FALLBACK_REDIRECT_URL`) requiere una sesión real de navegador. La variable está puesta, pero
**esto queda pendiente de verificación manual del owner**, junto con el aspecto visual de las pantallas
de Clerk.

---

## 5. Deuda y notas

- El `DropdownUserProfile` original traía tres ítems muertos sin `href`: "Changelog", "Documentation" y
  **"Join Slack community"**, residuo de la comunidad del template original. El grep de M2 no los cazó
  porque no contienen la palabra "tremor". Se eliminaron aquí.
- `siteConfig.sampleUser` sigue existiendo y lo consume `settings/page.tsx`, que es una página estática de
  demostración. La sesión real ya no lo usa.
- **La `sk_test` se compartió por chat.** Antes de la entrega hay que **rotarla en Clerk** y redactarla en
  `docs/claude-evidence/PROMPTS.md`, o el secreto queda publicado en un repo público.
