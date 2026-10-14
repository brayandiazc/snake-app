# Modelo de Datos

> Qué datos guarda **Snake App** y dónde.
>
> **Última actualización**: 2026-10-13

## No hay base de datos

La v1 no tiene backend. La partida vive en memoria y desaparece al cerrar la pestaña;
lo único que persiste son dos claves en `localStorage` del navegador.

| Clave              | Tipo                   | Qué guarda                            | Si falta o está corrupta |
| ------------------ | ---------------------- | ------------------------------------- | ------------------------ |
| `snake-app:record` | entero ≥ 0, como texto | La mejor puntuación en este navegador | Se trata como `0`        |
| `snake-app:locale` | `"es"` \| `"en"`       | El idioma elegido                     | Idioma del navegador     |

## Reglas

- **Todo acceso a `localStorage` va envuelto en `try/catch`.** En modo privado o con el
  almacenamiento bloqueado, leer o escribir lanza una excepción, y eso no puede tumbar el
  juego: se juega igual, solo que el récord no sobrevive a la recarga.
- **El récord es por navegador, no por persona.** Otro dispositivo u otro navegador
  empiezan en cero. Es una limitación conocida, no un bug.
- **Las claves llevan el prefijo `snake-app:`** para no chocar con otros sitios del mismo
  origen (pasa en `localhost`).

## Si llega un ranking online

Compartir puntuaciones entre jugadores exige backend, base de datos y una defensa contra
puntuaciones falsas — en un juego de cliente, cualquiera puede enviar el número que
quiera. Ese cambio reescribe este documento y necesita su propio ADR.
