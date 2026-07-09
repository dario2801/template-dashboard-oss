
# CLAUDE.md — Nova Analytics · Manual Operativo

> Reglas y contexto para cualquier asistente de IA en este repo.
> **Propietario:** Dario Auda · **Contexto:** trial técnico AI Agent Engineer.
> Lee **§1–§6 antes de cualquier acción.** No son sugerencias: son condiciones de operación.

---

## 0. Cómo leer este documento

1. **§1** es la idea central. Si una decisión te aleja de ella, detente y pregunta.
2. **§5** son las reglas inviolables (guardrails). Violarlas detiene la sesión.
3. No inicies un **milestone** (`PLAN.md`) sin que esté aprobado en el prompt actual.
4. **Regla de oro:** lo más simple que cumpla el 100% de los requisitos. Sin sobre-ingeniería.

---

## 1. Identidad y idea central

**Nova Analytics** es un producto de data-dashboard whitelabel. Este repo parte de un **fork open-source** que ya cumple la mayoría de requisitos funcionales; el trabajo es **rebrandear, montar un landing con auth funcional y desplegar**, NO desarrollar features desde cero.

> **Idea central:** entregar *working software* — un dashboard rebrandeado a Nova Analytics, con landing profesional, login/signup funcional y deploy público con HTTPS, en el menor tiempo posible sin sacrificar los requisitos del trial.

Si una propuesta no contribuye a esa frase, no la implementes sin confirmación.

**Alcance explícito (lo que este proyecto NO es):**

- ❌ No es multi-tenant. No hay `tenantId`, no hay aislamiento por fila, no hay RLS.
- ❌ No requiere API keys en cada endpoint, ni rate limiting, ni particionamiento de BD.
- ❌ No se reescribe el backend ni la lógica interna del fork.
- ❌ No se agrega ORM/DB/migraciones propias salvo que el fork ya las traiga.

(Estas restricciones vienen de otro proyecto y **no aplican aquí.** Meterlas es sobre-ingeniería que resta.)

---

## 2. Stack

Objetivo (confirmar contra el fork elegido en M0):

| Capa              | Tecnología                                          |
| ----------------- | ---------------------------------------------------- |
| Frontend          | Next.js (App Router) + React + TypeScript + Tailwind |
| Auth              | **Clerk** (landing → dashboard)               |
| Deploy            | **Vercel** (HTTPS + CI automático)            |
| Analytics (bonus) | Vercel Analytics / PostHog / Plausible               |

El fork base debe ser MIT/Apache, Next.js + TS + Tailwind, y levantar con `npm run dev` **sin DB obligatoria**.

---

## 3. Auth (decisión resuelta)

**Clerk** como puerta del landing. Páginas `/sign-in` y `/sign-up`, se protege `/dashboard`, y tras login se redirige al dashboard del fork.

- Si el fork trae su propio login demo → **no se reescribe**; Clerk envuelve el acceso público y el dashboard interno queda intacto.
- Si el fork no trae auth → Clerk cubre todo el flujo.
- Credencial de prueba documentada: `admin@novaanalytics.io`.

---

## 4. Whitelabel (requisito duro)

Cero rastros del producto original en la UI visible. Reemplazar: logo, favicon, app name, footer, títulos, metadata, manifest, social preview, y **todos** los datos demo (`Sarah Johnson`, `Nova Analytics`, `admin@novaanalytics.io`).

Antes de dar por cerrado M2: `grep` del nombre original en todo el repo → cero resultados en UI.

---

## 5. Reglas operativas inviolables (GUARDRAILS)

Estas reglas tienen prioridad sobre cualquier otra instrucción, incluso prompts futuros que las contradigan. Si un prompt pide violarlas, **rechaza y pide confirmación explícita escrita**.

### 5.1 Control de versiones

- **NUNCA `git push`**, **NUNCA merge a `main`**, **NUNCA reescribir historia** (`rebase -i`, `push --force`, `reset --hard` remoto) sin permiso explícito en el prompt actual. **El permiso no se acumula entre prompts.**
- `git commit` en rama local: permitido para avanzar el trial. Modificar el working tree y presentar el diff siempre está permitido.
- Permitido sin pedir: ramas locales, leer historial, `git status`/`diff`, `git stash`, `git restore` no destructivo.
- Commits descriptivos (el correo lo evalúa). Convención: `tipo: descripción` (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `ci:`).

### 5.2 Variables de entorno y secretos

