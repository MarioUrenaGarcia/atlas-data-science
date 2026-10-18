---
id: esperanza-condicional
titulo: Esperanza condicional
titulo_en: Conditional expectation
alias:
  - media condicional
  - función de regresión
  - E[Y | X]
modulo: 1
submodulo: '1.4'
orden: 9
nivel: intermedio
prerrequisitos:
  - distribucion-condicional
  - esperanza-matematica
relaciones:
  - tipo: relacionado
    id: ley-de-la-esperanza-total
etiquetas:
  - media condicional
  - regresión
  - mejor predicción
  - variable aleatoria
resumen: >
  La esperanza condicional de Y dado X = x es la media de la distribución condicional de Y en ese
  punto. Como función de x es la curva de regresión, y evaluada en X es una nueva variable
  aleatoria, la mejor predicción de Y a partir de X.
formula: '\mathbb{E}[Y \mid X = x] = \sum_y y\, p_{Y \mid X}(y \mid x) \ \text{o} \int y\, f_{Y \mid X}(y \mid x)\,dy'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: esperanza-condicional
    modelo: uniforme-triangulo
    x: 0.5
referencias:
  - clave: blitzstein-hwang
    capitulo: '9.1 y 9.3'
  - clave: ross-probabilidad
    capitulo: '7.5'
publicado: true
---

## Intuición

Si se sabe que el primer dado salió 3, la suma de los dos dados será en promedio $3 + 3.5 = 6.5$. Si salió 5, será en promedio 8.5. Para cada valor posible del primer dado hay un promedio distinto de la suma: esa regla, que a cada $x$ le asigna la media de $Y$ cuando $X = x$, es la **esperanza condicional**.

Tiene dos lecturas útiles. Como función de $x$, es la **curva de regresión**: describe cómo cambia en promedio $Y$ al cambiar $X$, sin suponer que el cambio sea lineal. Y como regla aplicada al valor aleatorio de $X$, $\mathbb{E}[Y \mid X]$ es una nueva variable aleatoria: el pronóstico de $Y$ que se haría después de observar $X$. Ese pronóstico es el mejor posible en error cuadrático medio.

## Definición

:::definicion[Esperanza condicional]
La **esperanza condicional** de $Y$ dado $X = x$ es la media de la distribución condicional:
$$
\mathbb{E}[Y \mid X = x] = \sum_y y\, p_{Y \mid X}(y \mid x) \quad \text{o} \quad \int_{-\infty}^{\infty} y\, f_{Y \mid X}(y \mid x)\,dy.
$$
Si $m(x) = \mathbb{E}[Y \mid X = x]$, la variable aleatoria $\mathbb{E}[Y \mid X] = m(X)$ se llama esperanza condicional de $Y$ dado $X$.
:::

La función $m$ se define para los $x$ con probabilidad o densidad marginal positiva. $\mathbb{E}[Y \mid X]$ es una función de $X$, así que su distribución se obtiene de la de $X$.

