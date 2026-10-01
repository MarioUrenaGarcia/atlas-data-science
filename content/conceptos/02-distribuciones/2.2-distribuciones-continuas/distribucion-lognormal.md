---
id: distribucion-lognormal
titulo: Distribución lognormal
titulo_en: Log-normal distribution
alias:
  - lognormal
  - log-normal
  - LogN(μ, σ²)
modulo: 2
submodulo: '2.2'
orden: 13
nivel: basico
prerrequisitos:
  - distribucion-normal
  - funcion-exponencial-y-logaritmo-natural
relaciones:
  - tipo: relacionado
    id: distribucion-de-pareto
etiquetas:
  - distribución continua
  - crecimiento multiplicativo
  - asimetría positiva
  - escala logarítmica
resumen: >
  Una variable positiva es lognormal si su logaritmo es normal. Surge al multiplicar muchos factores
  positivos independientes, como en precios, ingresos o tamaños de partículas.
formula: 'X = e^{Y},\quad Y \sim \mathcal{N}(\mu, \sigma^{2})'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: lognormal
      valores:
        mu: 0.5
        sigma: 0.6
      dominio: [0, 10]
      casos:
        - nombre: 'Precio de vivienda'
          descripcion: 'μ = 0.5 y σ = 0.6 (millones de pesos): mediana 1.65, media 1.97 y cola derecha visible, porque los factores del precio se multiplican.'
          valores: {mu: 0.5, sigma: 0.6}
        - nombre: 'Tamaño de granos'
          descripcion: 'μ = 0.7 y σ = 0.2: con poca dispersión logarítmica la lognormal es casi simétrica, parecida a una normal.'
          valores: {mu: 0.7, sigma: 0.2}
        - nombre: 'Ingresos'
          descripcion: 'μ = 1 y σ = 1: la cola derecha es muy larga y la media supera a la mediana en un 65 %.'
          valores: {mu: 1, sigma: 1}
      ejemplo:
        titulo: 'Viviendas caras'
        contexto: 'El precio de las viviendas de una ciudad, en millones de pesos, sigue una lognormal con μ = 0.5 y σ = 0.6.'
        pregunta: '¿Qué proporción cuesta más de 3 millones?'
        valores: {mu: 0.5, sigma: 0.6}
        region: derecha
        desde: 3
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: producto
        valores:
          n: 12
          mu: 0.5
          sigma: 0.6
referencias:
  - clave: blitzstein-hwang
    capitulo: '6'
  - clave: wasserman
    capitulo: '2'
publicado: true
---

## Intuición

El precio de una vivienda resulta de muchos factores que actúan multiplicándose: la ciudad lo duplica, la colonia lo aumenta un 30 %, el tamaño lo multiplica por 1.5, la antigüedad lo reduce un 20 %. Cuando una cantidad se forma multiplicando muchos factores positivos e independientes, su logaritmo es una suma de muchos términos, y por eso el logaritmo tiende a ser normal. La cantidad misma sigue entonces una distribución lognormal.

La lognormal es siempre positiva y asimétrica: la mayoría de los valores se agrupa en una zona moderada y una cola larga a la derecha recoge casos varias veces mayores que el típico. La diferencia entre multiplicar por 1.2 y dividir entre 1.2 es simétrica en escala logarítmica, pero no en la escala original, donde los aumentos se acumulan más lejos.

En escala logarítmica todo se vuelve sencillo: el centro es la media del logaritmo y la dispersión es su desviación estándar. Por eso los datos lognormales se analizan casi siempre tomando logaritmos. La mediana de la lognormal es $e^{\mu}$, y la media es mayor porque la cola derecha la empuja hacia arriba.

## Definición

:::definicion[Distribución lognormal]
Una variable aleatoria positiva $X$ tiene **distribución lognormal** con parámetros $\mu \in \mathbb{R}$ y $\sigma > 0$, $X \sim \operatorname{LogN}(\mu, \sigma^{2})$, si $\log X \sim \mathcal{N}(\mu, \sigma^{2})$. Su densidad es
$$
f(x) = \frac{1}{x\,\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(\log x - \mu)^{2}}{2\sigma^{2}}\right), \qquad x > 0.
$$
:::

