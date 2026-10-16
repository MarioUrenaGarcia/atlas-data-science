---
id: propiedades-de-la-varianza
titulo: Propiedades de la varianza
titulo_en: Properties of variance
alias:
  - reglas de la varianza
  - varianza de una suma
  - varianza de una transformación lineal
modulo: 1
submodulo: '1.3'
orden: 15
nivel: basico
prerrequisitos:
  - varianza
  - linealidad-de-la-esperanza
relaciones:
  - tipo: contrasta
    id: linealidad-de-la-esperanza
etiquetas:
  - transformación afín
  - suma de independientes
  - varianza del promedio
  - covarianza
resumen: >
  La varianza no cambia al sumar constantes, se multiplica por el cuadrado de un factor de escala y, con variables independientes, la de la suma es la suma de las varianzas. El promedio de n reduce la varianza n veces.
formula: '\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X), \qquad \operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) \text{ si } X, Y \text{ son independientes}'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: varianza
    experimento: dos-dados
    variable: suma
    a: -1
    b: 10
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.6 y 7.3'
  - clave: ross-probabilidad
    capitulo: '7.4'
publicado: true
---

## Intuición

La varianza mide el ancho de una distribución, así que sus reglas se entienden pensando en qué le pasa a ese ancho. Desplazar todos los valores, sumando una constante, mueve la distribución sin ensancharla: la varianza no cambia. Cambiar de unidades, multiplicando por $a$, estira el ancho por $|a|$ y la varianza, que está en unidades al cuadrado, por $a^2$.

Para sumas la pregunta es más interesante. Si dos fuentes de incertidumbre son independientes, sus errores a veces se suman y a veces se compensan, y en promedio las varianzas se suman exactamente. Si están relacionadas, hay que corregir con la covarianza: cuando tienden a moverse juntas la suma es más variable, y cuando se compensan es menos variable.

La consecuencia más importante es para promedios: el promedio de $n$ observaciones independientes tiene varianza $\sigma^2 / n$, y por eso promediar reduce el ruido.

## Definición

:::definicion[Reglas de la varianza]
Sean $X$, $Y$ variables aleatorias con varianza finita y $a$, $b$ constantes.
$$
\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X),
$$
$$
\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y),
$$
donde $\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big]$. Si $X$ y $Y$ son independientes, $\operatorname{Cov}(X, Y) = 0$ y la varianza de la suma es la suma de las varianzas.
:::

Para $X_1, \dots, X_n$ independientes con varianza $\sigma^2$, la suma tiene varianza $n\sigma^2$ y el promedio $\bar{X}$ tiene varianza $\sigma^2 / n$.

