# Diseño — SEO con la URL de producción

## Enfoque

URL absoluta escrita en el HTML estático: no hay build que la inyecte, y los rastreadores
de redes sociales no ejecutan JavaScript, así que tiene que estar en el HTML servido.

## Alternativas consideradas

| Alternativa                        | Por qué no                                                    |
| ---------------------------------- | ------------------------------------------------------------- |
| Inyectar la URL desde `main.js`    | Los rastreadores de Open Graph no ejecutan JavaScript         |
| Variable de entorno de Vercel      | Exigiría un paso de build, y el proyecto no tiene ninguno     |

## Áreas afectadas

- **Otros**: `index.html` (metadatos), `robots.txt`, `sitemap.xml`.

## Decisiones

- La URL de producción vive en cuatro sitios (`index.html`, `sitemap.xml`,
  `robots.txt` y los docs). La lista queda en `docs/conventions/deploy.md`.

## Despliegue y reversión

- Se publica con el siguiente release. Para revertir, se revierte el PR.
