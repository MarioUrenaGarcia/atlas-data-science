---
id: desigualdad-de-cantelli
titulo: Desigualdad de Cantelli
titulo_en: Cantelli's inequality
alias:
  - Chebyshev de una cola
  - desigualdad unilateral de Chebyshev
modulo: 1
submodulo: '1.5'
orden: 3
nivel: intermedio
prerrequisitos:
  - desigualdad-de-chebyshev
relaciones:
  - tipo: relacionado
    id: asimetria
etiquetas:
  - una sola cola
  - varianza
  - cota óptima
  - riesgo unilateral
resumen: >
  La desigualdad de Cantelli acota una sola cola usando la media y la varianza: la probabilidad de
  superar la media en k desviaciones estándar es a lo más 1/(1 + k²), mejor que la cota de
  Chebyshev para las dos colas.
formula: 'P(X - \mu \ge t) \le \frac{\sigma^2}{\sigma^2 + t^2}, \qquad t > 0'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: cola
    cota: cantelli
    distribucion: exponencial
    parametros:
      lambda: 1
    umbral: 2
referencias:
  - clave: ross-probabilidad
    capitulo: '8.5'
publicado: true
---

## Intuición

Muchas veces solo preocupa un lado: que un tiempo de entrega sea demasiado largo, que una pérdida sea demasiado grande, que la demanda supere la capacidad. La desigualdad de Chebyshev acota las dos colas a la vez, y usarla para una sola desperdicia información. La **desigualdad de Cantelli** acota una sola cola con la misma información, media y varianza, y da un número más pequeño: $1/(1 + k^2)$ en lugar de $1/k^2$.

Además, a diferencia de Chebyshev, informa algo para cualquier $k > 0$: con $k = 1$ garantiza que la probabilidad de superar la media en una desviación estándar es a lo más 1/2, mientras que Chebyshev da 1.

## Definición

:::teorema[Desigualdad de Cantelli]
Si $X$ tiene media $\mu$ y varianza $\sigma^2$ finita, para todo $t > 0$
$$
P(X - \mu \ge t) \le \frac{\sigma^2}{\sigma^2 + t^2}, \qquad P(X - \mu \le -t) \le \frac{\sigma^2}{\sigma^2 + t^2}.
$$
Con $t = k\sigma$, la cota es $1/(1 + k^2)$.
:::

La prueba aplica la desigualdad de Markov a $(X - \mu + u)^2$ con una constante $u \ge 0$ y elige el mejor $u$, que resulta ser $\sigma^2/t$.

:::figura[La normal estándar a una desviación estándar: la cola derecha tiene probabilidad 0.159 y la cota de Cantelli es $1/(1 + 1) = 0.5$, mientras que Chebyshev no diría nada.]{componente="InequalityBound"}
```yaml
modo: cola
cota: cantelli
distribucion: normal
umbral: 1
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con media $\mu$ y varianza $\sigma^2$.
- $t$: distancia sobre la media; $k = t/\sigma$: esa distancia en desviaciones estándar.
- $u$: constante auxiliar de la prueba.
- $D$: tiempo de entrega del ejemplo, en minutos.
:::

## Cómo usar la visualización

Arriba está la densidad exponencial con media 1, asimétrica a la derecha, con la cola $X - \mu \ge k\sigma$ sombreada; abajo, la probabilidad exacta de esa cola y la cota $1/(1 + k^2)$. Con $k = 2$ la probabilidad exacta es $e^{-3} \approx 0.050$ y la cota 0.2; la cota de Chebyshev para las dos colas sería 0.25.

La deslizadera mueve $k$ desde 0.25. A diferencia de Chebyshev, la curva de la cota empieza por debajo de 1 y siempre informa algo.

## Ejemplo

Un servicio de entregas tiene un tiempo $D$ con media de 30 minutos y desviación estándar de 6 minutos. Se promete entregar en 42 minutos.

1. El retraso respecto a la promesa ocurre si $D - 30 \ge 12$, es decir $k = 12/6 = 2$.
2. Cantelli: $P(D \ge 42) \le 36/(36 + 144) = 0.2$.
3. Chebyshev usado para una sola cola daría $1/4 = 0.25$.
4. Para garantizar a lo más un 5 % de retrasos hace falta $1/(1 + k^2) \le 0.05$, es decir $k \ge \sqrt{19} \approx 4.36$: prometer $30 + 4.36 \cdot 6 \approx 56$ minutos.

:::figura[El ejemplo de las entregas en unidades estandarizadas, $(D - 30)/6$: la promesa de 42 minutos queda en $k = 2$. Si $D$ fuera normal, la probabilidad de retraso sería 0.023; la garantía de Cantelli para cualquier distribución con esa media y esa varianza es 0.2. En el extremo de la deslizadera, $k = 4$, la cota vale $1/17 \approx 0.059$; para bajar a 0.05 hace falta $k = 4.36$, un poco más allá.]{componente="InequalityBound"}
```yaml
modo: cola
cota: cantelli
distribucion: normal
umbral: 2
nombre: Tiempo de entrega estandarizado
```
:::

## Propiedades

- **Óptima:** la igualdad se alcanza con una variable de dos valores, $\mu + t$ con probabilidad $\sigma^2/(\sigma^2 + t^2)$ y otro valor por debajo de la media.
- **Mejora a Chebyshev en una cola:** $1/(1 + k^2) < 1/k^2$ para todo $k$, y la diferencia importa sobre todo con $k$ pequeño.
- **Mediana y media:** para todo $t > \sigma$ la cota es menor que 1/2, así que la mediana no puede estar a más de $t$ de la media; como vale para todo $t > \sigma$, se obtiene $|\text{mediana} - \mu| \le \sigma$.
- **Ambas colas:** sumar las cotas de Cantelli para las dos colas da $2/(1 + k^2)$, que es peor que Chebyshev para $k > 1$.

:::figura[Una igualdad exacta: la Bernoulli con $p = 0.2$ tiene media 0.2 y desviación estándar 0.4, y el valor 1 está a 2 desviaciones sobre la media. Su probabilidad, 0.2, coincide con la cota $1/(1 + 4)$.]{componente="InequalityBound"}
```yaml
modo: cola
cota: cantelli
distribucion: bernoulli
parametros:
  p: 0.2
