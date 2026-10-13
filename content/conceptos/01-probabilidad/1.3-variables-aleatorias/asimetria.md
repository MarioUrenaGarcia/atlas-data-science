---
id: asimetria
titulo: Asimetría
titulo_en: Skewness
alias:
  - coeficiente de asimetría
  - sesgo de una distribución
  - tercer momento estandarizado
modulo: 1
submodulo: '1.3'
orden: 18
nivel: basico
prerrequisitos:
  - momentos-centrales
  - desviacion-estandar
relaciones:
  - tipo: relacionado
    id: asimetria-muestral
  - tipo: relacionado
    id: curtosis
etiquetas:
  - cola derecha
  - cola izquierda
  - tercer momento
  - forma de la distribución
resumen: >
  La asimetría mide hacia qué lado se extiende la cola más larga de una distribución: es el tercer momento central entre el cubo de la desviación estándar. Es positiva con cola derecha larga y cero si hay simetría.
formula: '\gamma_1 = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^3\right] = \frac{\mu_3}{\sigma^3}'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: forma
    distribucion: lognormal
    parametros:
      mu: 0
      sigma: 0.5
    momento: central
    orden: 3
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.2'
  - clave: degroot
    capitulo: '4.4'
publicado: true
---

## Intuición

Los ingresos de una población, los tiempos de respuesta de un servidor o los montos de las compras tienen algo en común: la mayoría de los valores son moderados, pero hay una cola de valores muy grandes y ninguna cola equivalente hacia abajo. Son distribuciones **asimétricas a la derecha**. En cambio, la calificación de un examen fácil se amontona cerca del máximo con una cola hacia las notas bajas: es asimétrica a la izquierda.

La **asimetría** convierte esa impresión en un número. Toma las desviaciones estandarizadas $(X - \mu)/\sigma$ y promedia sus cubos: el cubo conserva el signo y exagera las desviaciones grandes, así que el lado con la cola más larga domina el promedio. Al dividir entre $\sigma^3$, el número no depende de las unidades: la asimetría de los ingresos es la misma en pesos que en dólares.

## Definición

:::definicion[Asimetría]
Sea $X$ una variable aleatoria con media $\mu$, desviación estándar $\sigma > 0$ y tercer momento finito. Su **asimetría** es
$$
\gamma_1 = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^3\right] = \frac{\mu_3}{\sigma^3},
$$
donde $\mu_3 = \mathbb{E}[(X - \mu)^3]$ es el tercer momento central.
:::

Si $\gamma_1 > 0$ la distribución es asimétrica a la derecha (cola derecha más larga); si $\gamma_1 < 0$, a la izquierda. Toda distribución simétrica alrededor de su media tiene $\gamma_1 = 0$.

