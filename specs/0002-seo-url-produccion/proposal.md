# Propuesta — SEO con la URL de producción

- **Estado**: Implementada
- **Fecha**: 2026-10-13
- **Autor**: Brayan Diaz C
- **Ítem de roadmap**: v0.1 → Metadatos SEO y Open Graph de la página. Lo completa: la
  v0.1 lo dejó a falta de la URL de producción.

## Problema

`og:image` apunta a `/assets/og-image.png`, una ruta relativa. Las redes sociales
(Facebook, X, WhatsApp, LinkedIn) exigen una URL absoluta, así que al compartir el enlace
no sale la imagen. Además faltan `canonical`, `og:url` y `sitemap.xml`, que esperaban la
URL de producción: ya existe, `https://snake-app-mu.vercel.app/`.

## Evidencia

- **¿Quién pagaría por esto, y qué lo respalda?**: No aplica: corrección.
- **¿Ya existe?**: No aplica: corrección.
- **Experimento previo**: No aplica: corrección.

## Objetivo

Que al compartir la URL aparezcan título, descripción e imagen, y que los buscadores
tengan una URL canónica y un sitemap.

## Alcance

**Dentro del alcance:**

- `og:image` absoluta, `og:url`, `<link rel="canonical">` y `sitemap.xml`.
- `robots.txt` con la línea `Sitemap:`.
- La URL en el README y en `deploy.md`, que la tenían como pendiente.

**Fuera del alcance:**

- Dominio propio.

## Impacto

- **Usuarios**: el enlace compartido muestra la tarjeta con la imagen del juego.
- **Sistema**: solo `index.html`, `robots.txt` y un `sitemap.xml` nuevo.
- **Riesgos**: si algún día hay dominio propio, la URL está en cuatro sitios. Se
  documenta en `deploy.md` para cambiarlos juntos.

## Preguntas abiertas

- [x] Ninguna.