Su función de distribución se obtiene de la normal: $F(x) = \Phi\!\left(\frac{\log x - \mu}{\sigma}\right)$.

:::nota[Qué significa cada símbolo]
- $X$: cantidad positiva.
- $Y = \log X$: su logaritmo natural, que es normal.
- $\mu$: media del logaritmo; $e^{\mu}$ es la mediana de $X$.
- $\sigma$: desviación estándar del logaritmo.
- $\Phi$: función de distribución de la normal estándar.
- $\frac{1}{x}$: factor que aparece al cambiar de escala logarítmica a escala original.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad lognormal, la región elegida y su probabilidad; los casos cargan precios, tamaños e ingresos, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge multiplica 12 factores positivos al azar en cada experimento: el producto va creciendo en la segunda recta y su valor final cae en el histograma.

Al pasar del caso de los granos al de los ingresos, la curva pasa de casi simétrica a muy sesgada. En la vista de función de distribución, el cuantil 0.5 marca la mediana $e^{\mu}$, siempre menor que la media.

## Ejemplo

El precio de las viviendas de una ciudad, en millones de pesos, sigue $\operatorname{LogN}(0.5, 0.6^{2})$.

1. Precio mediano: $e^{0.5} \approx 1.65$ millones; la mitad de las viviendas cuesta menos.
2. Precio medio: $e^{\mu + \sigma^{2}/2} = e^{0.5 + 0.18} \approx 1.97$ millones, mayor que la mediana.
3. Proporción de viviendas de más de 3 millones: $P(X > 3) = 1 - \Phi\!\left(\frac{\log 3 - 0.5}{0.6}\right) = 1 - \Phi(0.998) \approx 0.159$.
4. Precio que solo supera el 10 % más caro: $e^{0.5 + 1.282 \cdot 0.6} \approx 3.56$ millones.

:::figura[Precios de vivienda LogN(0.5, 0.36): el área sombreada a la derecha de 3 millones vale 0.159.]{componente="DistributionExplorer"}
```yaml
distribucion: lognormal
valores:
  mu: 0.5
  sigma: 0.6
dominio: [0, 10]
ejemplo:
  titulo: 'Viviendas caras'
  contexto: 'El precio de las viviendas de una ciudad, en millones de pesos, sigue una lognormal con μ = 0.5 y σ = 0.6.'
  pregunta: '¿Qué proporción cuesta más de 3 millones?'
  valores: {mu: 0.5, sigma: 0.6}
  region: derecha
  desde: 3
region: derecha
desde: 3
muestras: false
```
:::

## Propiedades

- **Mediana y moda:** $\operatorname{mediana} = e^{\mu}$ y $\operatorname{moda} = e^{\mu - \sigma^{2}}$.
- **Media y varianza:** $\mathbb{E}[X] = e^{\mu + \sigma^{2}/2}$ y $\operatorname{Var}(X) = (e^{\sigma^{2}} - 1)e^{2\mu + \sigma^{2}}$.
- **Orden de los centros:** moda < mediana < media, con distancias que crecen con $\sigma$.
- **Productos:** si $X_1$ y $X_2$ son lognormales independientes, $X_1X_2$ es lognormal con $\mu_1 + \mu_2$ y $\sigma_1^{2} + \sigma_2^{2}$.
- **Potencias:** $X^{a} \sim \operatorname{LogN}(a\mu, a^{2}\sigma^{2})$; en particular $1/X \sim \operatorname{LogN}(-\mu, \sigma^{2})$.
- **Origen multiplicativo:** el producto de muchos factores positivos independientes es aproximadamente lognormal, por el teorema central del límite aplicado a los logaritmos.

