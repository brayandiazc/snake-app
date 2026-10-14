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
} from "../js/game.js";
import { MAZES, getMaze } from "../js/mazes.js";

// Una partida en marcha con la serpiente y la comida donde la prueba diga.
function playing(overrides = {}) {
  return { ...start(createGame({ random: () => 0 })), ...overrides };
}

test("la partida empieza en espera, con 4 celdas en el centro mirando a la derecha", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(game.status, "ready");
  assert.equal(game.direction, "right");
  assert.deepEqual(game.snake[0], { x: 16, y: 10 });
  assert.equal(game.snake.length, 4);
  assert.equal(game.score, 0);
  assert.equal(game.speed, 1);
});

test("en espera, step no mueve nada", () => {
  const game = createGame({ random: () => 0 });
  assert.equal(step(game), game);
});

test("la serpiente avanza una celda en su dirección y conserva su largo", () => {
  const game = playing();
  const next = step(game);
  assert.deepEqual(next.snake[0], { x: 17, y: 10 });
  assert.equal(next.snake.length, 4);
});

test("un giro encolado se aplica en el siguiente paso", () => {
  const next = step(queueDirection(playing(), "up"));
  assert.equal(next.direction, "up");
  assert.deepEqual(next.snake[0], { x: 16, y: 9 });
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
    assert.deepEqual(next.queuedDirections, [], direction);
  }
});

test("la marcha atrás se ignora", () => {
  const game = playing();
  assert.equal(queueDirection(game, "left"), game);
});

test("dos giros rápidos se aplican en orden, uno por paso", () => {
  let game = queueDirection(queueDirection(playing(), "up"), "left");
  game = step(game);
  assert.equal(game.direction, "up");
  game = step(game);
  assert.equal(game.direction, "left");
});

test("no se encolan más de dos giros", () => {
  const game = ["up", "left", "down"].reduce(queueDirection, playing());
  assert.deepEqual(game.queuedDirections, ["up", "left"]);
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
    assert.deepEqual(next.snake[0], expected, `borde hacia ${direction}`);
    assert.equal(next.status, "playing");
  }
});

test("al comer crece una celda, suma 1 punto y la comida cambia de sitio", () => {
  const game = playing({ food: { x: 17, y: 10 } });
  const next = step(game);
  assert.equal(next.snake.length, game.snake.length + 1);
  assert.equal(next.score, 1);
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
  assert.deepEqual(next.snake[0], { x: 2, y: 2 });
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
  const game = {
    ...start(createGame({ cols: 3, rows: 1, random: () => 0 })),
    snake: [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ],
    direction: "right",
    food: { x: 2, y: 0 },
  };
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
  const game = {
    ...start(createGame({ random: () => 0, maze: getMaze("caja") })),
    snake: [{ x: 31, y: 10 }],
    direction: "right",
    food: { x: 5, y: 5 },
  };
  assert.equal(step(game).status, "over");
});

test("en Caja no se atraviesa el borde: el muro lo impide", () => {
  const game = {
    ...start(createGame({ random: () => 0, maze: getMaze("caja") })),
    snake: [{ x: 1, y: 1 }],
    direction: "up",
    food: { x: 5, y: 5 },
  };
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
