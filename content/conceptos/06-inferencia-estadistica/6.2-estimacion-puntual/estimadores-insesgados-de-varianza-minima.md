---
id: estimadores-insesgados-de-varianza-minima
titulo: Estimadores insesgados de varianza mínima (UMVUE)
titulo_en: Uniformly minimum variance unbiased estimators
alias:
  - UMVUE
  - MVUE
  - estimador insesgado óptimo
modulo: 6
submodulo: '6.2'
orden: 8
nivel: avanzado
prerrequisitos:
  - eficiencia-relativa
etiquetas:
  - inferencia
  - UMVUE
  - insesgadez
  - eficiencia
resumen: >
  Un UMVUE es un estimador insesgado cuya varianza es menor o igual que la de cualquier otro estimador
  insesgado, para todos los valores del parámetro a la vez. Es el mejor dentro de la clase de los insesgados.
formula: '\mathbb{E}_\theta[\hat{\theta}^*] = \theta,\qquad \operatorname{Var}_\theta(\hat{\theta}^*) \le \operatorname{Var}_\theta(\tilde{\theta})\ \ \forall \theta,\ \forall \tilde{\theta}\ \text{insesgado}'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: media-exponencial
    n: 12
    theta: 3
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
publicado: true
---

## Intuición

Para estimar el tiempo medio de vida $\theta$ de unos focos, cuyas duraciones son exponenciales, hay varios estimadores insesgados: la media de las duraciones, $n$ veces la duración más corta, y otros. Todos aciertan en promedio, así que conviene elegir el de menor dispersión. Pero la dispersión depende del valor verdadero $\theta$, que se desconoce, y podría ocurrir que un estimador gane para unos valores de $\theta$ y pierda para otros.

Un **UMVUE** (estimador insesgado de varianza uniformemente mínima) evita ese dilema: gana o empata contra todos los insesgados, para todos los valores de $\theta$ a la vez. Para la media de la exponencial, ese estimador existe y es la media muestral. No siempre hay un UMVUE, pero cuando lo hay, los teoremas de Rao-Blackwell y Lehmann-Scheffé indican cómo encontrarlo.

## Definición

:::definicion[UMVUE]
Un estimador $\hat{\theta}^*$ de $\tau(\theta)$ es un **estimador insesgado de varianza uniformemente mínima** si

1. es insesgado: $\mathbb{E}_\theta[\hat{\theta}^*] = \tau(\theta)$ para todo $\theta$;
2. para cualquier otro estimador insesgado $\tilde{\theta}$, $\operatorname{Var}_\theta(\hat{\theta}^*) \le \operatorname{Var}_\theta(\tilde{\theta})$ para todo $\theta$.
:::

Formas de encontrarlo:

- **Por Lehmann-Scheffé:** una función insesgada de un estadístico suficiente y completo.
- **Por la cota de Cramér-Rao:** un estimador insesgado cuya varianza alcanza la cota es UMVUE (el recíproco no siempre vale).

:::nota[Qué significa cada símbolo]
- $\hat{\theta}^*$: el UMVUE; $\tilde{\theta}$: cualquier otro estimador insesgado.
- $\tau(\theta)$: cantidad que se estima, función del parámetro $\theta$.
- $\mathbb{E}_\theta$, $\operatorname{Var}_\theta$: esperanza y varianza cuando el parámetro vale $\theta$.
:::

## Cómo usar la visualización

Tres estimadores de la media $\theta = 3$ de una exponencial con muestras de 12: la media muestral, $n$ veces el mínimo y la mediana dividida entre $\log 2$. Los dos primeros son insesgados; el tercero lo es solo aproximadamente. La media muestral, el UMVUE, tiene la fila más angosta.

Experimentos sugeridos:

1. Comparar varianzas: la media muestral tiene $\theta^2/n = 0.75$; $n$ veces el mínimo, $\theta^2 = 9$.
2. Cambiar $n$: la media muestral siempre queda abajo.
3. Observar que la mediana corregida queda ligeramente desplazada: no es insesgada para $n$ finito.

## Ejemplo

Duraciones exponenciales con media $\theta$, muestra de tamaño $n$.

1. $T = \sum X_i$ es suficiente (factorización $\theta^{-n}e^{-T/\theta}$) y completo (familia exponencial).
2. $\mathbb{E}[T/n] = \theta$, así que $\bar{X} = T/n$ es insesgado y función de $T$.
3. Por Lehmann-Scheffé, $\bar{X}$ es el UMVUE de $\theta$, con varianza $\theta^2/n$.
4. La cota de Cramér-Rao para $\theta$ es $\theta^2/n$: la media la alcanza.

:::figura[Las dos recetas insesgadas del ejemplo con muestras de 30: la media muestral se concentra y n veces el mínimo no.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-exponencial
estimadores: [media, minimo]
n: 30
theta: 3
```
:::

## Propiedades

- **Es único** cuando existe.
- **Puede no existir:** hay familias sin estimador insesgado alguno para ciertas cantidades.
- **No minimiza el ECM:** un estimador sesgado puede tener menor error cuadrático medio.
- **Se obtiene por Rao-Blackwell** a partir de cualquier insesgado si se condiciona en un suficiente completo.

:::figura[El UMVUE de la varianza normal es el divisor n - 1, aunque el divisor n + 1 tenga menor error cuadrático medio.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: varianza-normal
estimadores: [s2, n1]
n: 6
theta: 2
```
:::

## Errores comunes

- **Creer que el UMVUE es el mejor estimador en todo sentido.** Es el mejor entre los insesgados con pérdida cuadrática.
- **Suponer que alcanzar la cota de Cramér-Rao es necesario.** Hay UMVUE con varianza estrictamente mayor que la cota.
- **Comparar solo en un valor de θ.** La condición es uniforme: debe cumplirse para todos.

:::figura[La mediana, más resistente pero menos eficiente: frente a la media de una normal, su varianza es mayor para todo valor de la media.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
estimadores: [media, mediana]
n: 12
theta: 5
```
:::

## Conexiones

El UMVUE es el óptimo de la [[eficiencia-relativa]] entre estimadores sin [[sesgo-de-un-estimador|sesgo]]. Se construye con el [[teorema-de-rao-blackwell]] y se identifica con el [[teorema-de-lehmann-scheffe]], usando la [[suficiencia]] y la [[completitud]].

## Formulario

:::formula[Definición de UMVUE]
$$
\mathbb{E}_\theta[\hat{\theta}^*] = \tau(\theta),\qquad \operatorname{Var}_\theta(\hat{\theta}^*) \le \operatorname{Var}_\theta(\tilde{\theta})\ \ \forall \theta
$$

- $\hat{\theta}^*$: UMVUE; $\tilde{\theta}$: cualquier insesgado; $\tau(\theta)$: cantidad a estimar.
:::

:::formula[UMVUE de la media exponencial]
$$
\hat{\theta}^* = \bar{X},\qquad \operatorname{Var}(\bar{X}) = \frac{\theta^2}{n}
$$

- $\theta$: media de la exponencial; $n$: tamaño de muestra.
:::
