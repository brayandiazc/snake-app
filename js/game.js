// Reglas del juego. Funciones puras: reciben un estado y devuelven uno nuevo.
// Sin DOM, sin window, sin localStorage — ver docs/architecture/architecture.md.

import { DEFAULT_MAZE_ID, getMaze, wallsOf } from "./mazes.js";

export const COLS = 33;
export const ROWS = 21;
export const MAX_SPEED = 9;
export const FOODS_PER_SPEED = 5;
const INITIAL_LENGTH = 4;
const MAX_QUEUED = 2;

const VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

export function speedFor(score) {
  return Math.min(MAX_SPEED, 1 + Math.floor(score / FOODS_PER_SPEED));
}

// De 300 ms por paso en Speed 1 a 100 ms en Speed 9.
export function tickMs(speed) {
  return 300 - (speed - 1) * 25;
}

// Salidas por número de jugadores. Las de dos son simétricas respecto al centro,
// para que nadie empiece con ventaja (spec 0004); tests/mazes.test.js comprueba que
// están libres en todos los laberintos. La de uno es el centro del tablero.
const TWO_PLAYER_SPAWNS = [
  { head: { x: 10, y: 6 }, direction: "right" },
  { head: { x: 22, y: 14 }, direction: "left" },
];

function spawnsFor(players, cols, rows) {
  if (players === 2) return TWO_PLAYER_SPAWNS;
  return [
    {
      head: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
      direction: "right",
    },
  ];
}

// El cuerpo se extiende detrás de la cabeza, en sentido contrario a la marcha.
function createSnake({ head, direction }) {
  const vector = VECTORS[direction];
  const cells = Array.from({ length: INITIAL_LENGTH }, (_, i) => ({
    x: head.x - vector.x * i,
    y: head.y - vector.y * i,
  }));
  return { cells, direction, queuedDirections: [], score: 0, alive: true };
}

// `maze` es uno de MAZES (js/mazes.js). Sin él, el tablero de la v0.1 (Libre).
// `players`: 1 o 2. El estado guarda siempre una lista de serpientes.
export function createGame({
  cols = COLS,
  rows = ROWS,
  random = Math.random,
  maze = getMaze(DEFAULT_MAZE_ID),
  players = 1,
} = {}) {
  const walls = wallsOf(maze);
  const snakes = spawnsFor(players, cols, rows).map(createSnake);
  return {
    cols,
    rows,
    players,
    snakes,
    mazeId: maze.id,
    walls,
    food: placeFood(cols, rows, allCells(snakes), random, walls),
    speed: 1,
    status: "ready",
    // Solo con dos jugadores: "p1", "p2" o "draw" al terminar.
    result: null,
    random,
  };
}

export function totalScore(state) {
  return state.snakes.reduce((total, snake) => total + snake.score, 0);
}

// Encola un giro de la serpiente `player` (0 = J1, 1 = J2). Ignora la marcha atrás
// y repetir la dirección: se comparan contra el último giro encolado, no contra la
// dirección actual, para que dos teclas rápidas («arriba, izquierda») funcionen en
// orden.
export function queueDirection(state, direction, player = 0) {
  const snake = state.snakes[player];
  if (!VECTORS[direction] || !snake || state.status === "over") return state;
  // En espera, cualquier flecha arranca, también la que repite la dirección.
  const current = start(state);
  const last = snake.queuedDirections.at(-1) ?? snake.direction;
  if (direction === last || direction === OPPOSITE[last]) return current;
  if (snake.queuedDirections.length >= MAX_QUEUED) return current;
  const snakes = current.snakes.map((candidate, index) =>
    index === player
      ? {
          ...candidate,
          queuedDirections: [...candidate.queuedDirections, direction],
        }
      : candidate,
  );
  return { ...current, snakes };
}

export function start(state) {
  return state.status === "ready" ? { ...state, status: "playing" } : state;
}

export function togglePause(state) {
  if (state.status === "playing") return { ...state, status: "paused" };
  if (state.status === "paused") return { ...state, status: "playing" };
  return state;
}

export function step(state) {
  if (state.status !== "playing") return state;

  // 1. Cada serpiente aplica su giro y calcula su nueva cabeza.
  const moves = state.snakes.map((snake) => {
    const [nextDirection, ...queuedDirections] = snake.queuedDirections;
    const direction = nextDirection ?? snake.direction;
    const vector = VECTORS[direction];
    const head = snake.cells[0];
    // El borde no mata: se sale por un lado y se entra por el opuesto.
    const newHead = {
      x: (head.x + vector.x + state.cols) % state.cols,
      y: (head.y + vector.y + state.rows) % state.rows,
    };
    const eats = state.food !== null && sameCell(newHead, state.food);
    // Si no come, la cola se mueve en este mismo paso: su celda queda libre.
    const body = eats ? snake.cells : snake.cells.slice(0, -1);
    return { snake, direction, queuedDirections, head, newHead, eats, body };
  });

  // 2. Los choques se resuelven a la vez, con el estado de antes del paso: nadie
  //    gana por moverse primero.
  const dies = moves.map((move, index) => {
    if (state.walls.has(move.newHead.y * state.cols + move.newHead.x)) {
      return true;
    }
    if (
      moves.some((other) => other.body.some((c) => sameCell(c, move.newHead)))
    ) {
      return true;
    }
    // Cabeza contra cabeza: en la misma celda, o cruzándose.
    return moves.some(
      (other, otherIndex) =>
        otherIndex !== index &&
        (sameCell(other.newHead, move.newHead) ||
          (sameCell(other.newHead, move.head) &&
            sameCell(move.newHead, other.head))),
    );
  });

  if (dies.some(Boolean)) {
    // Nadie se mueve: la partida se congela en el instante del choque.
    const snakes = moves.map((move, index) => ({
      ...move.snake,
      direction: move.direction,
      queuedDirections: move.queuedDirections,
      alive: !dies[index],
    }));
    return { ...state, snakes, status: "over", result: resultOf(state, dies) };
  }

  // 3. Todas avanzan; la que come crece y suma 1.
  const snakes = moves.map((move) => ({
    ...move.snake,
    cells: [move.newHead, ...move.body],
    direction: move.direction,
    queuedDirections: move.queuedDirections,
    score: move.snake.score + (move.eats ? 1 : 0),
  }));
  if (!moves.some((move) => move.eats)) return { ...state, snakes };

  const next = { ...state, snakes };
  const food = placeFood(
    state.cols,
    state.rows,
    allCells(snakes),
    state.random,
    state.walls,
  );
  // Sin celdas libres no hay dónde poner comida: la partida termina.
  const full = food === null;
  return {
    ...next,
    food,
    speed: speedFor(totalScore(next)),
    status: full ? "over" : state.status,
    result: full && state.players === 2 ? "draw" : state.result,
  };
}

function resultOf(state, dies) {
  if (state.players !== 2) return null;
  if (dies[0] && dies[1]) return "draw";
  return dies[0] ? "p2" : "p1";
}

function allCells(snakes) {
  return snakes.flatMap((snake) => snake.cells);
}

export function placeFood(cols, rows, snake, random, walls = new Set()) {
  const occupied = new Set(walls);
  for (const cell of snake) occupied.add(cell.y * cols + cell.x);
  const free = cols * rows - occupied.size;
  if (free <= 0) return null;
  // Elige la n-ésima celda libre: una sola llamada a random, sin reintentos.
  let n = Math.floor(random() * free);
  for (let index = 0; index < cols * rows; index++) {
    if (occupied.has(index)) continue;
    if (n === 0) return { x: index % cols, y: Math.floor(index / cols) };
    n--;
  }
  return null;
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}
