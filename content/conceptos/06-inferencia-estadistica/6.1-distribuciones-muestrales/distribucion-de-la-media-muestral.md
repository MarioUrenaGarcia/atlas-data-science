---
id: distribucion-de-la-media-muestral
titulo: Distribución de la media muestral
titulo_en: Sampling distribution of the sample mean
alias:
  - distribución de X barra
  - distribución del promedio
modulo: 6
submodulo: '6.1'
orden: 3
nivel: basico
prerrequisitos:
  - error-estandar
  - teorema-central-del-limite
etiquetas:
  - inferencia
  - media muestral
  - normalidad
  - teorema central del límite
resumen: >
  La media muestral tiene media mu y varianza sigma cuadrada entre n. Si la población es normal, es
  exactamente normal; si no, se aproxima a una normal al crecer n por el teorema central del límite.
formula: '\bar{X} \sim \mathcal{N}\!\left(\mu,\ \frac{\sigma^2}{n}\right)\ \text{(exacta si la población es normal)}'
visualizacion:
  componente: SamplingSimulator
  parametros:
    poblacion:
      distribucion: gamma
      valores:
        alpha: 1.5
        beta: 1
    estadistico: media
    n: 4
    nMaximo: 100
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: blitzstein-hwang
    capitulo: '10'
publicado: true
---

## Intuición

Los tiempos de reparación de un taller tienen una distribución asimétrica: la mayoría de los trabajos toma poco, unos pocos toman muchísimo. Si cada semana se promedian 4 reparaciones, el promedio semanal todavía hereda algo de esa asimetría. Si se promedian 30, la distribución de los promedios ya parece una campana simétrica, centrada en el tiempo medio de reparación y mucho más angosta que la de los tiempos individuales.

Ese comportamiento tiene tres partes que conviene separar. El centro: la media muestral apunta en promedio al valor correcto, la media de la población. La dispersión: se reduce como $\sigma/\sqrt{n}$. La forma: si la población es normal, la media es normal desde $n = 1$; si no, se vuelve aproximadamente normal al crecer $n$, más rápido cuanto menos asimétrica sea la población. Esa última parte es el teorema central del límite.

## Definición

:::teorema[Distribución de la media muestral]
Sea $X_1, \dots, X_n$ una muestra aleatoria de una población con media $\mu$ y varianza $\sigma^2$ finita, y $\bar{X} = \frac{1}{n}\sum_{i=1}^{n} X_i$. Entonces:

1. $\mathbb{E}[\bar{X}] = \mu$ y $\operatorname{Var}(\bar{X}) = \sigma^2/n$.
2. Si la población es $\mathcal{N}(\mu, \sigma^2)$, entonces $\bar{X} \sim \mathcal{N}(\mu, \sigma^2/n)$ exactamente.
3. En general, por el teorema central del límite,
$$
\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)\quad \text{cuando } n \to \infty.
$$
:::

:::demostracion[Media y varianza]
Por linealidad, $\mathbb{E}[\bar{X}] = \frac{1}{n}\sum \mathbb{E}[X_i] = \frac{1}{n} n\mu = \mu$. Por independencia, las varianzas se suman: $\operatorname{Var}(\bar{X}) = \frac{1}{n^2}\sum \operatorname{Var}(X_i) = \frac{1}{n^2} n \sigma^2 = \frac{\sigma^2}{n}$.
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: muestra aleatoria independiente; $n$: tamaño de muestra.
- $\bar{X}$: media muestral.
- $\mu$, $\sigma^2$: media y varianza de la población.
- $\mathcal{N}(\mu, \sigma^2/n)$: normal con media $\mu$ y varianza $\sigma^2/n$.
- $\xrightarrow{d}$: convergencia en distribución.
- $\mathbb{E}$, $\operatorname{Var}$: esperanza y varianza.
:::

## Cómo usar la visualización

La población es una gamma asimétrica con media 1.5. Cada muestra de tamaño $n$ aporta su media al histograma, y la curva es la aproximación normal $\mathcal{N}(\mu, \sigma^2/n)$.

Controles: **Tamaño de cada muestra**, los parámetros de la población y **Mostrar la distribución teórica**.

