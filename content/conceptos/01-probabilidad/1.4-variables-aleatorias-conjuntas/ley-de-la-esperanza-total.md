---
id: ley-de-la-esperanza-total
titulo: Ley de la esperanza total
titulo_en: Law of total expectation
alias:
  - ley de las esperanzas iteradas
  - propiedad de la torre
  - teorema de la doble esperanza
modulo: 1
submodulo: '1.4'
orden: 10
nivel: intermedio
prerrequisitos:
  - esperanza-condicional
relaciones:
  - tipo: relacionado
    id: ley-de-probabilidad-total
  - tipo: relacionado
    id: media-ponderada
etiquetas:
  - esperanzas iteradas
  - promedio de promedios
  - dividir en casos
  - ponderación
resumen: >
  La media de una variable es el promedio ponderado de sus medias condicionales: se divide el
  problema en casos según otra variable, se calcula la media en cada caso y se promedian con las
  probabilidades de los casos.
formula: '\mathbb{E}[Y] = \mathbb{E}\big[\mathbb{E}[Y \mid X]\big] = \sum_x P(X = x)\, \mathbb{E}[Y \mid X = x]'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: esperanza-total
    experimento: dos-dados
    variable: maximo
    segunda: suma
referencias:
  - clave: blitzstein-hwang
    capitulo: '9.3'
  - clave: ross-probabilidad
    capitulo: '7.5'
publicado: true
---

## Intuición

Para conocer el gasto médico promedio de los asegurados de una compañía se puede dividir a la población en grupos de edad, calcular el promedio de cada grupo y combinarlos. Pero no con un promedio simple: un grupo que es la mitad de la población debe pesar la mitad. La **ley de la esperanza total** dice exactamente eso: la media de $Y$ es el promedio de las medias condicionales $\mathbb{E}[Y \mid X = x]$, ponderado por las probabilidades $P(X = x)$.

Es la versión para medias de la ley de probabilidad total, y una de las herramientas más usadas para calcular esperanzas difíciles: se elige una variable $X$ que, una vez conocida, vuelva fácil el cálculo, y luego se promedia sobre ella.

## Definición

:::teorema[Ley de la esperanza total]
Si $\mathbb{E}|Y| < \infty$, entonces
$$
\mathbb{E}[Y] = \mathbb{E}\big[\mathbb{E}[Y \mid X]\big].
$$
Si $X$ es discreta, $\mathbb{E}[Y] = \sum_x P(X = x)\, \mathbb{E}[Y \mid X = x]$; si tiene densidad, $\mathbb{E}[Y] = \int \mathbb{E}[Y \mid X = x]\, f_X(x)\,dx$.
:::

La prueba en el caso discreto reordena la doble suma $\sum_x \sum_y y\, p(x, y)$ agrupando por $x$: cada grupo es $p_X(x)\,\mathbb{E}[Y \mid X = x]$.

