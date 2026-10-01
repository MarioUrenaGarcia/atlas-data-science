---
id: descenso-por-coordenadas
titulo: Descenso por coordenadas
titulo_en: Coordinate descent
alias:
  - optimización por coordenadas
  - descenso coordenado
modulo: 0
submodulo: '0.6'
orden: 11
nivel: intermedio
prerrequisitos:
  - descenso-de-gradiente
etiquetas:
  - descenso por coordenadas
  - optimización
  - lasso
  - una variable a la vez
resumen: >
  El descenso por coordenadas minimiza la función respecto a una variable a la vez, con las demás fijas, y
  recorre las variables por turnos; avanza rápido si las variables son poco dependientes entre sí.
formula: 'x_i^{(k+1)} = \arg\min_{t}\ f\big(x_1^{(k+1)}, \dots, x_{i-1}^{(k+1)},\ t,\ x_{i+1}^{(k)}, \dots, x_n^{(k)}\big)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: carrera
    funciones: [girada, cuadratica, rosenbrock]
    metodos: [coordenadas, gradiente-armijo]
    inicio: [2.5, 2]
referencias:
  - clave: hastie-esl
    capitulo: '3.8'
  - clave: boyd
publicado: true
---

## Intuición

Para ajustar el sonido de un ecualizador con muchas perillas, una estrategia sensata es mover una perilla hasta encontrar su mejor posición, dejarla ahí y pasar a la siguiente, y repetir la ronda. Cada ajuste es un problema de una sola variable, fácil de resolver, y no hace falta saber cómo interactúan todas las perillas a la vez.

El descenso por coordenadas hace eso con una función: en cada paso fija todas las variables menos una y minimiza respecto a esa. En el plano, el camino avanza en escalones horizontales y verticales. Si las variables casi no interactúan, unas pocas rondas bastan; si están muy relacionadas, como en un valle diagonal, cada escalón avanza poco. Es la base de los algoritmos más eficientes para la regresión lasso, donde el problema de una variable tiene solución explícita.

## Definición

:::definicion[Descenso por coordenadas]
Partiendo de $\mathbf{x}^{(0)}$, en la ronda $k$ se actualizan las coordenadas $i = 1, \dots, n$ en orden:
$$
x_i^{(k+1)} = \arg\min_{t \in \mathbb{R}}\ f\big(x_1^{(k+1)}, \dots, x_{i-1}^{(k+1)},\ t,\ x_{i+1}^{(k)}, \dots, x_n^{(k)}\big).
$$
Cada actualización usa los valores más recientes de las demás coordenadas.
:::

Para una cuadrática $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$, la minimización exacta en la coordenada $i$ es
$$
x_i \leftarrow \frac{b_i - \sum_{j \neq i} A_{ij} x_j}{A_{ii}},
$$
el método de Gauss-Seidel para resolver $\mathbf{A}\mathbf{x} = \mathbf{b}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}^{(k)}$: punto al empezar la ronda $k$; $x_i^{(k)}$: su coordenada $i$.
- $t$: valor de prueba de la coordenada que se optimiza.
- $\arg\min_t$: el valor de $t$ que hace mínima la función.
- $\mathbf{A}$, $\mathbf{b}$: matriz y vector de la cuadrática; $A_{ij}$: entrada de $\mathbf{A}$; $b_i$: entrada de $\mathbf{b}$.
- $n$: número de variables.
:::

## Cómo usar la visualización

Se comparan el descenso por coordenadas, que minimiza exactamente sobre $x$ y luego sobre $y$ por turnos, y el gradiente con búsqueda de Armijo. El encabezado da el punto de cada método; el panel compara los valores. El selector cambia la función y los controles mueven el punto inicial.

En la cuadrática con ejes alineados, $\tfrac{1}{2}(x^2 + 10y^2)$, el descenso por coordenadas llega en dos pasos: uno por variable. En la cuadrática girada avanza en escalera hacia el mínimo. En Rosenbrock, cuyo valle es curvo y diagonal, los escalones se vuelven diminutos.

## Ejemplo

Se minimiza $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$ desde $(-2, 1)$.

