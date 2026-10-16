---
id: ley-del-estadistico-inconsciente
titulo: Ley del estadístico inconsciente
titulo_en: Law of the unconscious statistician
alias:
  - LOTUS
  - esperanza de una función de una variable aleatoria
  - teorema del cambio de variable para esperanzas
modulo: 1
submodulo: '1.3'
orden: 12
nivel: basico
prerrequisitos:
  - esperanza-matematica
relaciones:
  - tipo: relacionado
    id: transformaciones-de-variables-aleatorias
  - tipo: relacionado
    id: funciones-convexas-y-concavas
etiquetas:
  - esperanza de g(X)
  - LOTUS
  - desigualdad de Jensen
  - función de una variable
resumen: >
  Para calcular la media de g(X) no hace falta hallar la distribución de g(X): basta promediar
  g(x) con las probabilidades o la densidad de X. En general la media de g(X) no es g de la media.
formula: '\mathbb{E}[g(X)] = \sum_x g(x)\, p_X(x) \quad \text{o} \quad \mathbb{E}[g(X)] = \int_{-\infty}^{\infty} g(x)\, f_X(x)\,dx'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: lotus
    experimento: dado
    variable: valor
    funcion: cuadrado
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.5'
  - clave: ross-probabilidad
    capitulo: '4.4'
publicado: true
---

## Intuición

Un juego paga $X^2$ pesos, donde $X$ es la cara de un dado. Para saber cuánto paga en promedio, la definición de esperanza pediría primero la distribución de $Y = X^2$ (valores 1, 4, 9, 16, 25, 36, cada uno con probabilidad 1/6) y luego su media. Pero hay un atajo evidente: promediar directamente $x^2$ usando las probabilidades de $X$,
$$
\mathbb{E}[X^2] = \tfrac{1}{6}(1 + 4 + 9 + 16 + 25 + 36) = \tfrac{91}{6} \approx 15.17.
$$

Ese atajo siempre es válido, y es tan natural que se usa sin pensar; de ahí el nombre irónico de **ley del estadístico inconsciente**. Lo que no es válido es el atajo equivocado: elevar al cuadrado la media, $3.5^2 = 12.25$, da otro número.

## Definición

:::definicion[Ley del estadístico inconsciente]
Sea $X$ una variable aleatoria y $g$ una función. Si $X$ es discreta con función de masa $p_X$,
$$
\mathbb{E}[g(X)] = \sum_x g(x)\, p_X(x).
$$
Si $X$ es continua con densidad $f_X$,
$$
\mathbb{E}[g(X)] = \int_{-\infty}^{\infty} g(x)\, f_X(x)\,dx,
$$
siempre que la suma o la integral de $|g(x)|$ sea finita.
:::

En el caso discreto, la prueba agrupa los valores $x$ que tienen la misma imagen $y = g(x)$: su probabilidad conjunta es $p_Y(y)$, y la suma se reordena como $\sum_y y\, p_Y(y)$.

:::figura[La ley con una variable continua: si $U$ es uniforme entre 0 y 1, la media de $U^2$ es $\int_0^1 u^2\,du = 1/3$, mientras que el cuadrado de la media es $1/4$.]{componente="RandomVariableLab"}
```yaml
modo: lotus
distribucion: uniforme
parametros:
  a: 0
  b: 1
funcion: cuadrado
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $g$: función que se aplica a los valores de $X$.
- $g(X)$: nueva variable aleatoria.
- $p_X$, $f_X$: función de masa o densidad de $X$.
- $D$: demanda diaria del ejemplo.
- $\mathbf{1}\{D > 4\}$: indicadora de que la demanda supera las 4 unidades.
- $U$: variable uniforme entre 0 y 1.
:::

## Cómo usar la visualización

Arriba está la distribución de la cara de un dado; abajo, la distribución de $g(X)$. Las líneas entre las dos gráficas llevan cada valor $x$ a $g(x)$. La animación suma un término $g(x)\,p(x)$ a la vez, y el panel compara tres números: la media por la ley, la media calculada con la distribución de $g(X)$ (siempre coinciden) y $g(\mathbb{E}[X])$, que en general es distinta.

El selector cambia la función: con $g(x) = 2x + 1$ los tres números coinciden, porque la función es lineal; con $|x - c|$ varios valores de $x$ caen en el mismo $g(x)$ y sus probabilidades se juntan en una sola barra de abajo.

## Ejemplo

La demanda diaria $D$ de un producto es Poisson con media 3, y la tienda tiene 4 unidades en existencia. ¿Con qué frecuencia se agota?

1. El faltante ocurre cuando $D > 4$; su indicadora es $g(D) = \mathbf{1}\{D > 4\}$.
2. Por la ley, $\mathbb{E}[g(D)] = \sum_{d > 4} p_D(d) = 1 - \sum_{d=0}^{4} e^{-3} 3^d / d!$.
3. $\sum_{d=0}^{4} e^{-3} 3^d / d! \approx 0.0498 + 0.1494 + 0.2240 + 0.2240 + 0.1680 = 0.8153$.
4. La tienda se queda sin producto en cerca del 18.5 % de los días.

:::figura[El ejemplo de la tienda: la función umbral manda los valores de 0 a 4 al 0 y los mayores al 1, y la media de $g(D)$ es la probabilidad de faltante, cerca de 0.185.]{componente="RandomVariableLab"}
```yaml
modo: lotus
distribucion: poisson
parametros:
  lambda: 3
