# Tareas — Laberintos y menú de inicio

## Implementación

- [ ] `js/mazes.js`: los cinco laberintos como filas de texto
- [ ] `js/game.js`: muros en `createGame`, choque con muro en `step`, comida fuera de
      los muros
- [ ] `js/storage.js`: récord por laberinto y último laberinto elegido
- [ ] `js/render.js`: muros de 3 × 3 puntos
- [ ] `js/i18n.js`: textos del menú y nombres de laberintos en es/en
- [ ] `index.html`, `css/styles.css` y `js/main.js`: estado de menú, navegación con
      teclado y táctil, volver al menú al terminar

## Pruebas

- [ ] `tests/mazes.test.js`: cada mapa mide 33 × 21, solo usa `.` y `#`, la salida y
      las 6 celdas de delante están libres, y todas las celdas libres están conectadas
- [ ] `tests/game.test.js`: chocar con un muro termina la partida, la comida nunca cae
      en un muro, Libre se comporta igual que la v0.1
- [ ] `tests/storage.test.js`: récord por laberinto, Libre lee la clave de la v0.1
- [ ] `tests/i18n.test.js`: sigue la paridad con las claves nuevas
- [ ] Prueba en Chrome: los cinco laberintos se ven y se juegan, menú con teclado y con
      el dedo, récord independiente por laberinto

## Documentación

- [ ] Actualizar `database.md`, `screens.md`, `architecture.md` y `CHANGELOG.md`
- [ ] Marcar como hechos los tres ítems de la v0.2 en
      [`../../docs/product/roadmap.md`](../../docs/product/roadmap.md)
- [ ] Añadir un ADR si se tomó una decisión duradera (`docs/decisions/`)

## Revisión y despliegue

- [ ] Autorrevisión / `/code-review`
- [ ] Abrir PR usando la plantilla de PR
