import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  placeFood,
  queueDirection,
  speedFor,
  start,
  step,
  tickMs,
  togglePause,
  totalScore,
} from "../js/game.js";
import { MAZES, getMaze } from "../js/mazes.js";

// La única serpiente de una partida de un jugador.
function you(state) {
  return state.snakes[0];
}

// Aplica a una partida de un jugador los cambios de la prueba. `snake`, `direction`
// y `score` son de la serpiente; el resto, de la partida.
function single(game, { snake, direction, score, ...rest } = {}) {
  const current = you(game);
  return {
    ...game,
    ...rest,
    snakes: [
      {
        ...current,
        cells: snake ?? current.cells,
        direction: direction ?? current.direction,
        score: score ?? current.score,
      },
    ],
  };
}

// Una partida en marcha con la serpiente y la comida donde la prueba diga.
function playing(overrides = {}) {
  return single(start(createGame({ random: () => 0 })), overrides);
}

test("la partida empieza en espera, con 4 celdas en el centro mirando a la derecha", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(game.status, "ready");
  assert.equal(you(game).direction, "right");
  assert.deepEqual(you(game).cells[0], { x: 16, y: 10 });
  assert.equal(you(game).cells.length, 4);
  assert.equal(you(game).score, 0);
  assert.equal(game.speed, 1);
});

test("en espera, step no mueve nada", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(step(game), game);
});

test("la serpiente avanza una celda en su dirección y conserva su largo", () => {
  const game = playing();
  const next = step(game);
  assert.deepEqual(you(next).cells[0], { x: 17, y: 10 });
  assert.equal(you(next).cells.length, 4);
});

test("un giro encolado se aplica en el siguiente paso", () => {
  const next = step(queueDirection(playing(), "up"));
  assert.equal(you(next).direction, "up");
  assert.deepEqual(you(next).cells[0], { x: 16, y: 9 });
});

test("pulsar una dirección en espera arranca la partida", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(queueDirection(game, "up").status, "playing");
});

test("en espera, cualquier flecha arranca, aunque repita o invierta la dirección", () => {
  const game = createGame({ random: () => 0 });
  for (const direction of ["right", "left"]) {
    const next = queueDirection(game, direction);
    assert.equal(next.status, "playing", direction);
    assert.deepEqual(you(next).queuedDirections, [], direction);
  }
});

test("la marcha atrás se ignora", () => {
  const game = playing();
  assert.equal(queueDirection(game, "left"), game);
});

test("dos giros rápidos se aplican en orden, uno por paso", () => {
  let game = queueDirection(queueDirection(playing(), "up"), "left");
  game = step(game);
  assert.equal(you(game).direction, "up");
  game = step(game);
  assert.equal(you(game).direction, "left");
});

test("no se encolan más de dos giros", () => {
  const game = ["up", "left", "down"].reduce(
    (state, direction) => queueDirection(state, direction),
    playing(),
  );
  assert.deepEqual(you(game).queuedDirections, ["up", "left"]);
});

test("atraviesa los cuatro bordes", () => {
  const cases = [
    { direction: "right", head: { x: 32, y: 5 }, expected: { x: 0, y: 5 } },
    { direction: "left", head: { x: 0, y: 5 }, expected: { x: 32, y: 5 } },
    { direction: "up", head: { x: 5, y: 0 }, expected: { x: 5, y: 20 } },
    { direction: "down", head: { x: 5, y: 20 }, expected: { x: 5, y: 0 } },
  ];
  for (const { direction, head, expected } of cases) {
    const next = step(
      playing({ snake: [head], direction, food: { x: 10, y: 10 } }),
    );
    assert.deepEqual(you(next).cells[0], expected, `borde hacia ${direction}`);
    assert.equal(next.status, "playing");
  }
});

test("al comer crece una celda, suma 1 punto y la comida cambia de sitio", () => {
  const game = playing({ food: { x: 17, y: 10 } });
  const next = step(game);
  assert.equal(you(next).cells.length, you(game).cells.length + 1);
  assert.equal(you(next).score, 1);
  assert.notDeepEqual(next.food, { x: 17, y: 10 });
});

test("Speed sube 1 cada 5 comidas y se queda en 9", () => {
  assert.equal(speedFor(0), 1);
  assert.equal(speedFor(4), 1);
  assert.equal(speedFor(5), 2);
  assert.equal(speedFor(15), 4);
  assert.equal(speedFor(40), 9);
  assert.equal(speedFor(100), 9);
});

test("la quinta comida sube Speed a 2", () => {
  const next = step(playing({ score: 4, food: { x: 17, y: 10 } }));
  assert.equal(next.speed, 2);
});

