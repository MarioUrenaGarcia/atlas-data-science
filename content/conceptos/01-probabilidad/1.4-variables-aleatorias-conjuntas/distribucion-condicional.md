---
id: distribucion-condicional
titulo: Distribución condicional
titulo_en: Conditional distribution
alias:
  - distribución de Y dado X
  - densidad condicional
  - función de masa condicional
modulo: 1
submodulo: '1.4'
orden: 3
nivel: intermedio
prerrequisitos:
  - distribuciones-marginales
  - probabilidad-condicional
relaciones:
  - tipo: relacionado
    id: teorema-de-bayes
etiquetas:
  - condicionar
  - rebanada de la conjunta
  - reescalar
  - información parcial
resumen: >
  La distribución condicional de Y dado X = x describe cómo se reparte Y cuando ya se sabe el valor
  de X. Se obtiene tomando la rebanada de la distribución conjunta en x y dividiéndola entre la
  marginal de X en ese punto.
formula: 'p_{Y \mid X}(y \mid x) = \frac{p(x, y)}{p_X(x)}, \qquad f_{Y \mid X}(y \mid x) = \frac{f(x, y)}{f_X(x)}'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: condicional
    experimento: dos-dados
    variable: primero
    segunda: suma
    x: 3
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.1'
  - clave: ross-probabilidad
    capitulo: '6.4 y 6.5'
publicado: true
---

## Intuición

Antes de lanzar dos dados, la suma puede ser cualquier valor entre 2 y 12, con 7 como el más probable. Si se sabe que el primer dado salió 3, la suma solo puede ir de 4 a 9, y cada uno de esos valores tiene probabilidad 1/6. La información sobre $X$ cambió la distribución de $Y$: eso es la **distribución condicional** de $Y$ dado $X = 3$.

En la tabla conjunta, condicionar en $X = 3$ significa quedarse con la columna de $X = 3$ y descartar el resto. Esa columna no suma 1 (suma $P(X = 3) = 1/6$), así que se divide entre su total para convertirla en una distribución. Es exactamente la probabilidad condicional $P(A \mid B) = P(A \cap B)/P(B)$, aplicada a todos los valores de $Y$ a la vez.

## Definición

:::definicion[Distribución condicional]
Si $X$ y $Y$ son discretas y $p_X(x) > 0$, la **función de masa condicional** de $Y$ dado $X = x$ es
$$
p_{Y \mid X}(y \mid x) = P(Y = y \mid X = x) = \frac{p(x, y)}{p_X(x)}.
$$
Si tienen densidad conjunta $f$ y $f_X(x) > 0$, la **densidad condicional** es
$$
f_{Y \mid X}(y \mid x) = \frac{f(x, y)}{f_X(x)}.
$$
:::

Para cada $x$ fija, la función de $y$ resultante es una distribución: suma o integra 1. En el caso continuo $P(X = x) = 0$, y la densidad condicional se entiende como el límite de condicionar en $X$ dentro de un intervalo cada vez más angosto alrededor de $x$.

:::figura[En la normal bivariada con correlación 0.7, la rebanada en $x = 1$ es una normal con media 0.7 y desviación estándar 0.714, más angosta y desplazada respecto a la marginal de $Y$, punteada.]{componente="JointDistribution2D"}
```yaml
modo: condicional
modelo: normal-bivariada
parametros:
  rho: 0.7
x: 1
```
:::

:::nota[Qué significa cada símbolo]
- $p(x, y)$, $f(x, y)$: masa o densidad conjunta.
- $p_X(x)$, $f_X(x)$: marginal de $X$ en $x$.
- $p_{Y \mid X}(y \mid x)$: probabilidad de $Y = y$ sabiendo que $X = x$.
- $f_{Y \mid X}(y \mid x)$: densidad condicional de $Y$ dado $X = x$.
- $\rho$: correlación de la normal bivariada.
- $L$, $S$: días con lluvia y suspensión del ejemplo.
- $M$: el mayor de dos dados.
:::

## Cómo usar la visualización

A la izquierda está la tabla del primer dado $X_1$ y la suma $S$, con la columna $X_1 = 3$ resaltada. A la derecha está esa columna reescalada: la distribución condicional de la suma, uniforme sobre 4, 5, ..., 9, junto a la marginal de $S$ punteada. Las líneas verticales marcan la media condicional, 6.5, y la media sin condición, 7.

La deslizadera cambia el valor de la condición. Al moverla, la distribución condicional se desplaza sin cambiar de forma: saber el primer dado fija el punto de partida y el segundo dado aporta siempre la misma incertidumbre. El botón de reproducción recorre todos los valores.

