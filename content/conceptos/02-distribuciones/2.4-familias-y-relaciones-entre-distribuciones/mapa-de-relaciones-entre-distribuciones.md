---
id: mapa-de-relaciones-entre-distribuciones
titulo: Mapa de relaciones entre distribuciones
titulo_en: Relationships among probability distributions
alias:
  - relaciones entre distribuciones
  - qué distribución usar
  - cómo leer gráficas de distribuciones
modulo: 2
submodulo: '2.4'
orden: 7
nivel: intermedio
prerrequisitos:
  - distribucion-t-de-student
  - distribucion-binomial-negativa
  - distribucion-de-weibull
  - distribucion-beta
relaciones:
  - tipo: relacionado
    id: distribucion-gamma
  - tipo: relacionado
    id: distribucion-exponencial
  - tipo: relacionado
    id: distribucion-beta
  - tipo: relacionado
    id: teorema-central-del-limite
etiquetas:
  - relaciones entre distribuciones
  - casos particulares
  - aproximaciones
  - elección de modelo
  - lectura de gráficas
resumen: >
  Muchas distribuciones son casos particulares, límites, transformaciones o mezclas de otras. El mapa
  reúne esas conexiones, explica cómo leer sus gráficas y orienta sobre qué distribución usar.
formula: '\operatorname{Bin}(n, p) \approx \operatorname{Poisson}(np), \quad \chi^{2}_{k} = \operatorname{Gamma}\!\left(\tfrac{k}{2}, \tfrac{1}{2}\right), \quad t_{\nu} \xrightarrow{d} \mathcal{N}(0, 1)'
visualizacion:
  componente: DistributionMap
  parametros:
    relacion: binomial-poisson
referencias:
  - clave: blitzstein-hwang
  - clave: casella-berger
  - clave: wasserman
publicado: true
---

## Intuición

Un catálogo de distribuciones puede parecer una lista larga de fórmulas sin relación entre sí. En realidad casi todas están conectadas, y conocer esas conexiones reduce mucho lo que hay que memorizar. La exponencial es la gamma que espera un solo evento; la chi-cuadrada es una gamma con un parámetro fijo; la Bernoulli es la binomial de un solo intento. Estos son casos particulares: una distribución dentro de otra.

Otras conexiones son límites. Una binomial con muchos intentos y probabilidad pequeña se comporta como una Poisson, y una t de Student con muchos grados de libertad se comporta como una normal. También hay construcciones: sumar cuadrados de normales produce una chi-cuadrada, dividir chi-cuadradas produce una F y elevar e a una normal produce una lognormal. Por último están las mezclas: una Poisson cuya tasa cambia al azar produce más variabilidad que una Poisson fija, y ese conteo es una binomial negativa.

Un mapa de carreteras no dice a dónde ir, pero muestra por dónde se llega. Este mapa cumple la misma función: ante un problema concreto ayuda a reconocer qué distribución lo describe y qué otras se le parecen.

## Definición

Entre dos distribuciones se distinguen cuatro tipos de relación.

:::definicion[Tipos de relación]
- **Caso particular:** la distribución $A$ es un caso particular de $B$ si existe un valor de los parámetros de $B$ con el que $B$ coincide con $A$. Por ejemplo, $\operatorname{Gamma}(1, \beta) = \operatorname{Exp}(\beta)$.
- **Límite:** $A$ es límite de una sucesión $B_n$ si $B_n \xrightarrow{d} A$, es decir, si $P(B_n \le x) \to P(A \le x)$ en todo punto de continuidad $x$ de la función de distribución de $A$. Por ejemplo, $\operatorname{Bin}(n, \lambda/n) \xrightarrow{d} \operatorname{Poisson}(\lambda)$.
- **Construcción:** $A$ es la distribución de una función $g(X_1, \dots, X_k)$ de variables independientes con distribución $B$. Por ejemplo, $\sum_{i=1}^{k} Z_i^{2} \sim \chi^{2}_{k}$ si $Z_i \sim \mathcal{N}(0, 1)$.
- **Mezcla:** $A$ resulta de sortear primero un parámetro $\Theta$ y después $X \mid \Theta \sim B(\Theta)$. Por ejemplo, si $\Lambda \sim \operatorname{Gamma}$ y $X \mid \Lambda \sim \operatorname{Poisson}(\Lambda)$, entonces $X$ es binomial negativa.
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: distribuciones; $B_n$: una sucesión de distribuciones indexada por $n$.
- $\xrightarrow{d}$: convergencia en distribución.
- $\operatorname{Bin}(n, p)$, $\operatorname{Poisson}(\lambda)$, $\operatorname{Exp}(\beta)$, $\operatorname{Gamma}(\alpha, \beta)$: binomial, Poisson, exponencial y gamma con sus parámetros.
- $\mathcal{N}(0, 1)$: normal estándar; $Z_i$: normales estándar independientes.
- $\chi^{2}_{k}$: chi-cuadrada con $k$ grados de libertad.
- $g$: función que transforma las variables; $X_1, \dots, X_k$: variables independientes.
- $\Theta$, $\Lambda$: parámetros que se sortean antes de generar el dato.
:::

