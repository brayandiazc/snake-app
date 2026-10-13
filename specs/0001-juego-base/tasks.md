# Tareas — Juego base: la réplica fiel v0.1 del Snake LCD

Lista de tareas de implementación. Manténla ordenada; marca los elementos a medida que avanzas.

## Implementación

- [x] `js/game.js`: estado, `createGame`, `queueDirection`, `step`, `togglePause`,
      `speedFor` y `tickMs`, según [`design.md`](design.md)
- [x] `js/storage.js`: leer y guardar el récord, tolerante a fallos
- [x] `js/i18n.js`: diccionario es/en y detección del idioma
- [x] `design/tokens.css`: tokens de la pantalla LCD
- [x] `assets/fonts/`: Orbitron en `.woff2`, con su licencia OFL (Doto se descartó,
      ver [`design.md`](design.md))
- [x] `index.html` y `css/styles.css`: dispositivo, canvas, marcador y avisos de estado
- [x] `js/render.js`: tablero, serpiente de 2 × 2 puntos y comida en rombo
- [x] `js/main.js`: bucle, teclado, gestos táctiles, pausa al ocultar la pestaña,
      idioma y récord
- [x] SEO: título, descripción, Open Graph, `robots.txt`, `assets/icon.svg` y
      `assets/og-image.png` (captura del propio juego)
- [x] `.vercelignore` con lo que no se publica

## Pruebas

- [x] `tests/game.test.js`: avanzar, girar, ignorar la marcha atrás, atravesar los
      cuatro bordes, comer (crece y suma 1), umbrales de Speed (4 → 1, 5 → 2, 40 → 9,
      100 → 9), chocar consigo misma, la cola que se va no mata, la comida nunca cae
      sobre la serpiente, el tablero lleno termina la partida
- [x] `tests/storage.test.js`: sin récord da 0, guarda solo si supera, valor corrupto
      da 0, un almacén que lanza excepciones no rompe nada
- [x] `tests/i18n.test.js`: paridad de claves es/en y detección del idioma
- [x] Cobertura ≥ 90 % de líneas en `js/game.js`
      (`node --test --experimental-test-coverage`)
- [x] Prueba en Chrome headless: partida completa con teclado hasta el fin y nuevo
      récord, gestos en móvil emulado (390 × 844), récord de 3 cifras en es/en, y
      comparación lado a lado con la captura
- [ ] Prueba manual en un móvil real (Safari iOS y Chrome Android)

## Documentación

- [x] Actualizar los `docs/` correspondientes y `CHANGELOG.md`
- [x] Marcar como hecho el **Ítem de roadmap** declarado en `proposal.md` dentro de
      [`../../docs/product/roadmap.md`](../../docs/product/roadmap.md) — o anotar ahí
      el desvío si el cambio terminó cubriendo algo distinto
- [x] Actualizar el estado de las vistas en `docs/architecture/screens.md`
- [x] Añadir un ADR si se tomó una decisión duradera (`docs/decisions/`) — no hizo
      falta: las decisiones están en `design.md` y en `architecture.md`

## Revisión y despliegue

- [x] Autorrevisión / `/code-review`
- [ ] Abrir PR usando la plantilla de PR
