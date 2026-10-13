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
import { loadLocale, loadRecord, saveLocale, saveRecord } from "./storage.js";

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
const SWIPE_MIN_PX = 24;
const MAX_FRAME_MS = 250;
// Alto del dispositivo, en celdas: tablero + línea + marcador + marco.
const DEVICE_ROWS = ROWS + 2 * BOARD_MARGIN + 0.12 + 2.85 + 0.3;
const DEVICE_COLS = COLS + 2 * BOARD_MARGIN + 0.3;

const storage = safeLocalStorage();
const touchFirst = window.matchMedia("(pointer: coarse)").matches;

const elements = {
  board: document.querySelector(".board"),
  status: document.querySelector(".status"),
  statusTitle: document.querySelector(".status-title"),
  statusHint: document.querySelector(".status-hint"),
  score: document.querySelector('[data-value="score"]'),
  speed: document.querySelector('[data-value="speed"]'),
  record: document.querySelector('[data-value="record"]'),
  localeSwitch: document.querySelector(".locale-switch"),
};
const ctx = elements.board.getContext("2d");
const colors = readColors();

let state = createGame();
let record = loadRecord(storage);
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
    newRecord = state.score > record;
    record = saveRecord(storage, state.score);
  }
  render();
}

function render() {
  draw(ctx, state, cellPx, colors);
  renderValue(elements.score, state.score);
  renderValue(elements.speed, state.speed);
  renderValue(elements.record, record);
  renderStatus();
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
  const messages = {
    ready: [t(locale, touchFirst ? "status.readyTouch" : "status.ready"), ""],
    paused: [
      t(locale, "status.paused"),
      t(locale, touchFirst ? "status.pausedHintTouch" : "status.pausedHint"),
    ],
    over: [
      newRecord
        ? t(locale, "status.newRecord", { score: state.score })
        : t(locale, "status.over"),
      t(locale, touchFirst ? "status.overHintTouch" : "status.overHint"),
    ],
  };
  const message = messages[state.status];
  elements.status.hidden = !message;
  if (!message) return;
  elements.statusTitle.textContent = message[0];
  elements.statusHint.textContent = message[1];
  elements.statusHint.hidden = !message[1];
}

// ---- Controles ----

function restart() {
  state = createGame();
  newRecord = false;
  render();
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
  const direction = KEY_DIRECTIONS[event.code];
  if (direction) {
    event.preventDefault();
    if (state.status === "paused") return;
    update(queueDirection(state, direction));
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
  if (!touchStart) return;
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
