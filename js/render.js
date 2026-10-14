// Dibuja un estado del juego en el canvas. No decide nada: solo pinta.
// Proporciones medidas sobre docs/product/referencia.jpeg — ver
// specs/0001-juego-base/design.md.

// Margen entre el marco y la primera celda, en celdas.
export const BOARD_MARGIN = 0.35;
// Tamaño del punto LCD respecto a su paso (13 px de punto cada 16,2 px).
const DOT_RATIO = 0.8;
// Los puntos de la comida casi se tocan (10,5 px cada 10,8 px).
const FOOD_DOT_RATIO = 0.95;
// Rombo de la comida en una rejilla de 3 × 3: arriba, izquierda, derecha, abajo.
const FOOD_DOTS = [
  [1, 0],
  [0, 1],
  [2, 1],
  [1, 2],
];

// Números del marcador: mapa de bits de 7 × 7 «píxeles», cada uno un punto LCD.
// El 1, el 3 y el 5 están copiados de la captura de referencia; el resto sigue
// su estilo (trazos verticales de dos puntos de grosor).
export const DIGIT_FONT = {
  0: [
    ".#####.",
    "##...##",
    "##...##",
    "##...##",
    "##...##",
    "##...##",
    ".#####.",
  ],
  1: [
    "..##...",
    ".###...",
    "#.##...",
    "..##...",
    "..##...",
    "..##...",
    "######.",
  ],
  2: [
    ".#####.",
    "##...##",
    ".....##",
    "..####.",
    ".##....",
    "##.....",
    "#######",
  ],
  3: [
    ".#####.",
    "##...##",
    ".....##",
    "..####.",
    ".....##",
    "##...##",
    ".#####.",
  ],
  4: [
    "...###.",
    "..####.",
    ".##.##.",
    "##..##.",
    "#######",
    "....##.",
    "....##.",
  ],
  5: [
    "#######",
    "##.....",
    "######.",
    ".....##",
    ".....##",
    "##...##",
    ".#####.",
  ],
  6: [
    "..####.",
    ".##....",
    "##.....",
    "######.",
    "##...##",
    "##...##",
    ".#####.",
  ],
  7: [
    "#######",
    ".....##",
    "....##.",
    "...##..",
    "..##...",
    "..##...",
    "..##...",
  ],
  8: [
    ".#####.",
    "##...##",
    "##...##",
    ".#####.",
    "##...##",
    "##...##",
    ".#####.",
  ],
  9: [
    ".#####.",
    "##...##",
    "##...##",
    ".######",
    ".....##",
    "....##.",
    ".####..",
  ],
};
const DIGIT_SIZE = 7;
// Cada dígito avanza 8 puntos: 7 de dibujo y 1 de separación.
const DIGIT_ADVANCE = 8;
// Paso del punto de los números respecto a la celda (≈ 5,65 px de 32,4 px).
export const DIGIT_PITCH = 0.175;
// Punto de 5 px cada 5,65 px.
const DIGIT_DOT_RATIO = 0.88;

// Dibuja `text` (solo dígitos) en su propio canvas, con puntos de `pitch` px.
export function drawDigits(canvas, text, pitch, color) {
  const width = Math.round((text.length * DIGIT_ADVANCE - 1) * pitch);
  const height = Math.round(DIGIT_SIZE * pitch);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  const dot = Math.max(1, Math.round(pitch * DIGIT_DOT_RATIO));
  [...text].forEach((char, index) => {
    const rows = DIGIT_FONT[char];
    if (!rows) return;
    const left = index * DIGIT_ADVANCE * pitch;
    rows.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel === "#") {
          ctx.fillRect(
            Math.round(left + x * pitch),
            Math.round(y * pitch),
            dot,
            dot,
          );
        }
      });
    });
  });
  return { width, height };
}

// Tamaño del canvas, en píxeles del dispositivo, para una celda de `cell` px.
export function boardSize(cols, rows, cell) {
  const margin = Math.round(BOARD_MARGIN * cell);
  return {
    margin,
    width: cols * cell + 2 * margin,
    height: rows * cell + 2 * margin,
  };
}

export function draw(ctx, state, cell, colors) {
  const { margin, width, height } = boardSize(state.cols, state.rows, cell);
  ctx.fillStyle = colors.screen;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = colors.ink;

  // Muros: 3 × 3 puntos por celda, más densos que la serpiente (2 × 2). En una
  // pantalla de un solo color se distinguen por textura, como en una LCD real.
  const wallPitch = cell / 3;
  const wallDot = Math.max(1, Math.round(wallPitch * DOT_RATIO));
  for (const index of state.walls ?? []) {
    const left = margin + (index % state.cols) * cell;
    const top = margin + Math.floor(index / state.cols) * cell;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillRect(
          Math.round(left + col * wallPitch),
          Math.round(top + row * wallPitch),
          wallDot,
          wallDot,
        );
      }
    }
  }

  // Cada celda de la serpiente son 2 × 2 puntos: unidos, forman el trazo doble.
  const pitch = cell / 2;
  const dot = Math.max(1, Math.round(pitch * DOT_RATIO));
  for (const { x, y } of state.snake) {
    const left = margin + x * cell;
    const top = margin + y * cell;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        ctx.fillRect(
          Math.round(left + col * pitch),
          Math.round(top + row * pitch),
          dot,
          dot,
        );
      }
    }
  }

  if (state.food) {
    const subPitch = cell / 3;
    const subDot = Math.max(1, Math.round(subPitch * FOOD_DOT_RATIO));
    const left = margin + state.food.x * cell;
    const top = margin + state.food.y * cell;
    for (const [col, row] of FOOD_DOTS) {
      ctx.fillRect(
        Math.round(left + col * subPitch),
        Math.round(top + row * subPitch),
        subDot,
        subDot,
      );
    }
  }
}
