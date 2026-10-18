---
id: desigualdad-de-chebyshev
titulo: Desigualdad de Chebyshev
titulo_en: Chebyshev's inequality
alias:
  - cota de Chebyshev
  - desigualdad de Bienaymé y Chebyshev
  - desigualdad de Tchebycheff
modulo: 1
submodulo: '1.5'
orden: 2
nivel: intermedio
prerrequisitos:
  - desigualdad-de-markov
  - desviacion-estandar
relaciones:
  - tipo: relacionado
    id: desigualdad-de-cantelli
etiquetas:
  - cota de dos colas
  - varianza
  - k desviaciones estándar
  - distribución arbitraria
resumen: >
  Para cualquier variable con varianza finita, la probabilidad de alejarse de la media k desviaciones
  estándar o más es a lo más 1/k². Garantiza que al menos el 75 % de la probabilidad está a menos
  de dos desviaciones.
formula: 'P\big(|X - \mu| \ge k\sigma\big) \le \frac{1}{k^2}, \qquad k > 0'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: cola
    cota: chebyshev
    distribucion: normal
    umbral: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '10.1'
  - clave: ross-probabilidad
    capitulo: '8.2'
publicado: true
---

## Intuición

La regla de la normal dice que el 95 % de la probabilidad está a menos de dos desviaciones estándar de la media. Pero esa regla solo vale para la normal. ¿Qué se puede garantizar si no se conoce la forma de la distribución? La **desigualdad de Chebyshev** responde: al menos el 75 %. Y a menos de tres desviaciones, al menos el 89 %.

La razón es la misma que en la desigualdad de Markov, aplicada a la distancia al cuadrado. La varianza es el promedio de $(X - \mu)^2$; si mucha probabilidad estuviera lejos de la media, ese promedio sería grande. La cota $1/k^2$ es pesimista para distribuciones con forma de campana, pero vale para todas, incluidas las asimétricas y las de colas pesadas, siempre que la varianza sea finita.

## Definición

:::teorema[Desigualdad de Chebyshev]
Si $X$ tiene media $\mu$ y varianza $\sigma^2$ finita, para todo $k > 0$
$$
P\big(|X - \mu| \ge k\sigma\big) \le \frac{1}{k^2}.
$$
Equivalentemente, para todo $t > 0$, $P(|X - \mu| \ge t) \le \sigma^2 / t^2$.
:::

Se obtiene aplicando la desigualdad de Markov a la variable no negativa $(X - \mu)^2$ con umbral $k^2\sigma^2$. La cota solo informa para $k > 1$.