### Cómo leer las gráficas de una distribución

Una distribución dice qué valores puede tomar una variable aleatoria $X$ y qué tan probable es cada uno. Todas las fichas del Atlas la muestran de la misma manera, y conviene saber leer esas gráficas antes de comparar distribuciones.

**Discretas y continuas.** En una distribución discreta, $X$ toma valores contables (0, 1, 2, ...) y la gráfica es de barras: la altura de cada barra ya es una probabilidad. En una continua, $X$ toma cualquier valor de un rango y la gráfica es una curva de densidad: la altura no es una probabilidad, y la probabilidad de un intervalo es el **área** bajo la curva. Por eso una densidad puede valer más que 1 sin ningún error; lo que siempre vale 1 es el área total.

:::figura[Barras: en la binomial con n = 10 y p = 0.5, la barra del 5 mide 0.2461 y esa altura es la probabilidad P(X = 5).]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 10
  p: 0.5
region: intervalo
desde: 5
hasta: 5
muestras: false
```
:::

:::figura[Densidad mayor que 1: la normal con σ = 0.3 tiene un pico de 1.33, pero el área entre -0.3 y 0.3 es 0.6827 y el área total es 1. Los botones cambian entre σ = 0.3 y σ = 1.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 0.3
dominio: [-4, 4]
region: intervalo
desde: -0.3
hasta: 0.3
casos:
  - nombre: 'σ = 0.3'
    descripcion: 'Campana angosta: el pico llega a 1.33 y aun así el área total es 1.'
    valores: {mu: 0, sigma: 0.3}
    region: intervalo
    desde: -0.3
    hasta: 0.3
  - nombre: 'σ = 1'
    descripcion: 'Normal estándar: el pico baja a 0.40 y el intervalo de una desviación, de -1 a 1, conserva el área 0.6827.'
    valores: {mu: 0, sigma: 1}
    region: intervalo
    desde: -1
    hasta: 1
muestras: false
```
:::

**Soporte.** Es el conjunto de valores posibles de $X$. La beta vive en $[0, 1]$, la chi-cuadrada en $x \ge 0$ y la normal en toda la recta. Fuera del soporte la masa o la densidad vale cero.

