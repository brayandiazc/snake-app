# Propuesta — Multijugador local

- **Estado**: Implementada
- **Fecha**: 2026-10-13
- **Autor**: Brayan Diaz C
- **Ítem de roadmap**: v0.2 → Dos jugadores a la vez con el mismo teclado (WASD y
  flechas), solo en escritorio.

## Problema

Snake es de un jugador. Dos personas frente al mismo ordenador solo pueden turnarse, y
eso no es jugar juntas.

## Evidencia

- **¿Quién pagaría por esto, y qué lo respalda?**: Nadie: es un experimento. Lo pide el
  autor para la v0.2.
- **¿Ya existe?**: Sí, hay variantes de Snake para dos jugadores. No compite con ellas.
- **Experimento previo**: No hacía falta.

## Objetivo

Dos serpientes en el mismo tablero, una con WASD y otra con las flechas. Gana quien
sobrevive.

## Alcance

**Dentro del alcance:**

- Fila **Jugadores ‹ 1 | 2 ›** en el menú de la spec 0003, **solo en escritorio**.
- Dos serpientes que se mueven a la vez y comen de la misma comida.
- Se muere al chocar con un muro, con el propio cuerpo o con la otra serpiente. Si
  mueren las dos en el mismo paso, es empate.
- Marcador: **J1 · Speed · J2** en lugar de Score · Speed · Record.
- Fin de partida: «¡Gana J1!», «¡Gana J2!» o «Empate».
- Funciona en los cinco laberintos.

**Fuera del alcance:**

- Dos jugadores en móvil o tablet: la fila no aparece si no hay teclado.
- Jugar contra la máquina.
- Partidas al mejor de N, o un récord de dos jugadores.

## Impacto

- **Usuarios**: el modo de un jugador no cambia.
- **Sistema**: `game.js` pasa de una serpiente a una lista de serpientes. Es el cambio
  más delicado de la v0.2: toca las reglas que ya funcionan.
- **Riesgos**:
  - **Romper el modo de un jugador al generalizar**: las pruebas de la v0.1 y de la
    0003 siguen pasando sin cambiar lo que comprueban.
  - **Teclas que se bloquean**: algunos teclados no registran más de 2–3 teclas
    pulsadas a la vez. Como cada jugador pulsa una tecla cada vez, no debería notarse;
    se prueba con un teclado real.
  - **Dos serpientes en una pantalla de un color**: J2 se dibuja con otra textura (ver
    [`design.md`](design.md)).

## Preguntas abiertas

- [ ] La textura de J2 se ajusta viéndola en pantalla, junto con la de los muros.
