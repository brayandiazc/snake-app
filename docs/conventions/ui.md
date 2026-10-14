# Convenciones de UI

> Cómo se organizan las vistas y dónde viven los assets de marca de
> Snake App. **El sistema de diseño no se describe aquí**: vive en
> [`design/`](../../design/README.md), con los tokens al lado de su guía.
> **Última actualización**: 2026-10-13

## Qué manda sobre qué

| Pregunta                                      | Dónde                                                      |
| --------------------------------------------- | ---------------------------------------------------------- |
| Paleta, tipografía, iconos, motion, estados   | [`design/README.md`](../../design/README.md)               |
| Los valores concretos de los tokens           | [`design/tokens.css`](../../design/tokens.css)             |
| Qué pantallas tiene el producto               | [`../architecture/screens.md`](../architecture/screens.md) |
| Cómo se organizan esas pantallas en el código | Este documento                                             |
| Los assets de marca de este producto          | Este documento                                             |

Desviarse del design system es legítimo y cuesta un ADR — igual que desviarse del
marco técnico. Lo que no vale es desviarse sin querer.

## Layouts

Uno solo: `index.html`, una página centrada con el «dispositivo» (tablero + marcador)
que escala al ancho disponible sin deformar los píxeles. No hay páginas públicas aparte,
ni auth, ni dashboard.

## Estructura

```text
index.html          # la única vista
css/styles.css      # importa design/tokens.css y maqueta el dispositivo
js/                 # ver docs/architecture/architecture.md
assets/             # iconos e imagen social
```

## Reglas

- **Reutiliza parciales y componentes**; no dupliques marcado. Un componente que se
  copia y se toca un poco es dos componentes que divergen.
- **Separa estructura (HTML), aspecto (CSS) y comportamiento (JS).** El canvas dibuja
  el tablero; el marcador y los avisos son HTML, para que sean accesibles y
  traducibles.
- **Píxeles nítidos**: el canvas se dimensiona a múltiplos enteros del tamaño de celda y
  se escala con `image-rendering: pixelated`. Un píxel LCD borroso rompe la réplica.
- **Primitivas nativas y los cuatro estados de datos**: las reglas viven en
  [`../../design/README.md`](../../design/README.md) — única copia, como promete la
  cabecera de este documento; aquí solo el recordatorio de que aplican a toda vista.
- **Head compartido** para metadatos y SEO — ver [`seo.md`](seo.md).
- Nada de colores crudos: solo tokens semánticos. Lo verifica el job `Design system`
  del CI, no la memoria.

## Assets de marca

Lo que cambia por producto y `design/` deliberadamente no fija:

| Asset             | Archivo fuente        | Uso                     |
| ----------------- | --------------------- | ----------------------- |
| Isotipo (símbolo) | `assets/icon.svg`     | Favicon, icono de app   |
| Imagen social     | `assets/og-image.png` | 1200×630 para compartir |

No hay logotipo de texto: la pantalla de juego es la marca.

```text
assets/
├── icon.svg
└── og-image.png
```

- Los fuentes en **vectorial (SVG)**; los rasterizados se generan desde ahí, nunca al
  revés.
- Respeta el área de protección alrededor del logo. No lo deformes, recolorees ni le
  apliques efectos.
- Usa la variante que corresponda al fondo (claro, oscuro, color).
