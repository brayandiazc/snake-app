# Convenciones de testing

> Cómo escribimos y ejecutamos tests en Snake App.
> **Última actualización**: 2026-10-13

> El stack concreto —motor, librería, herramientas— lo decide el proyecto y lo registra
> [`../architecture/stack.md`](../architecture/stack.md), con el porqué en
> [`../decisions/`](../decisions/README.md). Aquí van solo las **reglas**, que no cambian
> al cambiar de herramienta.

## Tipos de test

| Tipo          | Qué cubre                                      | Carpeta           |
| ------------- | ---------------------------------------------- | ----------------- |
| Unitarios     | Reglas del juego (`js/game.js`), récord e i18n | `tests/`          |
| E2E / sistema | Una partida completa en el navegador           | Manual, ver abajo |

Los archivos de prueba se llaman `*.test.js`: `node --test` los encuentra solo.

## Reglas

- Todo cambio funcional se acompaña de tests.
- Estructura **Arrange-Act-Assert** (AAA): preparar, ejecutar, verificar.
- Un test verifica **una** cosa; nombres descriptivos del comportamiento esperado.
- Los tests deben ser deterministas (sin dependencia de red, reloj o orden).
- Cobertura mínima esperada: **90 % de líneas en `js/game.js`**. El dibujo y el
  teclado (`render.js`, `main.js`) no se miden: se verifican jugando.
- La aleatoriedad entra inyectada: una prueba nunca depende de dónde cae la comida.
- **Prueba manual antes de cerrar un cambio visible**: abrir el juego, jugar hasta
  perder, comprobar que el récord sobrevive a la recarga, en escritorio y en móvil.

## Ejemplos

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { createGame, step } from "../js/game.js";

test("la serpiente crece una celda cuando come", () => {
  // Arrange
  const game = createGame({ food: { x: 6, y: 5 } }); // cabeza en (5,5) mirando a la derecha
  // Act
  const next = step(game);
  // Assert
  assert.equal(next.snake.length, game.snake.length + 1);
});
```

## Comandos útiles

El comando para ejecutar la suite completa vive en el bloque «Configuración y
comandos» de [`AGENTS.md`](../../AGENTS.md) — única copia (de ahí lo lee también
`check-project-tests.sh`). Aquí solo los que no están allí:

```bash
node --test --experimental-test-coverage   # con reporte de cobertura
node --test --watch                        # modo watch
```
