# Propuesta — Desempate por puntuación en multijugador

- **Estado**: Implementada
- **Fecha**: 2026-10-13
- **Autor**: Brayan Diaz C
- **Ítem de roadmap**: v0.3 → Desempate por puntuación en choques simultáneos de multijugador.

## Problema

En el modo de dos jugadores (v0.2), cuando ambas serpientes colisionan en el mismo paso
(ya sea cabeza con cabeza o chocando simultáneamente contra muros o cuerpos), la partida
siempre termina en «Empate» (`draw`), ignorando si uno de los jugadores dominó la
partida y comió más comida que el otro.

## Evidencia

- **¿Quién pagaría por esto, y qué lo respalda?**: Solicitado directamente por la
  persona usuaria para premiar el esfuerzo ofensivo y la cantidad de puntos logrados
  durante la partida de 2 jugadores.
- **¿Ya existe?**: En múltiples juegos de tipo arena/Snake competitivo, en caso de muerte
  simultánea gana el jugador con mayor puntuación acumulada.
- **Experimento previo**: No aplica: ajuste de regla competitiva solicitado.

## Objetivo

En partidas de dos jugadores, si ambas serpientes mueren en el mismo paso (colisión
simultánea o cabeza con cabeza), el ganador se determina comparando los puntos (comidas)
de cada jugador: gana quien tenga mayor puntuación (`p1` o `p2`). Si tienen exactamente
la misma puntuación, se declara empate (`draw`). Las colisiones donde solo un jugador
choca siguen declarando ganador al superviviente.

## Alcance

**Dentro del alcance:**

- Modificar la resolución del resultado (`resultOf`) en `js/game.js` para que ante muerte
  simultánea (`dies[0] && dies[1]`), se compare `snakes[0].score` vs `snakes[1].score`.
- Si `snakes[0].score > snakes[1].score`, el resultado es `"p1"`.
- Si `snakes[1].score > snakes[0].score`, el resultado es `"p2"`.
- Si `snakes[0].score === snakes[1].score`, el resultado se mantiene en `"draw"`.
- Tablero lleno con 2 jugadores: si la comida no cabe, resolver también por mayor
  puntuación o empate si igualan.
- Pruebas unitarias completas en `tests/game.test.js` verificando todos los casos.

**Fuera del alcance:**

- Permitir que una serpiente con más puntos destruya el cuerpo de otra al chocar (chocar
  contra el cuerpo del oponente sigue matando a quien comete la infracción).
- Alterar el modo de 1 jugador.

## Impacto

- **Usuarios**: Las partidas de 2 jugadores premian el apetito de riesgo y la comida
  conseguida cuando ocurre un choque frontal o muerte mutua.
- **Sistema**: Afecta únicamente la función `resultOf` y la resolución de fin de partida
  en `js/game.js`. No modifica el canvas, `render.js`, ni `storage.js`.
- **Riesgos**:
  - Regresión en tests existentes de 2 jugadores que asumían `"draw"`: se actualizan o se
    especifican con puntuaciones iguales/distintas.

## Preguntas abiertas

Ninguna.