:::figura[La uniforme entre 0 y 1: a 1.5 desviaciones estándar de la media queda una probabilidad de 0.134 fuera, mientras que la cota de Chebyshev da $1/1.5^2 \approx 0.444$.]{componente="InequalityBound"}
```yaml
modo: cola
cota: chebyshev
distribucion: uniforme
parametros:
  a: 0
  b: 1
umbral: 1.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con media $\mu$ y desviación estándar $\sigma$.
- $k$: número de desviaciones estándar.
- $t = k\sigma$: distancia a la media en las unidades de $X$.
- $(X - \mu)^2$: distancia al cuadrado, a la que se aplica Markov.
- $\bar{X}_n$: promedio de $n$ observaciones independientes; $\varepsilon$: tolerancia positiva.
- $r$: orden de un momento.
- $W$: peso de los paquetes del ejemplo, en gramos.
:::

## Cómo usar la visualización

Arriba está la densidad normal estándar con las dos colas $|X - \mu| \ge k\sigma$ sombreadas; abajo, la probabilidad exacta de esas colas y la cota $1/k^2$ como funciones de $k$. Con $k = 2$ la probabilidad exacta es 0.046 y la cota 0.25.

La deslizadera mueve $k$. Para $k < 1$ la cota supera 1 y no dice nada; para $k$ grande la probabilidad exacta de la normal cae como $e^{-k^2/2}$, mucho más rápido que $1/k^2$. El botón de reproducción recorre $k$ de 0.25 a 4.

## Ejemplo

Una empacadora llena paquetes con peso $W$ de media 500 gramos y desviación estándar 5 gramos, sin que se conozca la forma de la distribución.

1. Probabilidad de que un paquete se desvíe 15 gramos o más: $k = 15/5 = 3$, así que $P(|W - 500| \ge 15) \le 1/9 \approx 0.111$.
2. Al menos el 88.9 % de los paquetes pesa entre 485 y 515 gramos.
3. Si se supiera que $W$ es normal, la probabilidad sería 0.0027. La diferencia es el precio de no conocer la distribución.

:::figura[La distribución de Laplace, de colas más pesadas que la normal: a 3 desviaciones estándar queda fuera una probabilidad de 0.014, cinco veces la de la normal y aún muy por debajo de la cota 0.111.]{componente="InequalityBound"}
```yaml
modo: cola
cota: chebyshev
distribucion: laplace
umbral: 3
```
:::

## Propiedades

- **Ley débil de los grandes números:** aplicada al promedio de $n$ observaciones independientes, con varianza $\sigma^2/n$, da $P(|\bar{X}_n - \mu| \ge \varepsilon) \le \sigma^2/(n\varepsilon^2) \to 0$.
- **Es óptima:** para cada $k \ge 1$ existe una distribución que alcanza la igualdad: vale $\mu \pm k\sigma$ con probabilidad $1/(2k^2)$ cada uno y $\mu$ el resto del tiempo.
- **Versión de una cola:** la desigualdad de Cantelli mejora la cota para una sola cola a $1/(1 + k^2)$.
- **Con momentos más altos:** $P(|X - \mu| \ge t) \le \mathbb{E}|X - \mu|^r / t^r$, más fuerte en las colas lejanas si el momento existe.

:::figura[Un caso de igualdad: la variable de Rademacher vale $-1$ o 1 con probabilidad 1/2, y con $k = 1$ toda su masa está a exactamente una desviación estándar, así que la probabilidad y la cota valen 1.]{componente="InequalityBound"}
```yaml
modo: cola
cota: chebyshev
distribucion: rademacher
umbral: 1
```
:::

## Errores comunes

- **Usar la regla 68, 95, 99.7 sin saber si la distribución es normal.** Para una distribución desconocida solo se garantizan 0, 75 % y 88.9 %.
- **Aplicarla con $k < 1$.** La cota supera 1 y no aporta información.
- **Olvidar que la varianza debe ser finita.** Con la distribución de Cauchy o la $t$ con 2 grados de libertad, la desigualdad no aplica.

:::figura[Con $k = 0.8$ la cota de Chebyshev es $1/0.8^2 \approx 1.56$, mayor que 1, y la visualización la recorta en 1: no dice nada, aunque la probabilidad exacta de estar a 0.8 desviaciones o más en una normal es 0.42.]{componente="InequalityBound"}
```yaml
modo: cola
cota: chebyshev
distribucion: normal
umbral: 0.8
```
:::

## Conexiones

La desigualdad de Chebyshev es la [[desigualdad-de-markov]] aplicada a la distancia al cuadrado, y da sentido a la [[desviacion-estandar]] como escala universal. Su versión de una cola es la [[desigualdad-de-cantelli]]. Aplicada al promedio prueba la [[ley-debil-de-los-grandes-numeros]] y la [[convergencia-en-probabilidad]] a partir de la [[convergencia-en-media-cuadratica]]. Para sumas de variables acotadas, la [[desigualdad-de-hoeffding]] y la [[cota-de-chernoff]] dan cotas exponenciales mucho más fuertes.

## Formulario

:::formula[Desigualdad de Chebyshev]
$$
P\big(|X - \mu| \ge k\sigma\big) \le \frac{1}{k^2}
$$

- $\mu$, $\sigma$: media y desviación estándar; $k > 0$.
:::

:::formula[Forma con la distancia]
$$
P(|X - \mu| \ge t) \le \frac{\sigma^2}{t^2}
$$

- $t > 0$ en las unidades de $X$.
:::

:::formula[Promedio de n observaciones]
$$
P\big(|\bar{X}_n - \mu| \ge \varepsilon\big) \le \frac{\sigma^2}{n\varepsilon^2}
$$

- Observaciones independientes con varianza $\sigma^2$.
:::