:::figura[Soporte de la chi-cuadrada: la región X ≤ 0 tiene probabilidad 0, porque una suma de cuadrados nunca es negativa.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 3
dominio: [-2, 15]
region: izquierda
desde: 0
muestras: false
```
:::

**Tres preguntas para cada gráfica.** Dónde está el **centro**, qué tan ancha es la **dispersión** y qué tan pesadas son las **colas**. Dos distribuciones pueden coincidir en las dos primeras y diferir mucho en la tercera.

:::figura[Centro, dispersión y colas: la t con 3 grados (curva) y la normal estándar (línea punteada) tienen el mismo centro, pero más allá de ±3 la t deja 0.0577 y la normal solo 0.0027.]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 3
region: colas
desde: -3
hasta: 3
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
  etiqueta: Normal estándar
  visible: true
```
:::

## Cómo usar la visualización

El dibujo muestra las distribuciones como recuadros unidos por líneas, con un color para cada tipo de relación según la leyenda: caso particular, límite, construcción o mezcla. Al elegir una línea, en el dibujo o en el selector "Relación", aparece abajo la explicación con enlaces a las dos fichas y una gráfica que pone las dos distribuciones juntas, con la segunda como línea punteada o como la construcción animada.

Elige "Binomial y Poisson" y baja $p$ con el control: las barras y la línea punteada se pegan. Elige "t de Student y normal" y sube $\nu$: las colas de la t se adelgazan hasta coincidir con la normal. Elige "Chi-cuadrada dentro de la gamma" y mueve $k$: la línea punteada lo sigue y nunca se separa.

## Ejemplo

Las relaciones sirven para calcular. Una aseguradora tiene 200 pólizas y cada una genera un reclamo grande en el año con probabilidad 0.01, de forma independiente. Se quiere $P(X \ge 4)$ para el número $X$ de reclamos grandes, y después el valor crítico de una prueba chi-cuadrada con 4 grados.

1. $X \sim \operatorname{Bin}(200, 0.01)$. Como $n$ es grande y $p$ pequeña, se aproxima por $\operatorname{Poisson}(\lambda)$ con $\lambda = np = 2$.
2. Con la Poisson, $P(X \le 3) = e^{-2}(1 + 2 + 2 + 4/3) \approx 0.1353 + 0.2707 + 0.2707 + 0.1804 = 0.8571$.
3. Entonces $P(X \ge 4) \approx 0.1429$; el valor exacto de la binomial es 0.1420, una diferencia menor a una milésima.
4. Para la chi-cuadrada con 4 grados se usa que $\chi^{2}_{4} = \operatorname{Gamma}(2, 1/2)$, cuya cola tiene forma cerrada: $P(\chi^{2}_{4} > x) = e^{-x/2}(1 + x/2)$.
5. Con $x = 9.488$: $e^{-4.744}(1 + 4.744) \approx 0.00870 \cdot 5.744 \approx 0.0500$. Así se comprueba a mano que 9.488 es el valor crítico al 5 %.

:::figura[Reclamos grandes: la binomial con n = 200 y p = 0.01 (barras) frente a la Poisson con λ = np = 2 (línea punteada). La región X ≥ 4 vale 0.1420 en la binomial.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 200
  p: 0.01
rangos:
  n: [1, 300]
  p: [0.001, 0.2]
dominio: [0, 15]
region: derecha
desde: 4
muestras: false
referencia:
  distribucion: poisson
  enlace:
    lambda: {de: [n, p]}
  etiqueta: Poisson con λ = np
  visible: true
```
:::

:::figura[La chi-cuadrada con 4 grados es la gamma de forma 2 y escala 2: la cola desde 9.488 vale 0.05 en las dos curvas, que coinciden.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 4
dominio: [0, 20]
region: derecha
desde: 9.488
muestras: false
referencia:
  distribucion: gamma
  valores:
    beta: 0.5
  enlace:
    alpha: {de: [k], factor: 0.5}
  etiqueta: Gamma de forma k/2 y escala 2
  visible: true
```
:::

## Propiedades

- **Casos particulares:** $\operatorname{Bin}(1, p) = \operatorname{Bernoulli}(p)$; $\operatorname{Gamma}(1, \beta) = \operatorname{Exp}(\beta)$; $\chi^{2}_{k} = \operatorname{Gamma}(k/2, 1/2)$; $\operatorname{Weibull}(1, \lambda) = \operatorname{Exp}(1/\lambda)$; $\operatorname{Beta}(1, 1) = \mathcal{U}(0, 1)$; $t_{1}$ es la Cauchy estándar; la gamma con forma entera es la Erlang.
- **Límites:** $\operatorname{Bin}(n, p) \approx \operatorname{Poisson}(np)$ con $n$ grande y $p$ pequeña; $t_{\nu} \to \mathcal{N}(0, 1)$ cuando $\nu \to \infty$; la binomial y la Poisson se acercan a la normal cuando su varianza crece, por el [[teorema-central-del-limite]].
- **Construcciones:** $\sum Z_i^{2} \sim \chi^{2}_{k}$; $\frac{Z}{\sqrt{V/\nu}} \sim t_{\nu}$; $\frac{V_1/d_1}{V_2/d_2} \sim F_{d_1, d_2}$; $e^{Y}$ es lognormal si $Y$ es normal; la diferencia de dos exponenciales independientes con la misma tasa es Laplace; la suma de $k$ exponenciales con la misma tasa es Erlang.
- **Mezclas:** una Poisson con tasa gamma es binomial negativa; una binomial con probabilidad beta es beta-binomial. Las mezclas conservan la media y aumentan la varianza.

### Mapa rápido: qué distribución usar

- Resultado de sí o no: [[distribucion-de-bernoulli|Bernoulli]].
- Éxitos en un número fijo de intentos: [[distribucion-binomial|binomial]].
- Intentos hasta el primer éxito: [[distribucion-geometrica|geométrica]].
- Extracciones sin reemplazo de una población finita: [[distribucion-hipergeometrica|hipergeométrica]].
- Conteo de eventos en un intervalo: [[distribucion-de-poisson|Poisson]].
- Conteos con mucha variabilidad: [[distribucion-binomial-negativa|binomial negativa]].
- Espera hasta el primer evento: [[distribucion-exponencial|exponencial]].
- Espera hasta el evento número k: [[distribucion-gamma|gamma]].
- Mediciones en forma de campana: [[distribucion-normal|normal]].
- Datos positivos con sesgo a la derecha: [[distribucion-lognormal|lognormal]].
- Intervalo con todo igual de probable: [[distribucion-uniforme-continua|uniforme]].
- Inferencia sobre una media con muestras chicas: [[distribucion-t-de-student|t de Student]].
- Pruebas de varianza y tablas de contingencia: [[distribucion-chi-cuadrada|chi-cuadrada]].
- Análisis de varianza y comparación de modelos: [[distribucion-f-de-snedecor|F de Snedecor]].
- Probabilidades y tasas entre 0 y 1: [[distribucion-beta|beta]].
- Confiabilidad y tiempo hasta la falla: [[distribucion-de-weibull|Weibull]].
- Ingresos, tamaños y colas de ley de potencia: [[distribucion-de-pareto|Pareto]].
- Máximos de muchas observaciones: [[distribucion-de-gumbel|Gumbel]].
- Ángulos y direcciones: [[distribucion-de-von-mises|von Mises]].
- Conteos en varias categorías a la vez: [[distribucion-multinomial|multinomial]].

:::figura[Mezcla: la binomial negativa con r = 3 y p = 0.4 (barras) y la Poisson con la misma media 4.5 (línea punteada). La mezcla tiene varianza 11.25 en lugar de 4.5 y deja más masa en ambos extremos.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial-negativa
valores:
  r: 3
  p: 0.4
region: derecha
desde: 10
muestras: false
referencia:
  distribucion: poisson
  valores:
    lambda: 4.5
  etiqueta: Poisson con media 4.5
  visible: true
```
:::

:::figura[Límite de la Poisson hacia la normal: la curva punteada es la normal con media λ y varianza λ y sigue al control; con λ = 30 casi coincide con las barras.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 30
muestras: false
referencia:
  distribucion: normal
  enlace:
    mu: {de: [lambda]}
    sigma: {de: [lambda], potencias: [0.5]}
  etiqueta: Normal con media λ y varianza λ
  visible: true
```
:::

## Errores comunes

- **Usar un límite fuera de su régimen.** La aproximación de Poisson a la binomial necesita $n$ grande y $p$ pequeña; con $n = 20$ y $p = 0.5$ la Poisson de media 10 tiene varianza 10 en lugar de 5 y falla.
- **Confundir parametrizaciones al aplicar un caso particular.** La chi-cuadrada es gamma de forma $k/2$ y **tasa** 1/2, es decir, **escala** 2; usar escala 1/2 da una distribución distinta.
- **Pensar que una mezcla es un promedio de densidades con los parámetros promediados.** Mezclar Poissons con tasas distintas no da una Poisson con la tasa media: da más variabilidad.
- **Leer la altura de una densidad como probabilidad.** En una distribución continua la probabilidad está en el área; una densidad de 1.33 no significa probabilidad 1.33.
- **Comparar solo centro y dispersión.** La t con 3 grados y la normal tienen el mismo centro, pero más allá de 3 la cola de la t es más de 20 veces la de la normal.

:::figura[Límite fuera de régimen: la binomial con n = 20 y p = 0.5 (barras) frente a la Poisson con λ = np = 10 (línea punteada), mucho más ancha.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.5
muestras: false
referencia:
  distribucion: poisson
  enlace:
    lambda: {de: [n, p]}
  etiqueta: Poisson con λ = np
  visible: true
```
:::

:::figura[Escala frente a tasa: la chi-cuadrada con 4 grados (curva) frente a la gamma de forma 2 y tasa 2, es decir, escala 1/2 (línea punteada). No coinciden.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 4
dominio: [0, 15]
muestras: false
referencia:
  distribucion: gamma
  valores:
    alpha: 2
    beta: 2
  etiqueta: Gamma de forma 2 y tasa 2
  visible: true
```
:::

## Conexiones

El mapa resume relaciones que cada ficha desarrolla: la [[distribucion-de-bernoulli]] dentro de la [[distribucion-binomial]], el límite hacia la [[distribucion-de-poisson]], la [[distribucion-exponencial]] y la [[distribucion-chi-cuadrada]] dentro de la [[distribucion-gamma]], la [[distribucion-de-weibull]] con forma 1, la [[distribucion-uniforme-continua]] dentro de la [[distribucion-beta]] y la [[distribucion-t-de-student]] que tiende a la [[distribucion-normal]]. La [[distribucion-f-de-snedecor]] se construye con chi-cuadradas. Los límites hacia la normal son consecuencia del [[teorema-central-del-limite]], que también explica por qué el promedio de muchos datos de casi cualquier distribución es aproximadamente normal.

## Formulario

:::formula[Binomial hacia Poisson]
$$
\binom{n}{k} p^{k}(1 - p)^{n - k} \approx e^{-\lambda}\frac{\lambda^{k}}{k!}, \qquad \lambda = np
$$

- $n$: número de intentos; $p$: probabilidad de éxito; $k$: número de éxitos.
- $\lambda$: tasa de la Poisson, igual a la media de la binomial.
:::

:::formula[Casos particulares de la gamma]
$$
\operatorname{Gamma}(1, \beta) = \operatorname{Exp}(\beta), \qquad \chi^{2}_{k} = \operatorname{Gamma}\!\left(\frac{k}{2}, \frac{1}{2}\right)
$$

- $\beta$: tasa; su inverso es la escala.
- $k$: grados de libertad de la chi-cuadrada.
:::

:::formula[Construcciones con normales]
$$
\sum_{i=1}^{k} Z_i^{2} \sim \chi^{2}_{k}, \qquad \frac{Z}{\sqrt{V/\nu}} \sim t_{\nu}, \qquad \frac{V_1/d_1}{V_2/d_2} \sim F_{d_1, d_2}
$$

- $Z$, $Z_i$: normales estándar independientes.
- $V \sim \chi^{2}_{\nu}$, $V_1 \sim \chi^{2}_{d_1}$, $V_2 \sim \chi^{2}_{d_2}$: chi-cuadradas independientes.
- $\nu$, $d_1$, $d_2$: grados de libertad.
:::

:::formula[Cola de la chi-cuadrada con 4 grados]
$$
P(\chi^{2}_{4} > x) = e^{-x/2}\left(1 + \frac{x}{2}\right)
$$

- $x$: umbral, positivo.
- Se obtiene de la gamma de forma 2, que es una Erlang.
:::

:::formula[Mezcla de Poisson con tasa gamma]
$$
\Lambda \sim \operatorname{Gamma}(r, \beta), \quad X \mid \Lambda \sim \operatorname{Poisson}(\Lambda) \;\Longrightarrow\; X \sim \operatorname{BN}\!\left(r, \frac{\beta}{1 + \beta}\right)
$$

- $\Lambda$: tasa aleatoria; $r$: forma y $\beta$: tasa de la gamma.
- $X$: conteo; $\operatorname{BN}(r, p)$: binomial negativa que cuenta fracasos antes de $r$ éxitos.
:::
