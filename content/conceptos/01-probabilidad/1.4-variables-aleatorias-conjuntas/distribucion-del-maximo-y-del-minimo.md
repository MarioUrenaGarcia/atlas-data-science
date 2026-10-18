---
id: distribucion-del-maximo-y-del-minimo
titulo: Distribución del máximo y del mínimo
titulo_en: Distribution of the maximum and minimum
alias:
  - máximo de variables independientes
  - mínimo de variables independientes
  - valores extremos de una muestra
modulo: 1
submodulo: '1.4'
orden: 15
nivel: intermedio
prerrequisitos:
  - independencia-de-variables-aleatorias
relaciones:
  - tipo: caso-particular
    id: estadisticos-de-orden
  - tipo: relacionado
    id: funcion-de-supervivencia
etiquetas:
  - máximo
  - mínimo
  - sistemas en serie y en paralelo
  - valores extremos
resumen: >
  El máximo de n variables independientes no supera x solo si ninguna lo supera, así que su
  distribución es F(x) elevada a la n. El mínimo supera x solo si todas lo superan, así que su
  supervivencia es la de cada una elevada a la n.
formula: 'P(\max_i X_i \le x) = F(x)^n, \qquad P(\min_i X_i > x) = \big(1 - F(x)\big)^n'
visualizacion:
  componente: OrderStatsViz
  parametros:
    modo: extremos
    distribucion: exponencial
    n: 5
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.6'
  - clave: ross-probabilidad
    capitulo: '6.6'
publicado: true
---

## Intuición

Una presa resiste si la crecida más alta del año no supera su altura; una cadena se rompe en su eslabón más débil; un servidor con réplicas sigue en línea mientras al menos una funcione. En cada caso la variable importante es un **máximo** o un **mínimo** de varias variables.

Para variables independientes hay un razonamiento directo. El máximo es menor o igual que $x$ exactamente cuando **todas** lo son, y por independencia esa probabilidad es un producto: $F(x)^n$. De manera simétrica, el mínimo es mayor que $x$ cuando todas lo son, con probabilidad $(1 - F(x))^n$. Conforme crece $n$, estos productos empujan el máximo hacia la derecha y el mínimo hacia la izquierda: con más observaciones, es más probable que alguna sea extrema.

## Definición

:::teorema[Distribución del máximo y del mínimo]
Sean $X_1, \dots, X_n$ independientes con función de distribución $F$, y sean $M = \max_i X_i$ y $m = \min_i X_i$. Entonces
$$
F_M(x) = F(x)^n, \qquad P(m > x) = \big(1 - F(x)\big)^n, \quad F_m(x) = 1 - \big(1 - F(x)\big)^n.
$$
Si $F$ tiene densidad $f$, las densidades son $f_M(x) = n F(x)^{n-1} f(x)$ y $f_m(x) = n \big(1 - F(x)\big)^{n-1} f(x)$.
:::

Si las variables tienen distribuciones distintas $F_1, \dots, F_n$, la regla sigue valiendo con productos: $F_M(x) = \prod_i F_i(x)$ y $P(m > x) = \prod_i (1 - F_i(x))$.

:::figura[Tres uniformes entre 0 y 1: el máximo tiene densidad $3u^2$, cargada hacia 1, y el mínimo $3(1 - u)^2$, cargada hacia 0.]{componente="OrderStatsViz"}
```yaml
modo: extremos
distribucion: uniforme
parametros:
  a: 0
  b: 1
n: 3
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: variables independientes con distribución $F$ y densidad $f$.
- $M = \max_i X_i$: el máximo; $m = \min_i X_i$: el mínimo.
- $F_M$, $F_m$: sus funciones de distribución; $f_M$, $f_m$: sus densidades.
- $F_i$: distribución de $X_i$ cuando no son idénticas.
- $\lambda$: tasa de una exponencial.
- $T$: vida útil de los componentes del ejemplo, en años.
:::

## Cómo usar la visualización

Cada paso simula 5 tiempos exponenciales con media 1. La tira de arriba los ordena y marca el menor y el mayor; abajo se acumulan dos histogramas, el del mínimo y el del máximo, junto a sus densidades exactas y la densidad de cada observación, punteada. El encabezado compara la probabilidad exacta de que el máximo no supere la mediana de una observación, $0.5^5 \approx 0.031$, con la proporción simulada.

La deslizadera cambia $n$. Con más observaciones el mínimo se aprieta contra 0 y el máximo se aleja: el mínimo de $n$ exponenciales es exponencial con media $1/n$, y la media del máximo crece como $1 + 1/2 + \dots + 1/n$.

## Ejemplo

Un equipo tiene 3 componentes con vida útil $T$ exponencial de media 2 años, independientes.

1. **En serie** (falla al fallar el primero): la vida es el mínimo, exponencial con tasa $3 \cdot 0.5 = 1.5$. Probabilidad de durar más de 1 año: $e^{-1.5} \approx 0.223$.
2. **En paralelo** (falla al fallar el último): la vida es el máximo. Probabilidad de fallar antes de 1 año: $\big(1 - e^{-0.5}\big)^3 = 0.3935^3 \approx 0.061$.
3. La redundancia en paralelo reduce la probabilidad de falla en el primer año de 0.393 (un solo componente) a 0.061.

:::figura[El ejemplo de los componentes: con media 2 por componente, el mínimo de 3 tiene media 2/3 de año y el máximo media $2(1 + 1/2 + 1/3) \approx 3.67$ años.]{componente="OrderStatsViz"}
```yaml
modo: extremos
distribucion: exponencial
parametros:
  lambda: 0.5
