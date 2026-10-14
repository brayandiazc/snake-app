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
    "status.pausedHint": "Espacio para seguir",
    "status.pausedHintTouch": "Toca para seguir",
    "status.over": "Fin del juego",
    "status.overHint": "Enter para jugar otra vez",
    "status.overHintTouch": "Toca para jugar otra vez",
    "status.newRecord": "¡Nuevo récord: {score}!",
    "board.label": "Tablero del juego",
    "locale.switch": "English",
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
    "status.pausedHint": "Space to resume",
    "status.pausedHintTouch": "Tap to resume",
    "status.over": "Game over",
    "status.overHint": "Enter to play again",
    "status.overHintTouch": "Tap to play again",
    "status.newRecord": "New record: {score}!",
    "board.label": "Game board",
    "locale.switch": "Español",
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