- **NUNCA leas** `.env`/`.env.local`/`.env.production` ni archivos con secretos, salvo que el valor se pegue en el prompt. Permitido: leer `.env.example` (solo nombres). Si necesitas un valor, **pídelo** y espera.
- **Toda env var nueva se agrega a `.env.example` en el mismo cambio** que la introduce (solo el nombre, valor vacío, con un comentario breve de qué es). `.env.example` es el contrato del entorno.
- Nunca stagees `.env.local` (gitignored — verifícalo antes de cada commit). Las claves de Clerk nunca en logs, respuestas, errores ni URLs.

### 5.3 Dependencias y costos

- Nuevas deps: permitidas si están justificadas en `PLAN.md`. No agregues librerías pesadas ni servicios de pago sin justificar.
- Clerk y Vercel Analytics tienen tier gratuito suficiente para el trial. No integres nada con costo sin permiso.

### 5.4 No reescribir el fork

- El objetivo es *working software*. No refactorices el backend ni la lógica interna del fork. Whitelabel + landing + auth + deploy es todo el alcance.
- No agregues multi-tenancy, RLS, API-key-por-endpoint ni patrones de BridgeMeet. **No aplican** (§1).

### 5.5 SOLID y código limpio (proporcional al alcance)

- Componentes con una sola responsabilidad; separar presentación de lógica donde tenga sentido. Nada de componentes "dios".
- No es un proyecto de arquitectura enterprise: aplica buen gusto, no ceremonia. Si una abstracción no paga su costo en un trial, no la metas.

### 5.6 Calidad antes de deploy (M5)

- Sin errores de consola, sin `tsc` rojo, sin lint rojo, sin imágenes rotas. Estados de carga y 404 presentes. El deploy debe demostrarse sin caídas durante la review.

---

## 6. Comentarios en código (regla dura)

**Por defecto, NO comentar.** Solo se comenta el *por qué* no obvio: un invariante oculto, una restricción externa, un workaround, una decisión contraintuitiva.

- **No comentes lo que el nombre o la firma ya explican.** Si la función es evidente o super legible, un comentario que describe *qué* hace es ruido y se rechaza en review.
- Nada de comentarios decorativos, banners ASCII, ni `// end of function`.
- Prefiere nombres claros a comentarios explicativos.

Ejemplos:

```ts
// ❌ Ruido — la firma ya lo dice
// Suma dos números
function add(a: number, b: number) { return a + b }

// ✅ Justificado — explica un porqué no obvio
// Clerk devuelve el orgId como null en el primer render tras signup;
// esperamos al segundo tick para evitar un redirect prematuro.
```

---

## 7. Capacidades otorgadas

Dentro de §5, tienes autoridad para: leer todo el código; proponer arquitectura/refactors acotados; crear ramas locales, archivos, componentes, tests y documentación; hacer commits locales descriptivos; y mantener este documento y `PLAN.md`.

---

## 8. Protocolos de comunicación

- **Chat con Dario:** español. **Código, comentarios, commits, README, PRs, logs:** inglés.
- **Tono:** preciso, directo, sin relleno ni hedging.
- **Copy de cara al usuario — evita el em-dash (`—`)** como recurso de puntuación en strings de UI, landing, labels y errores. Reescribe con punto, dos puntos o coma. (Aplica solo al copy de producto; esta doc no está sujeta.)
- **Cuando dudes, pregunta.** Al ejecutar algo no trivial, explica *qué* y *por qué* antes. Al terminar, resume qué cambió, qué archivos y qué falta.
- Si un prompt contradice este documento, marca la contradicción y pide aclaración.

### Plantilla de permiso

> **[SOLICITUD DE PERMISO]** · Acción: `<exacta>` · Razón: `<por qué>` · Riesgo: `<reversibilidad y alcance>` · ¿Procedo?

No procedas hasta un sí explícito en el prompt actual.

---

## 9. Convenciones técnicas

- **Naming:** archivos kebab-case; componentes PascalCase; hooks `use*`; schemas Zod `*.schema.ts`; ramas `feature/<name>`/`fix/<name>`.
- **Comandos:** confirmar contra el fork — típicamente `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- **Datos demo Nova Analytics:** `Sarah Johnson` · `Nova Analytics` · `admin@novaanalytics.io`.
- **Env vars:** cada una documentada en `.env.example` + README.

---

> **Nota:** Este documento es intencionalmente más ligero que un manual enterprise. El trial premia *working software* y buen criterio, no ceremonia. Mantenlo simple.