## Ejemplo

Con la tabla de días con lluvia $L$ y suspensión del partido $S$ (marginal de $L$: 0.40, 0.40, 0.20):

1. $P(S = 1 \mid L = 0) = 0.10 / 0.40 = 0.25$.
2. $P(S = 1 \mid L = 2) = 0.15 / 0.20 = 0.75$: con dos días de lluvia la suspensión es tres veces más probable.
3. Condicionar al revés da otra cosa: $P(L = 2 \mid S = 1) = 0.15 / 0.45 = 0.333$.
4. Cada condicional suma 1: $P(S = 0 \mid L = 2) = 0.05 / 0.20 = 0.25$, y $0.75 + 0.25 = 1$.

:::figura[El ejemplo del partido: con $L = 2$ la columna 0.05, 0.15 se divide entre 0.20 y queda 0.25, 0.75; la marginal punteada de $S$ es 0.55, 0.45.]{componente="JointDistribution2D"}
```yaml
modo: condicional
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
x: 2
```
:::

## Propiedades

- **Regla del producto:** $p(x, y) = p_X(x)\, p_{Y \mid X}(y \mid x)$; la conjunta se reconstruye con una marginal y una condicional.
- **Bayes para variables:** $p_{X \mid Y}(x \mid y) = \dfrac{p_{Y \mid X}(y \mid x)\, p_X(x)}{p_Y(y)}$.
- **Independencia:** $X$ y $Y$ son independientes exactamente cuando la condicional de $Y$ no depende de $x$ y coincide con la marginal $p_Y$.
- **Normal bivariada estándar:** $Y \mid X = x \sim \mathcal{N}(\rho x,\ 1 - \rho^2)$; condicionar reduce la varianza en el factor $1 - \rho^2$.

:::figura[Con la densidad $4xy$ sobre el cuadrado unitario las variables son independientes: la rebanada en cualquier $x$, reescalada, coincide con la marginal de $Y$.]{componente="JointDistribution2D"}
```yaml
modo: condicional
modelo: producto-xy
x: 0.3
```
:::

## Errores comunes

- **Confundir $p_{Y \mid X}$ con $p_{X \mid Y}$.** Saber que la suma de dos dados es 7 da probabilidad 1/3 a que el mayor sea 6, pero saber que el mayor es 6 da probabilidad 2/11 a que la suma sea 7.
- **Olvidar dividir entre la marginal.** La rebanada $p(x, \cdot)$ sin reescalar no suma 1; solo es proporcional a la condicional.
- **Condicionar en un evento de probabilidad cero sin cuidado.** En variables continuas $P(X = x) = 0$, y la condicional depende de cómo se toma el límite; la fórmula con densidades es la convención correcta.

:::figura[Condicionar en la suma de dos dados igual a 7: el mayor de los dos solo puede ser 4, 5 o 6, cada uno con probabilidad 1/3.]{componente="JointDistribution2D"}
```yaml
modo: condicional
experimento: dos-dados
variable: suma
segunda: maximo
x: 7
```
:::

## Conexiones

La distribución condicional aplica la [[probabilidad-condicional]] a todos los valores de una variable a la vez, a partir de la [[distribucion-conjunta]] y las [[distribuciones-marginales]]. Su media es la [[esperanza-condicional]], y promediando sobre $X$ se obtienen la [[ley-de-la-esperanza-total]] y la [[ley-de-la-varianza-total]]. Invertir el condicionamiento es el [[teorema-de-bayes]] para variables, y la [[independencia-de-variables-aleatorias]] es el caso en que condicionar no cambia nada.

## Formulario

:::formula[Condicional discreta]
$$
p_{Y \mid X}(y \mid x) = \frac{p(x, y)}{p_X(x)}, \qquad p_X(x) > 0
$$

- Rebanada de la conjunta dividida entre su total.
:::

:::formula[Condicional continua]
$$
f_{Y \mid X}(y \mid x) = \frac{f(x, y)}{f_X(x)}, \qquad f_X(x) > 0
$$

- Densidad conjunta en la rebanada $x$ entre la marginal.
:::

:::formula[Regla del producto]
$$
p(x, y) = p_X(x)\, p_{Y \mid X}(y \mid x)
$$

- Marginal por condicional.
:::

:::formula[Normal bivariada estándar]
$$
Y \mid X = x \sim \mathcal{N}(\rho x,\ 1 - \rho^2)
$$

- $\rho$: correlación entre $X$ y $Y$.
:::
