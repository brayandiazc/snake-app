# Diseño — Multijugador local

## Enfoque

`game.js` generaliza la serpiente a una lista: `snakes: [{ cells, direction,
queuedDirections, score, alive }]`. El modo de un jugador es una lista de uno. Todas
las reglas se escriben una vez para N serpientes.

### Salidas

Simétricas respecto al centro, para que nadie empiece con ventaja. Validadas en los
cinco laberintos, que también son simétricos.

| Jugador | Teclas | Cabeza   | Mirando a   | Cuerpo         |
| ------- | ------ | -------- | ----------- | -------------- |
| J1      | WASD   | `(10, 6)` | la derecha  | `(7–10, 6)`    |
| J2      | Flechas | `(22, 14)` | la izquierda | `(22–25, 14)` |

En un jugador, la salida es la de la v0.1 (`(16, 10)`) y valen las dos teclas.

### Un paso con dos serpientes

1. Cada serpiente viva aplica su giro y calcula su nueva cabeza (atravesando bordes).
2. **Choques que se resuelven a la vez**, con el estado de antes del paso:
   - Cabeza en un muro, en el propio cuerpo o en el cuerpo de la otra → muere. Una cola
     que se mueve en este paso no cuenta, igual que en la v0.1.
   - Las dos cabezas en la misma celda, o cruzándose (cada una entra donde estaba la
     otra) → mueren las dos.
3. Las que sobreviven avanzan; la que come crece y suma 1.
4. Si muere al menos una: `status = "over"` y
   `result = "p1" | "p2" | "draw"`.

La velocidad se calcula con la comida total: `speedFor(j1.score + j2.score)`.

### Controles

`queueDirection(state, direction, player)`: con 2 jugadores, WASD va a J1 y las
flechas a J2; con 1, cualquiera mueve a la única serpiente. Cada serpiente tiene su
propia cola de 2 giros.

### Dibujo y marcador

- **J1**: 2 × 2 puntos, como la v0.1. **J2**: los mismos puntos pero en diagonal (2 de
  los 4), un trazo «punteado» que se distingue de J1 y de los muros (3 × 3).
- Marcador en dos jugadores: **J1 n · Speed n · J2 n**. El récord no se muestra ni se
  guarda: es de un jugador y por laberinto.

### Solo escritorio

La fila de Jugadores aparece si `matchMedia("(any-pointer: fine) and (any-hover:
hover)")` se cumple, es decir, si hay ratón o trackpad. Es una aproximación a «tiene
teclado»: una tablet con teclado y trackpad la verá, y está bien.

### Avisos con la partida congelada

En pausa y al terminar, el aviso va en un recuadro ajustado al texto y centrado: sin
él, «¡Gana J2!» se montaba sobre las serpientes. En espera sigue sin recuadro, para no
tapar las salidas. Añadido durante la implementación, al verlo en pantalla.

## Alternativas consideradas

| Alternativa                                     | Por qué no                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Duplicar `step()` para dos jugadores            | Dos copias de las reglas que divergen con el primer cambio        |
| Resolver primero J1 y luego J2                  | Daría ventaja a J1 en los choques cabeza contra cabeza            |
| J2 de otro color                                | La pantalla es monocroma; la textura respeta la referencia        |
| Detectar teclado con `navigator.keyboard`       | No existe en Safari ni en Firefox                                 |

## Áreas afectadas

- **Modelo de datos**: ninguno nuevo.
- **API**: ninguna.
- **Otros**: `game.js` (estado con lista de serpientes), `render.js` (textura de J2),
  `main.js` (teclas por jugador y marcador), `i18n.js` (textos de victoria y rótulos J1
  y J2), `screens.md` (resultado de la partida).

## Prototipo (si la spec toca UI)

No hay prototipo aparte: se revisa sobre el juego real.

## Decisiones

- El estado guarda una lista de serpientes, también en un jugador. Es una decisión
  duradera de la arquitectura: se refleja en
  [`architecture.md`](../../docs/architecture/architecture.md).
- Los choques se resuelven a la vez, con el estado de antes del paso: nadie gana por
  ser J1.

## Despliegue y reversión

- Sale con la v0.2, después de la spec 0003. Para revertir, se revierte el PR.
