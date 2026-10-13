# Diseño — Juego base: la réplica fiel v0.1 del Snake LCD

> Diseño técnico de este cambio. Sigue la arquitectura de
> [`architecture.md`](../../docs/architecture/architecture.md); aquí van los detalles.

## Enfoque

Las reglas viven en `js/game.js` como funciones puras sobre un objeto de estado. Una
función de paso recibe un estado y devuelve el siguiente. `js/main.js` acumula el tiempo
de `requestAnimationFrame` y llama a `step()` cada vez que se cumple el intervalo de la
velocidad actual; después `js/render.js` dibuja el estado en el canvas. El marcador y
los avisos son HTML.

### Medidas (tomadas de la captura)

Medido en píxeles sobre [`referencia.jpeg`](../../docs/product/referencia.jpeg)
(1121 × 832). Todo se expresa en relación con la celda (**C ≈ 32,4 px** en la captura),
para que escale a cualquier pantalla:

| Elemento                | Medida en la captura                               | Respecto a la celda      |
| ----------------------- | -------------------------------------------------- | ------------------------ |
| Tablero                 | **33 × 21 celdas**                                 | —                        |
| Punto LCD               | 13 px de punto + 3 px de separación                | Celda = 2 × 2 puntos     |
| Serpiente               | Cada celda, 2 × 2 puntos                           | Trazo doble y continuo   |
| Comida                  | Rombo de 4 puntos en una rejilla de 3 × 3          | Ocupa una celda          |
| Margen interior         | ≈ 11–12 px a cada lado del tablero                 | ≈ 0,35 C                 |
| Marco                   | Negro, 5 px, esquinas de ≈ 8 px                    | 0,15 C; radio 0,25 C     |
| Línea sobre el marcador | 4 px                                               | 0,12 C                   |
| Barra del marcador      | 92 px de alto                                      | ≈ 2,85 C                 |
| Texto del marcador      | Mayúsculas de 32 px; números de 37 px              | ≈ 1 C                    |
| Grupos del marcador     | Tres de igual ancho: rótulo a la izquierda, número a la derecha | —           |
| Fondo de la página      | Damero de cuadros de ≈ 10 px                       | Fijo, no escala          |

| Color                        | Valor                                |
| ---------------------------- | ------------------------------------ |
| Pantalla                     | `rgb(144 195 2)`                     |
| Tinta (puntos, marco, texto) | `rgb(0 0 0)`                         |
| Línea sobre el marcador      | `rgb(41 59 0)`                       |
| Damero de fondo              | `rgb(130 177 2)` y `rgb(156 193 53)` |

El canvas trabaja a un tamaño de celda entero (en píxeles del dispositivo), el mayor que
quepa en la ventana. Se escala con `image-rendering: pixelated`, así no aparecen bordes
borrosos.

### Estado y API de `game.js`

```js
// Estado: un objeto plano, nunca se muta — cada función devuelve uno nuevo.
{
  cols, rows,
  snake: [{ x, y }, ...],          // la cabeza es snake[0]
  direction: "right",
  queuedDirections: [],            // hasta 2 giros pendientes entre ticks
  food: { x, y } | null,
  score, speed,
  status: "ready" | "playing" | "paused" | "over",
}

createGame({ cols, rows, random })  // random: () => número en [0, 1), inyectado
queueDirection(state, direction)     // ignora la marcha atrás y los giros repetidos
step(state)                          // avanza un tick: mover, atravesar, comer, chocar
togglePause(state)
speedFor(score)                      // min(9, 1 + floor(score / 5))
tickMs(speed)                        // 300 - (speed - 1) * 25 → de 300 ms a 100 ms
```

Reglas del paso:

1. Se aplica el primer giro de la cola, si lo hay.
2. La nueva cabeza se calcula **con módulo**: al salir por un borde entra por el
   opuesto.
3. Si la nueva cabeza cae sobre el cuerpo, `status = "over"`. La punta de la cola no
   cuenta si ese tick no se come, porque se mueve a la vez.
4. Si cae sobre la comida: la serpiente crece una celda, `score + 1`, se recalcula
   `speed` y la comida aparece en una celda libre al azar. Si no queda ninguna celda
   libre, la partida termina.

Serpiente inicial: 4 celdas en el centro (cabeza en `(16, 10)`), mirando a la derecha.

### Otros módulos

