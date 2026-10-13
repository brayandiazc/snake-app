# Tareas — Juego base: la réplica fiel v0.1 del Snake LCD

Lista de tareas de implementación. Manténla ordenada; marca los elementos a medida que avanzas.

## Implementación

- [ ] `js/game.js`: estado, `createGame`, `queueDirection`, `step`, `togglePause`,
      `speedFor` y `tickMs`, según [`design.md`](design.md)
- [ ] `js/storage.js`: leer y guardar el récord, tolerante a fallos
- [ ] `js/i18n.js`: diccionario es/en y detección del idioma
- [ ] `design/tokens.css`: tokens de la pantalla LCD
- [ ] `assets/fonts/`: Orbitron y Doto en `.woff2`, con `OFL.txt`
- [ ] `index.html` y `css/styles.css`: dispositivo, canvas, marcador y avisos de estado
- [ ] `js/render.js`: tablero, serpiente de 2 × 2 puntos y comida en rombo
- [ ] `js/main.js`: bucle, teclado, gestos táctiles, pausa al ocultar la pestaña,
      idioma y récord
- [ ] SEO: título, descripción, Open Graph, `robots.txt`, `assets/icon.svg` y
      `assets/og-image.png` (captura del propio juego)
- [ ] `.vercelignore` con lo que no se publica

## Pruebas

- [ ] `tests/game.test.js`: avanzar, girar, ignorar la marcha atrás, atravesar los
      cuatro bordes, comer (crece y suma 1), umbrales de Speed (4 → 1, 5 → 2, 40 → 9,
      100 → 9), chocar consigo misma, la cola que se va no mata, la comida nunca cae
      sobre la serpiente, el tablero lleno termina la partida
- [ ] `tests/storage.test.js`: sin récord da 0, guarda solo si supera, valor corrupto
      da 0, un almacén que lanza excepciones no rompe nada
- [ ] `tests/i18n.test.js`: paridad de claves es/en y detección del idioma
- [ ] Cobertura ≥ 90 % de líneas en `js/game.js`
      (`node --test --experimental-test-coverage`)
- [ ] Prueba manual: una partida completa con teclado y otra en móvil; el récord
      sobrevive a la recarga; comparación lado a lado con la captura de referencia

## Documentación

- [ ] Actualizar los `docs/` correspondientes y `CHANGELOG.md`
- [ ] Marcar como hecho el **Ítem de roadmap** declarado en `proposal.md` dentro de
      [`../../docs/product/roadmap.md`](../../docs/product/roadmap.md) — o anotar ahí
      el desvío si el cambio terminó cubriendo algo distinto
- [ ] Actualizar el estado de las vistas en `docs/architecture/screens.md`
- [ ] Añadir un ADR si se tomó una decisión duradera (`docs/decisions/`)

## Revisión y despliegue

- [ ] Autorrevisión / `/code-review`
- [ ] Abrir PR usando la plantilla de PR
