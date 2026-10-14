# Diseño técnico — Desempate por puntuación en multijugador

## Contexto

En `js/game.js`, cuando `state.players === 2`, el resultado del fin de partida se decide
en la función auxiliar `resultOf(state, dies)`.

Actualmente:
```javascript
function resultOf(state, dies) {
  if (state.players !== 2) return null;
  if (dies[0] && dies[1]) return "draw";
  return dies[0] ? "p2" : "p1";
}
```

Si ambos mueren (`dies[0] && dies[1]`), devuelve incondicionalmente `"draw"`.

## Solución propuesta

Cuando ambos mueren (`dies[0] && dies[1]`), comparamos la puntuación de ambas
serpientes:

```javascript
function resultOf(state, dies) {
  if (state.players !== 2) return null;
  if (dies[0] && dies[1]) {
    const s1 = state.snakes[0].score;
    const s2 = state.snakes[1].score;
    if (s1 > s2) return "p1";
    if (s2 > s1) return "p2";
    return "draw";
  }
  return dies[0] ? "p2" : "p1";
}
```

Asimismo, en el caso donde el tablero se llena (`full && state.players === 2`):
```javascript
function drawOrScoreWinner(snakes) {
  const s1 = snakes[0].score;
  const s2 = snakes[1].score;
  if (s1 > s2) return "p1";
  if (s2 > s1) return "p2";
  return "draw";
}
```

Así el comportamiento es consistente en cualquier finalización simultánea de dos
jugadores.
