---
id: programacion-lineal
titulo: Programación lineal
titulo_en: Linear programming
alias:
  - programa lineal
  - optimización lineal
  - método gráfico
modulo: 0
submodulo: '0.6'
orden: 13
nivel: intermedio
prerrequisitos:
  - conjuntos-convexos
  - optimizacion-con-restricciones
etiquetas:
  - programación lineal
  - región factible
  - vértices
  - asignación de recursos
resumen: >
  Un programa lineal optimiza una función lineal sujeta a desigualdades lineales; su región factible es un
  polígono convexo y, si hay óptimo, alguno está en un vértice.
formula: '\max\ \mathbf{c}^\top \mathbf{x} \quad \text{sujeto a} \quad \mathbf{A}\mathbf{x} \le \mathbf{b},\ \mathbf{x} \ge \mathbf{0}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: lineal
    metodo: grafico
    c: [2, 3]
    a: [[1, 1], [1, 3], [2, 1]]
    b: [4, 7.5, 7]
referencias:
  - clave: boyd
    capitulo: '4.3'
publicado: true
---

## Intuición

Un taller produce mesas y sillas. Cada mueble consume horas de distintas máquinas, cada máquina tiene horas limitadas y cada mueble deja una ganancia. ¿Cuántos de cada uno conviene fabricar? Las ganancias y los consumos son proporcionales a las cantidades: esa linealidad es lo que define a la programación lineal, una de las herramientas más usadas para asignar recursos limitados.

Con dos productos el problema se dibuja. Cada restricción es una recta que deja un lado permitido; juntas forman un polígono, la región factible. La ganancia es constante a lo largo de rectas paralelas, y aumentar la ganancia equivale a desplazar esa recta en una dirección. El mejor plan es el último punto del polígono que toca la recta antes de salirse: siempre una esquina, o un lado completo si la recta es paralela a él. Por eso basta revisar los vértices, idea que el método simplex explota con miles de variables.

## Definición

:::definicion[Programa lineal]
En forma de desigualdades,
$$
\max_{\mathbf{x}}\ \mathbf{c}^\top \mathbf{x} \quad \text{sujeto a} \quad \mathbf{A}\mathbf{x} \le \mathbf{b},\quad \mathbf{x} \ge \mathbf{0}.
$$
La región factible $\{\mathbf{x} : \mathbf{A}\mathbf{x} \le \mathbf{b},\ \mathbf{x} \ge \mathbf{0}\}$ es un poliedro convexo; un **vértice** es un punto factible donde $n$ restricciones linealmente independientes son activas.
:::

:::teorema[Óptimo en un vértice]
Si un programa lineal tiene óptimo y su región factible tiene al menos un vértice, entonces algún vértice es óptimo.
:::

El problema puede ser **infactible**, si la región es vacía, o **no acotado**, si el objetivo crece sin límite dentro de la región. La **forma estándar** usa igualdades $\mathbf{A}\mathbf{x} + \mathbf{s} = \mathbf{b}$ con variables de holgura $\mathbf{s} \ge \mathbf{0}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}$: vector de cantidades que se deciden, no negativas.
- $\mathbf{c}$: vector de ganancias por unidad; $\mathbf{c}^\top \mathbf{x}$: objetivo.
- $\mathbf{A}$: matriz de consumos; $A_{ij}$ es lo que consume una unidad del producto $j$ del recurso $i$.
- $\mathbf{b}$: disponibilidad de cada recurso.
- $\mathbf{s}$: variables de holgura, el recurso que sobra.
- $n$: número de variables.
:::

## Cómo usar la visualización

El polígono azul es la región factible y la flecha naranja indica la dirección $\mathbf{c}$ en que crece el objetivo. La recta amarilla une los puntos con el mismo valor $z$ del objetivo; la reproducción la desplaza desde $z = 0$ hasta el óptimo. El encabezado escribe el programa y la recta actual con su valor; al final marca el vértice óptimo. El panel muestra también los precios sombra de cada restricción.

La recta recorre el polígono y lo abandona por un vértice: ahí está el óptimo. En el programa de la vista, $\max 2x + 3y$, la última esquina tocada es $(2.25, 1.75)$, con $z = 9.75$.

## Ejemplo

Un taller fabrica $x$ mesas y $y$ sillas por día, con ganancias de 3 y 5 miles de pesos. La máquina A, que solo usan las mesas, tiene 4 horas: $x \le 4$. La B, que solo usan las sillas a 2 horas cada una, tiene 12: $2y \le 12$. La C tiene 18 horas: $3x + 2y \le 18$.

