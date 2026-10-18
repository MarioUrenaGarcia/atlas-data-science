---
id: varianza-de-un-estimador
titulo: Varianza de un estimador
titulo_en: Variance of an estimator
alias:
  - precisión de un estimador
  - variabilidad de un estimador
modulo: 6
submodulo: '6.2'
orden: 3
nivel: intermedio
prerrequisitos:
  - estimador-y-estimacion
  - error-estandar
etiquetas:
  - inferencia
  - varianza
  - precisión
  - estimación puntual
resumen: >
  La varianza de un estimador mide cuánto cambian sus estimaciones de una muestra a otra alrededor de su
  propio promedio. Su raíz es el error estándar; dos estimadores insesgados se comparan por su varianza.
formula: '\operatorname{Var}_\theta(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \mathbb{E}_\theta[\hat{\theta}])^2\big]'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: media-exponencial
    estimadores: [media, minimo]
    n: 10
    theta: 2
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
publicado: true
---

## Intuición

Un servicio de soporte quiere estimar el tiempo medio de atención, que sigue una distribución exponencial. Con 10 llamadas hay dos recetas insesgadas: el promedio de los 10 tiempos, o diez veces el tiempo más corto (el mínimo de exponenciales es otra exponencial, con media diez veces menor). Ambas aciertan en promedio. Pero el mínimo depende de una sola llamada, la más rápida, y salta muchísimo de muestra en muestra; el promedio usa las 10 y es mucho más estable.

La **varianza de un estimador** mide esa estabilidad: cuánto se dispersan sus estimaciones alrededor de su propio centro. No dice si el centro es el correcto (eso es el sesgo), sino qué tan repetible es el resultado. Entre dos estimadores insesgados, se prefiere el de menor varianza.

## Definición

:::definicion[Varianza de un estimador]
La **varianza** del estimador $\hat{\theta}$ es
$$
\operatorname{Var}_\theta(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \mathbb{E}_\theta[\hat{\theta}])^2\big],
$$
y su raíz cuadrada es el **error estándar** del estimador. Depende del valor de $\theta$ y del tamaño de muestra $n$.
:::

:::nota[Qué significa cada símbolo]
- $\hat{\theta}$: estimador; $\theta$: valor verdadero del parámetro.
- $\mathbb{E}_\theta[\hat{\theta}]$: valor esperado del estimador.
- $\operatorname{Var}_\theta(\hat{\theta})$: varianza del estimador bajo $\theta$.
- $n$: tamaño de la muestra.
:::

## Cómo usar la visualización

Dos estimadores insesgados de la media $\theta = 2$ de una exponencial se aplican a las mismas muestras de tamaño 10: la media muestral y diez veces el mínimo. Las dos filas se centran en el valor verdadero, pero su anchura es muy distinta. El panel compara varianzas simuladas y exactas.

Experimentos sugeridos:

1. Comparar las anchuras: la del mínimo es unas tres veces mayor.
2. Aumentar $n$ a 50: la varianza de la media baja a 0.08 y la del mínimo sigue en 4.
3. Observar que ambas filas tienen el mismo centro: la diferencia está solo en la dispersión.

## Ejemplo

Tiempos exponenciales con media $\theta = 2$ minutos y $n = 10$.

1. Media muestral: $\operatorname{Var}(\bar{X}) = \theta^2/n = 4/10 = 0.4$; error estándar $\approx 0.63$.
2. El mínimo $X_{(1)}$ es exponencial con media $\theta/n$, así que $\operatorname{Var}(n X_{(1)}) = n^2 (\theta/n)^2 = \theta^2 = 4$; error estándar 2.
3. Los dos son insesgados, pero la varianza del mínimo es 10 veces la de la media.
4. Al duplicar $n$ la varianza de la media se reduce a la mitad; la del mínimo no cambia.

:::figura[Con muestras de 50 llamadas la media se concentra y diez veces el mínimo (ahora cincuenta veces) sigue igual de disperso.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-exponencial
estimadores: [media, minimo]
n: 50
theta: 2
```
:::

## Propiedades

- **Varianza baja no implica exactitud:** un estimador puede ser muy estable alrededor de un valor equivocado.
- **Suele bajar como $1/n$:** para promedios, $\operatorname{Var}(\bar{X}) = \sigma^2/n$.
- **Tiene una cota inferior** para estimadores insesgados: la cota de Cramér-Rao.

:::figura[Varianza sin sesgo: disparos centrados en el blanco pero muy dispersos.]{componente="EstimatorLab"}
```yaml
modo: diana
sesgo: 0
dispersion: 1.2
```
:::

## Errores comunes

- **Elegir el estimador de menor varianza sin mirar el sesgo.** La constante 0 tiene varianza cero y es un pésimo estimador.
- **Confundir la varianza del estimador con la de los datos.** La de los datos es $\sigma^2$; la del promedio, $\sigma^2/n$.
- **Creer que todo estimador mejora con más datos.** Diez veces el mínimo no mejora: su varianza no depende de $n$.

:::figura[Menos varianza a cambio de sesgo: la media contraída 0.8 por la media muestral es menos dispersa que la media, pero su centro queda por debajo del valor verdadero.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
estimadores: [media, contraida]
n: 10
theta: 2
```
:::

## Conexiones

La varianza de un estimador es el cuadrado de su [[error-estandar]] y la otra pieza, junto con el [[sesgo-de-un-estimador]], del [[error-cuadratico-medio]]. La [[eficiencia-relativa]] compara varianzas de estimadores insesgados.

## Formulario

:::formula[Varianza de un estimador]
$$
\operatorname{Var}_\theta(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \mathbb{E}_\theta[\hat{\theta}])^2\big]
$$

- $\hat{\theta}$: estimador; $\mathbb{E}_\theta$: esperanza bajo el valor $\theta$ del parámetro.
:::

:::formula[Varianzas del ejemplo exponencial]
$$
\operatorname{Var}(\bar{X}) = \frac{\theta^2}{n},\qquad \operatorname{Var}(n X_{(1)}) = \theta^2
$$

- $\theta$: media de la exponencial; $X_{(1)}$: mínimo de la muestra; $n$: tamaño.
:::