1. Minimización en $x$ con $y = 1$: $\partial f/\partial x = 3x + 2y - 1 = 0$ da $x = \dfrac{1 - 2}{3} = -0.3333$.
2. Minimización en $y$ con $x = -0.3333$: $\partial f/\partial y = 2x + 3y + 1 = 0$ da $y = \dfrac{-1 + 0.6667}{3} = -0.1111$.
3. Segunda ronda: $x = \dfrac{1 + 0.2222}{3} = 0.4074$ y $y = \dfrac{-1 - 0.8148}{3} = -0.6049$.
4. El error en $x$ pasa de 3 a $1.3333$ y luego a $0.5926$: se multiplica por $\tfrac{4}{9}$ en cada ronda, el cuadrado de la correlación $\tfrac{2}{3}$ entre las variables.
5. Tras 20 rondas el error es del orden de $3\,(4/9)^{20} \approx 3 \times 10^{-7}$.

:::figura[El descenso por coordenadas del ejemplo: escalones horizontales y verticales desde (-2, 1), por (-0.33, 1), (-0.33, -0.11) y (0.41, -0.11), que se acercan al mínimo (1, -1) reduciendo el error 4/9 por ronda.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [girada]
metodos: [coordenadas]
inicio: [-2, 1]
```
:::

## Propiedades

- **Variables separables:** si $f(\mathbf{x}) = \sum_i f_i(x_i)$, una sola ronda da el mínimo exacto.
- **Convergencia:** para $f$ convexa y diferenciable con mínimo único en cada coordenada, las rondas convergen al mínimo.
- **Problemas con penalización $\ell_1$:** para $f(\mathbf{x}) = g(\mathbf{x}) + \lambda\lVert \mathbf{x} \rVert_1$ con $g$ convexa y suave, el descenso por coordenadas converge, y cada paso es un umbral suave explícito.
- **Costo por paso:** solo se necesita la derivada parcial de una coordenada; si es barata de actualizar, una ronda cuesta lo mismo que un gradiente completo.
- **Variantes:** orden aleatorio de coordenadas, bloques de coordenadas o pasos aproximados en lugar de la minimización exacta.

:::figura[Caso de ejes alineados: en ½(x² + 10y²) las variables no interactúan, así que basta minimizar una vez en x y una vez en y para llegar al mínimo (0, 0).]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [cuadratica]
metodos: [coordenadas]
inicio: [3, 1.5]
```
:::

## Errores comunes

- **Esperar rapidez con variables muy relacionadas.** En un valle diagonal, cada paso por coordenada avanza poco; tras 200 pasos en Rosenbrock el método sigue lejos de $(1, 1)$.
- **Aplicarlo a funciones no suaves cualesquiera.** Con términos no diferenciables que mezclan variables, como $|x - y|$, el método puede atascarse en puntos que no son mínimos.
- **Actualizar todas las coordenadas con los valores viejos.** Eso es el método de Jacobi, distinto y más lento; el descenso por coordenadas usa siempre los valores recién actualizados.
- **Ignorar la escala.** Variables en escalas muy distintas cambian el número de rondas necesarias.

:::figura[En Rosenbrock, el valle curvo y diagonal obliga a escalones diminutos: tras 200 pasos el método está en (0.48, 0.23), con f = 0.27, lejos aún del mínimo (1, 1).]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [rosenbrock]
metodos: [coordenadas]
inicio: [-1.2, 1]
```
:::

## Conexiones

Es una variante del [[descenso-de-gradiente]] que usa una sola [[derivadas-parciales|derivada parcial]] a la vez. En cuadráticas equivale al método de Gauss-Seidel para [[sistemas-de-ecuaciones-lineales]]. Con penalización $\ell_1$ se combina con el umbral suave de los [[metodos-proximales-y-gradiente-proximal]] y es el algoritmo estándar de la regresión lasso. Su velocidad depende de la correlación entre variables, como el [[numero-de-condicion]].

## Formulario

:::formula[Actualización de una coordenada]
$$
x_i \leftarrow \arg\min_{t} f(x_1, \dots, x_{i-1}, t, x_{i+1}, \dots, x_n)
$$

- $x_i$: coordenada que se optimiza; las demás quedan fijas con sus valores más recientes.
:::

:::formula[Caso cuadrático (Gauss-Seidel)]
$$
x_i \leftarrow \frac{b_i - \sum_{j \neq i} A_{ij}x_j}{A_{ii}}
$$

- $\mathbf{A}$, $\mathbf{b}$: matriz y vector de $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$.
:::

:::formula[Factor por ronda en el ejemplo]
$$
\rho^2 = \left(\frac{A_{12}}{\sqrt{A_{11}A_{22}}}\right)^2 = \left(\frac{2}{3}\right)^2 = \frac{4}{9}
$$

- $\rho$: correlación entre las dos variables según la matriz $\mathbf{A}$.
:::
