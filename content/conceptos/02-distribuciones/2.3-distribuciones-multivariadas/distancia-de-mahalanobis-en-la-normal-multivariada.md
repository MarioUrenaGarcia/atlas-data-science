---
id: distancia-de-mahalanobis-en-la-normal-multivariada
titulo: Distancia de Mahalanobis en la normal multivariada
titulo_en: Mahalanobis distance in the multivariate normal
alias:
  - distancia de Mahalanobis
  - distancia estadística
  - D cuadrada de Mahalanobis
modulo: 2
submodulo: '2.3'
orden: 5
nivel: intermedio
prerrequisitos:
  - elipses-de-confianza
  - distancias
relaciones:
  - tipo: generaliza
    id: normal-estandar-y-puntuacion-z
etiquetas:
  - distancia
  - valores atípicos
  - chi-cuadrada
  - covarianza
  - control de calidad
resumen: >
  Mide qué tan lejos está un punto del centro en unidades de la covarianza. En una normal de dimensión d
  su cuadrado sigue una chi-cuadrada con d grados, lo que permite detectar valores atípicos.
formula: 'D^{2}(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}) \sim \chi^{2}_{d}'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: mahalanobis
    valores:
      mu1: 0
      mu2: 0
      sigma1: 1
      sigma2: 1
      rho: 0.8
    puntos: [[1.5, 1.5], [1.5, -1.5]]
    casos:
      - nombre: 'Tornillos'
        descripcion: 'Diámetro y largo estandarizados con ρ = 0.8: un tornillo grande en ambas medidas es normal; uno grueso y corto es raro aunque esté a la misma distancia euclidiana.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.8}
      - nombre: 'Sin correlación'
        descripcion: 'ρ = 0 y σ = 1: la distancia de Mahalanobis coincide con la euclidiana y las elipses son círculos.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0}
      - nombre: 'Escalas distintas'
        descripcion: 'Temperatura con σ = 2.5 y presión con σ = 0.5: un desvío de 1 en presión pesa cinco veces más que uno de 1 en temperatura.'
        valores: {mu1: 0, mu2: 0, sigma1: 2.5, sigma2: 0.5, rho: 0}
referencias:
  - clave: hastie-esl
  - clave: wasserman
publicado: true
---

## Intuición

En una línea de producción de tornillos se miden el diámetro y el largo. Los dos están correlacionados: cuando la máquina corta un poco más grande, ambas medidas suben juntas. Un tornillo un poco más grueso y un poco más largo que el promedio es perfectamente común. En cambio, uno más grueso pero más corto es extraño, porque va contra la tendencia de la máquina, aunque esté a la misma distancia en milímetros del tornillo promedio.

La distancia euclidiana no ve esa diferencia: solo mide la longitud del segmento hasta el centro. La distancia de Mahalanobis mide la distancia en las unidades que dicta la propia variabilidad de los datos: divide entre la desviación en cada dirección y descuenta la correlación. Los puntos a la misma distancia de Mahalanobis no forman un círculo, sino una de las elipses de la covarianza.

Para datos normales, el cuadrado de esa distancia tiene una distribución conocida, la chi-cuadrada, así que se puede decir con precisión qué tan raro es un punto. Es la generalización a varias dimensiones del puntaje $z$.

## Definición

:::definicion[Distancia de Mahalanobis]
Para un vector de medias $\boldsymbol{\mu}$ y una covarianza $\boldsymbol{\Sigma}$ definida positiva, la **distancia de Mahalanobis** de $\mathbf{x}$ al centro es
$$
D(\mathbf{x}) = \sqrt{(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})}.
$$
Si $\mathbf{X} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, entonces $D^{2}(\mathbf{X}) \sim \chi^{2}_{d}$. En dos dimensiones, $P(D^{2} \le t) = 1 - e^{-t/2}$.
:::

Con $\boldsymbol{\Sigma} = \sigma^{2}\mathbf{I}$ la distancia es la euclidiana dividida entre $\sigma$, y en una dimensión es el valor absoluto del puntaje $z$.

:::nota[Qué es X]
$\mathbf{X}$ = el vector de mediciones de una unidad, como el diámetro y el largo estandarizados de un tornillo.
:::

:::nota[Qué hace cada parámetro]
- **$\boldsymbol{\mu}$, centro:** el punto de referencia. Si se desplaza, cambian todas las distancias.
- **$\sigma_1, \sigma_2$, desviaciones:** la escala de cada eje. Si aumenta $\sigma_1$, un mismo desvío horizontal cuenta menos.
- **$\rho$, correlación:** la dirección en la que los desvíos son comunes. Si aumenta, los puntos sobre la diagonal ascendente se acercan y los de la descendente se alejan.
:::

