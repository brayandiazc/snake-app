// Textos visibles en español e inglés. La paridad de claves la verifica
// tests/i18n.test.js — ver docs/conventions/i18n.md.

export const DEFAULT_LOCALE = "es";
export const LOCALES = ["es", "en"];

export const messages = {
  es: {
    "meta.title": "Snake — el clásico de pantalla verde",
    "meta.description":
      "Juega al Snake clásico de pantalla verde en tu navegador. Sin instalar nada.",
    "hud.score": "Puntos",
    "hud.speed": "Velocidad",
    "hud.record": "Récord",
    "status.ready": "Pulsa una flecha para empezar",
    "status.readyTouch": "Toca para empezar",
    "status.paused": "Pausa",
    "status.pausedHint": "Espacio: seguir · Esc: menú",
    "status.pausedHintTouch": "Toca para seguir",
    "status.over": "Fin del juego",
    "status.overHint": "Enter: otra vez · Esc: menú",
    "status.overHintTouch": "Toca para jugar otra vez",
    "status.newRecord": "¡Nuevo récord: {score}!",
    "board.label": "Tablero del juego",
    "locale.switch": "English",
    "menu.label": "Menú",
    "menu.play": "Jugar",
    "menu.maze": "Laberinto",
    "menu.players": "Jugadores",
    "hud.p1": "J1",
    "hud.p2": "J2",
    "status.winP1": "¡Gana J1!",
    "status.winP2": "¡Gana J2!",
    "status.draw": "Empate",
    "menu.back": "Menú",
    "menu.hint": "↑↓ elegir · ←→ cambiar · Enter jugar",
    "menu.hintTouch": "Toca una opción",
    "maze.libre": "Libre",
    "maze.caja": "Caja",
    "maze.pasillos": "Pasillos",
    "maze.cruz": "Cruz",
    "maze.islas": "Islas",
  },
  en: {
    "meta.title": "Snake — the green-screen classic",
    "meta.description":
      "Play the classic green-screen Snake in your browser. Nothing to install.",
    "hud.score": "Score",
    "hud.speed": "Speed",
    "hud.record": "Record",
    "status.ready": "Press an arrow key to start",
    "status.readyTouch": "Tap to start",
    "status.paused": "Paused",
    "status.pausedHint": "Space: resume · Esc: menu",
    "status.pausedHintTouch": "Tap to resume",
    "status.over": "Game over",
    "status.overHint": "Enter: again · Esc: menu",
    "status.overHintTouch": "Tap to play again",
    "status.newRecord": "New record: {score}!",
    "board.label": "Game board",
    "locale.switch": "Español",
    "menu.label": "Menu",
    "menu.play": "Play",
    "menu.maze": "Maze",
    "menu.players": "Players",
    "hud.p1": "P1",
    "hud.p2": "P2",
    "status.winP1": "P1 wins!",
    "status.winP2": "P2 wins!",
    "status.draw": "Draw",
    "menu.back": "Menu",
    "menu.hint": "↑↓ select · ←→ change · Enter play",
    "menu.hintTouch": "Tap an option",
    "maze.libre": "Open",
    "maze.caja": "Box",
    "maze.pasillos": "Corridors",
    "maze.cruz": "Cross",
    "maze.islas": "Islands",
  },
};

// Preferencia guardada → idioma del navegador → español.
export function detectLocale(saved, navigatorLanguage) {
  if (LOCALES.includes(saved)) return saved;
  if (typeof navigatorLanguage === "string") {
    return navigatorLanguage.toLowerCase().startsWith("es") ? "es" : "en";
  }
  return DEFAULT_LOCALE;
}

export function t(locale, key, params = {}) {
  const text = messages[locale]?.[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    String(params[name] ?? match),
  );
}