1. Programa: $\max\ 3x + 5y$ sujeto a $x \le 4$, $2y \le 12$, $3x + 2y \le 18$, $x, y \ge 0$.
2. Vértices: $(0, 0)$, $(4, 0)$, $(4, 3)$, $(2, 6)$ y $(0, 6)$; por ejemplo, $(2, 6)$ resuelve $2y = 12$ y $3x + 2y = 18$.
3. Valores: $z(0, 0) = 0$, $z(4, 0) = 12$, $z(4, 3) = 27$, $z(2, 6) = 36$ y $z(0, 6) = 30$.
4. El óptimo es fabricar 2 mesas y 6 sillas, con ganancia de 36 mil pesos.
5. En el óptimo las máquinas B y C trabajan sus horas completas; a la máquina A le sobran 2 horas.

:::figura[El taller del ejemplo: la recta de ganancia 3x + 5y avanza en la dirección de la flecha y abandona la región por el vértice (2, 6), con ganancia 36.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: grafico
c: [3, 5]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Propiedades

- **Convexidad:** la región es convexa y el objetivo es lineal, así que todo óptimo local es global.
- **Óptimos múltiples:** si $\mathbf{c}$ es perpendicular a un lado del polígono que resulta óptimo, todos los puntos de ese lado son óptimos.
- **Número de vértices:** es finito, aunque puede ser enorme; por eso se necesitan métodos que no los revisen todos.
- **Sensibilidad:** el precio sombra de una restricción es cuánto mejora el óptimo por cada unidad adicional del recurso, mientras el vértice óptimo no cambie.
- **Dualidad:** cada programa lineal tiene un programa dual con el mismo valor óptimo.

:::figura[Óptimos múltiples: con ganancias 3x + 2y, la recta es paralela al lado 3x + 2y = 18, y todo el segmento entre (2, 6) y (4, 3) da la misma ganancia, 18.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: grafico
c: [3, 2]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Errores comunes

- **Buscar el óptimo en el interior.** Con objetivo lineal no constante, el óptimo nunca está en el interior: siempre se puede mejorar moviéndose en la dirección de $\mathbf{c}$.
- **Creer que el óptimo es el vértice más alejado del origen.** El óptimo depende de la dirección $\mathbf{c}$, no de la distancia.
- **Olvidar la no negatividad.** Sin $\mathbf{x} \ge \mathbf{0}$ la región puede cambiar por completo y el problema puede volverse no acotado.
- **Redondear la solución de un problema entero.** Si las cantidades deben ser enteras, redondear el óptimo continuo puede dar un punto infactible o lejos del mejor plan entero.

:::figura[Con ganancias x + 0.2y, el óptimo es el vértice (4, 3), con z = 4.6, aunque (2, 6) está más lejos del origen: lo que decide es la dirección de la flecha, no la distancia.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: grafico
c: [1, 0.2]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Conexiones

Es un caso de [[optimizacion-con-restricciones]] cuya región es uno de los [[conjuntos-convexos]] más simples, un poliedro, como en la [[optimizacion-convexa]]. Sus vértices son soluciones de [[sistemas-de-ecuaciones-lineales]]. Se resuelve con el [[metodo-simplex]] y su teoría de precios sombra viene de la [[dualidad-de-lagrange]]. La [[programacion-cuadratica]] la extiende a objetivos cuadráticos.

## Formulario

:::formula[Programa lineal en forma de desigualdades]
$$
\max_{\mathbf{x}}\ \mathbf{c}^\top \mathbf{x} \quad \text{s. a.} \quad \mathbf{A}\mathbf{x} \le \mathbf{b},\ \mathbf{x} \ge \mathbf{0}
$$

- $\mathbf{c}$: ganancias; $\mathbf{A}$: consumos; $\mathbf{b}$: recursos.
:::

:::formula[Forma estándar con holguras]
$$
\mathbf{A}\mathbf{x} + \mathbf{s} = \mathbf{b}, \qquad \mathbf{x} \ge \mathbf{0},\ \mathbf{s} \ge \mathbf{0}
$$

- $\mathbf{s}$: recurso sobrante en cada restricción.
:::

:::formula[Recta de nivel del objetivo]
$$
c_1 x + c_2 y = z
$$

- $z$: valor del objetivo; las rectas son paralelas y crecen en la dirección de $(c_1, c_2)$.
:::
