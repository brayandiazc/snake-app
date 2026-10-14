# Tareas — Laberintos y menú de inicio

## Implementación

- [x] `js/mazes.js`: los cinco laberintos como filas de texto
- [x] `js/game.js`: muros en `createGame`, choque con muro en `step`, comida fuera de
      los muros
- [x] `js/storage.js`: récord por laberinto y último laberinto elegido
- [x] `js/render.js`: muros de 3 × 3 puntos
- [x] `js/i18n.js`: textos del menú y nombres de laberintos en es/en
- [x] `index.html`, `css/styles.css` y `js/main.js`: estado de menú, navegación con
      teclado y táctil, volver al menú al terminar

## Pruebas

- [x] `tests/mazes.test.js`: cada mapa mide 33 × 21, solo usa `.` y `#`, la salida y
      las 6 celdas de delante están libres, y todas las celdas libres están conectadas
- [x] `tests/game.test.js`: chocar con un muro termina la partida, la comida nunca cae
      en un muro, Libre se comporta igual que la v0.1
- [x] `tests/storage.test.js`: récord por laberinto, Libre lee la clave de la v0.1
- [x] `tests/i18n.test.js`: sigue la paridad con las claves nuevas
- [x] Prueba en Chrome: los cinco laberintos se ven y se juegan, menú con teclado y con
      el dedo, récord independiente por laberinto

## Documentación

- [x] Actualizar `database.md`, `screens.md`, `architecture.md` y `CHANGELOG.md`
- [x] Marcar como hechos los tres ítems de la v0.2 en
      [`../../docs/product/roadmap.md`](../../docs/product/roadmap.md)
- [x] Añadir un ADR si se tomó una decisión duradera (`docs/decisions/`) — no hizo
      falta: las decisiones están en `design.md`

## Revisión y despliegue

- [x] Autorrevisión / `/code-review`
- [ ] Abrir PR usando la plantilla de PR