test("el intervalo va de 300 ms en Speed 1 a 100 ms en Speed 9", () => {
  assert.equal(tickMs(1), 300);
  assert.equal(tickMs(9), 100);
});

test("chocar consigo misma termina la partida", () => {
  // Un anillo de 5 celdas: la cabeza en (2,1) mirando abajo entra en (2,2), que es cuerpo.
  const snake = [
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
  ];
  const next = step(
    playing({ snake, direction: "down", food: { x: 10, y: 10 } }),
  );
  assert.equal(next.status, "over");
});

test("entrar en la celda que deja la cola no mata", () => {
  // Cuadrado de 4: la cabeza entra donde estaba la cola, que se mueve a la vez.
  const snake = [
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ];
  const next = step(
    playing({ snake, direction: "down", food: { x: 10, y: 10 } }),
  );
  assert.equal(next.status, "playing");
  assert.deepEqual(you(next).cells[0], { x: 2, y: 2 });
});

test("la comida nunca cae sobre la serpiente", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  // random() = 0 elegiría la primera celda; está ocupada, así que salta a la libre.
  assert.deepEqual(
    placeFood(3, 1, snake, () => 0),
    { x: 2, y: 0 },
  );
});

test("con el tablero lleno no hay comida y la partida termina", () => {
  // Tablero de 3x1: la serpiente ocupa 2 celdas y la comida la tercera.
  const game = single(
    start(createGame({ cols: 3, rows: 1, random: () => 0 })),
    {
      snake: [
        { x: 1, y: 0 },
        { x: 0, y: 0 },
      ],
      direction: "right",
      food: { x: 2, y: 0 },
    },
  );
  const next = step(game);
  assert.equal(next.food, null);
  assert.equal(next.status, "over");
});

test("la pausa congela la partida y se reanuda", () => {
  const paused = togglePause(playing());
  assert.equal(paused.status, "paused");
  assert.equal(step(paused), paused);
  assert.equal(togglePause(paused).status, "playing");
});

test("tras perder no se aceptan giros", () => {
  const over = playing({ status: "over" });
  assert.equal(queueDirection(over, "up"), over);
});

// ---- Laberintos (spec 0003) ----

test("sin laberinto, la partida es la de la v0.1: Libre y sin muros", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(game.mazeId, "libre");
  assert.equal(game.walls.size, 0);
});

test("chocar con un muro termina la partida", () => {
  // En Caja, la columna 32 es muro: la cabeza en (31,10) mirando a la derecha choca.
  const game = single(
    start(createGame({ random: () => 0, maze: getMaze("caja") })),
    {
      snake: [{ x: 31, y: 10 }],
      direction: "right",
      food: { x: 5, y: 5 },
    },
  );
  assert.equal(step(game).status, "over");
});

test("en Caja no se atraviesa el borde: el muro lo impide", () => {
  const game = single(
    start(createGame({ random: () => 0, maze: getMaze("caja") })),
    {
      snake: [{ x: 1, y: 1 }],
      direction: "up",
      food: { x: 5, y: 5 },
    },
  );
  assert.equal(step(game).status, "over");
});

test("la comida nunca cae en un muro", () => {
  // random() = 0 elegiría la primera celda, (0,0), que en Caja es muro.
  const game = createGame({ random: () => 0, maze: getMaze("caja") });
  assert.deepEqual(game.food, { x: 1, y: 1 });
});

test("en cualquier laberinto la serpiente sale sin chocar", () => {
  for (const maze of MAZES) {
    const next = step(start(createGame({ random: () => 0.5, maze })));
    assert.equal(next.status, "playing", maze.id);
  }
});

// ---- Dos jugadores (spec 0004) ----

// Partida de dos jugadores en marcha. `p1` y `p2` cambian celdas y dirección de cada
// serpiente; el resto, la partida.
function duel({ p1 = {}, p2 = {}, ...rest } = {}) {
  const game = start(createGame({ random: () => 0, players: 2 }));
  const [one, two] = game.snakes;
  return {
    ...game,
    food: { x: 0, y: 20 },
    ...rest,
    snakes: [
      { ...one, ...p1 },
      { ...two, ...p2 },
    ],
  };
}

test("con dos jugadores, J1 sale en (10,6) a la derecha y J2 en (22,14) a la izquierda", () => {
  const [one, two] = createGame({ players: 2, random: () => 0 }).snakes;
  assert.deepEqual(one.cells[0], { x: 10, y: 6 });
  assert.equal(one.direction, "right");
  assert.deepEqual(two.cells[0], { x: 22, y: 14 });
  assert.deepEqual(two.cells.at(-1), { x: 25, y: 14 });
  assert.equal(two.direction, "left");
});

