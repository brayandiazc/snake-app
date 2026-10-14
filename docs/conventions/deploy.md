# Convenciones de despliegue

> Cómo se publica Snake App y cómo se vuelve atrás.
> **Última actualización**: 2026-10-13

> El stack lo registra [`../architecture/stack.md`](../architecture/stack.md). Aquí van
> solo las **reglas**.

## Qué se despliega

Archivos estáticos: `index.html`, `css/`, `js/` y los recursos de `assets/`. No hay
build, ni servidor de aplicación, ni base de datos. Cualquier hosting estático sirve.

## Ambientes

| Ambiente   | URL                             | Rama      | Deploy     |
| ---------- | ------------------------------- | --------- | ---------- |
| Desarrollo | `http://localhost:8000`         | `develop` | Local      |
| Producción | https://snake-app-mu.vercel.app | `main`    | Automático |

## Reglas

- Solo se publica a producción desde `main`, y todo merge a `main` publica versión.
- **Lo que se sube es exactamente lo que hay en el commit.** Sin pasos manuales entre
  el repositorio y el hosting: si algo hay que retocar al publicar, va al repositorio.
- Nada de `tests/`, `docs/`, `specs/` ni archivos de herramientas en lo publicado: solo
  lo que el navegador necesita.
- Tras publicar, se abre la URL de producción y se juega una partida completa. Es el
  health check de un sitio estático.

## Procedimiento de deploy

**Vercel**, conectado al repositorio de GitHub: `main` publica producción y cada PR
tiene su vista previa. Al ser un sitio estático sin build, el proyecto se configura sin
comando de build y con la raíz del repositorio como directorio de salida.

Conectado el 2026-10-13. Configuración que debe tener el proyecto en Vercel:

- **Framework**: Other, sin comando de build; la raíz del repositorio es la salida.
- **Production Branch**: `main`. Vercel propone la rama por defecto del repositorio,
  que aquí es `develop`; dejarla así publicaría trabajo sin release.
- **Lo que no se publica**: lo excluye [`.vercelignore`](../../.vercelignore).

**La URL de producción aparece en cuatro sitios.** Si cambia (un dominio propio), se
cambian juntos: `index.html` (`canonical`, `og:url`, `og:image`), `sitemap.xml`,
`robots.txt` y la tabla de ambientes de arriba (y la del README).

## Rollback

Volver a publicar los archivos del tag anterior:

```bash
git checkout vX.Y.Z   # el último release bueno
# y repetir el procedimiento de deploy desde ese árbol
```

## Respaldos

No hay datos de servidor que respaldar: el código está en git y el récord de cada
jugador vive en su navegador.

## Monitoreo

Ninguno en la v1: no hay analítica ni registro de errores, y añadirlos implicaría
recoger datos de quien juega (ver [`../architecture/auth.md`](../architecture/auth.md)).
