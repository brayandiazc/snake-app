# Autenticación y Autorización

> Cómo se autentican los usuarios en **Snake App**.
>
> **Última actualización**: 2026-10-13

## No hay autenticación

La v1 no tiene cuentas: cualquiera que abra la página juega. No hay datos personales,
ni sesiones, ni nada que proteger en un servidor, porque no hay servidor.

| Actor   | ¿Tiene cuenta? | Credencial | Qué puede ver y hacer                           |
| ------- | -------------- | ---------- | ----------------------------------------------- |
| Jugador | No             | Ninguna    | Jugar y ver su récord, guardado en su navegador |

## Si algún día hay cuentas

Llegarían con el ranking online (ver [`database.md`](database.md)). Las reglas que
aplicarían desde el primer día:

- La autorización se valida **siempre en el servidor**. Nunca confiar en el cliente.
- Las contraseñas, si las hay, se guardan hasheadas con un algoritmo robusto y salt.
- Pedir un email o un alias para el ranking ya es recolectar datos personales: exige
  consentimiento en ese punto y una política de privacidad.
