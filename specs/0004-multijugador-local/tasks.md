# Tareas — Multijugador local

## Implementación

- [ ] `js/game.js`: estado con lista de serpientes, salidas de 1 y 2 jugadores, paso
      simultáneo con choques resueltos a la vez y `result`
- [ ] `js/render.js`: textura diagonal para J2
- [ ] `js/i18n.js`: rótulos J1 y J2, textos de victoria y empate en es/en
- [ ] `js/main.js`: fila de Jugadores en el menú (solo escritorio), WASD para J1 y
      flechas para J2, marcador de dos jugadores, sin récord en dos jugadores

## Pruebas

- [ ] `tests/game.test.js`: las pruebas de un jugador siguen pasando sin cambiar lo que
      comprueban; cada jugador solo responde a sus teclas; morir contra el cuerpo del
      otro; cabezas en la misma celda → empate; cabezas que se cruzan → empate; la
      comida suma al que la come; Speed usa la comida total
- [ ] Prueba en Chrome: partida de dos jugadores en cada laberinto, los tres finales
      posibles, y que la fila de Jugadores no aparece en móvil emulado
- [ ] Prueba manual con un teclado real, los dos jugadores pulsando a la vez

## Documentación

- [ ] Actualizar `architecture.md`, `screens.md` y `CHANGELOG.md`
- [ ] Marcar como hecho el ítem de la v0.2 en
      [`../../docs/product/roadmap.md`](../../docs/product/roadmap.md)
- [ ] Añadir un ADR si se tomó una decisión duradera (`docs/decisions/`)

## Revisión y despliegue

- [ ] Autorrevisión / `/code-review`
- [ ] Abrir PR usando la plantilla de PR
