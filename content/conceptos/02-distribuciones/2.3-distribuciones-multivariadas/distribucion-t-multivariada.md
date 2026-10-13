---
id: distribucion-t-multivariada
titulo: Distribución t multivariada
titulo_en: Multivariate t distribution
alias:
  - t de Student multivariada
  - t multivariante
modulo: 2
submodulo: '2.3'
orden: 9
nivel: avanzado
prerrequisitos:
  - distribucion-normal-multivariada
  - distribucion-t-de-student
  - distribucion-f-de-snedecor
relaciones:
  - tipo: generaliza
    id: distribucion-t-de-student
  - tipo: contrasta
    id: distribucion-normal-multivariada
etiquetas:
  - colas pesadas
  - distribuciones elípticas
  - finanzas
  - robustez
  - mezcla de escalas
resumen: >
  Versión de la normal multivariada con colas pesadas: un vector normal dividido entre una misma escala
  aleatoria. Conserva los contornos elípticos, pero produce valores extremos conjuntos con más frecuencia.
formula: 'f(\mathbf{x}) = \frac{\Gamma\!\left(\frac{\nu + d}{2}\right)}{\Gamma\!\left(\frac{\nu}{2}\right)(\nu\pi)^{d/2}|\boldsymbol{\Sigma}|^{1/2}}\left(1 + \frac{(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})}{\nu}\right)^{-(\nu + d)/2}'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: t
    valores:
      mu1: 0
      mu2: 0
      sigma1: 1
      sigma2: 1
      rho: 0.5
      nu: 4
    niveles: [0.5, 0.9, 0.99]
    casos:
      - nombre: 'Rendimientos de dos activos'
        descripcion: 'ν = 4 y ρ = 0.5: la mayoría de los días son tranquilos, pero los días extremos en ambos activos a la vez son mucho más frecuentes que con la normal.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 4}
      - nombre: 'Cauchy bivariada'
        descripcion: 'ν = 1: colas tan pesadas que no hay media ni covarianza; los contornos del 99 % quedan fuera de la gráfica.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 1}
      - nombre: 'Casi normal'
        descripcion: 'ν = 30: las elipses de la t y de la normal casi coinciden, salvo un poco en la del 99 %.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 30}
referencias:
  - clave: murphy
  - clave: tsay
publicado: true
---

## Intuición

Los rendimientos diarios de dos acciones se parecen a una nube normal la mayor parte del tiempo, pero de vez en cuando llega un día de pánico en el que las dos caen mucho a la vez. Una normal bivariada hace esos días tan raros que prácticamente nunca deberían ocurrir. La t multivariada los vuelve plausibles.

Su construcción tiene una lectura clara. Se toma un punto de una normal bivariada y se divide entre un factor de escala aleatorio común a las dos variables. En la mayoría de los días el factor es cercano a uno y el punto queda donde estaba; en algunos el factor es chico y el punto sale disparado lejos del centro, en la misma dirección que tenía. Como el factor es común, los extremos llegan juntos: es una dependencia en las colas que la normal no tiene.

La forma de los contornos sigue siendo elíptica, con la misma orientación que daría la normal con la misma matriz de escala. Lo que cambia es cómo se reparte la probabilidad entre las elipses: menos masa en la zona intermedia y más en las elipses grandes. El parámetro de grados de libertad controla ese peso de las colas.

## Definición

:::definicion[t multivariada]
Sean $\mathbf{Z} \sim \mathcal{N}_d(\mathbf{0}, \boldsymbol{\Sigma})$ y $W \sim \chi^{2}_{\nu}$ independientes. El vector
$$
\mathbf{X} = \boldsymbol{\mu} + \frac{\mathbf{Z}}{\sqrt{W/\nu}}
$$
tiene **distribución t multivariada** con localización $\boldsymbol{\mu}$, matriz de escala $\boldsymbol{\Sigma}$ y $\nu$ grados de libertad, $\mathbf{X} \sim t_{\nu}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$. Su densidad es
$$
f(\mathbf{x}) = \frac{\Gamma\!\left(\frac{\nu + d}{2}\right)}{\Gamma\!\left(\frac{\nu}{2}\right)(\nu\pi)^{d/2}|\boldsymbol{\Sigma}|^{1/2}}\left(1 + \frac{D^{2}(\mathbf{x})}{\nu}\right)^{-(\nu + d)/2}, \qquad D^{2}(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}).
$$
:::

