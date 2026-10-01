---
id: teorema-central-del-limite
titulo: Teorema central del límite
titulo_en: Central limit theorem
alias:
  - TCL
  - teorema del límite central
  - CLT
modulo: 3
submodulo: '3.1'
orden: 8
nivel: intermedio
prerrequisitos:
  - convergencia-en-distribucion
  - ley-debil-de-los-grandes-numeros
  - distribucion-normal
etiquetas:
  - distribución normal
  - sumas
  - media muestral
  - aproximación
  - convergencia en distribución
resumen: >
  La suma o la media de muchas variables independientes con varianza finita, una vez estandarizada,
  tiene distribución aproximadamente normal, sin importar la forma de la población de partida.
formula: '\frac{\sqrt{n}\,(\bar{X}_n - \mu)}{\sigma} = \frac{S_n - n\mu}{\sigma\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: clasico
    poblacion: exponencial
    poblaciones:
      - exponencial
      - uniforme
      - dado
      - bernoulli
      - bimodal
      - arcoseno
      - lognormal
      - asimetrica-discreta
    n: 10
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
  - clave: wasserman
publicado: true
---

## Intuición

En una sucursal bancaria el tiempo de atención de cada cliente es muy irregular: la mayoría tarda poco y unos cuantos tardan muchísimo. Su distribución es claramente asimétrica. Sin embargo, el tiempo total para atender a 36 clientes tiene una distribución casi simétrica, con forma de campana. Lo mismo ocurre con la suma de 30 dados, con el peso total de un lote de piezas o con el promedio de calificaciones de un grupo.

El teorema central del límite explica por qué: al sumar muchas contribuciones independientes, ninguna domina, y las irregularidades de cada una se compensan. Lo único que sobrevive de la población original es su media y su varianza; todo lo demás, la asimetría, los picos, los huecos, se diluye. Después de restar la media de la suma y dividir entre su desviación estándar, el resultado se parece cada vez más a la normal estándar. Por eso la distribución normal aparece en todas partes y por eso tantos procedimientos estadísticos, como los intervalos de confianza para una media, funcionan aunque los datos no sean normales.

## Definición

