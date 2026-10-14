# Diseño — Laberintos y menú de inicio

## Enfoque

Un laberinto es un dato, no código: `js/mazes.js` exporta una lista de mapas como
filas de texto (`#` = muro), igual que la fuente de dígitos. `game.js` recibe el mapa en
`createGame({ maze })` y lo trata como un conjunto de celdas prohibidas para la cabeza y
para la comida.

### Los cinco laberintos

| Id         | Qué es                                                     | Muros |
| ---------- | ---------------------------------------------------------- | ----- |
| `libre`    | El tablero de la v0.1, sin muros                           | 0     |
| `caja`     | Muro en todo el borde: se acaba atravesar                  | 104   |
| `pasillos` | Dos barras horizontales (filas 5 y 15, columnas 6–26)      | 42    |
| `cruz`     | Cuatro brazos desde los bordes con el centro abierto       | 24    |
| `islas`    | Cuatro bloques de 5 × 3 en las esquinas interiores         | 60    |

Todos se validaron con un script antes de escribir la spec: la serpiente nace en celdas
libres, tiene al menos 6 celdas libres delante y todas las celdas libres están
conectadas entre sí (contando que se atraviesan los bordes).

### Cambios en `game.js`

```js
createGame({ cols, rows, random, maze })  // maze: { id, walls: ["....#..", ...] }
// el estado gana `walls: Set<number>` (índice y * cols + x) y `mazeId`
```

- `step()`: si la nueva cabeza cae en un muro, `status = "over"`, antes de comprobar
  el cuerpo y la comida.
- `placeFood()`: las celdas de muro cuentan como ocupadas.
- La serpiente inicial no cambia de sitio: cabeza en `(16, 10)`, mirando a la derecha.
  Los cinco mapas dejan libre esa fila.

### Menú

El menú es un **modo de la interfaz** en `main.js` (`mode = "menu" | "game"`), no un
estado de `game.js`: un menú no es una regla del juego. Se dibuja en HTML sobre el canvas
(como los avisos de la v0.1), con el laberinto elegido de fondo y sin serpiente.

```
  ▸ JUGAR
    LABERINTO   ‹ CAJA ›
```

| Acción          | Teclado                 | Táctil                         |
| --------------- | ----------------------- | ------------------------------ |
| Mover selección | ↑ ↓ (o W S)             | —                              |
| Cambiar valor   | ← → (o A D)             | Tocar la fila del laberinto    |
| Empezar         | Enter o Espacio en Jugar | Tocar Jugar                   |
| Volver al menú  | Escape (en pausa o al terminar) | Tocar «Menú» al terminar |

Al empezar se pasa a `"ready"` (la v0.1 tal cual: «pulsa una flecha»). Al terminar,
Enter repite con el mismo laberinto y Escape vuelve al menú.

### Dibujo

- **Muros**: 3 × 3 puntos por celda, más densos que los 2 × 2 de la serpiente. Mismo
  color de tinta. Se distinguen por textura, no por color, como en una LCD real.
- El marcador muestra el récord del laberinto elegido, también en el menú.

### Persistencia

| Clave                         | Qué guarda                                    |
| ----------------------------- | --------------------------------------------- |
| `snake-app:record`            | Récord de Libre (la clave de la v0.1)         |
| `snake-app:record:<id>`       | Récord del resto de laberintos                |
| `snake-app:maze`              | Último laberinto elegido                      |

`storage.js` recibe el id: `loadRecord(storage, mazeId)` y
`saveRecord(storage, score, mazeId)`.

## Alternativas consideradas

| Alternativa                                  | Por qué no                                                         |
| -------------------------------------------- | ------------------------------------------------------------------ |
| Copiar los laberintos de Snake II            | Son de Nokia; el parecido de estilo basta                          |
| Muros dibujados como la serpiente (2 × 2)    | En una pantalla de un solo color, no se distinguen                 |
| Menú en HTML fuera del dispositivo           | Descartado por producto: el menú vive en la pantalla LCD           |
| Un único récord para todos los laberintos    | Caja es mucho más difícil que Libre; compartir récord lo vacía de sentido |

## Áreas afectadas

- **Modelo de datos**: dos claves nuevas de `localStorage`
  → [`database.md`](../../docs/architecture/database.md).
- **API**: ninguna.
- **Otros**: `screens.md` gana el estado Menú; `i18n.js` gana los textos del menú y
  los nombres de los laberintos.

## Prototipo (si la spec toca UI)

No hay prototipo aparte: el menú usa los mismos elementos que los avisos de la v0.1.
Se revisa sobre el juego real.

## Decisiones

- Un laberinto es un dato (filas de texto), validado por pruebas.
- El récord de Libre mantiene la clave de la v0.1: nadie pierde su récord al
  actualizar.
- Los muros se distinguen por textura (3 × 3 puntos), no por color.

## Despliegue y reversión

- Sale con la v0.2. Para revertir, se revierte el PR: las claves nuevas de
  `localStorage` quedan huérfanas, sin efecto.
