---
id: convergencia-en-distribucion
titulo: Convergencia en distribución
titulo_en: Convergence in distribution
alias:
  - convergencia débil
  - convergencia en ley
modulo: 3
submodulo: '3.1'
orden: 3
nivel: intermedio
prerrequisitos:
  - convergencia-en-probabilidad
etiquetas:
  - convergencia
  - función de distribución
  - aproximación
  - distribuciones límite
resumen: >
  Xₙ converge en distribución a X si su función de distribución Fₙ(x) tiende a F(x) en cada punto donde
  F es continua. Compara leyes de probabilidad, no valores, y es el modo del teorema central del límite.
formula: 'X_n \xrightarrow{d} X \iff \lim_{n \to \infty} F_{X_n}(x) = F_X(x) \ \ \text{en cada } x \text{ donde } F_X \text{ es continua}'
visualizacion:
  componente: ConvergenceViz
  parametros:
    modo: distribucion
    sucesion: maximo-uniformes
    sucesiones:
      - maximo-uniformes
      - binomial-poisson
      - t-normal
      - media-exponencial
      - uniforme-discreta
      - punto-1-n
    n: 1
    nMaximo: 60
referencias:
  - clave: casella-berger
    capitulo: '5.5'
  - clave: wasserman
publicado: true
---

## Intuición

Una central de emergencias divide el día en $n$ intervalos cortos y, en cada uno, entra una llamada con probabilidad $3/n$, de modo que en promedio llegan 3 llamadas al día. Con 10 intervalos el conteo es binomial; con 1000 intervalos también, pero la tabla de probabilidades de "0, 1, 2, 3, ... llamadas" ya casi no cambia al refinar más. Esa tabla se acerca a la de una distribución de Poisson con media 3.

La convergencia en distribución describe exactamente eso: la forma de la ley de probabilidad de $X_n$ se estabiliza en una ley límite. No dice nada sobre los valores concretos de $X_n$ en un experimento; ni siquiera hace falta que $X_n$ y el límite vivan en el mismo espacio. Se comparan las funciones de distribución $F_n(x) = P(X_n \le x)$ con la del límite, punto por punto. Hay una excepción natural: en los puntos donde la función de distribución límite da un salto no se exige nada, porque una ley que se concentra en $1/n$ debe considerarse cercana a la que se concentra en 0, aunque sus funciones de distribución difieran justo en 0.

## Definición

:::definicion[Convergencia en distribución]
Sean $X_1, X_2, \dots$ y $X$ variables aleatorias con funciones de distribución $F_n(x) = P(X_n \le x)$ y $F(x) = P(X \le x)$. La sucesión **converge en distribución** a $X$, y se escribe $X_n \xrightarrow{d} X$, si
$$
\lim_{n \to \infty} F_n(x) = F(x) \quad \text{para todo } x \text{ en el que } F \text{ es continua}.
$$
:::

Las variables pueden estar definidas en espacios distintos: la definición solo usa sus distribuciones. Una forma equivalente (teorema de Portmanteau) es $\mathbb{E}[g(X_n)] \to \mathbb{E}[g(X)]$ para toda función $g$ continua y acotada. Por el teorema de continuidad de Lévy, también equivale a la convergencia de las funciones características $\varphi_{X_n}(t) \to \varphi_X(t)$ para todo $t$.

:::nota[Qué significa cada símbolo]
- $X_n$: término $n$ de la sucesión; $X$, la variable límite.
- $F_n(x) = P(X_n \le x)$: función de distribución de $X_n$; $F$, la del límite.
- $x$: punto donde se comparan las funciones de distribución.
- $\xrightarrow{d}$: "converge en distribución a".
- $g$: función continua y acotada; $\mathbb{E}$, esperanza.
- $\varphi_X(t) = \mathbb{E}[e^{itX}]$: función característica de $X$, con $i$ la unidad imaginaria y $t$ real.
:::

## Cómo usar la visualización

