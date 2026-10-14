// Arranque: conecta teclado, gestos, bucle, idioma y récord con las reglas
// (game.js) y el dibujo (render.js). Ver docs/architecture/architecture.md.

import {
  COLS,
  ROWS,
  createGame,
  queueDirection,
  start,
  step,
  tickMs,
  togglePause,
} from "./game.js";
import {
  BOARD_MARGIN,
  DIGIT_PITCH,
  boardSize,
  draw,
  drawDigits,
} from "./render.js";
import { LOCALES, detectLocale, t } from "./i18n.js";
import { MAZES, getMaze } from "./mazes.js";
import {
  loadLocale,
  loadMazeId,
  loadRecord,
  saveLocale,
  saveMazeId,
  saveRecord,
} from "./storage.js";

const KEY_DIRECTIONS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};
// Con dos jugadores, WASD mueve a J1 y las flechas a J2. Con uno, cualquiera.
const PLAYER_TWO_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);
const SWIPE_MIN_PX = 24;
const MAX_FRAME_MS = 250;
// Alto del dispositivo, en celdas: tablero + línea + marcador + marco.
const DEVICE_ROWS = ROWS + 2 * BOARD_MARGIN + 0.12 + 2.85 + 0.3;
const DEVICE_COLS = COLS + 2 * BOARD_MARGIN + 0.3;

const storage = safeLocalStorage();
const touchFirst = window.matchMedia("(pointer: coarse)").matches;
// Dos jugadores solo con ratón o trackpad: aproxima «hay teclado» (spec 0004).
const canTwoPlayers = window.matchMedia(
  "(any-pointer: fine) and (any-hover: hover)",
).matches;

const elements = {
  board: document.querySelector(".board"),
  status: document.querySelector(".status"),
  statusTitle: document.querySelector(".status-title"),
  statusHint: document.querySelector(".status-hint"),
  score: document.querySelector('[data-value="score"]'),
  speed: document.querySelector('[data-value="speed"]'),
  record: document.querySelector('[data-value="record"]'),
  localeSwitch: document.querySelector(".locale-switch"),
  statusMenu: document.querySelector(".status-menu"),
  menu: document.querySelector(".menu"),
  menuItems: [...document.querySelectorAll(".menu-item")],
  playersValue: document.querySelector("[data-players]"),
  hudLeft: document.querySelector('[data-hud-label="left"]'),
  hudRight: document.querySelector('[data-hud-label="right"]'),
  menuHint: document.querySelector(".menu-hint"),
  mazeName: document.querySelector("[data-maze-name]"),
};
const ctx = elements.board.getContext("2d");
const colors = readColors();

// Pantalla actual: el menú de inicio o la partida (spec 0003).
let mode = "menu";
let menuIndex = 0;
let maze = getMaze(loadMazeId(storage));
let players = 1;
let state = createGame({ maze, players });
let record = loadRecord(storage, maze.id);
let newRecord = false;
let locale = detectLocale(loadLocale(storage), navigator.language);
let cellPx = 0;
let pixelRatio = 1;
// Último número dibujado en cada canvas del marcador, para no redibujar en cada paso.
const drawnDigits = new WeakMap();
let lastTime = 0;
let elapsed = 0;

// ---- Dimensiones ----

function resize() {
  const page = document.querySelector(".page");
  const style = getComputedStyle(page);
  const availableWidth =
    page.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const switchSpace = elements.localeSwitch.offsetHeight + 12;
  const availableHeight =
    window.innerHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom) -
    switchSpace;
  // Celda entera en px CSS: los puntos LCD no se ven borrosos.
  const cssCell = Math.max(
    4,
    Math.floor(
      Math.min(availableWidth / DEVICE_COLS, availableHeight / DEVICE_ROWS),
    ),
  );
  document.documentElement.style.setProperty("--cell", `${cssCell}px`);

  pixelRatio = window.devicePixelRatio || 1;
  cellPx = Math.round(cssCell * pixelRatio);
  const { width, height } = boardSize(COLS, ROWS, cellPx);
  elements.board.width = width;
  elements.board.height = height;
  elements.board.style.width = `${width / pixelRatio}px`;
  elements.board.style.height = `${height / pixelRatio}px`;
  render();
}

// ---- Bucle ----

function frame(time) {
  const delta = lastTime ? time - lastTime : 0;
  lastTime = time;
  if (state.status === "playing") {
    // Tope por frame: tras un tirón, la serpiente no salta varias celdas de golpe.
    elapsed += Math.min(delta, MAX_FRAME_MS);
    // Paso fijo según la velocidad: igual en 60 Hz que en 120 Hz.
    while (state.status === "playing" && elapsed >= tickMs(state.speed)) {
      elapsed -= tickMs(state.speed);
      update(step(state));
    }
  } else {
    elapsed = 0;
  }
  requestAnimationFrame(frame);
}

