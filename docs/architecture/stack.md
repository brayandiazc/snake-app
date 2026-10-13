# Stack de Snake App

> **Qué es**: lo que se eligió en **este** producto y por qué. Es la **única** fuente
> del stack: si una convención repite uno de estos datos, se desincroniza sin que nadie
> lo note. El porqué largo de cada elección va como ADR en
> [`../decisions/`](../decisions/README.md).
> **Última actualización**: 2026-10-13

## Stack elegido

**HTML + CSS + JavaScript nativos (módulos ES), dibujado en `<canvas>`, sin framework ni
build**. Decisión propia de este proyecto: es un experimento de una sola pantalla y la
persona pidió explícitamente HTML, CSS y JS. Ver
[ADR 0002](../decisions/0002-instanciacion-del-proyecto.md).

| Pieza                | Versión                     | Nota                                                                                          |
| -------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| Lenguaje del cliente | JavaScript ES2022 (módulos) | Sin transpilar. Navegadores objetivo: las dos últimas versiones de cada uno                   |
| Render               | Canvas 2D                   | API nativa del navegador                                                                      |
| Tipografía           | Orbitron 600 (OFL-1.1)      | Rótulos del marcador, alojada en `assets/fonts/`. Los números son puntos dibujados, no fuente |
| Estilos              | CSS nativo                  | Sin framework CSS: una pantalla con un canvas no lo amortiza                                  |
| Pruebas              | `node:test` (Node.js ≥ 22)  | Corredor nativo de Node; no hay `package.json` ni dependencias                                |
| Formato              | Prettier 3.9.6 vía `npx`    | Fijado en [`format.sh`](../../.github/scripts/format.sh)                                      |
| Servidor local       | `python3 -m http.server`    | Los módulos ES no cargan desde `file://`; cualquier servidor estático sirve                   |

Todo lo demás es lo que dicta el navegador. **Si no aparece abajo como desviación, es el
default.**

## Desviaciones de lo estándar del equipo

Ninguna. El producto va por el camino trillado.

## Servicios activos

Ninguno. El juego no tiene backend, ni analítica, ni servicios de terceros: el récord se
guarda en `localStorage` del navegador (ver [`database.md`](database.md)).

## Decisiones del arranque

Respondidas antes de escribir código:

- **Entidad central del producto**: la partida — serpiente, comida, puntuación y
  velocidad. Vive en memoria; solo el récord persiste.
- **¿Qué crece sin límite?**: nada. Es un sitio estático: el coste no depende de cuánta
  gente juegue, salvo el ancho de banda del hosting.
- **¿Hay costo de infraestructura por usuario?**: no.
- **¿Hay pantalla con interactividad continua?**: sí, el tablero — y precisamente por eso
  se dibuja en `<canvas>` con un bucle propio, no con un framework de UI.
- **¿Necesita algo que la web no da?**: no. Si algún día se quiere jugar offline o
  instalarlo, el camino es PWA, no nativo.