El panel superior grafica $F_n$ (línea continua) y $F$ (discontinua) y una línea vertical en el punto de comparación $x_0$, con los dos valores marcados. El panel inferior muestra, para cada $n$, la mayor diferencia $|F_n(x) - F(x)|$ en la ventana. La reproducción recorre $n$; los controles fijan $n$ y $x_0$.

Con la brecha del máximo de uniformes, $F_n$ empieza como una recta y se curva hasta coincidir con la exponencial; la mayor diferencia cae como $1/n$. Con la binomial hacia la Poisson los escalones se acomodan sobre los de la Poisson. Con la constante $1/n$ conviene poner $x_0 = 0$: ahí $F_n(0) = 0$ para todo $n$ mientras $F(0) = 1$, y aun así hay convergencia, porque 0 es un salto de $F$.

## Ejemplo

Una central recibe llamadas en $n$ intervalos del día, cada uno con probabilidad $3/n$ de traer una llamada, de forma independiente. El total es $X_n \sim \operatorname{Bin}(n, 3/n)$. Se compara $F_n(2) = P(X_n \le 2)$ con la Poisson de media 3.

1. Para la Poisson: $F(2) = e^{-3}\big(1 + 3 + \tfrac{3^2}{2}\big) = 8.5\,e^{-3} = 0.4232$.
2. Para $n = 5$: $F_5(2) = \sum_{k=0}^{2}\binom{5}{k}0.6^k\,0.4^{5-k} = 0.3174$.
3. Para $n = 10$: $F_{10}(2) = 0.3828$; para $n = 30$: $0.4114$; para $n = 100$: $0.4198$; para $n = 1000$: $0.4229$.
4. Lo mismo ocurre en cada $x$: como $\binom{n}{k}(3/n)^k(1 - 3/n)^{n-k} \to e^{-3}3^k/k!$ para cada $k$ fijo, $X_n \xrightarrow{d} \operatorname{Poisson}(3)$.
5. En la práctica, con $n$ grande y probabilidad pequeña, las probabilidades binomiales se calculan con la Poisson.

:::figura[El ejemplo de la central de llamadas: la distribución binomial con p = 3/n se acerca escalón por escalón a la de Poisson con media 3. Con x₀ = 2 se leen los valores del ejemplo.]{componente="ConvergenceViz"}
```yaml
modo: distribucion
sucesion: binomial-poisson
n: 5
nMaximo: 100
x0: 2
```
:::

## Propiedades

- **Es la más débil de los cuatro modos:** la convergencia en probabilidad implica la convergencia en distribución, pero no al revés.
- **Hacia una constante sí basta:** si $X_n \xrightarrow{d} c$ con $c$ constante, entonces $X_n \xrightarrow{p} c$.
- **Teorema de Pólya:** si $F$ es continua, la convergencia es uniforme, $\sup_x |F_n(x) - F(x)| \to 0$.
- **Funciones continuas:** $g(X_n) \xrightarrow{d} g(X)$ si $g$ es continua (teorema del mapeo continuo).
- **Leyes discretas pueden converger a continuas:** la uniforme en $\{1/n, 2/n, \dots, 1\}$ converge a la uniforme continua en $[0, 1]$.
- **Teorema central del límite:** la media estandarizada de variables independientes con varianza finita converge en distribución a la normal estándar.

:::figura[Propiedad: una ley discreta converge a una continua. La uniforme en {1/n, ..., 1} tiene escalones cada vez más finos que se pegan a la recta F(x) = x.]{componente="ConvergenceViz"}
```yaml
modo: distribucion
sucesion: uniforme-discreta
n: 3
nMaximo: 60
x0: 0.5
```
:::

:::figura[Propiedad: el teorema central del límite como convergencia en distribución. La media estandarizada de n exponenciales tiene distribución gamma reescalada, que se acerca a la normal.]{componente="ConvergenceViz"}
```yaml
modo: distribucion
sucesion: media-exponencial
n: 1
nMaximo: 60
x0: -1
```
:::

