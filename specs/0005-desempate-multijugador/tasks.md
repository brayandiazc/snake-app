# Tareas — Desempate por puntuación en multijugador

## Implementación

- [x] Modificar `resultOf` y la resolución de tablero lleno en `js/game.js` para otorgar
      la victoria a la serpiente con más puntos si ambas mueren en el mismo paso.
- [x] Mantener `"draw"` solo cuando ambos jugadores tengan exactamente la misma puntuación.

## Pruebas

- [x] En `tests/game.test.js`:
  - Choque simultáneo / cabeza a cabeza con igual puntuación (0 a 0 o N a N) → `"draw"`.
  - Choque simultáneo / cabeza a cabeza con J1 con más puntos → `"p1"`.
  - Choque simultáneo / cabeza a cabeza con J2 con más puntos → `"p2"`.
  - Choque de solo un jugador contra el cuerpo del otro o un muro → sigue ganando el superviviente sin importar quién tenga más puntos.
- [x] Ejecutar suite completa con `node --test`.

## Documentación

- [x] Actualizar `docs/product/roadmap.md` marcando el ítem completado.
- [x] Actualizar `CHANGELOG.md` en `## [Unreleased]`.