:::figura[En el triángulo $0 < x < y < 1$ la media condicional es $(1 + x)/2$ y $X$ tiene media 1/3; promediando los puntos con sus pesos se obtiene $\mathbb{E}[Y] = (1 + 1/3)/2 = 2/3$.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-total
modelo: uniforme-triangulo
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable que define los casos; $Y$: variable cuya media se busca.
- $\mathbb{E}[Y \mid X = x]$: media de $Y$ en el caso $X = x$.
- $\mathbb{E}[Y \mid X]$: esa media como variable aleatoria.
- $P(X = x)$, $f_X(x)$: peso de cada caso.
- $N$: número de sumandos de una suma aleatoria; $Y_i$: los sumandos, con media común $\mu$.
- $Z$: otra variable con la que se condiciona.
- $g$: función de $X$; $\mathbf{1}_A$: indicadora del evento $A$.
- $G$: grupo de edad; $R$: número de reclamaciones del ejemplo.
:::

## Cómo usar la visualización

Cada punto es la media de la suma de dos dados cuando el mayor de los dados vale $m$, con área proporcional a $P(M = m)$; la barra vertical abarca una desviación estándar condicional. La animación suma un término $P(M = m)\, \mathbb{E}[S \mid M = m]$ a la vez y el encabezado lleva el total parcial. Al terminar, la línea punteada marca el total, 7.

Los puntos de la izquierda tienen poco peso (el mayor casi nunca es 1) y los de la derecha mucho; por eso un promedio simple de los puntos no daría 7.

## Ejemplo

Una aseguradora divide a sus clientes en tres grupos de edad $G$, con probabilidades 0.2, 0.5 y 0.3. El número medio de reclamaciones $R$ en un año es 0.7, 0.25 y 0.4 en cada grupo.

1. $\mathbb{E}[R] = 0.2 \cdot 0.7 + 0.5 \cdot 0.25 + 0.3 \cdot 0.4$.
2. $= 0.14 + 0.125 + 0.12 = 0.385$ reclamaciones por cliente.
3. El grupo más numeroso, con la media más baja, jala el resultado hacia abajo.

:::figura[El ejemplo de la aseguradora: los tres puntos son las medias por grupo, con áreas según 0.2, 0.5 y 0.3, y su promedio ponderado es 0.385.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-total
valoresX: [1, 2, 3]
valoresY: [0, 1, 2]
probabilidades:
  - [0.10, 0.06, 0.04]
  - [0.40, 0.075, 0.025]
  - [0.21, 0.06, 0.03]
nombreX: grupo de edad
nombreY: reclamaciones al año
simboloX: G
simboloY: R
```
:::

## Propiedades

- **Versión con eventos:** con $Y = \mathbf{1}_A$ se obtiene la ley de probabilidad total, $P(A) = \sum_x P(X = x)\, P(A \mid X = x)$.
- **Sumas aleatorias:** si $N$ es independiente de las $Y_i$, idénticas con media $\mu$, entonces $\mathbb{E}\big[\sum_{i=1}^{N} Y_i\big] = \mathbb{E}\big[N \mu\big] = \mathbb{E}[N]\, \mu$.
- **Torre:** $\mathbb{E}\big[\mathbb{E}[Y \mid X, Z] \mid X\big] = \mathbb{E}[Y \mid X]$: condicionar en más información y luego promediar sobre ella regresa a la información menor.
- **Funciones:** $\mathbb{E}[g(X)\, Y] = \mathbb{E}\big[g(X)\, \mathbb{E}[Y \mid X]\big]$.

:::figura[En la normal bivariada con correlación 0.7, las medias condicionales siguen la recta $0.7x$ y sus pesos son simétricos alrededor de 0, así que el promedio ponderado es $\mathbb{E}[Y] = 0$.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-total
modelo: normal-bivariada
parametros:
  rho: 0.7
```
:::

## Errores comunes

- **Promediar las medias condicionales sin pesos.** En el ejemplo, $(0.7 + 0.25 + 0.4)/3 = 0.45$, no 0.385.
- **Olvidar que $\mathbb{E}[Y \mid X]$ es aleatoria.** La ley promedia sobre la distribución de $X$; no basta con un valor particular de $x$.
- **Usar casos que no forman una partición.** Los valores de $X$ deben cubrir todas las posibilidades sin traslaparse, como en la ley de probabilidad total.

:::figura[Un caso extremo: el 90 % de la población tiene media 1 y el 10 % tiene media 10. El promedio ponderado es 1.9, mientras que el promedio simple de las dos medias sería 5.5.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-total
valoresX: [0, 1]
valoresY: [1, 10]
probabilidades:
  - [0.9, 0]
  - [0, 0.1]
nombreX: el grupo
nombreY: el gasto
simboloX: G
simboloY: Y
```
:::

## Conexiones

La ley promedia la [[esperanza-condicional]] sobre la distribución de $X$, y es la versión para medias de la [[ley-de-probabilidad-total]]. Su compañera para la dispersión es la [[ley-de-la-varianza-total]]. El promedio con pesos es el de la [[media-ponderada]], y con indicadoras recupera la [[ley-de-probabilidad-total]] a partir de la [[esperanza-matematica]].

## Formulario

:::formula[Ley de la esperanza total]
$$
\mathbb{E}[Y] = \mathbb{E}\big[\mathbb{E}[Y \mid X]\big]
$$

- La media de las medias condicionales.
:::

:::formula[Caso discreto]
$$
\mathbb{E}[Y] = \sum_x P(X = x)\, \mathbb{E}[Y \mid X = x]
$$

- Pesos: las probabilidades de cada caso.
:::

:::formula[Caso continuo]
$$
\mathbb{E}[Y] = \int_{-\infty}^{\infty} \mathbb{E}[Y \mid X = x]\, f_X(x)\,dx
$$

- $f_X$: densidad marginal de $X$.
:::

:::formula[Suma aleatoria]
$$
\mathbb{E}\Big[\sum_{i=1}^{N} Y_i\Big] = \mathbb{E}[N]\, \mu
$$

- $N$ independiente de las $Y_i$, todas con media $\mu$.
:::
