# M6 — Tests, analytics y documentación

Rama: `feat/m6-tests-analytics-docs`. Cierra la parte de **código** del extra credit y los entregables de
documentación. El cuestionario behavioral queda fuera: necesita datos reales del owner.

---

## 1. La URL real

`siteConfig.url` tenía `https://nova-analytics.vercel.app`, una **suposición** de M1. La real es
`https://template-dashboard-oss-rose.vercel.app`.

No es cosmético. `layout.tsx` hace `metadataBase: new URL(siteConfig.url)`, y de ahí salen las URLs
absolutas de `og:image` y `og:url`. Con el valor viejo, las previsualizaciones en redes sociales habrían
apuntado a un dominio inexistente. Verificado en el HTML servido: el dominio real ya aparece.

---

## 2. Tests de integración con Jest

`jest.config.mjs` usa `next/jest`, que resuelve el alias `@/` y las transformaciones de Next sin configurar
Babel a mano. `jest.setup.ts` carga `@testing-library/jest-dom` e inyecta claves de Clerk **falsas**, que
nunca salen del proceso de test.

**58 tests, 8 suites.** No persiguen cobertura. Cada uno protege una invariante que este proyecto puede
romper de verdad.

| Suite | Qué protege |
| --- | --- |
| `whitelabel.test.ts` | Cero rastros del producto original. Recorre el sistema de archivos y permite solo los comentarios de atribución que exige Apache 2.0 |
| `chart-colors.test.ts` | `brand` es la primera clave de `chartColors`, y `getColorClassName` sigue cayendo a gris ante una clave desconocida |
| `site-config.test.ts` | La config de marca sigue siendo fuente única, y `url` apunta a un https real |
| `demo-data.test.ts` | Identidades únicas y todas en el dominio Nova |
| `brand-logo.test.tsx` | Un caller puede sobreescribir el color del wordmark |
| `landing.test.tsx` | La landing sin sesión enruta a sign-in y sign-up, y gasta su único pill blanco en el hero |
| `settings-profile.test.tsx` | El perfil renderiza al usuario de la sesión, nunca la identidad de demo |
| `health-route.test.ts` | `/api/health` reporta la instancia viva y nunca un snapshot de build |

### 2.1 Dos tests que codifican bugs reales

`chart-colors.test.ts` guarda la trampa de M2: las claves del mapa son API pública, y `getColorClassName`
cae a gris ante una clave desconocida. Renombrar sin actualizar el call site da un chart gris con `tsc`
limpio y build verde. El test afirma **las dos cosas**: que el rename ocurrió y que el fallback sigue vivo.

`brand-logo.test.tsx` guarda el bug de M4: el color del wordmark vivía en el span interno, donde `twMerge`
no podía pisarlo. Sobre el canvas negro con tema claro, "Nova Analytics" salía negro sobre negro.

### 2.2 Mutación: probar que los tests fallan

Un test que nunca falló no prueba nada. Se inyectó `Emma Stone`, `acme.com` e `indigo-600` en un archivo de
`src/` y se comprobó que **3 tests fallaban**. Restaurado, los 16 de esa suite vuelven a pasar.

### 2.3 Un bug que los tests no vieron, porque nadie miraba esa página

El owner encontró, usando la app, que `/settings` mostraba **`Nova Admin` / `admin@novaanalytics.io`** en el
apartado Profile, en vez del usuario que había iniciado sesión. La página renderizaba
`siteConfig.sampleUser`, un resto de M2, cuando M3 ya tenía la sesión disponible.

Fue documentado en M4 como "limitación deliberada". No lo era: era un bug, y la etiqueta lo escondió.

- `useSessionIdentity()` se extrajo de `UserProfile.tsx` a `src/lib/useSessionIdentity.ts`, y ahora lo usan
  el sidebar y la página de settings. Antes la lógica de iniciales estaba duplicada.