function update(next) {
  const wasOver = state.status === "over";
  state = next;
  if (!wasOver && state.status === "over") {
    // El récord es de un jugador y por laberinto: en dos jugadores no se toca.
    if (players === 1) {
      const score = state.snakes[0].score;
      newRecord = score > record;
      record = saveRecord(storage, score, maze.id);
    }
  }
  render();
}

function render() {
  // En el menú, de fondo solo se ve el laberinto elegido.
  const view = mode === "menu" ? { ...state, snake: [], food: null } : state;
  draw(ctx, view, cellPx, colors);
  // Un jugador: Puntos · Velocidad · Récord. Dos: J1 · Velocidad · J2.
  const duel = players === 2 && mode === "game";
  elements.hudLeft.textContent = t(locale, duel ? "hud.p1" : "hud.score");
  elements.hudRight.textContent = t(locale, duel ? "hud.p2" : "hud.record");
  renderValue(elements.score, state.snakes[0].score);
  renderValue(elements.speed, state.speed);
  renderValue(elements.record, duel ? state.snakes[1].score : record);
  renderStatus();
  renderMenu();
}

function renderMenu() {
  elements.menu.hidden = mode !== "menu";
  if (mode !== "menu") return;
  elements.playersValue.textContent = players;
  menuItems().forEach((item, index) => {
    item.classList.toggle("is-selected", index === menuIndex);
  });
  elements.mazeName.textContent = t(locale, `maze.${maze.id}`);
  elements.menuHint.textContent = t(
    locale,
    touchFirst ? "menu.hintTouch" : "menu.hint",
  );
}

// El número va como texto (para lectores de pantalla) y dibujado con puntos.
function renderValue(element, value) {
  const text = String(value);
  element.textContent = text;
  const canvas = element.previousElementSibling;
  const key = `${text}@${cellPx}`;
  if (drawnDigits.get(canvas) === key) return;
  drawnDigits.set(canvas, key);
  const { width, height } = drawDigits(
    canvas,
    text,
    // Paso entero: con decimales los puntos se deforman en pantallas pequeñas.
    Math.max(1, Math.round(cellPx * DIGIT_PITCH)),
    colors.ink,
  );
  canvas.style.width = `${width / pixelRatio}px`;
  canvas.style.height = `${height / pixelRatio}px`;
}

function renderStatus() {
  const message = mode === "game" ? statusMessage() : undefined;
  elements.status.hidden = !message;
  if (!message) return;
  const frozen = state.status === "over" || state.status === "paused";
  elements.statusMenu.hidden = !frozen;
  // Con la partida congelada, el aviso va en un recuadro: si no, se monta sobre
  // las serpientes. En espera va sin él, para no tapar la salida.
  elements.status.classList.toggle("is-boxed", frozen);
  elements.statusTitle.textContent = message[0];
  elements.statusHint.textContent = message[1];
  elements.statusHint.hidden = !message[1];
}

// [título, pista] del estado actual, o nada mientras se juega. Se calcula solo el
// del estado actual: el de fin de partida necesita `state.result`, que no existe antes.
function statusMessage() {
  const hint = (key) => t(locale, touchFirst ? `${key}Touch` : key);
  switch (state.status) {
    case "ready":
      return [hint("status.ready"), ""];
    case "paused":
      return [t(locale, "status.paused"), hint("status.pausedHint")];
    case "over":
      return [
        newRecord
          ? t(locale, "status.newRecord", { score: state.snakes[0].score })
          : overTitle(),
        hint("status.overHint"),
      ];
    default:
      return undefined;
  }
}

// ---- Controles ----

function restart() {
  state = createGame({ maze, players });
  newRecord = false;
  render();
}

// Filas visibles del menú: la de Jugadores no existe sin teclado.
function menuItems() {
  return elements.menuItems.filter((item) => !item.hidden);
}

function togglePlayers() {
  players = players === 1 ? 2 : 1;
  restart();
}

function overTitle() {
  if (players === 1) return t(locale, "status.over");
  const keys = { p1: "status.winP1", p2: "status.winP2", draw: "status.draw" };
  return t(locale, keys[state.result]);
}

function openMenu() {
  mode = "menu";
  menuIndex = 0;
  restart();
}

function startFromMenu() {
  mode = "game";
  restart();
}

function selectMaze(delta) {
  const index = MAZES.findIndex((candidate) => candidate.id === maze.id);
  maze = MAZES[(index + delta + MAZES.length) % MAZES.length];
  saveMazeId(storage, maze.id);
  record = loadRecord(storage, maze.id);
  restart();
}

