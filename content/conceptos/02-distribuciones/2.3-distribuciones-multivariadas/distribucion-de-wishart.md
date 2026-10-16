---
id: distribucion-de-wishart
titulo: Distribución de Wishart
titulo_en: Wishart distribution
alias:
  - Wishart
  - chi-cuadrada matricial
modulo: 2
submodulo: '2.3'
orden: 7
nivel: avanzado
prerrequisitos:
  - distribucion-normal-multivariada
  - distribucion-chi-cuadrada
relaciones:
  - tipo: generaliza
    id: distribucion-chi-cuadrada
  - tipo: relacionado
    id: distribucion-de-wishart-inversa
etiquetas:
  - matrices aleatorias
  - covarianza muestral
  - chi-cuadrada
  - distribución conjugada
  - incertidumbre de la covarianza
resumen: >
  Distribución de la suma de productos externos de vectores normales independientes. Describe la
  variabilidad de una matriz de covarianza muestral y generaliza la chi-cuadrada a matrices.
formula: '\mathbf{W} = \sum_{i=1}^{\nu}\mathbf{x}_i\mathbf{x}_i^{\top} \sim \mathcal{W}_d(\mathbf{V}, \nu), \qquad \mathbf{x}_i \sim \mathcal{N}_d(\mathbf{0}, \mathbf{V})'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: wishart
    valores:
      nu: 10
      sigma1: 1.5
      sigma2: 1
      rho: 0.5
    casos:
      - nombre: 'Rendimientos de dos acciones'
        descripcion: 'Once días de datos, ν = 10: las covarianzas muestrales W/ν rodean a la verdadera, pero varían mucho en tamaño y en inclinación.'
        valores: {nu: 10, sigma1: 1.5, sigma2: 1, rho: 0.5}
      - nombre: 'Muestra mínima'
        descripcion: 'ν = 2, el mínimo en dos dimensiones: cada matriz es casi una aguja, porque se arma con solo dos vectores.'
        valores: {nu: 2, sigma1: 1.5, sigma2: 1, rho: 0.5}
      - nombre: 'Año de datos'
        descripcion: 'ν = 40: las elipses simuladas casi coinciden con la verdadera; con muchos datos la covarianza muestral es precisa.'
        valores: {nu: 40, sigma1: 1.5, sigma2: 1, rho: 0.5}
referencias:
  - clave: bishop
  - clave: murphy
  - clave: gelman-bda
publicado: true
---

## Intuición

Con los rendimientos diarios de dos acciones durante once días se calcula una matriz de covarianza muestral: dos varianzas y una covarianza. Si se repitiera el ejercicio con otros once días, la matriz saldría distinta. La distribución de Wishart describe esa variabilidad: es la distribución de una matriz aleatoria.

Su construcción imita la de la chi-cuadrada. Una chi-cuadrada suma cuadrados de normales; una Wishart suma productos externos $\mathbf{x}\mathbf{x}^{\top}$ de vectores normales, que son matrices. Cada vector aporta una matriz de rango uno en su dirección, y al acumular muchas la suma se vuelve una matriz definida positiva cuya forma se acerca a la de la covarianza verdadera.

Una manera de ver una matriz de covarianza es dibujar su elipse. Con pocos vectores, las elipses que resultan son de tamaños y orientaciones muy distintos: la covarianza estimada con pocos datos es muy incierta. Con muchos vectores, todas las elipses se parecen a la verdadera. El parámetro de grados de libertad cuenta cuántos vectores se sumaron.

## Definición

:::definicion[Distribución de Wishart]
Sean $\mathbf{x}_1, \dots, \mathbf{x}_{\nu}$ vectores independientes con distribución $\mathcal{N}_d(\mathbf{0}, \mathbf{V})$, con $\nu \ge d$ y $\mathbf{V}$ definida positiva. La matriz
$$
\mathbf{W} = \sum_{i=1}^{\nu}\mathbf{x}_i\mathbf{x}_i^{\top}
$$
tiene **distribución de Wishart** con matriz de escala $\mathbf{V}$ y $\nu$ grados de libertad, $\mathbf{W} \sim \mathcal{W}_d(\mathbf{V}, \nu)$. Su densidad sobre las matrices definidas positivas es
$$
f(\mathbf{W}) = \frac{|\mathbf{W}|^{(\nu - d - 1)/2}\exp\!\left(-\tfrac{1}{2}\operatorname{tr}(\mathbf{V}^{-1}\mathbf{W})\right)}{2^{\nu d/2}|\mathbf{V}|^{\nu/2}\,\Gamma_d(\nu/2)}.
$$
:::

Si $\mathbf{X}_1, \dots, \mathbf{X}_n$ es una muestra de $\mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$ y $\mathbf{S}$ es su covarianza muestral, entonces $(n - 1)\mathbf{S} \sim \mathcal{W}_d(\boldsymbol{\Sigma}, n - 1)$.

