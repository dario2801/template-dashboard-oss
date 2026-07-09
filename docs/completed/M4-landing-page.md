# M4 — Landing page pública

Landing en `/`, aplicando el sistema de diseño de `docs/DESIGN/`. Rama: `feat/m3-m4-auth-and-landing`.

---

## 1. El redirect que bloqueaba `/`

`next.config.mjs` tenía un redirect `/` -> `/overview` con `permanent: true` (**HTTP 308**). Se eliminó.

> El 308 se cachea de forma agresiva en el navegador. Si al probar la landing sale el dashboard,
> **abrir una ventana de incógnito** o limpiar la caché del sitio. No es un bug del código.

---

## 2. Cómo se aplicó `docs/DESIGN/`

El sistema es una extracción de `slash.com`: dark fintech, acento cobre, colisión serif/sans. Se usó como
**sistema de tokens y reglas**, sin copiar contenido ni copy de ese sitio, y sin que su nombre aparezca en
el producto.

Tres decisiones tomadas con el owner:

1. **Alcance: landing + auth.** El dashboard queda como lo dejó M2, con su `ThemeProvider` light/dark.
   Rediseñar el dashboard habría implicado reescribir los primitives del fork, que `CLAUDE.md` §3.4 prohíbe.
   Marketing oscuro y producto claro es el patrón de Vercel, Linear y Stripe.
2. **Cobre solo editorial.** El acento cromático `copper` (`#cc9166`) se usa en eyebrows y links
   editoriales. El mark de Nova sigue en `brand-600` y actúa como firma de marca sobre el negro.
   `icon.svg`, la OG image y el dashboard no se tocaron.
3. **Playfair Display** sustituye a Ivy Presto, que es una fuente comercial de Ivy Foundry y no se puede
   usar. Es la primera sustituta que el propio doc recomienda. Se carga con `next/font/google`, sin
   dependencias nuevas.

### 2.1 Traducción a Tailwind 3

`CSS.md` y `TOKENS.md` traen un bloque `@theme`, que es sintaxis de **Tailwind v4**. Este proyecto usa
**Tailwind 3.4**, donde `@theme` no existe. Los tokens se declararon en `tailwind.config.ts`:

- Colores: `obsidian`, `onyx`, `carbon`, `graphite`, `slate`, `smoke`, `ash`, `steel`, `fog`, `mist`,
  `silver`, `bone`, `paper-white`, `copper`.
- `fontFamily.display` -> `var(--font-playfair)`.
- `backgroundImage.gilded` -> el gradiente dorado.
- `maxWidth.page` -> `1216px`.

> `slate` pisa la escala `slate-50..950` de Tailwind. Se verificó que **nada en `src/` usa `slate-N`**
> antes de declararlo. Si alguien escribe `slate-500` en el futuro, no existirá.

---

## 3. Componentes

Uno por sección, presentación sin lógica (`CLAUDE.md` §3.5):

```
src/app/page.tsx                        compone
src/components/landing/styles.ts        formas compartidas de los controles
src/components/landing/landing-header.tsx
src/components/landing/hero.tsx
src/components/landing/revenue-chart.tsx
src/components/landing/features.tsx
src/components/landing/stats.tsx
src/components/landing/cta.tsx
src/components/landing/landing-footer.tsx
```

La landing es auth-aware: usa `<Show when="signed-in" fallback={...}>` de Clerk. Sin sesión ofrece
"Get started" y "Sign in"; con sesión, "Go to dashboard".

> `SignedIn` y `SignedOut` **ya no existen** en `@clerk/nextjs` v7. El reemplazo es `<Show>`, un async
> server component con `when` y `fallback`.

---

## 4. Desviaciones deliberadas del doc

- **Sin captura de email en el hero.** El referente captura leads con un input de email. Nosotros tenemos
  Clerk: un campo que descarta lo que el usuario escribe sería deshonesto. Se sustituyó por los dos CTA
  reales, que llevan a `/sign-up` y `/sign-in`.
- **Un solo pill blanco por viewport**, como manda el doc ("it is a scarce visual resource"). El blanco se
  lo lleva el hero. El header usa el ghost outline. La sección CTA final, que está en otro viewport, vuelve
  a usar el blanco.
- **El gradiente dorado aparece una sola vez**, en el sparkline de `revenue-chart.tsx`, que es el único
  contexto de visualización de datos. El doc lo reserva explícitamente para eso.

---

## 5. Bug encontrado y corregido: `BrandLogo`

El wordmark hardcodeaba `text-gray-900 dark:text-gray-50` en el **span interno**. El `className` del caller
llega al span **externo**, así que `cx` (que es `twMerge(clsx())`) no podía sobreescribirlo: el color del
hijo ganaba por especificidad de elemento.

Sobre el canvas negro de la landing, con el tema del dashboard en claro, el nombre "Nova Analytics" habría
salido **negro sobre negro**. El color se movió al contenedor.

---

## 6. Verificación

| Comprobación | Resultado |
| --- | --- |
| `/` responde | 200 |
| Sidebar en la landing | Cero ocurrencias |
| Tokens en el HTML servido | `bg-obsidian`, `bg-onyx`, `text-paper-white`, `text-copper`, `border-graphite`, `font-display` |
| `--font-playfair` resuelve | Sí, a `'__Playfair_Display_...'` en `layout.css`. No cae al fallback |
| Footer credits | `© 2026 Nova Analytics. All rights reserved.` |
| Enlaces de auth | 3 a `/sign-in`, 4 a `/sign-up` |
| Gradiente dorado | 1 sola ocurrencia, en el chart |
| Em-dash en copy | Cero en todo `src/` |
| `tsc`, `lint`, `build` | Verde |

**Pendiente de verificación visual del owner.** El HTML, los tokens y las fuentes están comprobados de
forma programática, pero el aspecto real de la landing y de las pantallas de Clerk necesita un navegador.

---

## 7. Notas para M5

- La landing es `ƒ` (dinámica) porque `<Show>` lee la sesión. Es lo esperado.
- Al desplegar hay que cargar las seis env vars de Clerk en Vercel, en **Production y Preview**, y
  configurar las URLs de producción en el dashboard de Clerk.
- Probar la landing en **incógnito** por el 308 cacheado.
