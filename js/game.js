// Reglas del juego. Funciones puras: reciben un estado y devuelven uno nuevo.
// Sin DOM, sin window, sin localStorage — ver docs/architecture/architecture.md.

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

export function createGame({
  cols = COLS,
  rows = ROWS,
  random = Math.random,
} = {}) {
  const head = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
  const snake = Array.from({ length: INITIAL_LENGTH }, (_, i) => ({
    x: head.x - i,
    y: head.y,
  }));
  return {
    cols,
    rows,
    snake,
    direction: "right",
    queuedDirections: [],
    food: placeFood(cols, rows, snake, random),
    score: 0,
    speed: 1,
    status: "ready",
    random,
  };
}

// Encola un giro para los próximos ticks. Ignora la marcha atrás y repetir la
// dirección: se comparan contra el último giro encolado, no contra la dirección
// actual, para que dos teclas rápidas («arriba, izquierda») funcionen en orden.
export function queueDirection(state, direction) {
  if (!VECTORS[direction] || state.status === "over") return state;
  // En espera, cualquier flecha arranca, también la que repite la dirección.
  const current = start(state);
  const last = current.queuedDirections.at(-1) ?? current.direction;
  if (direction === last || direction === OPPOSITE[last]) return current;
  if (current.queuedDirections.length >= MAX_QUEUED) return current;
  return {
    ...current,
    queuedDirections: [...current.queuedDirections, direction],
  };
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

  const [nextDirection, ...queuedDirections] = state.queuedDirections;
  const direction = nextDirection ?? state.direction;
  const vector = VECTORS[direction];
  const head = state.snake[0];
  // El borde no mata: se sale por un lado y se entra por el opuesto.
  const newHead = {
    x: (head.x + vector.x + state.cols) % state.cols,
    y: (head.y + vector.y + state.rows) % state.rows,
  };

  const eats = state.food !== null && sameCell(newHead, state.food);
  // Si no come, la cola se mueve en este mismo tick: su celda queda libre.
  const body = eats ? state.snake : state.snake.slice(0, -1);
  if (body.some((cell) => sameCell(cell, newHead))) {
    return { ...state, direction, queuedDirections, status: "over" };
  }

  const snake = [newHead, ...body];
  if (!eats) return { ...state, snake, direction, queuedDirections };

  const score = state.score + 1;
  const food = placeFood(state.cols, state.rows, snake, state.random);
  return {
    ...state,
    snake,
    direction,
    queuedDirections,
    score,
    speed: speedFor(score),
    food,
    // Sin celdas libres no hay dónde poner comida: la partida termina.
    status: food === null ? "over" : state.status,
  };
}

export function placeFood(cols, rows, snake, random) {
  const occupied = new Set(snake.map((cell) => cell.y * cols + cell.x));
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
