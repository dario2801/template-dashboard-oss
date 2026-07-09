# M1 — Brand foundation: color token, BrandLogo, siteConfig

**Estado:** completado. Paleta aprobada por el owner.

## Qué se hizo

Infraestructura de marca centralizada para que color, logo e identidad tengan una única fuente de verdad.

- **Paleta Nova Analytics** en `src/app/globals.css`: escala `--brand-50 … --brand-950` como variables CSS
  (formato `R G B` para soportar alpha). Familia azul-violeta profundo ("Nova"). El acento primario es `600`
  (#4F46E5), hover `700` (#4338CA).
- **Token `brand`** en `tailwind.config.ts` (`theme.extend.colors.brand`), con formato
  `rgb(var(--brand-N) / <alpha-value>)` para que funcionen las utilidades de opacidad (`brand-500/50`).
  `DEFAULT` = 500. Ahora la UI usa `brand-*` en vez de `indigo-*` / `#6366F1`.
- **Identidad centralizada** en `src/app/siteConfig.ts`: `name`, `tagline`, `description`, `url`,
  `supportEmail` (hello@novaanalytics.io), `sampleUser` (admin@novaanalytics.io), y `baseLinks` extendido con
  `signIn`/`signUp` (para M3/M4). Copy sin em-dash.
- **Logo propio** en `src/components/brand/brand-logo.tsx`: `<BrandLogo>` (SRP), variantes `full` (icono +
  wordmark) e `icon`. Mark original: cuadrado redondeado `brand-600` con tres barras ascendentes (lectura de
  analytics). El favicon y el lockup comparten geometría.
- **`src/app/not-found.tsx`** actualizado: usa `<BrandLogo>` y `text-brand-600/500` (antes `DatabaseLogo` +
  `indigo`).
- **`public/DatabaseLogo.tsx` eliminado** (cero referencias tras el cambio).

## Verificaciones de aceptación

| Check | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | Limpio, sin errores |
| `pnpm build` | Verde. 8 páginas estáticas |
| Token `brand` compila y es usable | OK (`brand-600`, `brand-500/opacity`) |
| `<BrandLogo>` renderiza (full + icon) | OK |
| Cero referencias a `DatabaseLogo` | OK |
| Paleta revisada por el owner (artifact) | Aprobada |

## Notas / decisiones

- La escala `brand` coincide con la familia `indigo` de Tailwind. Deliberado: transición accesible desde el
  template, y como todo pasa por el token, cambiar los 11 hex en `globals.css` re-skinea todo el producto.
- **Ajuste conocido para M2:** removí `externalLink` de siteConfig al reescribirlo, lo que rompía
  `details/page.tsx` y `settings/page.tsx` (páginas paywall del template). Se restauró `externalLink.blocks`
  apuntando temporalmente a `/overview`. En M2 se decide el destino real de esas páginas (rebrand o retirar) y
  se limpia el `TremorPlaceholder`.
- Las variables `brand` sirven igual en light y dark porque son las mismas para ambos (el contraste lo dan las
  utilidades `dark:` de los componentes, no la escala). Si en M2/M4 hiciera falta, se pueden overridear bajo
  `.dark`.

## Pendiente

- M2 (whitelabel sweep): reemplazar `indigo-*` restantes por `brand-*` en el resto de componentes, metadata,
  favicon/OG, y datos demo.