- **`storage.js`**: `loadRecord(storage)` y `saveRecord(storage, score)`, que reciben
  el almacén como parámetro (en la app, `window.localStorage`; en las pruebas, uno
  falso). Todo va en `try/catch`; si falla, el récord es `0` y no se guarda. Claves en
  [`database.md`](../../docs/architecture/database.md).
- **`i18n.js`**: `messages = { es, en }`, `detectLocale(saved, navigatorLanguage)` y
  `t(locale, key, params)`.
- **`render.js`**: `draw(ctx, state, cellPx, colors)`. Los colores se leen una sola vez
  de las variables CSS de los tokens (`getComputedStyle`), no se escriben en el JS.
- **`main.js`**: teclado, gestos táctiles (deslizar ≥ 24 px decide la dirección; tocar
  empieza o reanuda), bucle, cambio de idioma, y guardar el récord al terminar.

### Aspecto

- **Colores**: nuevos tokens semánticos en `design/tokens.css` para la pantalla
  (`--lcd-screen`, `--lcd-ink`, `--lcd-frame`), con los valores de la tabla de colores.
  Mismo aspecto en tema claro y oscuro, damero de fondo incluido: es la réplica de
  una pantalla física, no una interfaz que cambie con el tema.
- **Rótulos**: Orbitron 600 (OFL-1.1), en `.woff2` dentro de `assets/fonts/` con su
  licencia. Nada se carga de un CDN. Tamaño y espaciado calibrados para que quepa el
  peor caso, un récord de tres cifras (el máximo posible es 689 = 693 celdas − 4).
- **Números**: no son una tipografía. En la captura son un mapa de bits de 7 × 7
  «píxeles», cada uno un punto LCD (paso ≈ 0,175 C). Se dibujan en un canvas por valor
  con `drawDigits()`, y el texto real queda oculto para lectores de pantalla. El 1, el
  3 y el 5 están copiados de la captura; el resto sigue su estilo.
- **Avisos de estado** (en espera, pausa, fin): en el tercio superior del tablero, sin
  fondo, porque el centro es donde está la serpiente al empezar.

## Alternativas consideradas

| Alternativa                                   | Por qué no                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| Tablero en DOM (un `<div>` por celda)         | 693 celdas redibujadas varias veces por segundo; el canvas lo hace sin esfuerzo |
| `setInterval` con el intervalo de la velocidad | Se desincroniza del refresco de pantalla y sigue corriendo con la pestaña oculta |
| Dibujar los números del marcador en el canvas | Se pierde la accesibilidad y la traducción; el HTML con fuente de puntos da lo mismo |
| Estado mutable dentro de una clase `Game`     | Más difícil de probar: cada prueba tendría que reconstruir el historial         |

## Áreas afectadas

- **Modelo de datos**: solo las dos claves de `localStorage` ya documentadas en
  [`database.md`](../../docs/architecture/database.md).
- **API**: ninguna.
- **Otros**: UI completa (`index.html`, `css/styles.css`), tokens en `design/tokens.css`,
  y recursos en `assets/` (icono, imagen social, fuentes).

## Prototipo (si la spec toca UI)

No hay prototipo aparte: la vista es una sola, y su referencia es la captura del juego
original ([`referencia.jpeg`](../../docs/product/referencia.jpeg)). La revisión visual se
hace sobre el juego real, en comparación lado a lado.

## Decisiones

- El borde se atraviesa, 1 punto por comida y la velocidad sube sola (decisiones de
  producto, registradas en el [roadmap](../../docs/product/roadmap.md)).
- Estado inmutable con función de paso pura. Ya está recogido en
  [`architecture.md`](../../docs/architecture/architecture.md), así que no necesita ADR
  propio.
- Tipografías alojadas en el repositorio, nunca desde un CDN.
- **Desvío respecto al borrador**: se descartó Doto para los números. Medida de cerca,
  la captura no usa una fuente sino puntos LCD, como la serpiente; Doto se parecía
  pero no era igual.

## Despliegue y reversión

- Sitio estático. Se publica con el primer release (`develop → main`), cuando Vercel
  esté conectado. Un `.vercelignore` deja fuera `tests/`, `docs/`, `specs/` y las
  herramientas.
- Para revertir, se revierte el PR. No hay datos de servidor que migrar.
- `canonical`, `og:url` y `sitemap.xml` necesitan la URL de producción. Se añaden
  cuando Vercel la asigne; antes de eso, un `sitemap.xml` con una URL inventada sería
  peor que no tenerlo.
