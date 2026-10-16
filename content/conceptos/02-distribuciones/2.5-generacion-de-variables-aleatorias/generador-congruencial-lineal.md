---
id: generador-congruencial-lineal
titulo: Generador congruencial lineal
titulo_en: Linear congruential generator
alias:
  - LCG
  - generador congruencial
  - generador de Lehmer
modulo: 2
submodulo: '2.5'
orden: 2
nivel: intermedio
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
relaciones:
  - tipo: contrasta
    id: mersenne-twister
etiquetas:
  - aritmética modular
  - periodo
  - Hull-Dobell
  - red de Marsaglia
  - RANDU
resumen: >
  Generador que produce cada estado con la regla x(n+1) = (a x(n) + c) mod m. Es simple y rápido; su
  periodo y su calidad dependen de la elección de a, c y m.
formula: 'x_{n+1} = (a\,x_n + c) \bmod m, \qquad u_n = \frac{x_n}{m}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: ciclo
    valores:
      m: 16
      a: 5
      c: 3
      x0: 7
    casos:
      - nombre: 'Periodo completo'
        descripcion: 'a = 5, c = 3, m = 16: se cumplen las condiciones de Hull y Dobell y el ciclo visita los 16 estados antes de repetirse.'
        valores: {m: 16, a: 5, c: 3, x0: 7}
      - nombre: 'Sin incremento'
        descripcion: 'c = 0: el generador multiplicativo nunca llega al cero y con m = 16 su ciclo desde 7 solo tiene 4 estados.'
        valores: {m: 16, a: 5, c: 0, x0: 7}
      - nombre: 'Multiplicador malo'
        descripcion: 'a = 6: tras tres pasos queda atrapado en el estado 9 para siempre; el periodo es 1.'
        valores: {m: 16, a: 6, c: 3, x0: 7}
referencias:
  - clave: ross-procesos
publicado: true
---

## Intuición

El generador congruencial lineal es la receta más antigua y simple para producir números que parecen aleatorios: se multiplica el número actual por una constante, se le suma otra y se queda con el residuo de dividir entre un módulo. Como el residuo siempre está entre cero y el módulo, la sucesión vive en un conjunto finito de estados y, tarde o temprano, vuelve a un estado ya visitado; desde ahí se repite para siempre.

Se puede imaginar como una caminata sobre una rueda con $m$ casillas: cada paso salta a la casilla que indica la fórmula. Con constantes bien elegidas, la caminata pasa por todas las casillas antes de repetirse, y el periodo es el máximo posible. Con constantes mal elegidas, la caminata se encierra en un ciclo corto o incluso en una sola casilla.

Además del periodo, importa la estructura: los vectores de valores consecutivos de un congruencial caen sobre un número limitado de planos paralelos. Con módulos pequeños o multiplicadores desafortunados, como el del famoso RANDU, esos planos son pocos y muy visibles, y pueden sesgar simulaciones en varias dimensiones.

## Definición

:::definicion[Generador congruencial lineal]
Dados un módulo $m > 0$, un multiplicador $0 < a < m$, un incremento $0 \le c < m$ y una semilla $0 \le x_0 < m$, el **generador congruencial lineal** produce
$$
x_{n+1} = (a\,x_n + c) \bmod m, \qquad u_n = \frac{x_n}{m} \in [0, 1).
$$
Con $c = 0$ se llama **multiplicativo** (de Lehmer).
:::

:::teorema[Hull y Dobell]
Con $c \ne 0$, el generador tiene periodo completo $m$ para toda semilla si y solo si: $c$ y $m$ no tienen factores primos comunes; $a - 1$ es divisible entre todo primo que divide a $m$; y $a - 1$ es divisible entre 4 si $m$ lo es.
:::

:::nota[Qué es X]
$x_n$ = el estado del generador en el paso $n$, un entero entre 0 y $m - 1$; $u_n = x_n/m$ es el número que se usa como uniforme.
:::

