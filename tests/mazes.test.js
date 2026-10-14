import { test } from "node:test";
import assert from "node:assert/strict";
import { COLS, ROWS } from "../js/game.js";
import { DEFAULT_MAZE_ID, MAZES, getMaze, wallsOf } from "../js/mazes.js";

// Salidas de la v0.1 (un jugador) y de la spec 0004 (dos jugadores), cada una con su
// cuerpo y las 6 celdas que tiene delante al empezar.
const RUNWAYS = {
  oneplayer: [...cells(13, 22, 10)],
  player1: [...cells(7, 16, 6)],
  player2: [...cells(16, 25, 14)],
};

function* cells(fromX, toX, y) {
  for (let x = fromX; x <= toX; x++) yield { x, y };
}

function isWall(maze, { x, y }) {
  return maze.rows[y][x] === "#";
}

test("hay cinco laberintos con ids únicos, y Libre es el de por defecto", () => {
  const ids = MAZES.map((maze) => maze.id);
  assert.deepEqual(ids, ["libre", "caja", "pasillos", "cruz", "islas"]);
  assert.equal(DEFAULT_MAZE_ID, "libre");
  assert.equal(wallsOf(getMaze("libre")).size, 0);
});

test("un id desconocido devuelve Libre", () => {
  assert.equal(getMaze("no-existe").id, "libre");
});

for (const maze of MAZES) {
  test(`${maze.id}: mide 33 × 21 y solo usa . y #`, () => {
    assert.equal(maze.rows.length, ROWS);
    for (const row of maze.rows) {
      assert.equal(row.length, COLS);
      assert.match(row, /^[.#]+$/);
    }
  });

  test(`${maze.id}: las salidas y el camino de delante están libres`, () => {
    for (const [name, runway] of Object.entries(RUNWAYS)) {
      const blocked = runway.filter((cell) => isWall(maze, cell));
      assert.deepEqual(blocked, [], name);
    }
  });

  test(`${maze.id}: todas las celdas libres están conectadas`, () => {
    // Recorrido en anchura, atravesando bordes como la serpiente.
    const free = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!isWall(maze, { x, y })) free.push(`${x},${y}`);
      }
    }
    const seen = new Set([free[0]]);
    const queue = [free[0]];
    while (queue.length) {
      const [x, y] = queue.shift().split(",").map(Number);
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const next = {
          x: (x + dx + COLS) % COLS,
          y: (y + dy + ROWS) % ROWS,
        };
        const key = `${next.x},${next.y}`;
        if (!isWall(maze, next) && !seen.has(key)) {
          seen.add(key);
          queue.push(key);
        }
      }
    }
    assert.equal(seen.size, free.length);
  });

  test(`${maze.id}: es simétrico respecto al centro`, () => {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        assert.equal(
          maze.rows[y][x],
          maze.rows[ROWS - 1 - y][COLS - 1 - x],
          `${x},${y}`,
        );
      }
    }
  });
}
