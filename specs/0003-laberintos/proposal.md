# Propuesta — Laberintos y menú de inicio

- **Estado**: Borrador
- **Fecha**: 2026-10-13
- **Autor**: Brayan Diaz C
- **Ítem de roadmap**: v0.2 → Menú de inicio dentro de la pantalla LCD; Laberintos fijos
  con muros, a elegir antes de jugar; Récord separado por laberinto.

## Problema

La v0.1 tiene un único tablero vacío: cuando se le coge el truco, todas las partidas
son iguales. Los obstáculos dan variedad, pero elegir laberinto exige un menú que hoy
no existe.

## Evidencia

- **¿Quién pagaría por esto, y qué lo respalda?**: Nadie: sigue siendo un experimento
  sin objetivo comercial. Lo pide el autor para la v0.2.
- **¿Ya existe?**: Sí: el Snake II del móvil tenía laberintos. Aquí se diseñan desde
  cero, con nombres y mapas propios.
- **Experimento previo**: No hacía falta.

## Objetivo

Al abrir el juego aparece un menú en la pantalla LCD. Desde él se elige uno de cinco
laberintos, cada uno con su propio récord, y chocar con un muro termina la partida.

## Alcance

**Dentro del alcance:**

- Cinco laberintos de 33 × 21 celdas: **Libre** (el tablero de la v0.1), **Caja**,
  **Pasillos**, **Cruz** e **Islas**.
- Chocar con un muro termina la partida. Atravesar bordes sigue valiendo donde no hay
  muro.
- Menú dentro de la pantalla: **Jugar** y **Laberinto ‹ nombre ›**, con el laberinto
  elegido dibujado de fondo.
- Récord por laberinto. El de Libre conserva la clave de la v0.1, así no se pierde.
- Al terminar: otra vez con el mismo laberinto, o volver al menú.
- Se recuerda el último laberinto elegido.

**Fuera del alcance:**

- Dos jugadores (spec 0004), aunque el menú queda preparado para añadir esa fila.
- Bloques que aparecen al azar.
- Editor de laberintos.

## Impacto

- **Usuarios**: primera pantalla nueva; las partidas en Libre siguen igual que en la
  v0.1, récord incluido.
- **Sistema**: `game.js` gana muros; módulo nuevo `js/mazes.js`; `render.js` dibuja
  muros; `main.js` gestiona el menú; dos claves nuevas de `localStorage`
  ([`database.md`](../../docs/architecture/database.md)).
- **Riesgos**:
  - **Muros que se confunden con la serpiente**: se dibujan con otra textura de puntos
    (ver [`design.md`](design.md)).
  - **Laberinto imposible**: una prueba valida cada mapa (zona de salida libre, camino
    delante y ninguna zona libre aislada).
  - **Parecido con Snake II**: nombres y mapas propios, no copiados.

## Preguntas abiertas

- [ ] La textura de los muros se ajusta viéndola en pantalla; el punto de partida está
      en [`design.md`](design.md).