:::figura[El primer dado y la suma: en cada columna la media condicional es $x + 3.5$, y la curva de regresión es una recta de pendiente 1, porque el segundo dado aporta en promedio 3.5 sin importar el primero.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-condicional
experimento: dos-dados
variable: primero
segunda: suma
x: 3
```
:::

:::nota[Qué significa cada símbolo]
- $p_{Y \mid X}$, $f_{Y \mid X}$: masa o densidad condicional de $Y$ dado $X$.
- $\mathbb{E}[Y \mid X = x]$: media de $Y$ cuando $X = x$, un número.
- $m(x)$: función de regresión.
- $\mathbb{E}[Y \mid X] = m(X)$: variable aleatoria que depende de $X$.
- $g$: función cualquiera de $X$.
- $\rho$: correlación de la normal bivariada; $\mu_X$, $\mu_Y$, $\sigma_X$, $\sigma_Y$: sus medias y desviaciones estándar.
- $L$, $S$: días con lluvia y suspensión del ejemplo.
:::

## Cómo usar la visualización

A la izquierda está la densidad uniforme sobre el triángulo $0 < x < y < 1$ con la columna $X = 0.5$ resaltada y la curva de regresión trazada sobre ella; a la derecha, la distribución condicional de $Y$ en esa columna, uniforme entre 0.5 y 1, con su media 0.75 marcada. El encabezado escribe la integral con el valor actual.

La deslizadera mueve la condición. La media condicional sigue la recta $(1 + x)/2$: a la mitad del intervalo que va de $x$ a 1. Cerca de $x = 1$ la condicional es muy angosta, porque $Y$ queda atrapada entre $x$ y 1.

## Ejemplo

Con la tabla de días con lluvia $L$ y suspensión $S$:

1. $\mathbb{E}[S \mid L = 0] = P(S = 1 \mid L = 0) = 0.25$.
2. $\mathbb{E}[S \mid L = 1] = 0.20 / 0.40 = 0.50$ y $\mathbb{E}[S \mid L = 2] = 0.15 / 0.20 = 0.75$.
3. $\mathbb{E}[S \mid L]$ es una variable aleatoria que vale 0.25, 0.50 o 0.75 con probabilidades 0.4, 0.4 y 0.2.
4. Su media es $0.25 \cdot 0.4 + 0.5 \cdot 0.4 + 0.75 \cdot 0.2 = 0.45 = \mathbb{E}[S]$.

:::figura[El ejemplo del partido: la media condicional de la suspensión sube de 0.25 a 0.5 y a 0.75 con los días de lluvia. Los puntos de la curva son los valores de la variable $\mathbb{E}[S \mid L]$.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-condicional
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
x: 1
```
:::

## Propiedades

- **Esperanza total:** $\mathbb{E}\big[\mathbb{E}[Y \mid X]\big] = \mathbb{E}[Y]$.
- **Sacar lo conocido:** $\mathbb{E}[g(X)\, Y \mid X] = g(X)\, \mathbb{E}[Y \mid X]$; lo que depende solo de $X$ se comporta como constante.
- **Independencia:** si $X$ y $Y$ son independientes, $\mathbb{E}[Y \mid X] = \mathbb{E}[Y]$, una constante.
- **Mejor predicción:** $\mathbb{E}[Y \mid X]$ minimiza $\mathbb{E}\big[(Y - g(X))^2\big]$ entre todas las funciones $g$.
- **Normal bivariada:** $\mathbb{E}[Y \mid X = x] = \mu_Y + \rho\, \dfrac{\sigma_Y}{\sigma_X}(x - \mu_X)$, una recta; por eso en la normal la regresión lineal es la óptima.

:::figura[En la normal bivariada estándar con correlación 0.6, la curva de regresión es la recta $0.6x$: la media condicional en $x = 1$ es 0.6, a medio camino entre 0 y 1.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-condicional
modelo: normal-bivariada
parametros:
  rho: 0.6
x: 1
```
:::

## Errores comunes

- **Tratar $\mathbb{E}[Y \mid X]$ como un número.** Es un número solo cuando se fija $X = x$; sin fijarlo es una variable aleatoria.
- **Invertir la condición.** $\mathbb{E}[S \mid X_1 = x] = x + 3.5$, pero $\mathbb{E}[X_1 \mid S = s] = s/2$: son curvas distintas con pendientes distintas.
- **Suponer que la regresión es lineal.** Fuera del caso normal, la media condicional puede tener cualquier forma; ajustar una recta da solo la mejor aproximación lineal.

:::figura[La regresión al revés: dada la suma $S = s$, el primer dado vale en promedio $s/2$. Con $s = 7$ la media condicional es 3.5, y la curva tiene pendiente 1/2, no 1.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-condicional
experimento: dos-dados
variable: suma
segunda: primero
x: 7
```
:::

## Conexiones

La esperanza condicional es la [[esperanza-matematica]] de la [[distribucion-condicional]]. Promediada sobre $X$ da la [[ley-de-la-esperanza-total]], y su dispersión es la parte explicada en la [[ley-de-la-varianza-total]]. En la normal bivariada coincide con la recta definida por la [[correlacion-de-pearson]]. La [[correlacion-cero-no-implica-independencia]] se ve cuando $\mathbb{E}[Y \mid X]$ cambia con $x$ aunque la correlación sea cero.

## Formulario

:::formula[Caso discreto]
$$
\mathbb{E}[Y \mid X = x] = \sum_y y\, p_{Y \mid X}(y \mid x)
$$

- Media de la columna $x$ reescalada.
:::

:::formula[Caso continuo]
$$
\mathbb{E}[Y \mid X = x] = \int_{-\infty}^{\infty} y\, f_{Y \mid X}(y \mid x)\,dy
$$

- $f_{Y \mid X}$: densidad condicional.
:::

:::formula[Mejor predicción]
$$
\mathbb{E}[Y \mid X] = \operatorname*{arg\,min}_{g}\ \mathbb{E}\big[(Y - g(X))^2\big]
$$

- Entre todas las funciones $g$ de $X$.
:::

:::formula[Normal bivariada]
$$
\mathbb{E}[Y \mid X = x] = \mu_Y + \rho\, \frac{\sigma_Y}{\sigma_X}\,(x - \mu_X)
$$

- $\rho$: correlación; $\sigma_X$, $\sigma_Y$: desviaciones estándar.
:::