:::figura[La gamma con forma 2: el tercer momento central es 4 y la desviación estándar es $\sqrt{2}$, así que $\gamma_1 = 4 / 2^{3/2} \approx 1.414$. La media queda a la derecha de la mediana, que a su vez queda a la derecha de la moda.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: gamma
parametros:
  alpha: 2
  beta: 1
momento: central
orden: 3
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $\mu$, $\sigma$: media y desviación estándar.
- $\mu_3$: tercer momento central.
- $\gamma_1$: asimetría.
- $(X - \mu)/\sigma$: desviación estandarizada.
- $p$: probabilidad de éxito de la Bernoulli del ejemplo.
- $\alpha$: parámetro de forma de la gamma.
:::

## Cómo usar la visualización

Arriba está una densidad lognormal, típica de ingresos o de tiempos, con su media, su mediana y su moda. Al avanzar, abajo aparecen las contribuciones de cada franja al tercer momento central: negativas a la izquierda de la media, positivas a la derecha. Las de la derecha llegan mucho más lejos, y el encabezado termina con la asimetría, cerca de 1.75.

La deslizadera de orden cambia el momento que se descompone; con orden 4 el encabezado muestra la curtosis.

## Ejemplo

Una variable de Bernoulli con $P(B = 1) = p$ tiene $\mu = p$, $\sigma^2 = p(1 - p)$ y $\mu_3 = p(1 - p)(1 - 2p)$.

1. $\gamma_1 = \dfrac{p(1 - p)(1 - 2p)}{(p(1 - p))^{3/2}} = \dfrac{1 - 2p}{\sqrt{p(1 - p)}}$.
2. Con $p = 0.2$: $\gamma_1 = 0.6 / 0.4 = 1.5$; el éxito es raro y forma una cola a la derecha.
3. Con $p = 0.5$: $\gamma_1 = 0$.
4. Con $p = 0.01$: $\gamma_1 = 0.98 / 0.0995 \approx 9.85$; los eventos raros producen asimetrías enormes.

:::figura[La Bernoulli del ejemplo con $p = 0.2$: el valor 1, raro y lejano, aporta casi todo el tercer momento, y la asimetría es 1.5.]{componente="RandomVariableLab"}
```yaml
modo: forma
valores: [0, 1]
probabilidades: [0.8, 0.2]
nombre: una variable de Bernoulli con p = 0.2
simbolo: B
momento: central
orden: 3
```
:::

## Propiedades

- **Sin unidades:** $\gamma_1(aX + b) = \gamma_1(X)$ si $a > 0$, y cambia de signo si $a < 0$.
- **Familias conocidas:** la exponencial tiene asimetría 2; la gamma con forma $\alpha$, $2/\sqrt{\alpha}$; la Poisson con media $\lambda$, $1/\sqrt{\lambda}$. Las tres se acercan a la simetría cuando crece el parámetro.
- **Sumas:** la asimetría de una suma de $n$ variables independientes e idénticas es $\gamma_1 / \sqrt{n}$, y por eso los promedios se vuelven más simétricos.
- **Media, mediana y moda:** en muchas distribuciones unimodales con asimetría positiva se cumple moda < mediana < media, aunque no es una regla universal.

:::figura[Asimetría negativa: la beta con parámetros 5 y 2 se amontona cerca de 1 con una cola hacia la izquierda, y su asimetría es cerca de $-0.6$.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: beta
parametros:
  a: 5
  b: 2
momento: central
orden: 3
```
:::

:::figura[La gamma con forma 8 es la suma de 8 exponenciales independientes; su asimetría es $2/\sqrt{8} \approx 0.71$, y la densidad ya se parece a una campana.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: gamma
parametros:
  alpha: 8
  beta: 1
momento: central
orden: 3
```
:::

## Errores comunes

- **Concluir simetría de $\gamma_1 = 0$.** Hay distribuciones asimétricas con tercer momento central nulo.
- **Usar la regla "media a la derecha de la mediana" como definición.** La asimetría es un momento; la posición relativa de media y mediana es otra medida que casi siempre, pero no siempre, coincide en signo.
- **Interpretar la asimetría cuando no existe.** Si el tercer momento es infinito, como en Pareto con índice menor que 3, la asimetría no está definida y su estimación con datos no converge.

:::figura[Una distribución asimétrica con asimetría cero: vale $-3$ con probabilidad 0.1, $-1$ con 0.5 y 2 con 0.4. Las contribuciones al tercer momento se cancelan exactamente, aunque la forma no es simétrica.]{componente="RandomVariableLab"}
```yaml
modo: forma
valores: [-3, -1, 2]
probabilidades: [0.1, 0.5, 0.4]
nombre: una variable asimétrica con tercer momento nulo
simbolo: X
momento: central
orden: 3
```
:::

## Conexiones

La asimetría es el tercero de los [[momentos-centrales]] dividido entre el cubo de la [[desviacion-estandar]]. Junto con la [[curtosis]] describe la forma más allá de la [[varianza]], y su relación con la media y la mediana se ve en [[mediana-y-moda-de-una-distribucion]]. Su estimación con datos es la [[asimetria-muestral]]. En el [[teorema-central-del-limite]] la asimetría controla qué tan rápido el promedio se vuelve normal: el término principal del error es proporcional a $\gamma_1/\sqrt{n}$.

## Formulario

:::formula[Definición]
$$
\gamma_1 = \frac{\mu_3}{\sigma^3} = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^3\right]
$$

- Positiva: cola derecha más larga.
:::

:::formula[Bernoulli]
$$
\gamma_1 = \frac{1 - 2p}{\sqrt{p(1 - p)}}
$$

- $p$: probabilidad de éxito.
:::

:::formula[Suma de n independientes idénticas]
$$
\gamma_1\left(\sum_{i=1}^{n} X_i\right) = \frac{\gamma_1(X_1)}{\sqrt{n}}
$$

- La suma se vuelve más simétrica.
:::