test("las dos serpientes avanzan a la vez", () => {
  const [one, two] = step(duel()).snakes;
  assert.deepEqual(one.cells[0], { x: 11, y: 6 });
  assert.deepEqual(two.cells[0], { x: 21, y: 14 });
});

test("cada jugador solo gira su serpiente", () => {
  const game = queueDirection(duel(), "up", 1);
  assert.deepEqual(game.snakes[0].queuedDirections, []);
  assert.deepEqual(game.snakes[1].queuedDirections, ["up"]);
});

test("chocar contra el cuerpo del otro mata solo al que choca", () => {
  // J1 baja hacia (5,5), que es cuerpo de J2.
  const next = step(
    duel({
      p1: { cells: [{ x: 5, y: 4 }], direction: "down" },
      p2: {
        cells: [
          { x: 4, y: 5 },
          { x: 5, y: 5 },
          { x: 6, y: 5 },
        ],
        direction: "left",
      },
    }),
  );
  assert.equal(next.status, "over");
  assert.equal(next.result, "p2");
  assert.equal(next.snakes[0].alive, false);
  assert.equal(next.snakes[1].alive, true);
});

test("las dos cabezas en la misma celda: empate", () => {
  const next = step(
    duel({
      p1: { cells: [{ x: 4, y: 5 }], direction: "right" },
      p2: { cells: [{ x: 6, y: 5 }], direction: "left" },
    }),
  );
  assert.equal(next.result, "draw");
});

test("dos cabezas que se cruzan: empate si tienen igual puntuación", () => {
  const next = step(
    duel({
      p1: { cells: [{ x: 4, y: 5 }], direction: "right", score: 2 },
      p2: { cells: [{ x: 5, y: 5 }], direction: "left", score: 2 },
    }),
  );
  assert.equal(next.result, "draw");
});

test("dos cabezas en la misma celda: gana J1 si tiene más puntos", () => {
  const next = step(
    duel({
      p1: { cells: [{ x: 4, y: 5 }], direction: "right", score: 3 },
      p2: { cells: [{ x: 6, y: 5 }], direction: "left", score: 1 },
    }),
  );
  assert.equal(next.result, "p1");
});

test("dos cabezas que se cruzan: gana J2 si tiene más puntos", () => {
  const next = step(
    duel({
      p1: { cells: [{ x: 4, y: 5 }], direction: "right", score: 1 },
      p2: { cells: [{ x: 5, y: 5 }], direction: "left", score: 4 },
    }),
  );
  assert.equal(next.result, "p2");
});

test("chocar contra el cuerpo del rival sigue matando al infractor aunque tenga más puntos", () => {
  const next = step(
    duel({
      p1: { cells: [{ x: 5, y: 4 }], direction: "down", score: 10 },
      p2: {
        cells: [
          { x: 4, y: 5 },
          { x: 5, y: 5 },
          { x: 6, y: 5 },
        ],
        direction: "left",
        score: 2,
      },
    }),
  );
  assert.equal(next.status, "over");
  assert.equal(next.result, "p2");
  assert.equal(next.snakes[0].alive, false);
  assert.equal(next.snakes[1].alive, true);
});

test("entrar donde deja la cola del otro no mata", () => {
  // J2 avanza y su cola (7,5) queda libre en el mismo paso en que J1 entra en ella.
  const next = step(
    duel({
      p1: { cells: [{ x: 7, y: 4 }], direction: "down" },
      p2: {
        cells: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 7, y: 5 },
        ],
        direction: "left",
      },
    }),
  );
  assert.equal(next.status, "playing");
});

test("la comida suma al que la come, y Speed usa la comida de los dos", () => {
  const next = step(
    duel({
      food: { x: 11, y: 6 },
      p1: { score: 3 },
      p2: { score: 1 },
    }),
  );
  assert.equal(next.snakes[0].score, 4);
  assert.equal(next.snakes[1].score, 1);
  assert.equal(totalScore(next), 5);
  assert.equal(next.speed, 2);
});

test("con un jugador no hay resultado al perder", () => {
  // En Caja, la columna 32 es muro.
  const over = step(
    single(start(createGame({ random: () => 0, maze: getMaze("caja") })), {
      snake: [{ x: 31, y: 10 }],
      direction: "right",
    }),
  );
  assert.equal(over.status, "over");
  assert.equal(over.result, null);
});

test("las salidas de dos jugadores están libres en todos los laberintos", () => {
  for (const maze of MAZES) {
    const next = step(
      start(createGame({ random: () => 0.5, maze, players: 2 })),
    );
    assert.equal(next.status, "playing", maze.id);
  }
});