:::nota[Qué es X]
$X$ = una matriz aleatoria $\mathbf{W}$ definida positiva, como $\nu$ veces la covarianza muestral de los rendimientos de dos acciones.
:::

:::nota[Qué hace cada parámetro]
- **$\nu$, grados de libertad:** cuántos vectores se suman. Si aumenta, $\mathbf{W}/\nu$ se concentra alrededor de $\mathbf{V}$ y las elipses simuladas se parecen más a la verdadera.
- **$\mathbf{V}$, matriz de escala:** la forma promedio, con desviaciones $\sigma_1, \sigma_2$ y correlación $\rho$. Si aumenta $\sigma_1$, todas las matrices se estiran en la primera dirección; si aumenta $\rho$, se inclinan.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{W}$: matriz aleatoria de $d \times d$; $d$: dimensión.
- $\mathbf{x}_i$: vectores normales independientes; $\mathbf{x}_i\mathbf{x}_i^{\top}$: su producto externo.
- $\nu$: grados de libertad; $\mathbf{V}$: matriz de escala.
- $|\cdot|$: determinante; $\operatorname{tr}$: traza.
- $\Gamma_d$: función gamma multivariada.
- $\mathbf{S}$: covarianza muestral; $n$: tamaño de muestra; $\boldsymbol{\Sigma}$: covarianza poblacional.
:::

## Cómo usar la visualización

Cada matriz simulada se dibuja como su elipse; para compararlas con la escala, se divide entre $\nu$, de modo que la elipse punteada de $\mathbf{V}$ es la media. La más reciente aparece resaltada junto con los $\nu$ vectores normales cuya suma la formó. Los controles fijan $\nu$ y la escala; el panel da las entradas de la última matriz y el promedio de las simuladas. La reproducción agrega una matriz por paso y el botón agrega 20.

Con $\nu = 2$ simula y observa elipses muy alargadas y en todas direcciones. Sube $\nu$ a 40 y observa que se agrupan alrededor de la punteada. Con muchas simulaciones, el promedio del panel se acerca a las entradas de $\mathbf{V}$.

## Ejemplo

Los rendimientos diarios, en por ciento, de dos acciones son normales bivariados con $\sigma_1 = 1.5$, $\sigma_2 = 1$ y $\rho = 0.5$. Se calculan con 11 días, así que $10\mathbf{S} \sim \mathcal{W}_2(\boldsymbol{\Sigma}, 10)$.

1. Media: $\mathbb{E}[\mathbf{S}] = \boldsymbol{\Sigma} = \begin{pmatrix} 2.25 & 0.75 \\ 0.75 & 1 \end{pmatrix}$.
2. La entrada diagonal cumple $10 S_{11}/2.25 \sim \chi^{2}_{10}$.
3. Varianza de la varianza muestral: $\operatorname{Var}(S_{11}) = \frac{2 \cdot 2.25^{2}}{10} \approx 1.01$, con desviación de 1.01, casi la mitad del valor verdadero.
4. Probabilidad de sobrestimar mucho: $P(S_{11} > 3) = P(\chi^{2}_{10} > 13.33) \approx 0.206$.
5. Probabilidad de subestimar: $P(S_{11} < 1.5) = P(\chi^{2}_{10} < 6.67) \approx 0.244$. Con once días, en casi la mitad de los casos la varianza estimada se aleja más de un tercio de la verdadera.

