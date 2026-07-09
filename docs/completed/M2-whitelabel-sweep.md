# M2 — Whitelabel sweep

Objetivo: cero rastros visibles del producto original. Los cuatro obligatorios del brief
(**logo, favicon, application name, footer credits**) quedan cubiertos.

Rama: `feat/m2-whitelabel-sweep` (desde `main`, que ya contenía M1 vía el merge de PR #1).

---

## 1. Qué se hizo

### 1.1 Identidad y metadata

- `src/app/layout.tsx`: `metadataBase` pasa de `https://yoururl.com` a `new URL(siteConfig.url)`.
  `authors` y `creator` dejan de ser `"yourname"`. `twitter.title` deja de ser `"Tremor OSS Dashboard"`,
  `twitter.creator` deja de ser `"@tremorlabs"`. Se añadió `twitter.description` y `keywords`.
  Se eliminó el bloque `icons: { icon: "/favicon.ico" }` para que Next 14 auto-cablee `src/app/icon.svg`.
- `package.json`: `name` pasa de `template-dashboard-open-source-version` a `nova-analytics`.
  Ninguna dependencia tocada. `pnpm-lock.yaml` intacto.
- `README.md`: reescrito para Nova Analytics. Se retiró el banner que embebía `public/og_github.jpg`
  (ese archivo se borra en este milestone, dejarlo habría sido una imagen rota). Se conserva la
  atribución Apache 2.0 al template original, que es correcta y exigida por la licencia.

### 1.2 Fuente única de identidad

`src/app/siteConfig.ts`:

- `sampleUser` pasa de `string` a `{ name, initials, email }`. Lo consumen `UserProfile.tsx`,
  `DropdownUserProfile.tsx` y `settings/page.tsx`, que antes hardcodeaban `"Emma Stone"` / `"ES"` /
  `"emma.stone@acme.com"`.
- **`externalLink` eliminado.** Era deuda técnica de M1: apuntaba a `/overview` solo para no romper
  `tsc` tras quitar la URL de Tremor. Su único consumidor eran las dos páginas paywall, ahora reescritas.

### 1.3 Páginas placeholder

Decisión de M2 (la sección 6.4 del handoff la dejaba abierta): **contenido real**, no empty state.

- `src/app/settings/page.tsx`: página de ajustes real. Secciones Profile (lee de `siteConfig.sampleUser`),
  Notifications (tres toggles accesibles con `role="switch"` y `aria-checked`), Workspace y Support
  (mailto a `siteConfig.supportEmail`). El `<h1>` lo aporta `settings/layout.tsx`, no se duplica.
- `src/app/(main)/details/page.tsx`: tabla real de miembros del workspace sobre los datos mock de
  `src/data/data.ts`, con `Badge` para el rol.
- `src/components/ui/icons/TremorPlaceholder.tsx`: **eliminado**. Nada más lo importaba.
- Desaparece el CTA "Get full template here" y con él el link muerto que la review había marcado.

### 1.4 Color: `indigo` -> `brand`

Migración uno a uno, preservando el número de shade (`indigo-600` -> `brand-600`).

- `src/lib/utils.ts`: `focusInput` y `focusRing`. Da estado de foco branded en toda la app.
- `src/lib/chartUtils.ts`: la clave `indigo` del mapa `chartColors` pasa a llamarse `brand` y se mantiene
  **primera**, de modo que `AvailableChartColors` deja la serie primaria sobre el acento.
- `src/components/`: `Badge`, `Calendar`, `ProgressBar`, `RadioCard`.
- `src/components/ui/navigation/`: `sidebar`, `MobileSidebar`, `SidebarWorkspacesDropdown`.
- `src/components/ui/overview/`: las tres tarjetas del dashboard.
- `src/app/(main)/overview/page.tsx` y `src/app/layout.tsx` (`selection:`).

> Trampa evitada: `chartColors` usa `indigo` como **clave**, no solo como clase. `getColorClassName`
> cae a gris ante una clave desconocida, así que renombrar la clave sin actualizar
> `colors={["indigo", "gray"]}` en `DashboardChartCard.tsx` habría puesto la serie primaria en gris
> **sin error de tipos y con el build en verde**. Se actualizó el call site.

### 1.5 Datos demo

`src/data/data.ts`:

- `users[]`: las 7 identidades reemplazadas. La primera es el sample user del brief
  (`Nova Admin` / `NA` / `admin@novaanalytics.io`, rol `admin`).
- `invitedUsers[]`: emails `@gmail.com` y `@bluewin.ch` migrados a `@novaanalytics.io`.
- **Bug corregido**: el dataset original repetía `a.stone@gmail.com` en dos usuarios distintos.
  Los 9 emails son ahora únicos, lo que además permite usarlos como `key` de React en la tabla.

### 1.6 Navegación

- `MobileSidebar.tsx`: `<DrawerTitle>` usa `siteConfig.name` en vez de `"Retail Analytics"`.
- `SidebarWorkspacesDropdown.tsx`: el workspace pasa a `nova-analytics` / `"Nova Analytics"` / `NA`,
  en los tres sitios donde estaba hardcodeado.
- `ModalAddWorkspace.tsx`: la copy decía `"Database region"` y `"Database configuration"` en un modal de
  **crear workspace**. Reescrita a `"Workspace region"` / `"Workspace configuration"`, con el `const`
  interno `databases` renombrado a `workspaceTiers`.

### 1.7 Favicon y OG image

- **Borrados**: `src/app/favicon.ico`, `src/app/opengraph-image.png`, `public/og_github.jpg`.
  `favicon.ico` tenía que irse: en el app dir de Next 14 tiene precedencia sobre `icon.svg`.
- **Creado** `src/app/icon.svg`: el mark de `BrandLogo` (cuadrado redondeado `#4F46E5` = `brand-600`,
  tres barras ascendentes). Vectorial, nítido a 16x16.
- **Creado** `src/app/opengraph-image.tsx`: genera el PNG 1200x630 con `ImageResponse` de `next/og`
  (ya viene con Next 14, cero dependencias nuevas). Lee `name`, `tagline` y `url` de `siteConfig`.

> `runtime = "edge"` es obligatorio aquí, no cosmético. El build node de `@vercel/og` resuelve su fuente
> por defecto con `fileURLToPath`, que lanza `TypeError: Invalid URL` sobre rutas Windows al importar el
> módulo. Rompía `pnpm build` en el prerender de `/opengraph-image`. El build edge no hace esa resolución.
> Los colores van en hex literal porque Satori no lee CSS vars ni clases de Tailwind; los cuatro valores
> (`#4F46E5`, `#3730A3`, `#1E1B4B`, `#C7D2FE`) son exactamente `brand-600/800/950/200` de `globals.css`.

---

## 2. Criterios de aceptación

| Criterio | Estado |
| --- | --- |
| `grep -rEi "tremor\|retail analytics\|yourname\|emma stone\|acme.com\|indigo"` en `src/` `public/` | Cero hits en UI. Solo comentarios `// Tremor Raw` y atributos `tremor-id` |
| `pnpm exec tsc --noEmit` | Limpio |
| `pnpm lint` | `No ESLint warnings or errors` |
| `pnpm build` | Verde |
| Favicon verificado | `/icon.svg` -> 200 `image/svg+xml`; `<link rel="icon">` apunta a él |
| OG image verificada | `/opengraph-image` -> 200 `image/png`, PNG real 1200x630 |
| Rutas | `/overview` `/details` `/settings` -> 200; ruta inexistente -> 404 |
| HTML renderizado sin rastros | `curl` de las tres rutas: cero hits |
| Sin dependencias nuevas | `pnpm-lock.yaml` intacto; `package.json` solo cambia `name` |
| `LICENSE.md` | Intacto |
| Sin em-dash en copy de producto | Cero hits en `src/` |
| Sin coautoría de IA | Cero hits en el diff |

Verificación hecha contra el servidor de desarrollo real, no solo con el build.

---

## 3. Se conserva a propósito

- Comentarios `// Tremor Raw ...` en `src/lib/*` y en los primitives de `src/components/*`, y los
  atributos DOM `tremor-id="tremor-raw"` de `DatePicker.tsx` y `Drawer.tsx`. Son atribución de origen
  del código, no UI visible. Apache 2.0 lo permite y conservarlos es lo correcto.
- `LICENSE.md` íntegro.

---

## 4. Deuda conocida que entra a M3+

- **Los 52 `owner` de `usage[]`** en `src/data/data.ts` (`"John Doe"`, `"Wei Zhang"`, ...) siguen siendo
  nombres genéricos. No son rastros del producto original: no llevan email, dominio ni marca. Se dejaron
  a propósito. Sustituir 52 nombres neutros por otros 52 neutros es churn sin valor de whitelabel.
- `UserProfile.tsx` y `DropdownUserProfile.tsx` leen `siteConfig.sampleUser`. **M3 los reemplaza** por
  `<UserButton/>` y `useUser()` de Clerk, así que ese acoplamiento es deliberadamente temporal.
- El `<h1>` de `/settings` vive en `settings/layout.tsx`. `settings` sigue fuera del route group `(main)`.
  Importa para el matcher del middleware de Clerk en M3.
- `next.config.mjs` mantiene el redirect `/` -> `/overview` con `permanent: true` (308). M4 debe
  eliminarlo y probar la landing en incógnito, porque el 308 se cachea fuerte.