:::nota[Qué hace cada parámetro]
- **$m$, módulo:** el número de estados posibles. Si aumenta, el periodo máximo crece y los valores se vuelven más finos.
- **$a$, multiplicador:** cuánto se estira el estado en cada paso. Si se elige mal, el ciclo se acorta o cae en un punto fijo.
- **$c$, incremento:** un desplazamiento constante. Si vale cero, el generador nunca alcanza el estado cero ni el periodo completo.
- **$x_0$, semilla:** el estado inicial. Con periodo completo solo cambia el punto de entrada al ciclo.
:::

:::nota[Qué significa cada símbolo]
- $x_n$: estado entero; $u_n$: salida en $[0, 1)$.
- $m$: módulo; $a$: multiplicador; $c$: incremento; $x_0$: semilla.
- $\bmod$: residuo de la división entera.
:::

## Cómo usar la visualización

Los $m$ estados aparecen en un círculo; cada paso de la reproducción traza una cuerda del estado actual al siguiente, y la lista de arriba registra el recorrido. Los estados ya visitados se rellenan y los que el ciclo nunca toca quedan en gris. El panel da el periodo, si se cumplen las condiciones de Hull y Dobell, el estado actual y su uniforme. Los casos cargan un periodo completo, un generador sin incremento y un multiplicador malo.

Reproduce el periodo completo y observa que visita los 16 estados. Pon $c = 0$ y observa el ciclo corto. Prueba $a = 9$ con $c = 3$: también cumple las condiciones y recorre todos los estados en otro orden.

## Ejemplo

Con $x_{n+1} = (5x_n + 3) \bmod 16$ y $x_0 = 7$:

1. $5 \cdot 7 + 3 = 38$, y $38 \bmod 16 = 6$; luego $5 \cdot 6 + 3 = 33 \to 1$; luego $8$, $11$, $10$, $5$, ...
2. La sucesión completa es 6, 1, 8, 11, 10, 5, 12, 15, 14, 9, 0, 3, 2, 13, 4, 7 y vuelve a 6: periodo 16.
3. Hull y Dobell: $c = 3$ y $m = 16$ no comparten factores; el único primo de 16 es 2 y $a - 1 = 4$ es divisible entre 2; como 16 es múltiplo de 4, también $a - 1 = 4$ lo es. Se cumplen las tres condiciones.
4. Con $a = 6$: $6 \cdot 7 + 3 = 45 \to 13$, $6 \cdot 13 + 3 = 81 \to 1$, $6 + 3 = 9$, $6 \cdot 9 + 3 = 57 \to 9$: queda fijo en 9.
5. Con $c = 0$ y $a = 5$: $7 \to 3 \to 15 \to 11 \to 7$, un ciclo de 4 estados.

:::figura[Periodo completo: la caminata sobre los 16 estados del círculo los visita todos antes de volver a 7.]{componente="RandomLab"}
```yaml
modo: ciclo
valores:
  m: 16
  a: 5
  c: 3
  x0: 7
```
:::

## Propiedades

- **Periodo máximo:** con $c \ne 0$ es $m$; con $c = 0$ es a lo más $m - 1$, y se alcanza solo si $m$ es primo y $a$ es una raíz primitiva módulo $m$.
- **Estructura en red:** los puntos $(u_n, \dots, u_{n+k-1})$ caen en a lo más $(k!\,m)^{1/k}$ hiperplanos paralelos (teorema de Marsaglia).
- **Bits bajos:** con $m = 2^{b}$, el bit menos significativo alterna con periodo 2 y los bits bajos son poco aleatorios.
- **RANDU:** $x_{n+1} = 65539\,x_n \bmod 2^{31}$ cumple $u_{n+2} = 6u_{n+1} - 9u_n \pmod 1$, de modo que sus ternas caen en solo 15 planos.
- **Salto adelante:** $x_{n+k} = \big(a^{k}x_n + c\frac{a^{k} - 1}{a - 1}\big) \bmod m$ permite avanzar $k$ pasos de golpe, útil para dividir la sucesión entre procesadores.