:::nota[Qué significa cada símbolo]
- $D(\mathbf{x})$: distancia de Mahalanobis; $D^{2}$: su cuadrado.
- $\mathbf{x}$: punto evaluado; $\boldsymbol{\mu}$: centro; $\boldsymbol{\Sigma}$: covarianza e inversa $\boldsymbol{\Sigma}^{-1}$.
- $d$: dimensión; $\chi^{2}_{d}$: chi-cuadrada con $d$ grados.
- $t$: umbral para $D^{2}$.
- $\mathbf{I}$: matriz identidad; $\sigma$: desviación común.
:::

## Cómo usar la visualización

Dos puntos arrastrables, A y B, aparecen sobre los contornos del 50, 90 y 99 %. Por cada punto pasan un círculo punteado, con todos los puntos a la misma distancia euclidiana del centro, y una elipse de color, con todos los puntos a la misma distancia de Mahalanobis. El panel da ambas distancias y la probabilidad que encierra la elipse de cada punto. Los casos cargan tornillos correlacionados, variables sin correlación y escalas distintas.

Con el caso de los tornillos, A y B están a la misma distancia euclidiana, 2.12, pero B está fuera de la elipse del 99.99 %. Lleva $\rho$ a 0 y observa que las dos distancias se vuelven iguales. Arrastra B sobre su círculo y observa cómo cambia su distancia de Mahalanobis.

## Ejemplo

El diámetro y el largo estandarizados de los tornillos siguen una normal bivariada con medias 0, varianzas 1 y $\rho = 0.8$. Se comparan dos tornillos: A $= (1.5, 1.5)$ y B $= (1.5, -1.5)$.

1. Inversa de la covarianza: $\boldsymbol{\Sigma}^{-1} = \frac{1}{1 - 0.64}\begin{pmatrix} 1 & -0.8 \\ -0.8 & 1 \end{pmatrix} = 2.778\begin{pmatrix} 1 & -0.8 \\ -0.8 & 1 \end{pmatrix}$.
2. Para A: $D^{2} = 2.778(2.25 + 2.25 - 2 \cdot 0.8 \cdot 2.25) = 2.778 \cdot 0.9 = 2.5$, así que $D \approx 1.58$.
3. Para B: $D^{2} = 2.778(2.25 + 2.25 + 2 \cdot 0.8 \cdot 2.25) = 2.778 \cdot 8.1 = 22.5$, así que $D \approx 4.74$.
4. Las dos distancias euclidianas valen $\sqrt{4.5} \approx 2.12$.
5. Con $D^{2} \sim \chi^{2}_{2}$: para A, $P(D^{2} \le 2.5) = 1 - e^{-1.25} \approx 0.713$, un tornillo común; para B, $P(D^{2} > 22.5) = e^{-11.25} \approx 1.3 \times 10^{-5}$, un tornillo que conviene revisar.

:::figura[Tornillos: A y B están en el mismo círculo punteado, pero la elipse de A encierra el 71 % de la probabilidad y la de B casi toda.]{componente="MultivariateExplorer"}
```yaml
modo: mahalanobis
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.8
puntos: [[1.5, 1.5], [1.5, -1.5]]
```
:::

## Propiedades

- **Distribución:** si $\mathbf{X} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, entonces $D^{2}(\mathbf{X}) \sim \chi^{2}_{d}$, con media $d$.
- **Estandarización:** $D(\mathbf{x}) = \lVert\mathbf{L}^{-1}(\mathbf{x} - \boldsymbol{\mu})\rVert$ con $\mathbf{L}\mathbf{L}^{\top} = \boldsymbol{\Sigma}$: es la distancia euclidiana después de volver redonda la nube.
- **Invarianza:** no cambia si los datos se transforman con $\mathbf{y} = \mathbf{A}\mathbf{x} + \mathbf{b}$, $\mathbf{A}$ invertible, y la covarianza se transforma igual; en particular no depende de las unidades.
- **Caso diagonal:** con $\rho = 0$, $D^{2} = \sum_i (x_i - \mu_i)^{2}/\sigma_i^{2}$, la suma de puntajes $z$ al cuadrado.
- **Umbral de atípicos:** un punto con $D^{2} > \chi^{2}_{d;\,0.99}$ (9.21 para $d = 2$) tiene probabilidad menor al 1 % de estar tan lejos.
- **Curvas de igual distancia:** son las elipses $D^{2} = c$, las mismas curvas de nivel de la densidad normal.

