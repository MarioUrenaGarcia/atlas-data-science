---
id: metodo-delta
titulo: Método delta
titulo_en: Delta method
alias:
  - propagación de errores
  - método delta univariado
modulo: 3
submodulo: '3.1'
orden: 15
nivel: intermedio
prerrequisitos:
  - teorema-central-del-limite
  - derivada-como-pendiente-y-razon-de-cambio
etiquetas:
  - normalidad asintótica
  - transformaciones
  - error estándar
  - derivada
resumen: >
  Si √n(Tₙ - θ) converge a una normal y g es derivable en θ con g'(θ) ≠ 0, entonces g(Tₙ) también es
  asintóticamente normal, con desviación estándar multiplicada por |g'(θ)|.
formula: '\sqrt{n}\,(T_n - \theta) \xrightarrow{d} \mathcal{N}(0, \sigma^2) \ \Rightarrow\ \sqrt{n}\,\big(g(T_n) - g(\theta)\big) \xrightarrow{d} \mathcal{N}\big(0, g''(\theta)^2\sigma^2\big)'
visualizacion:
  componente: AsymptoticTransform
  parametros:
    modo: delta
    poblacion:
      distribucion: exponencial
      valores:
        lambda: 0.5
    transformacion: logaritmo
    transformaciones:
      - logaritmo
      - inverso
      - raiz
      - cuadrado
      - exponencial
    n: 30
referencias:
  - clave: casella-berger
    capitulo: '5.5'
  - clave: wasserman
publicado: true
---

## Intuición

Una agencia de transporte mide los tiempos entre llegadas de autobuses a una parada y calcula su promedio. Por el teorema central del límite sabe cuánto varía ese promedio de una semana a otra. Pero lo que reporta no es el tiempo medio, sino la frecuencia: autobuses por minuto, que es el recíproco del promedio. ¿Cuánto varía ese recíproco?

El método delta responde usando una idea de cálculo: cerca de un punto, una función derivable se parece a su recta tangente. Como el promedio se concentra cada vez más cerca de su valor esperado, solo importa cómo se comporta la función en una vecindad pequeña, donde es casi lineal. Una función lineal transforma una normal en otra normal y multiplica su desviación estándar por el valor absoluto de la pendiente. Así, el error estándar de una función de un estimador es el error estándar del estimador multiplicado por $|g'|$. Si la pendiente es cero, la recta tangente es horizontal, la aproximación de primer orden no dice nada y manda el término cuadrático.

## Definición