:::figura[Casos con contexto (periodo completo, sin incremento, multiplicador malo): cada botón carga a, c, m y la semilla, y una frase explica qué pasa con el ciclo.]{componente="RandomLab"}
```yaml
modo: ciclo
valores:
  m: 16
  a: 5
  c: 0
  x0: 7
casos:
  - nombre: 'Periodo completo'
    descripcion: '16 estados visitados.'
    valores: {m: 16, a: 5, c: 3, x0: 7}
  - nombre: 'Sin incremento'
    descripcion: 'Ciclo de 4 estados.'
    valores: {m: 16, a: 5, c: 0, x0: 7}
  - nombre: 'Multiplicador malo'
    descripcion: 'Punto fijo en 9.'
    valores: {m: 16, a: 6, c: 3, x0: 7}
```
:::

:::figura[Red en dos dimensiones: con m = 256 los pares consecutivos del congruencial forman líneas paralelas.]{componente="RandomLab"}
```yaml
modo: pares
generador: lcg-pequeno
valores:
  n: 256
  semilla: 3
```
:::

:::figura[Planos de RANDU: en la rebanada de ternas con el valor del medio cerca de 0.5, los puntos (uₙ, uₙ₊₂) caen sobre unas pocas líneas.]{componente="RandomLab"}
```yaml
modo: pares
generador: randu
ternas: true
valores:
  n: 600
  semilla: 1
```
:::

## Errores comunes

- **Elegir el multiplicador al tanteo.** Un $a$ que no cumple las condiciones acorta el periodo o produce puntos fijos.
- **Usar los bits bajos.** Con módulo potencia de 2, tomar el residuo entre un número pequeño, como `x % 2`, da una sucesión que alterna.
- **Confiar en un periodo largo.** RANDU tiene periodo $2^{29}$ y aun así sus ternas son pésimas; el periodo no basta.
- **Usar módulos pequeños para simulaciones grandes.** Con $m = 2^{31}$ el ciclo se agota en segundos en una computadora moderna.

:::figura[El periodo no basta: RANDU tiene un periodo de más de 500 millones, pero sus pares consecutivos parecen buenos y sus ternas no; compara activando la rebanada.]{componente="RandomLab"}
```yaml
modo: pares
generador: randu
valores:
  n: 1000
  semilla: 1
```
:::

## Conexiones

Es el ejemplo clásico de [[generadores-de-numeros-pseudoaleatorios]]. Su estructura en planos se detecta con [[pruebas-de-aleatoriedad]] en varias dimensiones y es una de las razones por las que se desarrolló el [[mersenne-twister]]. Su determinismo es la base de las [[semillas-y-reproducibilidad|semillas]]. Las [[secuencias-de-baja-discrepancia-cuasi-monte-carlo]] usan estructuras regulares a propósito, pero para integrar, no para imitar el azar. El [[mapa-de-relaciones-entre-distribuciones]] muestra cómo, a partir de uniformes, se construyen otras distribuciones.

## Formulario

:::formula[Recurrencia]
$$
x_{n+1} = (a\,x_n + c) \bmod m, \qquad u_n = \frac{x_n}{m}
$$

- $a$: multiplicador; $c$: incremento; $m$: módulo; $x_n$: estado; $u_n$: salida.
:::

:::formula[Hull y Dobell]
$$
\gcd(c, m) = 1, \qquad p \mid m \Rightarrow p \mid a - 1, \qquad 4 \mid m \Rightarrow 4 \mid a - 1
$$

- $\gcd$: máximo común divisor; $p$: primo; $\mid$: divide a.
:::

:::formula[Salto de k pasos]
$$
x_{n+k} = \left(a^{k}x_n + c\,\frac{a^{k} - 1}{a - 1}\right) \bmod m
$$

- $k$: número de pasos que se avanzan.
:::

:::formula[Relación de RANDU]
$$
u_{n+2} \equiv 6u_{n+1} - 9u_n \pmod 1
$$

- Las ternas $(u_n, u_{n+1}, u_{n+2})$ caen en 15 planos.
:::
