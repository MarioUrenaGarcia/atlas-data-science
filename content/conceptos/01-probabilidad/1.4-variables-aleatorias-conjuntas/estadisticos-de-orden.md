---
id: estadisticos-de-orden
titulo: Estadísticos de orden
titulo_en: Order statistics
alias:
  - estadístico de orden k
  - valores ordenados de una muestra
  - mediana muestral como estadístico de orden
modulo: 1
submodulo: '1.4'
orden: 14
nivel: intermedio
prerrequisitos:
  - independencia-de-variables-aleatorias
  - funcion-de-densidad-de-probabilidad
relaciones:
  - tipo: relacionado
    id: distribucion-del-maximo-y-del-minimo
  - tipo: relacionado
    id: cuantiles-cuartiles-deciles-y-percentiles
etiquetas:
  - ordenar la muestra
  - k-ésimo menor
  - mediana muestral
  - distribución beta
resumen: >
  Al ordenar una muestra de n observaciones, el valor que queda en el lugar k es el estadístico de
  orden k. Su distribución se deduce contando cuántas observaciones caen por debajo de cada punto,
  y para muestras uniformes es una beta.
formula: 'f_{X_{(k)}}(x) = \frac{n!}{(k-1)!\,(n-k)!}\, F(x)^{k-1}\,\big(1 - F(x)\big)^{n-k} f(x)'
visualizacion:
  componente: OrderStatsViz
  parametros:
    modo: orden
    distribucion: uniforme
    parametros:
      a: 0
      b: 1
    n: 5
    k: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.6'
  - clave: casella-berger
    capitulo: '5.4'
publicado: true
---

## Intuición

En una carrera con cinco corredores, el tiempo del segundo lugar es una variable aleatoria: depende de los cinco tiempos, pero solo a través de su orden. Lo mismo pasa con el menor, el mayor o la mediana de cualquier muestra. Al ordenar $X_1, \dots, X_n$ de menor a mayor se obtienen los **estadísticos de orden** $X_{(1)} \le X_{(2)} \le \dots \le X_{(n)}$.

Su distribución se obtiene contando. Para que el segundo menor de cinco esté cerca de $x$, una observación debe caer debajo de $x$, otra justo en $x$ y las tres restantes por encima. Cada observación cae debajo de $x$ con probabilidad $F(x)$ y por encima con probabilidad $1 - F(x)$, y el número de maneras de asignar esos papeles es un coeficiente multinomial. De ahí sale una fórmula general para cualquier $k$.

## Definición

:::definicion[Estadísticos de orden]
Sean $X_1, \dots, X_n$ independientes con función de distribución $F$ y densidad $f$. Al ordenarlas, $X_{(k)}$ es el $k$-ésimo valor más pequeño. Su densidad es
$$
f_{X_{(k)}}(x) = \frac{n!}{(k-1)!\,(n-k)!}\, F(x)^{k-1}\,\big(1 - F(x)\big)^{n-k} f(x).
$$
Su función de distribución es la probabilidad de que al menos $k$ observaciones queden por debajo de $x$:
$$
P(X_{(k)} \le x) = \sum_{j=k}^{n} \binom{n}{j} F(x)^{j}\, \big(1 - F(x)\big)^{n-j}.
$$
:::

$X_{(1)}$ es el mínimo, $X_{(n)}$ el máximo y, con $n$ impar, $X_{((n+1)/2)}$ es la mediana muestral.

:::figura[La mediana de 9 observaciones normales estándar es el estadístico de orden 5: su densidad es mucho más angosta que la de cada observación, punteada, y está centrada en 0.]{componente="OrderStatsViz"}
```yaml
modo: orden
distribucion: normal
n: 9
k: 5
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: observaciones independientes con distribución $F$ y densidad $f$.
- $X_{(k)}$: estadístico de orden $k$, el $k$-ésimo valor más pequeño.
- $n$: tamaño de la muestra; $k$: rango, entre 1 y $n$.
- $F(x)^{k-1}$: probabilidad de que $k - 1$ observaciones dadas queden debajo de $x$.
- $\binom{n}{j}$: número de maneras de elegir las $j$ observaciones que quedan debajo.
- $U_{(k)}$: estadístico de orden de una muestra uniforme entre 0 y 1.
:::

## Cómo usar la visualización

Cada paso simula una muestra de 5 uniformes entre 0 y 1. La tira de arriba las muestra ordenadas, numeradas por su rango, y resalta la segunda menor; su valor se agrega al histograma de abajo, que se acerca a la densidad exacta $20\,u(1 - u)^3$. La línea punteada es la densidad plana de cada observación.

Las deslizaderas cambian $n$ y $k$. Con $k = 1$ el histograma se carga hacia 0 (el mínimo), con $k = n$ hacia 1 (el máximo), y con $k$ al centro y $n$ grande se vuelve una campana angosta alrededor de la mediana. Si $k$ se pone por encima de $n$, se usa $k = n$.

## Ejemplo

Cuatro componentes con vida útil uniforme entre 0 y 1 (en décadas) funcionan en paralelo, y el sistema necesita al menos dos activos: falla cuando falla el tercero, en el tiempo $U_{(3)}$.

1. Para uniformes, $U_{(k)}$ tiene distribución $\operatorname{Beta}(k,\ n - k + 1)$; aquí $\operatorname{Beta}(3, 2)$, con densidad $12\,u^2(1 - u)$.
2. Vida media del sistema: $\mathbb{E}[U_{(3)}] = k/(n + 1) = 3/5 = 0.6$ décadas.
3. Probabilidad de fallar antes de 0.5: al menos 3 de 4 componentes fallan antes de 0.5, es decir $\binom{4}{3}(0.5)^4 + (0.5)^4 = 5/16 \approx 0.31$.

:::figura[El ejemplo de los componentes: el tercer menor de 4 uniformes tiene media 0.6, y su histograma sigue la densidad beta $12u^2(1 - u)$.]{componente="OrderStatsViz"}
```yaml
modo: orden
distribucion: uniforme
parametros:
  a: 0
  b: 1
