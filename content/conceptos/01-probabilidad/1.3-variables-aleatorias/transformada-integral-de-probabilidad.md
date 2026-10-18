---
id: transformada-integral-de-probabilidad
titulo: Transformada integral de probabilidad
titulo_en: Probability integral transform
alias:
  - teorema de la transformada integral
  - uniformización
  - PIT
modulo: 1
submodulo: '1.3'
orden: 28
nivel: intermedio
prerrequisitos:
  - metodo-de-la-cdf-para-transformaciones
  - funcion-cuantil
relaciones:
  - tipo: relacionado
    id: muestreo-por-transformada-inversa
etiquetas:
  - uniforme
  - función de distribución
  - valor p
  - calibración
  - cópulas
resumen: >
  Si X es continua con función de distribución F, la variable F(X) es uniforme entre 0 y 1, sea cual sea la distribución de X. Toda distribución continua se vuelve uniforme al evaluarla en su propia F.
formula: 'X \text{ continua con distribución } F \quad \Rightarrow \quad U = F(X) \sim \mathrm{U}(0, 1)'
visualizacion:
  componente: TransformationViz
  parametros:
    modo: integral-probabilidad
    distribucion: normal
referencias:
  - clave: blitzstein-hwang
    capitulo: '5.3'
  - clave: wasserman
publicado: true
---

## Intuición

Supongamos que una estatura sale en el percentil 73 de su población. Si se repite el experimento muchas veces, ¿qué percentiles salen? Cada percentil es igual de probable: la probabilidad de caer por debajo del percentil 30 es exactamente 30 %, por debajo del 80 es 80 %, y así para cualquier valor. Es decir, el **percentil** de una observación es uniforme, sin importar si la variable es normal, exponencial o cualquier otra continua.

Eso es la **transformada integral de probabilidad**: evaluar una variable en su propia función de distribución, $U = F(X)$, da una uniforme entre 0 y 1. La función de distribución convierte valores en "posiciones relativas", y las posiciones relativas de una variable continua están repartidas de manera pareja.

## Definición

:::definicion[Transformada integral de probabilidad]
Sea $X$ una variable aleatoria con función de distribución $F$ continua. Entonces
$$
U = F(X)
$$
tiene distribución uniforme en $(0, 1)$: $P(U \le u) = u$ para todo $u \in [0, 1]$.
:::

La prueba es una línea con el método de la función de distribución cuando $F$ es estrictamente creciente: $P(F(X) \le u) = P(X \le F^{-1}(u)) = F(F^{-1}(u)) = u$. Con tramos planos se usa la función cuantil y el resultado se mantiene.

:::figura[Con la exponencial de media 1: cada valor simulado de $X$ sube hasta la curva $F$ y se lleva al eje vertical. Los valores de $X$ se amontonan cerca de 0, pero los de $U = F(X)$ forman un histograma plano.]{componente="TransformationViz"}
```yaml
modo: integral-probabilidad
distribucion: exponencial
parametros:
  lambda: 1
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable continua.
- $F$: función de distribución de $X$.
- $F^{-1}$: función cuantil.
- $U = F(X)$: posición relativa de $X$ en su distribución.
- $\mathrm{U}(0, 1)$: distribución uniforme entre 0 y 1.
- $u$: número entre 0 y 1.
- $T$: tiempo de vida del ejemplo.
:::

## Cómo usar la visualización

Arriba está la función de distribución normal estándar. La animación genera valores de $X$; cada uno sube desde el eje horizontal hasta la curva y avanza hasta el eje vertical, donde se lee $U = F(X)$. Abajo a la izquierda se acumula el histograma de $X$, con forma de campana; a la derecha, el de $U$, que tiende a ser plano.

Los valores de $X$ cerca de 0 son frecuentes, pero ahí la curva es empinada y los separa mucho en el eje vertical; los valores de las colas son raros, pero ahí la curva es plana y los junta. Los dos efectos se compensan exactamente.

## Ejemplo

El tiempo de vida $T$ de un componente, en años, sigue una Weibull con $F(t) = 1 - e^{-t^2}$ para $t \ge 0$.

1. $U = F(T) = 1 - e^{-T^2}$ es uniforme en $(0, 1)$.
2. Comprobación con $u = 0.5$: $P(U \le 0.5) = P(T \le \sqrt{\ln 2}) = 1 - e^{-\ln 2} = 0.5$.
3. Uso práctico: si el modelo es correcto, los valores $F(t_i)$ de los tiempos observados deben parecer uniformes. Si se amontonan cerca de 0 o de 1, el modelo subestima o sobrestima los tiempos.

:::figura[El ejemplo del componente: los tiempos de vida de Weibull pasan por su función de distribución y los valores resultantes llenan el intervalo de 0 a 1 de manera pareja.]{componente="TransformationViz"}
```yaml
modo: integral-probabilidad
distribucion: weibull
parametros:
  k: 2
  lambda: 1
