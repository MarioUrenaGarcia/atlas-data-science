---
id: distribuciones-marginales
titulo: Distribuciones marginales
titulo_en: Marginal distributions
alias:
  - distribución marginal
  - marginalización
  - densidad marginal
modulo: 1
submodulo: '1.4'
orden: 2
nivel: intermedio
prerrequisitos:
  - distribucion-conjunta
relaciones:
  - tipo: relacionado
    id: ley-de-probabilidad-total
etiquetas:
  - marginal
  - sumar sobre la otra variable
  - integrar sobre la otra variable
  - tabla de doble entrada
resumen: >
  La distribución marginal de una variable se obtiene de la distribución conjunta sumando o
  integrando sobre los valores de la otra variable. Es la distribución de esa variable cuando se
  ignora a la otra.
formula: 'p_X(x) = \sum_y p(x, y), \qquad f_X(x) = \int_{-\infty}^{\infty} f(x, y)\,dy'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: marginales
    modelo: suma-xy
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.1'
  - clave: ross-probabilidad
    capitulo: '6.1'
publicado: true
---

## Intuición

Una tabla conjunta de días con lluvia y suspensiones de un partido responde preguntas sobre los dos a la vez. Si solo interesa la lluvia, basta sumar cada fila: la probabilidad de que llueva un día es la suma de las casillas de ese día, haya o no suspensión. El resultado se escribe tradicionalmente en el **margen** de la tabla, y de ahí el nombre: **distribución marginal**.

Marginalizar es olvidar una variable. Todo lo que dependía de ella se acumula: la probabilidad de cada valor de $X$ es la suma de las probabilidades de todos los pares que lo incluyen. Con densidades la suma se vuelve una integral, y la idea es la misma que la de la ley de probabilidad total aplicada a la partición que forman los valores de la otra variable.

## Definición

:::definicion[Distribuciones marginales]
Si $X$ y $Y$ tienen función de masa conjunta $p(x, y)$, las **funciones de masa marginales** son
$$
p_X(x) = \sum_y p(x, y), \qquad p_Y(y) = \sum_x p(x, y).
$$
Si tienen densidad conjunta $f(x, y)$, las **densidades marginales** son
$$
f_X(x) = \int_{-\infty}^{\infty} f(x, y)\,dy, \qquad f_Y(y) = \int_{-\infty}^{\infty} f(x, y)\,dx.
$$
:::

En términos de funciones de distribución, $F_X(x) = \lim_{y \to \infty} F_{X,Y}(x, y)$: se deja libre a $Y$.

:::figura[Las marginales del mayor y el menor de dos dados: la animación suma cada columna en la barra de arriba y cada fila en la barra de la derecha. El mayor se carga hacia el 6 y el menor hacia el 1.]{componente="JointDistribution2D"}
```yaml
modo: marginales
experimento: dos-dados
variable: maximo
segunda: minimo
```
:::

:::nota[Qué significa cada símbolo]
- $p(x, y)$, $f(x, y)$: masa o densidad conjunta.
- $p_X$, $p_Y$: funciones de masa marginales.
- $f_X$, $f_Y$: densidades marginales.
- $\sum_y$: suma sobre todos los valores de $Y$.
- $\int \cdots\,dy$: integral sobre todos los valores de $y$.
- $F_{X,Y}$, $F_X$: funciones de distribución conjunta y marginal.
- $L$, $S$: días con lluvia y suspensión del partido en el ejemplo.
:::

## Cómo usar la visualización

La gráfica muestra la densidad $f(x, y) = x + y$ sobre el cuadrado unitario: más oscuro donde $x$ y $y$ son grandes. La animación recorre primero las columnas: cada una se resalta, se integra en $y$ y se deposita como una barra de la marginal de $X$ arriba; luego hace lo mismo con las filas para la marginal de $Y$ a la derecha. El encabezado da el valor de cada integral.

Al terminar, las dos marginales son rectas crecientes, $f_X(x) = x + \tfrac{1}{2}$: los valores grandes de cada variable son más probables, aunque la marginal no dice nada de cómo se combinan.

## Ejemplo

Con la tabla de días con lluvia $L$ y suspensión $S$:

