// Récord e idioma en localStorage. El almacén entra como parámetro para poder
// probarlo sin navegador. Todo va en try/catch: en modo privado o con el
// almacenamiento bloqueado, leer o escribir lanza, y eso no puede tumbar el juego.
// Claves documentadas en docs/architecture/database.md.

const RECORD_KEY = "snake-app:record";
const LOCALE_KEY = "snake-app:locale";
const MAZE_KEY = "snake-app:maze";

// Libre conserva la clave de la v0.1: nadie pierde su récord al actualizar.
function recordKey(mazeId) {
  return !mazeId || mazeId === "libre" ? RECORD_KEY : `${RECORD_KEY}:${mazeId}`;
}

export function loadRecord(storage, mazeId) {
  try {
    const value = Number.parseInt(
      storage?.getItem(recordKey(mazeId)) ?? "",
      10,
    );
    return Number.isInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

// Guarda la puntuación solo si supera el récord. Devuelve el récord vigente.
export function saveRecord(storage, score, mazeId) {
  const record = loadRecord(storage, mazeId);
  if (score <= record) return record;
  try {
    storage?.setItem(recordKey(mazeId), String(score));
  } catch {
    // Sin almacenamiento el récord vale para esta sesión, no sobrevive a la recarga.
  }
  return score;
}

export function loadLocale(storage) {
  try {
    return storage?.getItem(LOCALE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveLocale(storage, locale) {
  try {
    storage?.setItem(LOCALE_KEY, locale);
  } catch {
    // Igual que el récord: se pierde al recargar, nada más.
  }
}

export function loadMazeId(storage) {
  try {
    return storage?.getItem(MAZE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveMazeId(storage, mazeId) {
  try {
    storage?.setItem(MAZE_KEY, mazeId);
  } catch {
    // Se vuelve a Libre al recargar, nada más.
  }
}
