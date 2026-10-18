---
id: interpolacion-polinomial
titulo: Interpolación polinomial
titulo_en: Polynomial interpolation
alias:
  - polinomio interpolante
  - interpolación de Lagrange
  - forma de Lagrange
modulo: 0
submodulo: '0.7'
orden: 7
nivel: intermedio
prerrequisitos:
  - sistemas-de-ecuaciones-lineales
  - funciones-reales-y-sus-graficas
etiquetas:
  - interpolación
  - polinomios
  - Lagrange
  - aproximación
resumen: >
  Por n puntos con abscisas distintas pasa un único polinomio de grado menor que n; la forma de Lagrange
  lo escribe como suma de los valores por polinomios base que valen 1 en un nodo y 0 en los demás.
formula: 'p(x) = \sum_{i=1}^{n} y_i\,\ell_i(x), \qquad \ell_i(x) = \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: interpolacion
    funcion: seno
    nodos: equiespaciados
    n: 3
referencias:
  - clave: hastie-esl
publicado: true
---

## Intuición

Una tabla de mareas da la altura del agua cada tres horas y se quiere saber cuál fue a las cuatro y media. Una solución es unir los puntos con una curva suave y leerla entre dos mediciones. La curva más simple que pasa exactamente por varios puntos es un polinomio: por dos puntos pasa una recta, por tres una parábola, y en general por $n$ puntos pasa un polinomio de grado $n - 1$, y solo uno.

Lagrange encontró una forma directa de escribirlo. Para cada punto se arma un polinomio que vale 1 en ese punto y 0 en todos los demás; multiplicado por la altura de ese punto, solo se nota ahí. Sumando estas piezas se obtiene un polinomio que pasa por todos los puntos a la vez. Si los datos vienen de una función suave, el polinomio la aproxima bien entre los nodos; pero, como se verá con el fenómeno de Runge, agregar nodos no siempre mejora la aproximación.

## Definición

:::teorema[Existencia y unicidad]
Dados $n$ puntos $(x_1, y_1), \dots, (x_n, y_n)$ con $x_i$ distintos, existe un único polinomio $p$ de grado menor o igual que $n - 1$ con $p(x_i) = y_i$ para todo $i$.
:::

:::definicion[Forma de Lagrange]
$$
p(x) = \sum_{i=1}^{n} y_i\,\ell_i(x), \qquad \ell_i(x) = \prod_{j \ne i} \frac{x - x_j}{x_i - x_j},
$$
donde cada $\ell_i$ cumple $\ell_i(x_i) = 1$ y $\ell_i(x_j) = 0$ para $j \ne i$.
:::

Si los $y_i = f(x_i)$ vienen de una función con $n$ derivadas continuas, el error en cada $x$ es
$$
f(x) - p(x) = \frac{f^{(n)}(\xi)}{n!}\prod_{i=1}^{n}(x - x_i)
$$
para algún $\xi$ en el intervalo que contiene a $x$ y a los nodos.

:::nota[Qué significa cada símbolo]
- $(x_i, y_i)$: puntos que se interpolan; $x_i$: nodos; $n$: número de puntos.
- $p$: polinomio interpolante, de grado a lo más $n - 1$.
- $\ell_i$: polinomio base de Lagrange asociado al nodo $i$.
- $f$: función de la que vienen los datos; $f^{(n)}$: su derivada de orden $n$.
- $\xi$: punto intermedio que da la fórmula del error.
:::

## Cómo usar la visualización

La curva azul es la función y la naranja el polinomio que pasa por los nodos marcados con círculos. La reproducción agrega un nodo por cuadro, hasta 20, y el encabezado escribe el grado del polinomio y el error máximo en todo el intervalo. El control elige nodos igualmente espaciados o de Chebyshev.

Con $\operatorname{sen} x$ en $[0, \pi]$ el error baja rápido: 0.056 con 3 nodos, $1.8 \times 10^{-3}$ con 5 y $2.6 \times 10^{-9}$ con 12. Con funciones menos suaves, como $|x|$ o la de Runge, el error deja de bajar o crece.

## Ejemplo

Se busca la parábola que pasa por $(0, 1)$, $(1, 3)$ y $(2, 2)$.

