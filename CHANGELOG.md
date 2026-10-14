# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Fixed

- **Al compartir el enlace no salía la imagen**: `og:image` era una ruta relativa y las
  redes sociales la exigen absoluta. Se añaden también `canonical`, `og:url` y
  `sitemap.xml` con la URL de producción, https://snake-app-mu.vercel.app
  ([spec 0002](specs/0002-seo-url-produccion/)).

## [0.1.0] - 2026-10-13

### Added

- **El juego, v0.1** ([spec 0001](specs/0001-juego-base/)): réplica fiel del Snake de
  pantalla LCD verde, calibrada con la captura de referencia. Tablero de 33 × 21
  celdas que se atraviesa por los bordes, 1 punto por comida, velocidad que sube sola
  (Speed 1–9), récord en el navegador, teclado y gestos táctiles, español e inglés, y
  metadatos SEO y Open Graph.
- Documentación del proyecto instanciada desde la plantilla
  `project-starter-template-es-ai` v2.3.1: stack (HTML, CSS y JavaScript nativos),
  arquitectura, roadmap de la v0.1 con sus reglas de juego, hosting en Vercel y
  [ADR 0002](docs/decisions/0002-instanciacion-del-proyecto.md).
- Repositorio público en GitHub con `develop` como rama por defecto, labels, topics,
  squash merge y protección de `main` y `develop` (PR obligatorio y checks `Calidad` y
  `Gitleaks`).

[Unreleased]: https://github.com/brayandiazc/snake-app/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/brayandiazc/snake-app/releases/tag/v0.1.0