:::teorema[Método delta]
Sea $T_n$ una sucesión de variables aleatorias con $\sqrt{n}\,(T_n - \theta) \xrightarrow{d} \mathcal{N}(0, \sigma^2)$ y sea $g$ una función derivable en $\theta$ con $g'(\theta) \neq 0$. Entonces
$$
\sqrt{n}\,\big(g(T_n) - g(\theta)\big) \xrightarrow{d} \mathcal{N}\big(0,\ g'(\theta)^2\,\sigma^2\big).
$$
En la práctica: $g(T_n) \approx \mathcal{N}\big(g(\theta),\ g'(\theta)^2\sigma^2/n\big)$, y el error estándar es $|g'(\theta)|\,\sigma/\sqrt{n}$.
:::

:::teorema[Método delta de segundo orden]
Si $g'(\theta) = 0$ y $g''(\theta) \neq 0$ existe, entonces
$$
n\,\big(g(T_n) - g(\theta)\big) \xrightarrow{d} \frac{g''(\theta)\,\sigma^2}{2}\,\chi^2_1.
$$
:::

Cuando $\sigma$ depende de $\theta$, como es habitual, el error estándar estimado se obtiene sustituyendo $\theta$ por $T_n$, lo que es válido por el teorema de Slutsky.

:::nota[Qué significa cada símbolo]
- $T_n$: estimador o estadístico calculado con $n$ datos; típicamente $T_n = \bar{X}_n$.
- $\theta$: valor al que converge $T_n$.
- $\sigma^2$: varianza asintótica de $\sqrt{n}(T_n - \theta)$; para la media muestral, la varianza de la población.
- $g$: función que se aplica al estimador.
- $g'(\theta)$, $g''(\theta)$: primera y segunda derivadas de $g$ en $\theta$.
- $\chi^2_1$: distribución ji cuadrada con un grado de libertad, la de $Z^2$ con $Z$ normal estándar.
- $\xrightarrow{d}$: convergencia en distribución.
:::

## Cómo usar la visualización

El panel superior muestra la curva $g$ cerca de $\mu$ y su recta tangente; cada muestra produce una media $\bar{X}_n$ que se proyecta sobre la curva. Abajo se acumulan los histogramas de las medias y de sus transformadas, con la normal que predice el teorema central del límite a la izquierda y la del método delta a la derecha. El panel compara la desviación estándar observada de $g(\bar{X}_n)$ con la predicha.

Con datos exponenciales de media 2 y $g = \log$, la curvatura todavía se nota con $n = 30$: el histograma de $\log \bar{X}_n$ es un poco asimétrico. Al aumentar $n$ el rango de las medias se estrecha, la curva se confunde con la tangente y ambas desviaciones coinciden. Con $g(x) = 1/x$ la pendiente en $\mu = 2$ es $-1/4$: la dispersión se reduce a la cuarta parte.

## Ejemplo

Los tiempos entre llegadas de autobuses son exponenciales con media $\mu = 2$ minutos ($\sigma = 2$). Con $n = 50$ tiempos se estima la frecuencia de llegadas $\lambda = 1/\mu = 0.5$ autobuses por minuto mediante $\hat{\lambda} = 1/\bar{X}_{50}$.

1. Por el teorema central del límite, $\bar{X}_{50} \approx \mathcal{N}(2, 4/50)$, con error estándar $2/\sqrt{50} = 0.283$ minutos.
2. Con $g(x) = 1/x$: $g'(x) = -1/x^2$, así que $g'(2) = -0.25$.
3. Por el método delta, $\hat{\lambda} \approx \mathcal{N}\big(0.5,\ 0.25^2 \cdot 4/50\big)$, con error estándar $0.25 \cdot 0.283 = 0.0707$ autobuses por minuto.
4. Intervalo aproximado del 95 %: $0.5 \pm 1.96 \cdot 0.0707 = [0.361, 0.639]$.
5. En general, para una exponencial $\sigma = \mu$ y el error estándar de $\hat{\lambda}$ es $\frac{1}{\mu^2}\cdot\frac{\mu}{\sqrt{n}} = \frac{\lambda}{\sqrt{n}}$.

:::figura[El ejemplo de los autobuses: recíproco de la media de 50 tiempos exponenciales con media 2. La desviación de 1/X̄ es la de X̄ multiplicada por |g'(2)| = 0.25.]{componente="AsymptoticTransform"}
```yaml
modo: delta
poblacion:
  distribucion: exponencial
  valores:
    lambda: 0.5
transformacion: inverso
n: 50
```
:::

## Propiedades

- **Linealización:** $g(T_n) = g(\theta) + g'(\theta)(T_n - \theta) + o_p(1/\sqrt{n})$, por el desarrollo de Taylor de primer orden.
- **Transformaciones estabilizadoras de varianza:** si $\sigma^2 = \sigma^2(\theta)$, la función $g$ con $g'(\theta) = 1/\sigma(\theta)$ produce un estimador con varianza asintótica constante. Para proporciones es $g(p) = \arcsin\sqrt{p}$; para conteos de Poisson, $g(\lambda) = \sqrt{\lambda}$.
- **Logit de una proporción:** $\log\frac{\hat{p}}{1 - \hat{p}} \approx \mathcal{N}\Big(\log\frac{p}{1 - p}, \frac{1}{np(1-p)}\Big)$, base de los intervalos para razones de momios.
- **Segundo orden:** si $g'(\theta) = 0$ el error es de orden $1/n$ y la ley límite es una ji cuadrada escalada, no una normal.
- **Invariancia de la consistencia:** si $g$ es continua, $g(T_n) \xrightarrow{p} g(\theta)$ aunque no sea derivable.

:::figura[Propiedad: el logit de una proporción. Con p = 0.3 y n = 100, la desviación de log(p̂/(1 - p̂)) es 1/√(np(1 - p)) = 0.218.]{componente="AsymptoticTransform"}
```yaml
modo: delta
poblacion:
  distribucion: bernoulli
  valores:
    p: 0.3
transformacion: logit
n: 100
```
:::

:::figura[Propiedad: método delta de segundo orden. Con p = 1/2 la función p(1 - p) tiene derivada cero y sus valores se acumulan de un solo lado de 1/4, con forma de ji cuadrada.]{componente="AsymptoticTransform"}
```yaml
modo: delta
poblacion:
  distribucion: bernoulli
  valores:
    p: 0.5
transformacion: varianza-bernoulli
n: 50
```
:::

:::demostracion
Por Taylor, $g(T_n) - g(\theta) = g'(\tilde{\theta}_n)(T_n - \theta)$ con $\tilde{\theta}_n$ entre $T_n$ y $\theta$. Como $T_n \xrightarrow{p} \theta$, también $\tilde{\theta}_n \xrightarrow{p} \theta$ y, si $g'$ es continua, $g'(\tilde{\theta}_n) \xrightarrow{p} g'(\theta)$. Entonces $\sqrt{n}(g(T_n) - g(\theta)) = g'(\tilde{\theta}_n)\sqrt{n}(T_n - \theta)$, y por Slutsky converge a $g'(\theta)\,\mathcal{N}(0, \sigma^2)$.
:::

## Errores comunes

- **Aplicarlo con $g'(\theta) = 0$.** Da varianza cero, lo cual es falso: el error es de orden $1/n$ y hay que usar el segundo orden.
- **Confiar en él con $n$ pequeño y $g$ muy curva.** La aproximación lineal solo vale en una vecindad pequeña; con pocos datos la transformación introduce asimetría y sesgo.
- **Evaluar la derivada en el lugar equivocado.** Se evalúa en $\theta$, el límite, y en la práctica en el estimador, no en un valor arbitrario.
- **Olvidar el dominio de $g$.** Con $g = \log$, una media que puede ser negativa o cero hace que $g(T_n)$ no esté definido.

:::figura[Error común: n pequeño con una función curva. Con n = 5 el logaritmo de la media de exponenciales es claramente asimétrico y su dispersión difiere de la predicha.]{componente="AsymptoticTransform"}
```yaml
modo: delta
poblacion:
  distribucion: exponencial
  valores:
    lambda: 0.5
transformacion: logaritmo
n: 5
```
:::

## Conexiones

Combina el [[teorema-central-del-limite]] con la [[derivada-como-pendiente-y-razon-de-cambio|derivada]] y el desarrollo de [[serie-de-taylor-y-de-maclaurin|Taylor]]. Su demostración usa el [[teorema-de-slutsky]] y su versión para varios parámetros es el [[metodo-delta-multivariado]]. La conservación de la consistencia bajo funciones continuas es el [[teorema-del-mapeo-continuo]]. Se usa para obtener errores estándar de estimadores de máxima verosimilitud transformados, razones de momios y coeficientes de variación.

## Formulario

:::formula[Método delta]
$$
\sqrt{n}\,\big(g(T_n) - g(\theta)\big) \xrightarrow{d} \mathcal{N}\big(0,\ g'(\theta)^2\sigma^2\big)
$$

- $T_n$: estimador asintóticamente normal.
- $\theta$: su límite.
- $\sigma^2$: varianza asintótica de $\sqrt{n}(T_n - \theta)$.
- $g'(\theta)$: derivada de $g$ en $\theta$, distinta de cero.
:::

:::formula[Error estándar por el método delta]
$$
\operatorname{ee}\big(g(T_n)\big) \approx |g'(\theta)|\,\frac{\sigma}{\sqrt{n}}
$$

- $\operatorname{ee}$: error estándar.
:::

:::formula[Segundo orden]
$$
n\,\big(g(T_n) - g(\theta)\big) \xrightarrow{d} \frac{g''(\theta)\,\sigma^2}{2}\,\chi^2_1
$$

- $g''(\theta)$: segunda derivada; se usa cuando $g'(\theta) = 0$.
- $\chi^2_1$: ji cuadrada con un grado de libertad.
:::

:::formula[Recíproco de la media exponencial]
$$
\hat{\lambda} = \frac{1}{\bar{X}_n} \approx \mathcal{N}\Big(\lambda,\ \frac{\lambda^2}{n}\Big)
$$

- $\lambda = 1/\mu$: tasa de la exponencial.
- $\bar{X}_n$: media de $n$ tiempos.
:::

:::formula[Logit de una proporción]
$$
\log\frac{\hat{p}}{1 - \hat{p}} \approx \mathcal{N}\Big(\log\frac{p}{1 - p},\ \frac{1}{n\,p(1-p)}\Big)
$$

- $\hat{p}$: proporción observada en $n$ ensayos.
- $p$: proporción verdadera.
:::