:::figura[Casos con contexto (tornillos, sin correlación, escalas distintas): cada botón carga la covarianza, y una frase explica qué direcciones pesan más.]{componente="MultivariateExplorer"}
```yaml
modo: mahalanobis
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0
puntos: [[1.5, 1.5], [1.5, -1.5]]
casos:
  - nombre: 'Tornillos'
    descripcion: 'ρ = 0.8: A cerca y B lejos.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.8}
  - nombre: 'Sin correlación'
    descripcion: 'ρ = 0: Mahalanobis igual a euclidiana.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0}
  - nombre: 'Escalas distintas'
    descripcion: 'σ = 2.5 y 0.5: las elipses son horizontales y aplanadas.'
    valores: {mu1: 0, mu2: 0, sigma1: 2.5, sigma2: 0.5, rho: 0}
```
:::

:::figura[Escalas distintas: con σ₁ = 2.5 y σ₂ = 0.5, el punto A a 2 unidades en horizontal y el punto B a 1 unidad en vertical tienen distancias de Mahalanobis 0.8 y 2: B es más raro aunque está más cerca.]{componente="MultivariateExplorer"}
```yaml
modo: mahalanobis
valores:
  mu1: 0
  mu2: 0
  sigma1: 2.5
  sigma2: 0.5
  rho: 0
puntos: [[2, 0], [0, 1]]
```
:::

## Errores comunes

- **Detectar atípicos con la distancia euclidiana.** Con variables correlacionadas o en escalas distintas, la distancia euclidiana marca como raros puntos comunes y deja pasar puntos realmente atípicos.
- **Comparar $D$ con 1.96.** El umbral sale de la chi-cuadrada de $D^{2}$ con $d$ grados; en dos dimensiones el 95 % corresponde a $D^{2} = 5.99$, es decir, $D = 2.45$.
- **Estandarizar cada variable y luego usar la distancia euclidiana.** Eso corrige las escalas, pero no la correlación; falta el término cruzado.
- **Estimar la covarianza con datos que incluyen los atípicos.** Los propios atípicos inflan $\boldsymbol{\Sigma}$ y disminuyen su distancia; se usan estimadores robustos.

:::figura[Estandarizar no basta: con ρ = 0.8 y varianzas 1, las dos variables ya están estandarizadas y aun así A y B, a la misma distancia euclidiana, tienen distancias de Mahalanobis 1.58 y 4.74.]{componente="MultivariateExplorer"}
```yaml
modo: mahalanobis
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.8
puntos: [[-1.5, -1.5], [-1.5, 1.5]]
```
:::

## Conexiones

Generaliza el puntaje de la [[normal-estandar-y-puntuacion-z]] y modifica las [[distancias]] euclidianas con la covarianza. Sus curvas de igual valor son las [[elipses-de-confianza]], y su cuadrado sigue la [[distribucion-chi-cuadrada]]. Es el exponente de la densidad de la [[distribucion-normal-multivariada]]. Se usa para detectar valores atípicos multivariados, en análisis discriminante y en control estadístico de procesos con varias características. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Distancia de Mahalanobis]
$$
D(\mathbf{x}) = \sqrt{(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})}
$$

- $\mathbf{x}$: punto; $\boldsymbol{\mu}$: centro; $\boldsymbol{\Sigma}^{-1}$: inversa de la covarianza.
:::

:::formula[Distribución en la normal]
$$
D^{2}(\mathbf{X}) \sim \chi^{2}_{d}, \qquad P(D^{2} \le t) = 1 - e^{-t/2} \ (d = 2)
$$

- $d$: dimensión; $t$: umbral.
:::

:::formula[Caso diagonal]
$$
D^{2} = \sum_{i=1}^{d} \frac{(x_i - \mu_i)^{2}}{\sigma_i^{2}}
$$

- $x_i$, $\mu_i$, $\sigma_i$: componente, media y desviación de cada variable.
:::

:::formula[Inversa en dos dimensiones con varianzas uno]
$$
\boldsymbol{\Sigma}^{-1} = \frac{1}{1 - \rho^{2}}\begin{pmatrix} 1 & -\rho \\ -\rho & 1 \end{pmatrix}
$$

- $\rho$: correlación.
:::

:::formula[Estandarización]
$$
D(\mathbf{x}) = \lVert\mathbf{L}^{-1}(\mathbf{x} - \boldsymbol{\mu})\rVert, \qquad \mathbf{L}\mathbf{L}^{\top} = \boldsymbol{\Sigma}
$$

- $\mathbf{L}$: factor de Cholesky; $\lVert\cdot\rVert$: norma euclidiana.
:::