:::teorema[Teorema central del límite]
Sean $X_1, X_2, \dots$ independientes e idénticamente distribuidas con media $\mu$ y varianza $\sigma^2$, con $0 < \sigma^2 < \infty$. Sea $S_n = X_1 + \cdots + X_n$. Entonces
$$
Z_n = \frac{S_n - n\mu}{\sigma\sqrt{n}} = \frac{\sqrt{n}\,(\bar{X}_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1),
$$
es decir, $P(Z_n \le z) \to \Phi(z)$ para todo $z \in \mathbb{R}$.
:::

En la práctica se lee como una aproximación: para $n$ grande, $S_n \approx \mathcal{N}(n\mu, n\sigma^2)$ y $\bar{X}_n \approx \mathcal{N}(\mu, \sigma^2/n)$. Las condiciones de independencia e igual distribución se pueden relajar (versiones de Lyapunov y Lindeberg-Feller), pero la varianza finita es esencial.

:::nota[Qué significa cada símbolo]
- $X_i$: observación $i$, independientes con la misma distribución.
- $\mu$: media de cada observación; $\sigma^2$, su varianza; $\sigma$, su desviación estándar.
- $S_n$: suma de las $n$ observaciones; $\bar{X}_n = S_n/n$, su media.
- $Z_n$: suma estandarizada, con media 0 y varianza 1.
- $\xrightarrow{d}$: convergencia en distribución.
- $\mathcal{N}(0, 1)$: normal estándar; $\Phi$, su función de distribución.
- $z$: valor real donde se comparan las distribuciones.
:::

## Cómo usar la visualización

El panel de arriba muestra la población y, con marcas, los valores de la última muestra. Cada muestra de tamaño $n$ produce un valor de $Z_n$ que cae en el histograma de abajo; la curva es la normal estándar y el escalón, la distribución exacta de $Z_n$ calculada por convolución. El panel de valores reporta la distancia máxima entre la distribución exacta y la normal.

Con la exponencial y $n = 1$ el histograma reproduce la asimetría de la población; con $n = 10$ ya es casi simétrico. La distancia a la normal baja de 0.13 con $n = 1$ a 0.04 con $n = 10$ y a 0.02 con $n = 40$. La mezcla con dos modas pierde sus jorobas desde $n = 4$. La población discreta con un valor raro y grande necesita un $n$ mucho mayor: la asimetría de $Z_n$ disminuye como $1/\sqrt{n}$.

## Ejemplo

En una sucursal el tiempo de atención de cada cliente es exponencial con media $\mu = 5$ minutos, así que $\sigma = 5$ minutos. Se pregunta la probabilidad de que atender a 36 clientes tome más de 200 minutos.

1. La suma tiene media $n\mu = 36 \cdot 5 = 180$ minutos y desviación estándar $\sigma\sqrt{n} = 5 \cdot 6 = 30$ minutos.
2. Se estandariza: $P(S_{36} > 200) = P\big(Z_{36} > \frac{200 - 180}{30}\big) = P(Z_{36} > 0.667)$.
3. Por el teorema central del límite: $P(Z_{36} > 0.667) \approx 1 - \Phi(0.667) = 0.2525$.
4. Valor exacto: la suma de 36 exponenciales tiene distribución gamma, y $P(S_{36} > 200) = 0.2424$.
5. El error de la aproximación es de una centésima pese a que cada tiempo individual es muy asimétrico.

:::figura[El ejemplo de la sucursal: suma estandarizada de 36 tiempos exponenciales. El histograma y la distribución exacta ya están muy cerca de la normal.]{componente="CentralLimit"}
```yaml
modo: clasico
poblacion: exponencial
n: 36
```
:::

## Propiedades

- **Media y suma:** $\bar{X}_n \approx \mathcal{N}(\mu, \sigma^2/n)$ y $S_n \approx \mathcal{N}(n\mu, n\sigma^2)$ para $n$ grande.
- **Aproximación normal a la binomial:** si $S_n \sim \operatorname{Bin}(n, p)$, entonces $\frac{S_n - np}{\sqrt{np(1-p)}} \xrightarrow{d} \mathcal{N}(0, 1)$; con variables enteras conviene la corrección por continuidad de $\pm 0.5$.
- **Velocidad:** la distancia entre la distribución de $Z_n$ y la normal es de orden $1/\sqrt{n}$ (teorema de Berry-Esseen); poblaciones más asimétricas requieren $n$ mayor.
- **Asimetría residual:** si la población tiene asimetría $\gamma$, la de $Z_n$ es $\gamma/\sqrt{n}$.
- **Universalidad:** el límite no depende de la población, solo de $\mu$ y $\sigma^2$.

:::figura[Propiedad: suma de 30 dados. La población es plana y discreta, y la suma estandarizada ya es prácticamente normal.]{componente="CentralLimit"}
```yaml
modo: clasico
poblacion: dado
n: 30
```
:::

:::figura[Propiedad: la asimetría se diluye como 1/√n. Con una población discreta que rara vez toma un valor grande, la suma estandarizada sigue sesgada con n = 20.]{componente="CentralLimit"}
```yaml
modo: clasico
poblacion: asimetrica-discreta
n: 20
```
:::

:::figura[Propiedad: las modas de la población desaparecen. Una mezcla con dos picos produce sumas estandarizadas con un solo pico desde n = 4.]{componente="CentralLimit"}
```yaml
modo: clasico
poblacion: bimodal
n: 4
```
:::

## Errores comunes

- **Creer que los datos se vuelven normales.** Lo que se aproxima a la normal es la distribución de la suma o de la media, no la de las observaciones individuales.
- **Aplicarlo con $n$ pequeño y población muy asimétrica.** La regla de "$n \ge 30$" no es universal; con asimetría fuerte se necesitan muchos más datos.
- **Aplicarlo sin varianza finita.** Con datos Cauchy la media no se estabiliza y la suma estandarizada no tiende a la normal.
- **Olvidar la independencia.** Con observaciones fuertemente dependientes la varianza de la suma no es $n\sigma^2$ y la aproximación falla.

:::figura[Error común: n pequeño con población asimétrica. Con exponenciales y n = 3 la suma estandarizada todavía está claramente sesgada a la derecha.]{componente="CentralLimit"}
```yaml
modo: clasico
poblacion: exponencial
n: 3
```
:::

:::figura[Error común: sin varianza finita no hay teorema central del límite. La media de 50 observaciones Cauchy tiene la misma distribución que una sola.]{componente="CentralLimit"}
```yaml
modo: falla
poblacion: cauchy
n: 50
```
:::

## Conexiones

Es un resultado de [[convergencia-en-distribucion]] que complementa a la [[ley-debil-de-los-grandes-numeros]]: la ley dice hacia dónde va la media y el teorema, cómo fluctúa alrededor. La versión estándar es el [[tcl-de-lindeberg-levy]]; el [[tcl-de-lyapunov]] y el [[tcl-de-lindeberg-feller]] permiten sumandos distintos; el [[tcl-multivariado]] trata vectores. El [[teorema-de-berry-esseen]] cuantifica su error y [[cuando-el-tcl-falla]] muestra sus límites. Con el [[metodo-delta]] y el [[teorema-de-slutsky]] se extiende a funciones de medias y a estadísticos estandarizados con la desviación estimada.

## Formulario

:::formula[Teorema central del límite]
$$
Z_n = \frac{S_n - n\mu}{\sigma\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $S_n$: suma de $n$ observaciones independientes.
- $\mu$, $\sigma$: media y desviación estándar de cada observación.
- $\mathcal{N}(0, 1)$: normal estándar.
:::

:::formula[Forma con la media]
$$
\frac{\sqrt{n}\,(\bar{X}_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1), \qquad \bar{X}_n \approx \mathcal{N}\Big(\mu, \frac{\sigma^2}{n}\Big)
$$

- $\bar{X}_n$: media muestral.
- $\sigma^2/n$: varianza de la media.
:::

:::formula[Probabilidad aproximada para una suma]
$$
P(S_n > s) \approx 1 - \Phi\Big(\frac{s - n\mu}{\sigma\sqrt{n}}\Big)
$$

- $s$: umbral.
- $\Phi$: función de distribución normal estándar.
:::

:::formula[Aproximación normal a la binomial con corrección por continuidad]
$$
P(S_n \ge k) \approx 1 - \Phi\Big(\frac{k - 0.5 - np}{\sqrt{np(1-p)}}\Big)
$$

- $S_n \sim \operatorname{Bin}(n, p)$: número de éxitos.
- $k$: valor entero.
- $p$: probabilidad de éxito.
:::

:::formula[Asimetría de la suma estandarizada]
$$
\gamma(Z_n) = \frac{\gamma}{\sqrt{n}}
$$

- $\gamma$: asimetría de la población, $\mathbb{E}[(X - \mu)^3]/\sigma^3$.
:::