function activateMenuItem(index) {
  menuIndex = index;
  const action = menuItems()[index].dataset.action;
  if (action === "play") startFromMenu();
  else if (action === "maze") selectMaze(1);
  else if (action === "players") togglePlayers();
}

// Teclado en el menú: ↑↓ eligen fila, ←→ cambian el valor, Enter/Espacio activan.
function handleMenuKey(event) {
  const direction = KEY_DIRECTIONS[event.code];
  const action = menuItems()[menuIndex].dataset.action;
  if (direction === "up" || direction === "down") {
    const delta = direction === "up" ? -1 : 1;
    const count = menuItems().length;
    menuIndex = (menuIndex + delta + count) % count;
    render();
  } else if (
    (direction === "left" || direction === "right") &&
    action === "maze"
  ) {
    selectMaze(direction === "left" ? -1 : 1);
  } else if (
    (direction === "left" || direction === "right") &&
    action === "players"
  ) {
    togglePlayers();
  } else if (event.code === "Enter" || event.code === "Space") {
    activateMenuItem(menuIndex);
  } else {
    return;
  }
  event.preventDefault();
}

// Tocar o Enter: empieza, reanuda o vuelve a jugar según el estado.
function primaryAction() {
  if (state.status === "over") restart();
  else if (state.status === "ready") update(start(state));
  else if (state.status === "paused") update(togglePause(state));
}

document.addEventListener("keydown", (event) => {
  // Con el foco en el botón de idioma, Enter y Espacio son del botón.
  const onButton = event.target === elements.localeSwitch;
  if (onButton && (event.code === "Enter" || event.code === "Space")) return;
  if (mode === "menu") {
    handleMenuKey(event);
    return;
  }
  if (
    event.code === "Escape" &&
    (state.status === "over" || state.status === "paused")
  ) {
    event.preventDefault();
    openMenu();
    return;
  }
  const direction = KEY_DIRECTIONS[event.code];
  if (direction) {
    event.preventDefault();
    if (state.status === "paused") return;
    const player = players === 2 && PLAYER_TWO_KEYS.has(event.code) ? 1 : 0;
    update(queueDirection(state, direction, player));
    return;
  }
  if (event.code === "Space" || event.code === "KeyP") {
    event.preventDefault();
    if (state.status === "ready" || state.status === "over") primaryAction();
    else update(togglePause(state));
  } else if (event.code === "Enter") {
    event.preventDefault();
    primaryAction();
  }
});

const device = document.querySelector(".device");
let touchStart = null;

device.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  },
  { passive: true },
);

device.addEventListener("touchend", (event) => {
  // Un toque sobre un botón (menú) es un clic: no se anula ni se interpreta como gesto.
  if (!touchStart || event.target.closest("button")) {
    touchStart = null;
    return;
  }
  if (mode === "menu") return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  touchStart = null;
  event.preventDefault();
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN_PX) {
    primaryAction();
    return;
  }
  if (state.status === "paused" || state.status === "over") return;
  const direction =
    Math.abs(dx) > Math.abs(dy)
      ? dx > 0
        ? "right"
        : "left"
      : dy > 0
        ? "down"
        : "up";
  update(queueDirection(state, direction));
});

// Con la pestaña oculta la partida se pausa: volver no debe ser perder.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.status === "playing") update(togglePause(state));
});

elements.menuItems.forEach((item) => {
  item.addEventListener("click", () =>
    activateMenuItem(menuItems().indexOf(item)),
  );
});
elements.menuItems.find((item) => item.dataset.action === "players").hidden =
  !canTwoPlayers;
elements.statusMenu.addEventListener("click", openMenu);

elements.localeSwitch.addEventListener("click", () => {
  locale = LOCALES.find((candidate) => candidate !== locale);
  saveLocale(storage, locale);
  applyLocale();
});

// ---- Idioma ----

function applyLocale() {
  document.documentElement.lang = locale;
  document.title = t(locale, "meta.title");
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", t(locale, "meta.description"));
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(locale, element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute(
      "aria-label",
      t(locale, element.dataset.i18nAriaLabel),
    );
  }
  render();
}

// ---- Utilidades ----

function readColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    screen: style.getPropertyValue("--lcd-screen").trim(),
    ink: style.getPropertyValue("--lcd-ink").trim(),
  };
}

function safeLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

// ---- Arranque ----

// El color de la barra del navegador móvil sale del token: un <meta> no lee CSS.
const themeColor = document.createElement("meta");
themeColor.name = "theme-color";
themeColor.content = colors.screen;
document.head.append(themeColor);

window.addEventListener("resize", resize);
applyLocale();
// Las fuentes cambian el alto del botón de idioma: se recalcula al cargarlas.
document.fonts.ready.then(resize);
resize();
requestAnimationFrame(frame);