1. Polinomios base: $\ell_1(x) = \dfrac{(x - 1)(x - 2)}{2}$, $\ell_2(x) = \dfrac{x(x - 2)}{-1}$, $\ell_3(x) = \dfrac{x(x - 1)}{2}$.
2. $p(x) = 1 \cdot \ell_1(x) + 3 \cdot \ell_2(x) + 2 \cdot \ell_3(x)$.
3. Desarrollando: $p(x) = \tfrac{1}{2}(x^2 - 3x + 2) - 3(x^2 - 2x) + (x^2 - x) = -1.5x^2 + 3.5x + 1$.
4. Comprobación: $p(0) = 1$, $p(1) = -1.5 + 3.5 + 1 = 3$ y $p(2) = -6 + 7 + 1 = 2$.
5. Entre los datos: $p(0.5) = 2.375$ y $p(1.5) = 2.875$.

:::figura[Los tres puntos del ejemplo con su parábola $-1.5x^2 + 3.5x + 1$, en línea punteada, y el spline cúbico natural por los mismos puntos: con solo tres datos las dos curvas son parecidas.]{componente="NumericsLab"}
```yaml
modo: spline
puntos: [[0, 1], [1, 3], [2, 2]]
polinomio: true
```
:::

## Propiedades

- **Reproducción exacta:** si los datos vienen de un polinomio de grado menor que $n$, el interpolante es ese mismo polinomio.

:::figura[$x^3 - 2x + 1$ interpolado con 4 nodos: el polinomio de grado 3 coincide con la función y el error máximo es $9 \times 10^{-16}$, puro redondeo. Con 3 nodos el error sería 1.3.]{componente="NumericsLab"}
```yaml
modo: interpolacion
funcion: polinomio
nodos: equiespaciados
n: 4
```
:::

- **Linealidad:** el interpolante de $a f + b g$ es $a$ veces el de $f$ más $b$ veces el de $g$.
- **Forma de Newton:** el mismo polinomio se puede escribir con diferencias divididas, lo que permite agregar un nodo sin recalcular todo.
- **Forma baricéntrica:** reescribir la forma de Lagrange como cociente de dos sumas la hace estable y de costo $O(n)$ por evaluación.
- **Nodos de Chebyshev:** concentrar los nodos cerca de los extremos minimiza el producto $\prod(x - x_i)$ y controla el error.

## Errores comunes

- **Creer que más nodos siempre mejoran.** Con nodos igualmente espaciados en $|x|$, el error pasa de 0.11 con 12 nodos a 3.2 con 20.

:::figura[$|x|$ en $[-1, 1]$ con nodos igualmente espaciados: la esquina en 0 impide que el polinomio la siga, y al subir el grado aparecen oscilaciones cerca de los extremos que hacen crecer el error.]{componente="NumericsLab"}
```yaml
modo: interpolacion
funcion: valor-absoluto
nodos: equiespaciados
n: 12
```
:::

- **Resolver el sistema de Vandermonde para los coeficientes.** Ese sistema está muy mal condicionado con muchos nodos; las formas de Lagrange o de Newton evitan el problema.
- **Extrapolar con el polinomio.** Fuera del intervalo de los nodos el producto $\prod(x - x_i)$ crece muy rápido y el polinomio se separa de los datos.
- **Confundir interpolar con ajustar.** La interpolación pasa por todos los puntos; con datos ruidosos conviene un ajuste, como mínimos cuadrados, que no los obliga a coincidir.

## Conexiones

Encontrar los coeficientes es resolver uno de los [[sistemas-de-ecuaciones-lineales]], y el polinomio es un caso de las [[funciones-reales-y-sus-graficas]]. El [[fenomeno-de-runge]] muestra su límite con nodos igualmente espaciados, y los [[splines-cubicos]] lo resuelven usando polinomios por tramos. La [[regla-de-simpson]] integra el polinomio interpolante de grado 2, y la [[serie-de-taylor-y-de-maclaurin]] es una interpolación con todos los nodos en un mismo punto.

## Formulario

:::formula[Forma de Lagrange]
$$
p(x) = \sum_{i=1}^{n} y_i\,\ell_i(x)
$$

- $y_i$: valores; $\ell_i$: polinomios base.
:::

:::formula[Polinomios base]
$$
\ell_i(x) = \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}, \qquad \ell_i(x_j) = \begin{cases} 1 & j = i \\ 0 & j \ne i \end{cases}
$$

- $x_j$: nodos distintos.
:::

:::formula[Error de interpolación]
$$
f(x) - p(x) = \frac{f^{(n)}(\xi)}{n!}\prod_{i=1}^{n}(x - x_i)
$$

- $f^{(n)}$: derivada de orden $n$; $\xi$: punto intermedio.
:::

:::formula[Parábola del ejemplo]
$$
p(x) = -1.5x^2 + 3.5x + 1
$$

- Pasa por $(0, 1)$, $(1, 3)$ y $(2, 2)$.
:::