- Los `Input` pasaron de `defaultValue` a `value` + `readOnly`. Un input **no controlado** conserva el valor
  con el que montó, así que `defaultValue` se habría quedado con el string vacío que había antes de que
  Clerk resolviera al usuario.
- El avatar del workspace tomaba prestadas las **iniciales del usuario**. Ahora las deriva de
  `siteConfig.name`. Coincidían en `NA` por casualidad, lo que lo hacía invisible.
- `tests/settings-profile.test.tsx` lo guarda. Reintroduciendo el bug, sus 6 tests fallan.

### 2.4 Un test que estaba mal

`footer p:last-of-type` no selecciona el último `<p>` del footer: selecciona el último de **cada grupo de
hermanos**, y matcheó el `<p>` del tagline. El fallo era del test, no del código. Corregido con
`getByText(/all rights reserved/i)`.

---

## 3. Analytics y monitoreo

- `@vercel/analytics` (v2.0.1). Se verificó que el subpath `./next` existe en la versión instalada antes de
  importarlo, en vez de asumirlo. `<Analytics />` va en el root layout.
- `src/app/api/health/route.ts` devuelve `{ status, name, timestamp }` con `dynamic = "force-dynamic"`.
  Un probe de uptime debe observar la instancia viva, no un artefacto de build.

`clerkMiddleware()` corre sobre `/api/*` por el matcher, pero como no hace checks de autorización, no
bloquea. Verificado con `curl` sin sesión: **200**.

---

## 4. El build no necesita secretos

Se movió `.env.local` fuera y se corrió `pnpm build`: **verde, exit 0**. Ninguna ruta se prerenderiza
llamando a Clerk, porque `auth.protect()` y `<Show>` las vuelven dinámicas.

Consecuencia práctica: **un pipeline de CI puede validar lint, typecheck, tests y build sin ningún secreto.**

---

## 5. Documentación

- `README.md`: reescrito completo. Stack, setup, tabla de env vars, scripts, la tabla de tests con el porqué
  de los dos importantes, notas de arquitectura, monitoreo, credenciales del revisor, limitaciones y
  atribución Apache 2.0.
- `docs/claude-evidence/PROMPTS.md`: los prompts por milestone, traducidos al inglés, con los hallazgos y una
  sección final honesta sobre **lo que Claude hizo mal y qué lo atrapó**. Las claves de Clerk aparecen como
  `[REDACTED]`.

---

## 6. Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm test` | 52 pasan, 7 suites |
| Mutación de la suite de whitelabel | 3 fallos con la regresión, 0 al restaurar |
| `pnpm exec tsc --noEmit` | Limpio, con los tests incluidos en `tsconfig` |
| `pnpm lint` | Sin warnings |
| `pnpm build` con claves | Verde |
| `pnpm build` **sin** claves | Verde, exit 0 |
| `GET /api/health` sin sesión | 200, `{"status":"ok","name":"Nova Analytics",...}` |
| Dominio real en el HTML servido | `template-dashboard-oss-rose.vercel.app` |
| Secretos en el diff o en `PROMPTS.md` | Cero |

---

## 7. Lo que queda

- **Rotar la `sk_test` en Clerk.** Pasó por un prompt. `PROMPTS.md` la redacta, pero el repo es público y la
  clave existió en texto plano en una conversación.
- **Crear el usuario `admin@novaanalytics.io` en Clerk** con contraseña, para que el revisor entre sin
  registrarse. El README dice que la contraseña va en el correo de entrega, no en el repo.
- **Cuestionario behavioral** (`docs/behavioral-questionnaire-answers.md`). Entregable duro, no bonus. Se
  redacta con datos reales del owner. La P11 va sobre **Dot Com Media**.
- **CI/CD** (`.github/workflows/ci.yml`). No se añadió aquí porque no estaba en el pedido. Ahora es trivial:
  el build no necesita secretos.
- **Video walkthrough** y **smoke test en prod** justo antes de enviar.
