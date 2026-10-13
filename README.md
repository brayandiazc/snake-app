# Snake App

El Snake clásico de los móviles de pantalla LCD, jugable en el navegador. Sin
instalar nada, sin cuentas, sin anuncios.

![Calidad](https://github.com/brayandiazc/snake-app/actions/workflows/quality.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

## Descripción

Una réplica fiel del Snake de pantalla verde: serpiente de píxeles negros sobre fondo
LCD, comida en forma de rombo y una barra inferior con **Score**, **Speed** y
**Record**. El récord se guarda en tu navegador. Juega en español o en inglés.

El alcance de la versión actual está en
[`docs/product/roadmap.md`](docs/product/roadmap.md).

## Requisitos previos

- Un navegador moderno (Chrome, Firefox, Safari o Edge, últimas dos versiones)
- **Python 3** para el servidor local (viene con macOS y la mayoría de Linux)
- **Node.js** v22 o superior, solo para las pruebas y el formato

## Instalación

```bash
git clone https://github.com/brayandiazc/snake-app
cd snake-app
git config core.hooksPath .githooks   # ← una vez por clon, no viaja en el repo
```

> La última línea no es opcional. Sin ella no corren los hooks: `pre-commit` no
> formatea y `pre-push` no verifica antes de publicar, así que los fallos se
> descubren en el CI —más lento y, en un repositorio privado, con minutos contados.

No hay dependencias que instalar ni build: el juego es HTML, CSS y JavaScript nativos.

## Uso

```bash
python3 -m http.server 8000              # http://localhost:8000
node --test                              # suite de pruebas
bash .github/scripts/format.sh --check   # formato
```

> Ábrelo por HTTP, no con doble clic: los módulos ES no cargan desde `file://`.

## Stack

**HTML + CSS + JavaScript nativos, dibujado en `<canvas>`**, sin framework ni build.
Lo elegido está en [`docs/architecture/stack.md`](docs/architecture/stack.md); el
porqué, en [`docs/decisions/`](docs/decisions/README.md).

## Deployment

Hosting estático en Vercel: `main` publica producción.

| Ambiente   | URL                                                        | Rama      | Deploy |
| ---------- | ---------------------------------------------------------- | --------- | ------ |
| Desarrollo | `http://localhost:8000`                                    | `develop` | Local  |
| Producción | [URL_PRODUCCION] <!-- pendiente: falta conectar Vercel --> | `main`    | Manual |

Procedimiento en [`docs/conventions/deploy.md`](docs/conventions/deploy.md).

## Documentación

El mapa completo —qué documento responde a cada pregunta— está en
**[`AGENTS.md`](AGENTS.md)**, que es también el contexto canónico para los agentes de
IA ([`CLAUDE.md`](CLAUDE.md) lo importa). Los atajos más usados:

- [`docs/architecture/stack.md`](docs/architecture/stack.md) — con qué se construye
- [`docs/product/roadmap.md`](docs/product/roadmap.md) — qué está hecho y qué viene
- [`docs/conventions/`](docs/conventions/README.md) — cómo se trabaja aquí
- [`docs/decisions/`](docs/decisions/README.md) — por qué se decidió cada cosa

## Contribución

Flujo de trabajo, branching y formato de commits en
[`CONTRIBUTING.md`](CONTRIBUTING.md). Reporte de vulnerabilidades en
[`SECURITY.md`](SECURITY.md).

## Versionado y licencia

[Semantic Versioning](https://semver.org/) y [Keep a Changelog](CHANGELOG.md).
Licencia [MIT](LICENSE).

---

⌨️ con ❤️ por [@brayandiazc](https://github.com/brayandiazc)
