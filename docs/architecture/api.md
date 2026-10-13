# Contrato de API

> La API de **Snake App**.
>
> **Última actualización**: 2026-10-13

## No hay API

La v1 es un sitio estático: el navegador descarga HTML, CSS y JavaScript, y no vuelve a
llamar a ningún servidor. Tampoco consume APIs de terceros.

El contrato que sí existe es interno, entre módulos del cliente, y vive en
[`architecture.md`](architecture.md): `game.js` expone el paso del juego y `render.js`
lo dibuja.

Si llega el ranking online (ver [`database.md`](database.md)), este documento se
rellena antes de escribir el primer endpoint.