```
:::

## Propiedades

- **Universalidad:** vale para toda distribución continua, con colas ligeras o pesadas, simétrica o no.
- **Inversa:** si $U$ es uniforme, $F^{-1}(U)$ tiene distribución $F$; es el muestreo por transformada inversa, el camino de regreso.
- **Valores p:** bajo la hipótesis nula, un valor p calculado con una distribución continua exacta es uniforme en $(0, 1)$.
- **Cópulas:** aplicando la transformada a cada coordenada de un vector aleatorio se obtienen marginales uniformes, y lo que queda describe solo la dependencia.
- **Calibración:** en pronósticos probabilísticos, los valores $F(y_{\text{obs}})$ deben ser uniformes; su histograma diagnostica sesgos y exceso o falta de dispersión.

:::figura[Incluso con la Cauchy, de colas tan pesadas que no tiene media, $F(X)$ es uniforme: los valores extremos de $X$ se comprimen cerca de 0 y de 1.]{componente="TransformationViz"}
```yaml
modo: integral-probabilidad
distribucion: cauchy
```
:::

## Errores comunes

- **Aplicarla a variables discretas.** Si $X$ es discreta, $F(X)$ solo toma unos cuantos valores y no es uniforme. Para la cara de un dado, $F(X)$ vale $1/6, 2/6, \dots, 1$, con media $7/12$ y no $1/2$.
- **Usar la función de distribución equivocada.** Si los datos vienen de $G$ y se transforman con $F \ne G$, el resultado no es uniforme; precisamente eso permite detectar el error.
- **Confundirla con la estandarización.** $(X - \mu)/\sigma$ cambia posición y escala pero conserva la forma; $F(X)$ cambia la forma a uniforme.

:::figura[$F(X)$ para la cara de un dado: solo toma seis valores, y su función de distribución es una escalera, no la recta de una uniforme. Por ejemplo, $P(F(X) \le 0.4) = 1/3$, no 0.4.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
valores: [0.167, 0.333, 0.5, 0.667, 0.833, 1]
nombre: la posición F(X) de la cara de un dado
simbolo: U
x: 0.4
```
:::

## Conexiones

La transformada se prueba con el [[metodo-de-la-cdf-para-transformaciones]] aplicado a $g = F$, y su inversa, mediante la [[funcion-cuantil]], es el [[muestreo-por-transformada-inversa]]. Muestra que la [[funcion-de-distribucion-acumulada]] convierte cualquier variable continua en una uniforme, lo que explica por qué los valores p son uniformes bajo la hipótesis nula y por qué las cópulas separan marginales y dependencia. Con datos, la versión empírica es el rango relativo, relacionado con los [[cuantiles-cuartiles-deciles-y-percentiles]].

## Formulario

:::formula[Transformada integral]
$$
U = F(X) \sim \mathrm{U}(0, 1)
$$

- $F$ continua.
:::

:::formula[Prueba]
$$
P(F(X) \le u) = P\big(X \le F^{-1}(u)\big) = F\big(F^{-1}(u)\big) = u
$$

- Para $F$ estrictamente creciente.
:::

:::formula[Transformación inversa]
$$
U \sim \mathrm{U}(0, 1) \quad \Rightarrow \quad F^{-1}(U) \sim F
$$

- Vale para cualquier $F$, incluso discreta.
:::