Experimentos sugeridos:

1. Con $n = 4$, observar que el histograma todavía tiene cola derecha y no coincide del todo con la curva.
2. Subir $n$ a 30: el histograma se vuelve simétrico y la curva lo describe bien.
3. Aumentar la forma $\alpha$ de la gamma: la población es menos asimétrica y la aproximación funciona con $n$ más pequeño.

## Ejemplo

El peso de los paquetes de café de una empacadora es normal con $\mu = 500$ g y $\sigma = 6$ g. Un inspector pesa 9 paquetes.

1. $\bar{X} \sim \mathcal{N}(500, 36/9) = \mathcal{N}(500, 4)$, con error estándar 2 g.
2. Probabilidad de que el promedio sea menor que 497 g: $z = (497 - 500)/2 = -1.5$, y $P(Z < -1.5) \approx 0.0668$.
3. Para un solo paquete: $z = (497 - 500)/6 = -0.5$ y $P \approx 0.3085$. Un paquete ligero es común; un promedio de 9 tan bajo es raro.

:::figura[Población normal: la media de 9 observaciones es exactamente normal, con una desviación tres veces menor que la de los datos.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.5
estadistico: media
n: 9
poblacionEditable: false
```
:::

## Propiedades

- **Insesgada:** $\mathbb{E}[\bar{X}] = \mu$ para cualquier población con media finita.
- **Consistente:** se concentra alrededor de $\mu$ al crecer $n$ (ley de los grandes números).
- **Normalidad aproximada** para $n$ grande si $\sigma^2$ es finita; con poblaciones simétricas basta un $n$ pequeño, con poblaciones muy asimétricas se necesita más.

:::figura[Población discreta: la media de 20 conteos de Poisson ya tiene forma de campana.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: poisson
  valores:
    lambda: 2
estadistico: media
n: 20
poblacionEditable: false
```
:::

## Errores comunes

- **Creer que los datos se vuelven normales al crecer n.** Es la media la que se aproxima a una normal; los datos conservan la forma de la población.
- **Aplicar la regla "n mayor que 30" sin mirar la población.** Con colas muy pesadas o mucha asimetría puede no bastar; con poblaciones simétricas basta menos.
- **Usarla con varianza infinita.** Para una población de Cauchy la media de $n$ datos tiene la misma distribución que un solo dato: no se concentra.

:::figura[Población de Cauchy: la media muestral no se concentra al crecer n, porque la población no tiene varianza finita.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: cauchy
estadistico: media
n: 30
poblacionEditable: false
```
:::

## Conexiones

La media muestral generaliza la [[media-aritmetica]] a una variable aleatoria. Su dispersión es el [[error-estandar]] y su forma límite la da el [[teorema-central-del-limite]]; su concentración, la [[ley-debil-de-los-grandes-numeros]]. Cuando la población es [[distribucion-normal|normal]] la distribución es exacta. Al estandarizarla con $s$ en lugar de $\sigma$ se obtiene el [[estadistico-pivote]] con distribución t.

## Formulario

:::formula[Media y varianza de la media muestral]
$$
\mathbb{E}[\bar{X}] = \mu,\qquad \operatorname{Var}(\bar{X}) = \frac{\sigma^2}{n}
$$

- $\mu$, $\sigma^2$: media y varianza de la población; $n$: tamaño de muestra.
:::

:::formula[Caso normal]
$$
X_i \sim \mathcal{N}(\mu, \sigma^2) \Longrightarrow \bar{X} \sim \mathcal{N}\!\left(\mu, \frac{\sigma^2}{n}\right)
$$

- La distribución es exacta para cualquier $n$.
:::

:::formula[Teorema central del límite]
$$
\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $\xrightarrow{d}$: convergencia en distribución al crecer $n$; requiere $\sigma^2$ finita.
:::

:::formula[Probabilidad para la media]
$$
P(\bar{X} < a) \approx \Phi\!\left(\frac{a - \mu}{\sigma/\sqrt{n}}\right)
$$

- $\Phi$: función de distribución de la normal estándar; $a$: valor de corte.
:::