| | $S = 0$ | $S = 1$ | $p_L$ |
| --- | --- | --- | --- |
| $L = 0$ | 0.30 | 0.10 | 0.40 |
| $L = 1$ | 0.20 | 0.20 | 0.40 |
| $L = 2$ | 0.05 | 0.15 | 0.20 |
| $p_S$ | 0.55 | 0.45 | 1 |

1. Marginal de $L$: sumas por fila, $0.40$, $0.40$, $0.20$.
2. Marginal de $S$: sumas por columna, $0.55$ y $0.45$.
3. $\mathbb{E}[L] = 0 \cdot 0.4 + 1 \cdot 0.4 + 2 \cdot 0.2 = 0.8$ días; para la media de una sola variable basta su marginal.

:::figura[La tabla del ejemplo: las casillas de cada valor de $L$ se suman en la barra de arriba (0.4, 0.4 y 0.2) y las de cada valor de $S$ en la de la derecha (0.55 y 0.45).]{componente="JointDistribution2D"}
```yaml
modo: marginales
valoresX: [0, 1, 2]
valoresY: [0, 1]
probabilidades:
  - [0.30, 0.10]
  - [0.20, 0.20]
  - [0.05, 0.15]
nombreX: días con lluvia
nombreY: suspensión del partido
simboloX: L
simboloY: S
```
:::

## Propiedades

- **Son distribuciones:** cada marginal es una función de masa o una densidad válida, porque la suma o integral doble total es 1.
- **Momentos individuales:** $\mathbb{E}[X]$, $\operatorname{Var}(X)$ y cualquier $\mathbb{E}[g(X)]$ dependen solo de la marginal de $X$.
- **Normal bivariada:** sus marginales son normales con las medias y varianzas de cada coordenada, sea cual sea la correlación.
- **Independencia:** si $X$ y $Y$ son independientes, la conjunta es el producto de las marginales, y entonces las marginales sí determinan la conjunta.

:::figura[La normal bivariada con correlación 0.8: las marginales de los bordes son campanas normales estándar, iguales a las que tendría con correlación 0. La correlación solo se ve en la inclinación de la nube.]{componente="JointDistribution2D"}
```yaml
modo: marginales
modelo: normal-bivariada
parametros:
  rho: 0.8
```
:::

## Errores comunes

- **Reconstruir la conjunta multiplicando marginales.** Solo es válido con independencia; en general, muchas conjuntas distintas tienen las mismas marginales.
- **Integrar sobre la variable equivocada.** Para $f_X$ se integra en $y$, con $x$ fija; los límites de integración dependen de $x$ cuando el soporte no es un rectángulo.
- **Olvidar el soporte.** Para la densidad uniforme sobre el triángulo $0 < x < y < 1$, $f_X(x) = \int_x^1 2\,dy = 2(1 - x)$, no $\int_0^1 2\,dy = 2$.

:::figura[Las mismas marginales que las de dos monedas independientes, 0.5 y 0.5 en cada borde, salen de una tabla donde las monedas siempre coinciden.]{componente="JointDistribution2D"}
```yaml
modo: marginales
valoresX: [0, 1]
valoresY: [0, 1]
probabilidades:
  - [0.5, 0]
  - [0, 0.5]
nombreX: la primera moneda
nombreY: la segunda moneda
```
:::

## Conexiones

Las marginales se obtienen de la [[distribucion-conjunta]] y son el caso de variables aleatorias de la [[ley-de-probabilidad-total]]. Dividiendo la conjunta entre una marginal se obtiene la [[distribucion-condicional]], y la [[independencia-de-variables-aleatorias]] se define comparando la conjunta con el producto de las marginales. Las cópulas describen todo lo que hay en la conjunta además de sus marginales. Una marginal es la [[funcion-de-masa-de-probabilidad]] o la [[funcion-de-densidad-de-probabilidad]] de una sola variable.

## Formulario

:::formula[Marginal discreta]
$$
p_X(x) = \sum_y p(x, y)
$$

- Se suma la fila de $x$ en la tabla conjunta.
:::

:::formula[Marginal continua]
$$
f_X(x) = \int_{-\infty}^{\infty} f(x, y)\,dy
$$

- Se integra la densidad conjunta en la otra variable.
:::

:::formula[Marginal desde la función de distribución]
$$
F_X(x) = \lim_{y \to \infty} F_{X,Y}(x, y)
$$

- Se deja libre a $Y$.
:::
