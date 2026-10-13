# 0002. Instanciación del proyecto desde la plantilla

- **Estado**: Aceptada
- **Fecha**: 2026-10-13
- **Decisores**: Brayan Diaz C

## Contexto y problema

Snake App es un experimento: replicar en el navegador, de forma fiel, el Snake de
pantalla LCD verde (serpiente de píxeles negros, comida en rombo, barra con Score,
Speed y Record). Nace de la plantilla
[`brayandiazc/project-starter-template-es-ai`](https://github.com/brayandiazc/project-starter-template-es-ai)
v2.3.1 (`31aefed`), que trae documentación, capa de IA y guardrails para proyectos de
cualquier tamaño. Había que decidir qué parte de eso aplica a un juego de una pantalla
sin backend.

## Opciones consideradas

- **TypeScript + Vite + Vitest** — tipado y un servidor de desarrollo cómodo, a cambio
  de `package.json`, dependencias y un paso de build. Además, a fecha de hoy
  `typescript-eslint` no soporta TypeScript 7, así que había que fijar versiones.
- **HTML + CSS + JavaScript nativos, sin build** — nada que instalar ni actualizar;
  las pruebas con el corredor nativo de Node (`node:test`).
- **Framework CSS (Tailwind, Bootstrap…)** — considerado y descartado: la interfaz es un
  canvas y una barra de marcador.

## Decisión

**HTML + CSS + JavaScript nativos (módulos ES), con el tablero en `<canvas>`, sin
framework ni build.** La persona lo pidió así explícitamente, y para una sola pantalla
el build no se amortiza. Detalle en
[`../architecture/stack.md`](../architecture/stack.md).

Tipo de proyecto: **Web**. Capacidades de la v1: **i18n (es/en)** y **web pública con
SEO**. Sin API, sin autenticación, sin base de datos y sin emails: el récord se guarda
en `localStorage`.

Poda aplicada:

- Convenciones borradas: `conventions/database.md` (migraciones) y
  `conventions/transactional-emails.md`.
- Skills borradas: `migration-guard`; y `portar-cambio` con `template-parity.yml` y
  `check-parity.sh`, exclusivos del repo-plantilla.
- Script borrado: `scripts/backup-db.sh`.
- Se **conservan** `architecture/api.md`, `auth.md` y `database.md`, reescritos como
  «no aplica en v1 y qué lo cambiaría»: los enlazan el agente `doc-keeper`, la plantilla
  de specs y la definición de terminado, y `database.md` documenta las claves de
  `localStorage`.
- Se conservan `design/`, `DESIGN.md` y las skills de UI, SEO e i18n.

Permisos y guardrails:

- Los tres guardrails (git, secretos y specs) quedan **activos**, como vienen.
- `.claude/settings.local.json` con una allowlist de comandos de solo lectura (no se
  versiona). El `ask:[Bash]` de `.claude/settings.json` sigue para todo lo demás.
- Git hooks del clon activados (`core.hooksPath = .githooks`).

## Consecuencias

**Positivas:**

- Cero dependencias: nada que auditar, actualizar ni que se rompa con un major.
- Las reglas del juego, separadas del dibujo, se prueban sin navegador.

**Negativas / costos:**

- Sin tipos ni linter de JavaScript: los errores de tipo aparecen al jugar o en las
  pruebas, no al escribir.
- Hace falta un servidor local (`python3 -m http.server`): los módulos ES no cargan
  desde `file://`.

**Neutras / a vigilar:**

- Si llega un ranking online, la arquitectura cambia de raíz (backend, datos, auth,
  defensa contra trampas). Ese cambio merece su propio ADR.
- Hosting y dominio siguen sin decidir.

## Referencias

- [`../architecture/stack.md`](../architecture/stack.md)
- [`../architecture/architecture.md`](../architecture/architecture.md)
- [`../product/roadmap.md`](../product/roadmap.md)