:::figura[Propiedad: la t de Student converge a la normal estándar al crecer los grados de libertad; la diferencia máxima es pequeña desde unos 30 grados.]{componente="ConvergenceViz"}
```yaml
modo: distribucion
sucesion: t-normal
n: 1
nMaximo: 60
x0: 1.5
```
:::

## Errores comunes

- **Exigir convergencia también en los saltos del límite.** $X_n = 1/n$ converge en distribución a 0 aunque $F_n(0) = 0 \neq 1 = F(0)$ para todo $n$.
- **Concluir que los valores se acercan.** Si $Z \sim \mathcal{N}(0, 1)$, la sucesión $X_n = -Z$ converge en distribución a $Z$ (es idéntica en ley), pero $|X_n - Z| = 2|Z|$ no se hace pequeña.
- **Sumar límites en distribución.** De $X_n \xrightarrow{d} X$ y $Y_n \xrightarrow{d} Y$ no se sigue $X_n + Y_n \xrightarrow{d} X + Y$; hace falta información conjunta o que uno de los límites sea constante.
- **Suponer que las esperanzas convergen.** La convergencia en distribución no controla las colas: las medias pueden no converger.

:::figura[Error común: la constante 1/n. En x₀ = 0, un salto del límite, Fₙ(0) = 0 para todo n; en cualquier otro punto la diferencia termina siendo cero.]{componente="ConvergenceViz"}
```yaml
modo: distribucion
sucesion: punto-1-n
n: 1
nMaximo: 40
x0: 0
```
:::

:::figura[Error común: misma distribución, valores lejanos. La sucesión (-1)ⁿ Z converge en distribución a Z pero no en probabilidad.]{componente="ConvergenceViz"}
```yaml
modo: relaciones
sucesion: signo-alternante
```
:::

## Conexiones

Es implicada por la [[convergencia-en-probabilidad]] y es el modo del [[teorema-central-del-limite]], del [[tcl-multivariado]] y del [[metodo-delta]]. El [[teorema-de-slutsky]] y el [[teorema-del-mapeo-continuo]] permiten combinarla y transformarla. El [[teorema-de-berry-esseen]] mide qué tan rápido converge la distribución de una media estandarizada, y el [[teorema-de-donsker]] la extiende a trayectorias completas. Las relaciones con los demás modos están en [[relaciones-entre-modos-de-convergencia]].

## Formulario

:::formula[Definición]
$$
X_n \xrightarrow{d} X \iff F_n(x) \to F(x)\ \text{en cada punto de continuidad de } F
$$

- $F_n(x) = P(X_n \le x)$: función de distribución de $X_n$.
- $F(x) = P(X \le x)$: función de distribución del límite.
:::

:::formula[Forma de Portmanteau]
$$
X_n \xrightarrow{d} X \iff \mathbb{E}[g(X_n)] \to \mathbb{E}[g(X)]\ \ \text{para toda } g \text{ continua y acotada}
$$

- $g$: función continua y acotada.
- $\mathbb{E}$: esperanza.
:::

:::formula[Teorema de continuidad de Lévy]
$$
X_n \xrightarrow{d} X \iff \varphi_{X_n}(t) \to \varphi_X(t)\ \ \forall t
$$

- $\varphi_X(t) = \mathbb{E}[e^{itX}]$: función característica.
- $t$: argumento real; $i$, la unidad imaginaria.
:::

:::formula[Binomial hacia Poisson]
$$
\binom{n}{k}\Big(\frac{\lambda}{n}\Big)^k\Big(1 - \frac{\lambda}{n}\Big)^{n-k} \to \frac{e^{-\lambda}\lambda^k}{k!}
$$

- $n$: número de ensayos.
- $\lambda$: media fija, aquí 3.
- $k$: número de éxitos.
:::

:::formula[Teorema de Pólya]
$$
F \text{ continua y } X_n \xrightarrow{d} X \ \Rightarrow\ \sup_x |F_n(x) - F(x)| \to 0
$$

- $\sup_x$: mayor diferencia sobre todos los puntos.
:::