n: 4
k: 3
```
:::

## Propiedades

- **Uniformes:** $U_{(k)} \sim \operatorname{Beta}(k,\ n - k + 1)$, con media $k/(n + 1)$.
- **Transformación:** si $X = F^{-1}(U)$, entonces $X_{(k)} = F^{-1}(U_{(k)})$; todo se reduce al caso uniforme por la función cuantil.
- **Dependencia:** los estadísticos de orden no son independientes entre sí, porque están obligados a respetar el orden.
- **Exponenciales:** el mínimo de $n$ exponenciales con tasa $\lambda$ es exponencial con tasa $n\lambda$, y los espacios entre estadísticos consecutivos son exponenciales independientes.
- **Cuantiles muestrales:** con $n$ grande, $X_{(\lceil np \rceil)}$ se concentra alrededor del cuantil $F^{-1}(p)$.

:::figura[El mínimo de 6 exponenciales con media 1 es exponencial con media 1/6: el histograma del estadístico de orden 1 se pega a 0.]{componente="OrderStatsViz"}
```yaml
modo: orden
distribucion: exponencial
n: 6
k: 1
```
:::

## Errores comunes

- **Creer que $X_{(k)}$ tiene la distribución de cada $X_i$.** Ordenar cambia la distribución: el mínimo de una muestra tiende a ser menor que una observación típica.
- **Tratar los valores ordenados como independientes.** Si $X_{(1)}$ es grande, todos los demás también lo son.
- **Esperar que la mediana muestral sea exactamente la mediana poblacional.** Es una variable aleatoria con su propia dispersión, que disminuye con $n$.

:::figura[La mediana de 20 uniformes, estadístico de orden 10: está cerca de 0.5 pero varía de muestra en muestra, con una desviación estándar de alrededor de 0.11.]{componente="OrderStatsViz"}
```yaml
modo: orden
distribucion: uniforme
parametros:
  a: 0
  b: 1
n: 20
k: 10
```
:::

## Conexiones

Los estadísticos de orden se construyen con observaciones que cumplen la [[independencia-de-variables-aleatorias]], y su densidad combina la [[funcion-de-densidad-de-probabilidad]] con la [[funcion-de-distribucion-acumulada]]. Los casos extremos se estudian en la [[distribucion-del-maximo-y-del-minimo]], y la reducción al caso uniforme usa la [[transformada-integral-de-probabilidad]]. Con datos, los estadísticos de orden son la base de la [[mediana]] y de los [[cuantiles-cuartiles-deciles-y-percentiles]].

## Formulario

:::formula[Densidad del estadístico de orden k]
$$
f_{X_{(k)}}(x) = \frac{n!}{(k-1)!\,(n-k)!}\, F(x)^{k-1}\,\big(1 - F(x)\big)^{n-k} f(x)
$$

- $k - 1$ observaciones debajo, una en $x$ y $n - k$ arriba.
:::

:::formula[Función de distribución]
$$
P(X_{(k)} \le x) = \sum_{j=k}^{n} \binom{n}{j} F(x)^{j}\, \big(1 - F(x)\big)^{n-j}
$$

- Al menos $k$ de las $n$ observaciones quedan en o debajo de $x$.
:::

:::formula[Caso uniforme]
$$
U_{(k)} \sim \operatorname{Beta}(k,\ n - k + 1), \qquad \mathbb{E}[U_{(k)}] = \frac{k}{n + 1}
$$

- Observaciones uniformes entre 0 y 1.
:::