:::figura[Tres casos con contexto (precio de vivienda, tamaño de granos, ingresos): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: lognormal
valores:
  mu: 0.5
  sigma: 0.6
dominio: [0, 10]
casos:
  - nombre: 'Precio de vivienda'
    descripcion: 'μ = 0.5 y σ = 0.6 (millones de pesos): mediana 1.65, media 1.97 y cola derecha visible, porque los factores del precio se multiplican.'
    valores: {mu: 0.5, sigma: 0.6}
  - nombre: 'Tamaño de granos'
    descripcion: 'μ = 0.7 y σ = 0.2: con poca dispersión logarítmica la lognormal es casi simétrica, parecida a una normal.'
    valores: {mu: 0.7, sigma: 0.2}
  - nombre: 'Ingresos'
    descripcion: 'μ = 1 y σ = 1: la cola derecha es muy larga y la media supera a la mediana en un 65 %.'
    valores: {mu: 1, sigma: 1}
```
:::

:::figura[Origen multiplicativo: cada resultado multiplica 12 factores positivos al azar; el producto sigue LogN(0.5, 0.36).]{componente="ContinuousGenesis"}
```yaml
proceso: producto
valores:
  n: 12
  mu: 0.5
  sigma: 0.6
```
:::

:::figura[Efecto de σ: con σ = 0.25 la lognormal (curva) es casi simétrica; con σ = 1 (línea punteada) la cola derecha se alarga y la moda se pega al cero.]{componente="DistributionExplorer"}
```yaml
distribucion: lognormal
valores:
  mu: 0.5
  sigma: 0.25
dominio: [0, 8]
muestras: false
referencia:
  distribucion: lognormal
  valores:
    mu: 0.5
    sigma: 1
  etiqueta: LogN(0.5, 1)
```
:::

## Errores comunes

- **Confundir μ con la media de X.** $\mu$ es la media del logaritmo; la media de $X$ es $e^{\mu + \sigma^{2}/2}$.
- **Reportar la media como valor típico.** En datos lognormales la mediana describe mejor el caso típico; la media está inflada por la cola.
- **Promediar los datos y luego tomar logaritmo.** El logaritmo del promedio no es el promedio de los logaritmos; para estimar $\mu$ se promedian los logaritmos.
- **Usar intervalos simétricos en la escala original.** Los intervalos se construyen en escala logarítmica y luego se exponencian, lo que los vuelve asimétricos.

:::figura[Mediana frente a media: el cuantil 0.5 de LogN(0.5, 0.36) es 1.65, mientras que la media, marcada con el triángulo, es 1.97.]{componente="DistributionExplorer"}
```yaml
distribucion: lognormal
valores:
  mu: 0.5
  sigma: 0.6
vista: acumulada
probabilidad: 0.5
muestras: false
```
:::

## Conexiones

La lognormal es la [[funcion-exponencial-y-logaritmo-natural|exponencial]] de una [[distribucion-normal]]. Compite con la [[distribucion-gamma]] y la [[distribucion-de-weibull]] para modelar cantidades positivas asimétricas, y con la [[distribucion-de-pareto]] para ingresos y tamaños, aunque su cola es más ligera que la de una ley de potencia. En finanzas, los precios de activos se modelan como lognormales porque sus rendimientos logarítmicos se suman.

## Formulario

:::formula[Definición]
$$
X = e^{Y}, \qquad Y \sim \mathcal{N}(\mu, \sigma^{2})
$$

- $\mu$, $\sigma$: media y desviación del logaritmo.
:::

:::formula[Densidad]
$$
f(x) = \frac{1}{x\,\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(\log x - \mu)^{2}}{2\sigma^{2}}\right), \qquad x > 0
$$

- $\log$: logaritmo natural.
:::

:::formula[Función de distribución]
$$
F(x) = \Phi\!\left(\frac{\log x - \mu}{\sigma}\right)
$$

- $\Phi$: función de distribución normal estándar.
:::

:::formula[Centros]
$$
\operatorname{moda} = e^{\mu - \sigma^{2}}, \qquad \operatorname{mediana} = e^{\mu}, \qquad \mathbb{E}[X] = e^{\mu + \sigma^{2}/2}
$$

- Los tres coinciden solo en el límite $\sigma \to 0$.
:::

:::formula[Varianza]
$$
\operatorname{Var}(X) = \left(e^{\sigma^{2}} - 1\right)e^{2\mu + \sigma^{2}}
$$

- Crece muy rápido con $\sigma$.
:::
