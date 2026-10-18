---
id: distribucion-muestral-de-una-proporcion
titulo: Distribución muestral de una proporción
titulo_en: Sampling distribution of a proportion
alias:
  - distribución de p sombrero
  - proporción muestral
modulo: 6
submodulo: '6.1'
orden: 6
nivel: basico
prerrequisitos:
  - distribucion-de-la-media-muestral
  - distribucion-binomial
etiquetas:
  - inferencia
  - proporciones
  - binomial
  - aproximación normal
resumen: >
  La proporción muestral de éxitos en n ensayos independientes es una binomial dividida entre n, con media p
  y error estándar raíz de p(1 - p)/n. Para n grande se aproxima a una normal si np y n(1 - p) no son pequeños.
formula: 'n\hat{p} \sim \operatorname{Binomial}(n, p),\qquad \hat{p} \approx \mathcal{N}\!\left(p,\ \frac{p(1 - p)}{n}\right)'
visualizacion:
  componente: SamplingSimulator
  parametros:
    poblacion:
      distribucion: bernoulli
      valores:
        p: 0.3
    estadistico: proporcion
    n: 100
    nMaximo: 400
referencias:
  - clave: agresti
    capitulo: '1'
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una cadena de cafeterías quiere saber qué proporción de sus clientes usa la aplicación para pedir. En realidad es 30 %, pero eso no se sabe: se encuesta a 40 clientes y 14 dicen que sí, 35 %. Otra encuesta de 40 daría quizá 25 %, otra 32 %. La **proporción muestral** es un promedio de ceros y unos (1 si el cliente usa la aplicación, 0 si no), así que se comporta como cualquier media muestral: se centra en la proporción verdadera y su variación se reduce con el tamaño de la encuesta.

Su particularidad es que la varianza queda determinada por la propia proporción: es máxima cuando la proporción es 50 % y pequeña cuando es cercana a 0 o a 1. Además, como solo toma valores $0, 1/n, 2/n, \dots$, es discreta: con muestras pequeñas o proporciones extremas su distribución es asimétrica y escalonada, y la aproximación normal falla.

## Definición

:::definicion[Proporción muestral]
Sean $X_1, \dots, X_n$ independientes con $X_i \sim \operatorname{Bernoulli}(p)$. La **proporción muestral** es
$$
\hat{p} = \frac{1}{n}\sum_{i=1}^{n} X_i,
$$
y su distribución exacta es la de una binomial dividida entre $n$: $n\hat{p} \sim \operatorname{Binomial}(n, p)$. Su media y su error estándar son
$$
\mathbb{E}[\hat{p}] = p,\qquad \operatorname{EE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}.
$$
Por el teorema central del límite, $\hat{p} \approx \mathcal{N}\big(p, p(1 - p)/n\big)$ cuando $np \ge 10$ y $n(1 - p) \ge 10$, una regla práctica habitual.
:::

:::nota[Qué significa cada símbolo]
- $X_i$: indicador de éxito del individuo $i$ (1 sí, 0 no).
- $p$: proporción de éxitos en la población; $\hat{p}$: proporción muestral.
- $n$: tamaño de la muestra.
- $\operatorname{Binomial}(n, p)$: número de éxitos en $n$ ensayos independientes.
- $\operatorname{EE}(\hat{p})$: error estándar de la proporción muestral.
:::

## Cómo usar la visualización

La población es un conjunto de ceros y unos con proporción de unos $p = 0.3$. Cada encuesta de $n$ clientes aporta su proporción al histograma, y la curva es la aproximación normal.

Controles: **Tamaño de cada muestra**, la **Probabilidad de éxito** $p$ y la curva teórica.

Experimentos sugeridos:

1. Bajar $n$ a 40 y observar que el histograma es escalonado: solo hay valores múltiplos de $1/40$.
2. Bajar $p$ a 0.03: con $n = 40$ el histograma se amontona en 0 y la aproximación normal falla.
3. Con $p = 0.5$, subir $n$ de 40 a 160: el error estándar pasa de 0.079 a 0.040.

## Ejemplo