n: 3
```
:::

## Propiedades

- **Exponenciales:** el mínimo de exponenciales independientes con tasas $\lambda_i$ es exponencial con tasa $\sum_i \lambda_i$.
- **Uniformes:** el máximo de $n$ uniformes en $(0, 1)$ tiene media $n/(n + 1)$ y el mínimo $1/(n + 1)$.
- **Simetría:** $\min_i X_i = -\max_i(-X_i)$, así que basta estudiar uno de los dos.
- **Crecimiento del máximo:** con colas exponenciales el máximo crece como $\log n$; con colas potenciales crece como una potencia de $n$. El estudio de su límite reescalado es la teoría de valores extremos.

:::figura[El máximo de 20 uniformes se concentra muy cerca de 1, con media $20/21 \approx 0.95$, mientras que el mínimo queda cerca de 0.]{componente="OrderStatsViz"}
```yaml
modo: extremos
distribucion: uniforme
parametros:
  a: 0
  b: 1
n: 20
```
:::

## Errores comunes

- **Multiplicar por $n$ en lugar de elevar a la $n$.** $P(M \le x)$ es $F(x)^n$, no $nF(x)$, que puede superar 1.
- **Olvidar la independencia.** Si las variables están correlacionadas, como las lluvias de días consecutivos, el producto ya no es válido.
- **Confundir el mínimo con una observación típica.** El mínimo de 10 normales estándar tiene media cercana a $-1.54$, muy lejos de 0.

:::figura[Diez normales estándar: el máximo se centra cerca de 1.54 y el mínimo cerca de $-1.54$, simétricos alrededor de 0.]{componente="OrderStatsViz"}
```yaml
modo: extremos
distribucion: normal
n: 10
```
:::

## Conexiones

El máximo y el mínimo son los casos $k = n$ y $k = 1$ de los [[estadisticos-de-orden]], y se calculan con la [[independencia-de-variables-aleatorias]]. La distribución del mínimo se expresa con la [[funcion-de-supervivencia]], y la del máximo con potencias de la [[funcion-de-distribucion-acumulada]]. La distribución exponencial es especialmente cómoda porque su mínimo vuelve a ser exponencial.

## Formulario

:::formula[Máximo]
$$
F_M(x) = F(x)^n, \qquad f_M(x) = n F(x)^{n-1} f(x)
$$

- $M = \max_i X_i$: máximo de $n$ variables independientes con distribución $F$ y densidad $f$.
- $F_M$, $f_M$: función de distribución y densidad del máximo.
:::

:::formula[Mínimo]
$$
P(m > x) = \big(1 - F(x)\big)^n, \qquad f_m(x) = n\big(1 - F(x)\big)^{n-1} f(x)
$$

- $m = \min_i X_i$: mínimo de las $n$ variables.
- $f_m$: densidad del mínimo; $1 - F(x)$: probabilidad de que una variable supere $x$.
:::

:::formula[Distribuciones distintas]
$$
F_M(x) = \prod_{i=1}^{n} F_i(x), \qquad P(m > x) = \prod_{i=1}^{n} \big(1 - F_i(x)\big)
$$

- $F_i$: función de distribución de $X_i$, independientes pero no necesariamente idénticas.
:::

:::formula[Mínimo de exponenciales]
$$
\min_i X_i \sim \operatorname{Exp}\Big(\sum_{i=1}^{n} \lambda_i\Big)
$$

- $X_i \sim \operatorname{Exp}(\lambda_i)$ independientes, con tasas $\lambda_i$.
:::

:::formula[Uniformes]
$$
\mathbb{E}[M] = \frac{n}{n + 1}, \qquad \mathbb{E}[m] = \frac{1}{n + 1}
$$

- $n$ uniformes independientes entre 0 y 1; $\mathbb{E}$: esperanza.
:::