:::nota[Qué es X]
$\mathbf{X}$ = un vector de mediciones con colas pesadas y extremos que llegan juntos, como los rendimientos diarios de dos activos.
:::

:::nota[Qué hace cada parámetro]
- **$\nu$, grados de libertad:** el peso de las colas. Si aumenta, las colas se adelgazan y la distribución se acerca a la normal con la misma $\boldsymbol{\Sigma}$.
- **$\boldsymbol{\mu}$, localización:** el centro. Si aumenta una entrada, la nube se traslada.
- **$\boldsymbol{\Sigma}$, matriz de escala:** forma y orientación de los contornos, con $\sigma_1, \sigma_2$ y $\rho$. Si aumenta $\rho$, las elipses se inclinan y se angostan como en la normal.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: vector aleatorio; $\mathbf{x}$: valor posible; $d$: dimensión.
- $\mathbf{Z}$: vector normal de media cero; $W$: chi-cuadrada independiente de $\mathbf{Z}$.
- $\nu$: grados de libertad; $\boldsymbol{\mu}$: localización; $\boldsymbol{\Sigma}$: escala.
- $D^{2}(\mathbf{x})$: cuadrado de la distancia de Mahalanobis.
- $\Gamma$: función gamma; $|\boldsymbol{\Sigma}|$: determinante.
:::

## Cómo usar la visualización

Las elipses continuas encierran el 50, el 90 y el 99 % de la probabilidad de la t; las punteadas, los mismos niveles de la normal con la misma matriz de escala. Los controles fijan $\nu$, el centro y la escala. El botón de simulación agrega 500 puntos de la t, y el panel cuenta qué fracción cae fuera de la elipse normal del 99 %, que debería ser 0.01 si los datos fueran normales.

Con $\nu = 4$ simula y observa que alrededor del 9 % de los puntos queda fuera de la elipse normal del 99 %. Sube $\nu$ a 30 y observa que las elipses continuas y punteadas casi coinciden. Baja $\nu$ a 1 y observa los puntos muy lejanos de la Cauchy bivariada.

## Ejemplo

Los rendimientos diarios estandarizados de dos activos siguen una t bivariada con $\nu = 4$, $\boldsymbol{\mu} = \mathbf{0}$ y matriz de escala con varianzas 1 y $\rho = 0.5$.

1. Covarianza: $\operatorname{Cov}(\mathbf{X}) = \frac{\nu}{\nu - 2}\boldsymbol{\Sigma} = 2\boldsymbol{\Sigma}$; la escala no es la covarianza.
2. Para la t, $D^{2}(\mathbf{X})/d \sim F_{d,\nu}$, aquí $F_{2,4}$.
3. La elipse normal del 99 % tiene $D^{2} = 9.21$. Con la t, $P(D^{2} > 9.21) = P(F_{2,4} > 4.605) \approx 0.092$.
4. Es decir, un día fuera de esa elipse ocurre cerca de 9 veces más seguido de lo que predice la normal.
5. La elipse del 99 % de la t necesita $D^{2} = 2F_{2,4;\,0.99} = 2 \cdot 18 = 36$: su radio es el doble del radio normal.

:::figura[Rendimientos de dos activos: con ν = 4 las elipses de la t (continuas) se separan de las normales (punteadas) en el nivel del 99 %. Al simular, cerca del 9 % de los puntos cae fuera de la elipse normal del 99 %.]{componente="MultivariateExplorer"}
```yaml
modo: t
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.5
  nu: 4
niveles: [0.5, 0.99]
```
:::

## Propiedades

- **Media y covarianza:** $\mathbb{E}[\mathbf{X}] = \boldsymbol{\mu}$ si $\nu > 1$ y $\operatorname{Cov}(\mathbf{X}) = \frac{\nu}{\nu - 2}\boldsymbol{\Sigma}$ si $\nu > 2$.
- **Distancia de Mahalanobis:** $D^{2}(\mathbf{X})/d \sim F_{d,\nu}$; la elipse de probabilidad $q$ tiene $D^{2} = dF_{d,\nu;\,q}$.
- **Marginales:** cada componente es una t univariada con los mismos $\nu$ grados.
- **Límite:** cuando $\nu \to \infty$, $\mathbf{X} \to \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$.
- **Dependencia sin correlación:** con $\boldsymbol{\Sigma}$ diagonal las componentes no están correlacionadas pero no son independientes, porque comparten el factor $W$.
- **Mezcla de escalas:** $\mathbf{X} \mid W \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma}\nu/W)$; es una mezcla de normales con varianzas distintas.