Clientes que usan la aplicación: $p = 0.3$, encuesta de $n = 40$.

1. $\operatorname{EE}(\hat{p}) = \sqrt{0.3 \cdot 0.7/40} = \sqrt{0.00525} \approx 0.0725$.
2. Condiciones: $np = 12 \ge 10$ y $n(1 - p) = 28 \ge 10$, así que la aproximación normal es razonable.
3. Probabilidad de obtener 35 % o más: $z = (0.35 - 0.30)/0.0725 \approx 0.69$, $P \approx 0.245$.
4. Probabilidad exacta con la binomial: $P(n\hat{p} \ge 14) \approx 0.297$. La diferencia se debe a la discreción; con la corrección por continuidad, $z = (13.5/40 - 0.3)/0.0725 \approx 0.52$ y $P \approx 0.302$, mucho más cerca.

:::figura[Encuestas de 40 con p igual a 0.3: el histograma escalonado y la curva normal aproximada.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: bernoulli
  valores:
    p: 0.3
estadistico: proporcion
n: 40
poblacionEditable: false
```
:::

## Propiedades

- **Insesgada:** $\mathbb{E}[\hat{p}] = p$.
- **Varianza máxima en $p = 0.5$:** $p(1 - p) \le 1/4$, de donde $\operatorname{EE}(\hat{p}) \le 1/(2\sqrt{n})$; con $n = 1000$, el error estándar no pasa de 0.016.
- **Asimetría para $p$ extremo:** cuando $p$ está cerca de 0 o de 1, la distribución se amontona en el extremo y tiene cola hacia el centro.

:::figura[Proporción extrema: con p igual a 0.05 y 30 casos, la proporción muestral es muy asimétrica y vale cero con frecuencia.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: bernoulli
  valores:
    p: 0.05
estadistico: proporcion
n: 30
poblacionEditable: false
```
:::

## Errores comunes

- **Usar la normal con pocos éxitos esperados.** Si $np < 10$, conviene usar la binomial exacta.
- **Olvidar que la varianza depende de $p$.** Al estimar el error estándar se usa $\hat{p}$ en lugar de $p$, lo que añade incertidumbre con muestras pequeñas.
- **Suponer independencia en muestras por conglomerados.** Encuestar a familias completas o salones enteros produce respuestas correlacionadas y un error real mayor.

:::figura[Muestra grande con proporción intermedia: con n igual a 300 y p igual a 0.5 el histograma ya es casi continuo y coincide con la curva normal.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: bernoulli
  valores:
    p: 0.5
estadistico: proporcion
n: 300
nMaximo: 400
poblacionEditable: false
```
:::

## Conexiones

La proporción muestral es la [[distribucion-de-la-media-muestral|media muestral]] de variables de [[distribucion-de-bernoulli|Bernoulli]], y su número de éxitos sigue la [[distribucion-binomial]]. Su dispersión es el [[error-estandar]] $\sqrt{p(1 - p)/n}$ y su forma límite la da el [[teorema-central-del-limite]].

## Formulario

:::formula[Proporción muestral]
$$
\hat{p} = \frac{1}{n}\sum_{i=1}^{n} X_i,\qquad n\hat{p} \sim \operatorname{Binomial}(n, p)
$$

- $X_i$: indicadores de éxito; $n$: tamaño; $p$: proporción de la población.
:::

:::formula[Media y error estándar]
$$
\mathbb{E}[\hat{p}] = p,\qquad \operatorname{EE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}
$$

- $\operatorname{EE}$: error estándar.
:::

:::formula[Aproximación normal con corrección por continuidad]
$$
P(n\hat{p} \ge k) \approx 1 - \Phi\!\left(\frac{(k - 0.5)/n - p}{\sqrt{p(1 - p)/n}}\right)
$$

- $k$: número de éxitos; $\Phi$: distribución normal estándar; restar 0.5 compensa la discreción.
:::

:::formula[Cota del error estándar]
$$
\operatorname{EE}(\hat{p}) \le \frac{1}{2\sqrt{n}}
$$

- La igualdad ocurre en $p = 0.5$.
:::
