# Propuesta — Juego base: la réplica fiel v0.1 del Snake LCD

- **Estado**: Implementada
- **Fecha**: 2026-10-13
- **Autor**: Brayan Diaz C
- **Ítem de roadmap**: v0.1 → Réplica fiel de la referencia — los ocho ítems de la
  versión. Van en una sola spec porque ninguno se juega por separado: sin marcador no
  hay récord, y sin bucle no hay nada que dibujar.

## Problema

Hoy el repositorio tiene documentación y ninguna línea de juego. El objetivo del
experimento —un Snake de navegador que se sienta como el del móvil de pantalla verde—
no se puede evaluar hasta que haya algo que jugar.

## Evidencia

- **¿Quién pagaría por esto, y qué lo respalda?**: Nadie, y no hace falta: es un
  experimento sin objetivo comercial
  (ver [`business-model.md`](../../docs/product/business-model.md)).
- **¿Ya existe?**: Sí, hay muchos clones de Snake en la web. No compite con ellos: el
  valor está en el ejercicio, no en el producto.
- **Experimento previo**: No hacía falta. La referencia visual es una captura del juego
  original que aportó el autor: [`referencia.jpeg`](../../docs/product/referencia.jpeg).

## Objetivo

Una partida completa, de la espera al fin, que **puesta al lado de la captura de
referencia no se distinga de ella**, y que se juegue igual con teclado que con el dedo.

## Alcance

**Dentro del alcance:**

- Tablero LCD: fondo verde, borde negro redondeado y píxeles negros con separación.
- Serpiente que avanza, gira, crece al comer y **atraviesa el borde** (sale por un lado
  y entra por el opuesto). Solo muere al chocar consigo misma.
- Comida en forma de rombo de cuatro píxeles, en una celda libre al azar.
- Puntuación: **1 punto por comida**.
- Velocidad automática: **Speed empieza en 1 y sube 1 cada 5 comidas, hasta 9**.
- Barra inferior con Score, Speed y Record, con los números en tipografía de puntos.
- Récord en `localStorage`, que sobrevive a la recarga.
- Estados: en espera, jugando, en pausa y fin de partida.
- Controles: flechas y WASD, Espacio/P para pausar, Enter para reiniciar; deslizar el
  dedo para girar y tocar para empezar.
- Textos en español e inglés, con detección del idioma del navegador.
- `<title>`, descripción, Open Graph, `robots.txt`, `sitemap.xml` e icono.

**Fuera del alcance:**

- Laberintos, menú del móvil, sonido y vibración.
- Ranking online y cuentas.
- PWA y juego sin conexión.
- Conectar Vercel: va aparte, al publicar el primer release.

## Impacto

- **Usuarios**: pasan de no tener nada a tener el juego completo.
- **Sistema**: crea todo lo descrito en
  [`architecture.md`](../../docs/architecture/architecture.md): `index.html`, `css/`,
  `js/` y `assets/`.
- **Riesgos**:
  - **Fidelidad**: «parecido» es subjetivo. Se mitiga con las medidas tomadas de la
    captura (ver [`design.md`](design.md)) y una comparación lado a lado antes de cerrar.
  - **Licencias**: las tipografías son OFL-1.1, se alojan en el repositorio con su
    licencia. No se copia nada de otro sitio.
  - **Móvil**: deslizar el dedo puede hacer scroll en vez de girar. Se bloquea el gesto
    por defecto solo sobre el tablero.

## Preguntas abiertas

- [ ] El ritmo de Speed (cuánto se acelera cada nivel) se ajusta jugando; el valor de
      partida está en [`design.md`](design.md).
