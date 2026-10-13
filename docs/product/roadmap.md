# Roadmap — Snake App

> Estado y dirección del producto. Documento vivo.
> **Última actualización**: 2026-10-13

## Leyenda

- ✅ Hecho
- 🚧 En curso
- 📋 Planificado
- ⏸️ Diferido

## Visión

Un Snake de navegador que se sienta exactamente como el del móvil de pantalla verde:
abrir, jugar, batir tu récord. Nada más, y nada menos.

## Estado actual

Documentación instanciada; aún no hay código del juego.

## Por versión / fase

Cada ítem se marca cuando la spec que lo implementa se fusiona — no antes. Anota
entre paréntesis la spec responsable en cuanto exista, para que el ítem y su
contrato queden atados:

### v0.1 — Réplica fiel de la referencia

- [ ] 📋 Tablero LCD: fondo verde, borde y cuadrícula de píxeles negros.
- [ ] 📋 Serpiente que se mueve, crece al comer y muere al chocar.
- [ ] 📋 Comida en forma de rombo en una celda libre al azar.
- [ ] 📋 Barra inferior con Score, Speed y Record.
- [ ] 📋 Récord guardado en el navegador.
- [ ] 📋 Controles con teclado (flechas, pausa) y con gestos táctiles.
- [ ] 📋 Textos en español e inglés.
- [ ] 📋 Metadatos SEO y Open Graph de la página.

Reglas de juego decididas (2026-10-13), que la referencia no muestra:

- **El borde no mata**: la serpiente sale por un lado y aparece por el opuesto. Solo
  pierde al chocar consigo misma.
- **Cada comida vale 1 punto**, sin importar la velocidad.
- **La velocidad sube sola**: Speed arranca en 1 y sube 1 cada 5 comidas, hasta 9. El
  ritmo exacto se ajusta jugando, en la spec.

## Backlog / ideas sin agendar

- Laberintos como niveles.
- Jugar sin conexión e instalarlo (PWA).
- Ranking online (exige backend; ver `docs/architecture/database.md`).

## Fuera de alcance

| Qué               | Por qué quedó fuera                                    | Qué lo reabriría                    |
| ----------------- | ------------------------------------------------------ | ----------------------------------- |
| Cuentas y ranking | Exigen backend, base de datos y defensa contra trampas | Que la v1 tenga uso real y lo pidan |
| Menú del móvil    | La v1 replica la pantalla de juego, no el menú         | Que la v1 esté terminada            |

## Cómo se actualiza este documento

Este archivo **no se revisa solo al cerrar una versión**: se mueve con cada spec.

- **Al abrir una spec**: su `proposal.md` declara el campo _Ítem de roadmap_ —
  la versión y el ítem que viene a completar. Si el ítem no existe, se crea aquí
  primero — y si no encaja en ninguna versión, la pregunta es si entra en esta o qué
  sale a cambio, no si se cuela sin decidirlo.
- **Al cerrar la spec**: el mismo PR que implementa el cambio marca el ítem como
  hecho aquí y actualiza el `CHANGELOG.md`. Los tres viajan juntos — ver
  [`../conventions/workflow.md`](../conventions/workflow.md).
- **Al cerrar la versión**: se revisa el conjunto (qué quedó 📋, qué se difiere ⏸️)
  antes de cortar el release con `/release`.
- Las decisiones que cambian el rumbo se registran como ADRs en [`../decisions/`](../decisions/README.md).