umbral: 2
```
:::

## Errores comunes

- **Usarla para las dos colas.** La cota es para un solo lado; para $|X - \mu| \ge t$ se usa Chebyshev.
- **Confundir $k$ con $t$.** La cota $1/(1 + k^2)$ usa $k$ en desviaciones estándar; en unidades de $X$ es $\sigma^2/(\sigma^2 + t^2)$.
- **Ignorar la asimetría.** En distribuciones asimétricas a la derecha, la cola derecha puede estar mucho más cerca de la cota que la izquierda.

:::figura[La lognormal, muy asimétrica: con $k = 1$ la cola derecha tiene probabilidad cercana a 0.11, mientras que la izquierda, una desviación por debajo de la media, casi no tiene probabilidad.]{componente="InequalityBound"}
```yaml
modo: cola
cota: cantelli
distribucion: lognormal
parametros:
  sigma: 0.8
umbral: 1
```
:::

## Conexiones

La desigualdad de Cantelli es la versión de una cola de la [[desigualdad-de-chebyshev]] y, como ella, se deduce de la [[desigualdad-de-markov]]. Es útil en distribuciones con [[asimetria]], donde las dos colas se comportan distinto. Usa solo la [[varianza]] y la media, y cuando además se sabe que la variable es acotada, la [[desigualdad-de-bernstein]] da cotas exponenciales para promedios.

## Formulario

:::formula[Desigualdad de Cantelli]
$$
P(X - \mu \ge t) \le \frac{\sigma^2}{\sigma^2 + t^2}
$$

- $X$: variable aleatoria con media $\mu$ y varianza finita $\sigma^2$.
- $t > 0$: distancia sobre la media en las unidades de $X$.
- La misma cota vale para la cola izquierda, $P(X - \mu \le -t)$.
:::

:::formula[En desviaciones estándar]
$$
P(X - \mu \ge k\sigma) \le \frac{1}{1 + k^2}
$$

- $\sigma$: desviación estándar; $k = t/\sigma > 0$: la distancia medida en desviaciones estándar.
:::

:::formula[Las dos colas sumadas]
$$
P(|X - \mu| \ge k\sigma) \le \frac{2}{1 + k^2}
$$

- Suma de las cotas de cada cola; para $k > 1$ es peor que la cota $1/k^2$ de Chebyshev.
:::

:::formula[Media y mediana]
$$
|\text{mediana} - \mu| \le \sigma
$$

- La mediana es un valor que deja al menos la mitad de la probabilidad de cada lado.
- Se obtiene porque, para todo $t > \sigma$, cada cola tiene probabilidad menor que 1/2.
:::