funcion: umbral
c: 4
```
:::

## Propiedades

- **No requiere la distribución de $g(X)$:** basta la de $X$, aunque $g$ no sea invertible.
- **Funciones lineales:** si $g(x) = ax + b$, entonces $\mathbb{E}[g(X)] = g(\mathbb{E}[X])$; es el único caso general en que el atajo equivocado funciona.
- **Desigualdad de Jensen:** si $g$ es convexa, $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$; si es cóncava, la desigualdad se invierte. Por eso $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$.
- **Momentos y transformadas:** con $g(x) = x^k$ se obtienen los momentos; con $g(x) = e^{tx}$, la función generadora de momentos.

:::figura[Una función convexa: con $g(x) = 2^x$ sobre un dado, la media de $g(X)$ es 21, casi el doble de $g(3.5) \approx 11.3$. Los valores altos del dado se amplifican mucho más que los bajos.]{componente="RandomVariableLab"}
```yaml
modo: lotus
experimento: dado
variable: valor
funcion: exponencial
```
:::

## Errores comunes

- **Calcular $g(\mathbb{E}[X])$ en lugar de $\mathbb{E}[g(X)]$.** Salvo para funciones lineales, son números distintos; el error sistemático tiene el signo que dicta la desigualdad de Jensen.
- **Buscar la distribución de $g(X)$ sin necesidad.** Si solo se quiere la media, la ley evita ese trabajo.
- **Usar la densidad de $g(X)$ con la variable de $X$.** En la integral aparecen $g(x)$ y la densidad de $X$, no la de $Y$.

:::figura[La distancia media al centro de un dado: con $g(x) = |x - 3.5|$ la media es 1.5, mientras que $g(\mathbb{E}[X]) = g(3.5) = 0$.]{componente="RandomVariableLab"}
```yaml
modo: lotus
experimento: dado
variable: valor
funcion: abs-centro
c: 3.5
```
:::

## Conexiones

La ley extiende la [[esperanza-matematica]] a funciones de la variable sin pasar por las [[transformaciones-de-variables-aleatorias]]. Con ella se calculan la [[varianza]] (con $g(x) = (x - \mu)^2$), los [[momentos]] y la [[funcion-generadora-de-momentos]]. Aplicada a una indicadora da probabilidades, como en las [[variables-indicadoras]]. La desigualdad de Jensen, que compara $\mathbb{E}[g(X)]$ con $g(\mathbb{E}[X])$, se basa en las [[funciones-convexas-y-concavas]].

## Formulario

:::formula[Caso discreto]
$$
\mathbb{E}[g(X)] = \sum_x g(x)\, p_X(x)
$$

- Se promedia $g(x)$ con las probabilidades de $X$.
:::

:::formula[Caso continuo]
$$
\mathbb{E}[g(X)] = \int_{-\infty}^{\infty} g(x)\, f_X(x)\,dx
$$

- Se integra $g(x)$ contra la densidad de $X$.
:::

:::formula[Desigualdad de Jensen]
$$
g \text{ convexa} \quad \Rightarrow \quad \mathbb{E}[g(X)] \ge g(\mathbb{E}[X])
$$

- Con $g$ cóncava la desigualdad se invierte.
:::