:::figura[La suma de dos dados independientes: cada dado tiene varianza 2.917 y la suma tiene $2 \cdot 2.917 = 5.833$.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: dos-dados
variable: suma
a: 1
b: 0
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$, $X_1, \dots, X_n$: variables aleatorias.
- $a$, $b$: constantes.
- $\operatorname{Var}$: varianza; $\operatorname{Cov}$: covarianza.
- $\mu_X$, $\mu_Y$: medias de $X$ y $Y$.
- $\sigma^2$: varianza común de las $X_i$.
- $\bar{X}$: promedio de $X_1, \dots, X_n$.
- $N$: número de caras del ejemplo.
:::

## Cómo usar la visualización

Arriba está la suma de dos dados con su media 7 y su varianza 5.833; abajo, la transformación $Y = -S + 10$. La distribución de abajo es el reflejo de la de arriba desplazado: su media es $-7 + 10 = 3$, pero su varianza es la misma, $(-1)^2 \cdot 5.833$.

Las deslizaderas cambian $a$ y $b$. Con cualquier $b$ la varianza de $Y$ no cambia; con $a = 2$ o $a = -2$ se multiplica por 4, y con $a = 0$ la variable se vuelve constante y su varianza es 0.

## Ejemplo

Se lanzan 4 monedas equilibradas y $N$ es el número de caras.

1. $N = I_1 + I_2 + I_3 + I_4$, donde $I_k$ indica cara en la moneda $k$.
2. Cada indicadora tiene varianza $p(1 - p) = 1/2 \cdot 1/2 = 1/4$.
3. Las monedas son independientes, así que $\operatorname{Var}(N) = 4 \cdot 1/4 = 1$ y $\sigma_N = 1$.
4. La proporción de caras $N / 4$ tiene varianza $1 / 16$; con 100 monedas, la proporción tendría varianza $1/400$ y desviación estándar 0.05.

:::figura[El número de caras en 4 monedas: la suma de cuatro indicadoras independientes tiene varianza $4 \cdot 1/4 = 1$.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: cuatro-monedas
variable: numero-de-caras
a: 1
b: 0
```
:::

## Propiedades

- **Constantes:** $\operatorname{Var}(b) = 0$ y $\operatorname{Var}(X + b) = \operatorname{Var}(X)$.
- **Escala:** $\operatorname{Var}(aX) = a^2 \operatorname{Var}(X)$; en particular $\operatorname{Var}(-X) = \operatorname{Var}(X)$.
- **Diferencias:** si $X$ y $Y$ son independientes, $\operatorname{Var}(X - Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)$.
- **Promedio:** para $n$ variables independientes con varianza $\sigma^2$, $\operatorname{Var}(\bar{X}) = \sigma^2 / n$ y la desviación estándar del promedio es $\sigma / \sqrt{n}$.
- **Fórmula de cálculo:** $\operatorname{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$.

:::figura[Cambiar de escala: la cara de un dado multiplicada por 3 tiene varianza $9 \cdot 2.917 = 26.25$, y restarle 2 no la modifica.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: dado
variable: valor
a: 3
b: -2
```
:::

## Errores comunes

- **Escribir $\operatorname{Var}(aX) = a \operatorname{Var}(X)$.** El factor sale al cuadrado.
- **Sumar varianzas de variables dependientes.** $X + X = 2X$ tiene varianza $4\operatorname{Var}(X)$, no $2\operatorname{Var}(X)$: la covarianza de $X$ consigo misma es su varianza.
- **Restar varianzas al restar variables.** La incertidumbre de una diferencia de variables independientes es mayor que la de cada una.

:::figura[Una variable sumada consigo misma: duplicar la cara de un dado da varianza $4 \cdot 2.917 = 11.667$, el doble de la varianza de la suma de dos dados independientes.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: dado
variable: valor
a: 2
b: 0
```
:::

## Conexiones

Estas reglas completan la [[varianza]] y contrastan con la [[linealidad-de-la-esperanza]]: la media de una suma nunca necesita independencia, la varianza sí. Aplicadas a [[variables-indicadoras]] dan la varianza $np(1-p)$ de la [[distribucion-binomial]]. La fórmula $\operatorname{Var}(\bar{X}) = \sigma^2 / n$ es la base de la [[ley-debil-de-los-grandes-numeros]] y de la escala $\sigma / \sqrt{n}$ en el [[teorema-central-del-limite]]. La covarianza que aparece en la suma de variables dependientes se estudia con detalle en el submódulo de variables aleatorias conjuntas.

## Formulario

:::formula[Transformación afín]
$$
\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X)
$$

- Las constantes aditivas no cuentan.
:::

:::formula[Suma de dos variables]
$$
\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)
$$

- Si son independientes, $\operatorname{Cov}(X, Y) = 0$.
:::

:::formula[Suma y promedio de independientes]
$$
\operatorname{Var}\left(\sum_{i=1}^{n} X_i\right) = n\sigma^2, \qquad \operatorname{Var}(\bar{X}) = \frac{\sigma^2}{n}
$$

- Cada $X_i$ con varianza $\sigma^2$.
:::

:::formula[Fórmula de cálculo]
$$
\operatorname{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2
$$

- Segundo momento menos media al cuadrado.
:::
