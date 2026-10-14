# Mapa de pantallas — Snake App

> Qué pantallas tiene el producto, para qué sirve cada una y **por dónde va**. Es la
> salida del paso "Mapear" del sprint de definición
> ([`../conventions/workflow.md`](../conventions/workflow.md)) y el tablero de avance de
> la UI: se actualiza cada vez que una vista cambia de estado.
>
> Aquí **no** se decide cómo se ve (eso es [`design/`](../../design/README.md)) ni cómo
> se organiza el código de las vistas (eso es
> [`../conventions/ui.md`](../conventions/ui.md)). Las decisiones de diseño de un cambio
> concreto van en el `design.md` de su spec; las duraderas, en un
> [ADR](../decisions/README.md).
>
> **Última actualización**: 2026-10-13

## Estados

| Estado        | Significa                                                       |
| ------------- | --------------------------------------------------------------- |
| **mapa**      | Existe la decisión de que haga falta. Nada construido.          |
| **prototipo** | Maquetada en estático con `/prototipo`, navegable y criticable. |
| **conectada** | Con datos reales, sus cuatro estados y revisada en ambos temas. |

Una vista no pasa a **conectada** sin loading, empty, error y éxito — ver
[`../conventions/ui.md`](../conventions/ui.md).

## Pantallas

Una sola ruta. Lo que cambia no es la pantalla, sino el estado del juego dentro de ella:
la barra de marcador (Score · Speed · Record) está siempre visible. Los cuatro estados
de datos de `ui.md` (carga, vacío, error, éxito) no aplican: no hay datos que cargar, y
si el almacenamiento falla el juego sigue sin récord persistente.

| Vista             | Ruta | Propósito                                                                                   | Estado    |
| ----------------- | ---- | ------------------------------------------------------------------------------------------- | --------- |
| Menú de inicio    | `/`  | Elegir laberinto y jugadores (en escritorio) y empezar; el laberinto elegido se ve de fondo | conectada |
| Juego — en espera | `/`  | Tablero vacío con la serpiente inicial y «pulsa una tecla para empezar»                     | conectada |
| Juego — jugando   | `/`  | La partida: serpiente, comida y marcador en vivo                                            | conectada |
| Juego — en pausa  | `/`  | Tablero congelado y aviso de pausa                                                          | conectada |
| Juego — fin       | `/`  | Puntuación final o ganador (J1, J2 o empate), aviso de récord nuevo y cómo volver a jugar   | conectada |

## Mapa de navegación

```mermaid
flowchart LR
    Entrada([Abre la página]) --> Menu[Menú de inicio]
    Menu -- Jugar --> Espera[En espera]
    Fin -- Esc / Menú --> Menu
    Pausa -- Esc --> Menu
    Espera -- flecha o tecla --> Jugando[Jugando]
    Jugando -- Espacio / P --> Pausa[En pausa]
    Pausa -- Espacio / P --> Jugando
    Jugando -- choca consigo misma --> Fin[Fin de partida]
    Fin -- Enter / toque --> Espera
```

## Recorrido crítico

El camino que la v1 debe hacer impecable, en orden:

Menú → En espera → Jugando → Fin de partida → En espera (con el récord del laberinto
actualizado)

## Pantallas que no van a existir

| Vista descartada     | Por qué                                                    | ¿Qué señal la haría entrar?          |
| -------------------- | ---------------------------------------------------------- | ------------------------------------ |
| Registro / login     | No hay cuentas en la v1                                    | Que se pida un ranking online        |
| Ranking global       | Exige backend y defensa contra puntuaciones falsas         | Que haya gente jugando y pidiéndolo  |
| Privacidad / cookies | No se recogen datos personales ni hay cookies ni analítica | Añadir analítica, anuncios o cuentas |