:::figura[Casos con contexto (rendimientos de dos activos, Cauchy bivariada, casi normal): cada botón carga los grados de libertad y una frase explica el peso de las colas.]{componente="MultivariateExplorer"}
```yaml
modo: t
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.5
  nu: 30
casos:
  - nombre: 'Rendimientos de dos activos'
    descripcion: 'ν = 4: 9 % fuera de la elipse normal del 99 %.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 4}
  - nombre: 'Cauchy bivariada'
    descripcion: 'ν = 1: no hay media ni covarianza.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 1}
  - nombre: 'Casi normal'
    descripcion: 'ν = 30: las dos familias de elipses casi coinciden.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, nu: 30}
```
:::

:::figura[Sin correlación no es independencia: con ρ = 0 y ν = 3 la nube es redonda, pero los puntos lejanos aparecen en las dos coordenadas a la vez porque comparten la misma escala aleatoria.]{componente="MultivariateExplorer"}
```yaml
modo: t
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0
  nu: 3
```
:::

## Errores comunes

- **Tomar la matriz de escala como covarianza.** La covarianza es $\frac{\nu}{\nu - 2}\boldsymbol{\Sigma}$; con $\nu = 4$ es el doble.
- **Usar los cuantiles chi-cuadrada para sus elipses.** Para la t el radio sale de la F: $D^{2} = dF_{d,\nu;\,q}$.
- **Suponer independencia cuando la escala es diagonal.** El factor común $W$ liga los extremos de todas las componentes.
- **Modelar cada componente con una t por separado.** Varias t univariadas independientes no producen los extremos simultáneos de la t multivariada.

:::figura[Elipses con el cuantil equivocado: la elipse del 99 % de la t con ν = 3 (continua) es mucho más grande que la que daría el cuantil de la chi-cuadrada (punteada).]{componente="MultivariateExplorer"}
```yaml
modo: t
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.3
  nu: 3
niveles: [0.99]
```
:::

## Conexiones

Generaliza la [[distribucion-t-de-student]] a varias dimensiones y tiende a la [[distribucion-normal-multivariada]] cuando crecen los grados de libertad. Su distancia de Mahalanobis se relaciona con la [[distribucion-f-de-snedecor]], y con un grado de libertad es la versión multivariada de la [[distribucion-de-cauchy]]. Sus regiones de probabilidad son [[elipses-de-confianza]] con radio corregido. Se usa en finanzas, en regresión robusta y como distribución predictiva en modelos bayesianos normales con covarianza desconocida. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Construcción]
$$
\mathbf{X} = \boldsymbol{\mu} + \frac{\mathbf{Z}}{\sqrt{W/\nu}}, \qquad \mathbf{Z} \sim \mathcal{N}_d(\mathbf{0}, \boldsymbol{\Sigma}),\ W \sim \chi^{2}_{\nu}
$$

- $\boldsymbol{\mu}$: localización; $\boldsymbol{\Sigma}$: escala; $\nu$: grados de libertad.
:::

:::formula[Densidad]
$$
f(\mathbf{x}) = \frac{\Gamma\!\left(\frac{\nu + d}{2}\right)}{\Gamma\!\left(\frac{\nu}{2}\right)(\nu\pi)^{d/2}|\boldsymbol{\Sigma}|^{1/2}}\left(1 + \frac{D^{2}(\mathbf{x})}{\nu}\right)^{-(\nu + d)/2}
$$

- $D^{2}(\mathbf{x})$: cuadrado de la distancia de Mahalanobis; $d$: dimensión; $\Gamma$: función gamma.
:::

:::formula[Covarianza]
$$
\operatorname{Cov}(\mathbf{X}) = \frac{\nu}{\nu - 2}\boldsymbol{\Sigma}, \qquad \nu > 2
$$

- Con $\nu \le 2$ la covarianza no existe.
:::

:::formula[Elipses de probabilidad]
$$
\frac{D^{2}(\mathbf{X})}{d} \sim F_{d,\nu}, \qquad c_q = dF_{d,\nu;\,q}
$$

- $F_{d,\nu;\,q}$: cuantil $q$ de la F con $d$ y $\nu$ grados; $c_q$: radio al cuadrado de la elipse.
:::