:::figura[Rendimientos de dos acciones: con ν = 10 las elipses de S rodean a la verdadera (punteada), pero algunas son mucho más grandes o más chicas.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
valores:
  nu: 10
  sigma1: 1.5
  sigma2: 1
  rho: 0.5
```
:::

## Propiedades

- **Media:** $\mathbb{E}[\mathbf{W}] = \nu\mathbf{V}$.
- **Varianzas de las entradas:** $\operatorname{Var}(W_{ij}) = \nu(v_{ij}^{2} + v_{ii}v_{jj})$; en particular $\operatorname{Var}(W_{ii}) = 2\nu v_{ii}^{2}$.
- **Caso de una dimensión:** con $d = 1$ y $\mathbf{V} = \sigma^{2}$, $\mathbf{W} = \sigma^{2}\chi^{2}_{\nu}$.
- **Diagonal:** $W_{ii}/v_{ii} \sim \chi^{2}_{\nu}$.
- **Suma:** si $\mathbf{W}_1 \sim \mathcal{W}_d(\mathbf{V}, \nu_1)$ y $\mathbf{W}_2 \sim \mathcal{W}_d(\mathbf{V}, \nu_2)$ son independientes, $\mathbf{W}_1 + \mathbf{W}_2 \sim \mathcal{W}_d(\mathbf{V}, \nu_1 + \nu_2)$.
- **Transformación:** $\mathbf{A}\mathbf{W}\mathbf{A}^{\top} \sim \mathcal{W}(\mathbf{A}\mathbf{V}\mathbf{A}^{\top}, \nu)$.
- **Conjugación:** es la distribución conjugada de la matriz de precisión $\boldsymbol{\Sigma}^{-1}$ de una normal multivariada.

:::figura[Casos con contexto (once días de rendimientos, muestra mínima, un año de datos): cada botón carga los grados de libertad y una frase explica cuánto varían las matrices.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
valores:
  nu: 2
  sigma1: 1.5
  sigma2: 1
  rho: 0.5
casos:
  - nombre: 'Rendimientos de dos acciones'
    descripcion: 'ν = 10: variabilidad notable alrededor de la verdadera.'
    valores: {nu: 10, sigma1: 1.5, sigma2: 1, rho: 0.5}
  - nombre: 'Muestra mínima'
    descripcion: 'ν = 2: elipses alargadas en todas direcciones.'
    valores: {nu: 2, sigma1: 1.5, sigma2: 1, rho: 0.5}
  - nombre: 'Año de datos'
    descripcion: 'ν = 40: casi todas las elipses coinciden con la punteada.'
    valores: {nu: 40, sigma1: 1.5, sigma2: 1, rho: 0.5}
```
:::

:::figura[Construcción: la elipse resaltada es la suma de los productos externos de los vectores marcados, dividida entre su número. Con la reproducción se ve una suma nueva en cada paso.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
valores:
  nu: 5
  sigma1: 1.2
  sigma2: 1.2
  rho: 0
```
:::

## Errores comunes

- **Confundir $\mathbf{W}$ con la covarianza muestral.** La Wishart describe la suma $\nu\mathbf{S}$; la covarianza muestral es $\mathbf{W}/\nu$, con media $\mathbf{V}$.
- **Usar menos grados de libertad que la dimensión.** Con $\nu < d$ la suma no es invertible y no tiene densidad; con datos de alta dimensión y pocos casos, la covarianza muestral es singular.
- **Esperar que la correlación muestral sea tan precisa como cada varianza.** Con pocos grados de libertad la inclinación de la elipse varía mucho, aunque la escala promedio sea correcta.
- **Usar la Wishart como prior de una covarianza.** Es conjugada de la precisión; para la covarianza se usa la [[distribucion-de-wishart-inversa]].

:::figura[Correlación muestral inestable: con ν = 4 y ρ = 0, las elipses simuladas se inclinan hacia uno y otro lado, aunque la verdadera (punteada) es un círculo.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
valores:
  nu: 4
  sigma1: 1.3
  sigma2: 1.3
  rho: 0
```
:::

## Conexiones

Generaliza la [[distribucion-chi-cuadrada]] a matrices y se construye con vectores de la [[distribucion-normal-multivariada]]. Su inversa es la [[distribucion-de-wishart-inversa]], usada como prior de covarianzas, y para matrices de correlación se usa la [[distribucion-lkj-para-matrices-de-correlacion|LKJ]]. Su elipse media coincide con las de [[elipses-de-confianza]] de la normal original. Aparece en las pruebas sobre matrices de covarianza y en el estadístico $T^{2}$ de Hotelling. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Construcción]
$$
\mathbf{W} = \sum_{i=1}^{\nu}\mathbf{x}_i\mathbf{x}_i^{\top}, \qquad \mathbf{x}_i \sim \mathcal{N}_d(\mathbf{0}, \mathbf{V})
$$

- $\nu$: grados de libertad; $\mathbf{V}$: escala; $d$: dimensión.
:::

:::formula[Densidad]
$$
f(\mathbf{W}) = \frac{|\mathbf{W}|^{(\nu - d - 1)/2}\exp\!\left(-\tfrac{1}{2}\operatorname{tr}(\mathbf{V}^{-1}\mathbf{W})\right)}{2^{\nu d/2}|\mathbf{V}|^{\nu/2}\,\Gamma_d(\nu/2)}
$$

- $\operatorname{tr}$: traza; $|\cdot|$: determinante; $\Gamma_d$: gamma multivariada.
:::

:::formula[Media y varianzas]
$$
\mathbb{E}[\mathbf{W}] = \nu\mathbf{V}, \qquad \operatorname{Var}(W_{ij}) = \nu(v_{ij}^{2} + v_{ii}v_{jj})
$$

- $v_{ij}$: entrada $(i, j)$ de $\mathbf{V}$.
:::

:::formula[Covarianza muestral]
$$
(n - 1)\mathbf{S} \sim \mathcal{W}_d(\boldsymbol{\Sigma}, n - 1)
$$

- $\mathbf{S}$: covarianza muestral de $n$ observaciones normales con covarianza $\boldsymbol{\Sigma}$.
:::

:::formula[Diagonal]
$$
\frac{W_{ii}}{v_{ii}} \sim \chi^{2}_{\nu}
$$

- $W_{ii}$: entrada diagonal de $\mathbf{W}$; $\chi^{2}_{\nu}$: chi-cuadrada con $\nu$ grados.
:::
