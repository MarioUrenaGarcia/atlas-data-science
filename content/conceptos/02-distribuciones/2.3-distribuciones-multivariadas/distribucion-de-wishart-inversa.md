---
id: distribucion-de-wishart-inversa
titulo: Distribución de Wishart inversa
titulo_en: Inverse Wishart distribution
alias:
  - Wishart inversa
  - inversa de Wishart
modulo: 2
submodulo: '2.3'
orden: 8
nivel: avanzado
prerrequisitos:
  - distribucion-de-wishart
  - distribucion-gamma-inversa
relaciones:
  - tipo: generaliza
    id: distribucion-gamma-inversa
  - tipo: contrasta
    id: distribucion-lkj-para-matrices-de-correlacion
etiquetas:
  - matrices aleatorias
  - prior de covarianza
  - estadística bayesiana
  - distribución conjugada
  - gamma inversa
resumen: >
  Distribución de la inversa de una matriz de Wishart. Es la distribución conjugada de la matriz de
  covarianza de una normal multivariada y generaliza la gamma inversa a matrices.
formula: '\boldsymbol{\Sigma} \sim \mathcal{W}^{-1}_d(\boldsymbol{\Psi}, \nu) \iff \boldsymbol{\Sigma}^{-1} \sim \mathcal{W}_d(\boldsymbol{\Psi}^{-1}, \nu), \qquad \mathbb{E}[\boldsymbol{\Sigma}] = \frac{\boldsymbol{\Psi}}{\nu - d - 1}'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: wishart
    inversa: true
    valores:
      nu: 6
      sigma1: 1.73
      sigma2: 1.73
      rho: 0
    casos:
      - nombre: 'Prior poco informativo'
        descripcion: 'ν = 4, el mínimo para que exista la media en dos dimensiones: las covarianzas posibles varían enormemente en tamaño.'
        valores: {nu: 4, sigma1: 1.73, sigma2: 1.73, rho: 0}
      - nombre: 'Prior moderado'
        descripcion: 'ν = 6 y Ψ = 3I: la covarianza media es la identidad, con bastante incertidumbre en varianzas y correlación.'
        valores: {nu: 6, sigma1: 1.73, sigma2: 1.73, rho: 0}
      - nombre: 'Posterior con datos'
        descripcion: 'Tras 30 observaciones, ν = 36 y Ψ incluye su dispersión: las covarianzas se concentran alrededor de la estimada con los datos.'
        valores: {nu: 36, sigma1: 1.5, sigma2: 1, rho: 0.6}
referencias:
  - clave: gelman-bda
  - clave: murphy
publicado: true
---

## Intuición

En un modelo bayesiano para dos mediciones normales, por ejemplo la presión sistólica y la diastólica de pacientes, la matriz de covarianza es un parámetro desconocido. Hay que asignarle una distribución previa: una distribución sobre matrices de covarianza posibles. La Wishart inversa es la elección clásica, porque tras observar datos normales la posterior vuelve a ser una Wishart inversa con parámetros actualizados.

La relación con la Wishart es la misma que hay entre la gamma inversa y la gamma. La Wishart describe sumas de productos de vectores, que son matrices de precisión cuando se miran del lado de la información; su inversa describe covarianzas. Una matriz de Wishart grande corresponde a una covarianza chica, y una casi singular corresponde a una covarianza enorme en alguna dirección.

Su punto débil es que mezcla dos cosas: el tamaño de las varianzas y el de las correlaciones. Con pocos grados de libertad, las matrices simuladas que tienen varianzas grandes también tienden a tener correlaciones fuertes. Por eso, en modelos modernos, a veces se prefiere separar las varianzas de una matriz de correlación con distribución LKJ.

## Definición

:::definicion[Distribución de Wishart inversa]
La matriz $\boldsymbol{\Sigma}$, definida positiva de $d \times d$, tiene **distribución de Wishart inversa** con matriz de escala $\boldsymbol{\Psi}$ y $\nu$ grados de libertad, $\boldsymbol{\Sigma} \sim \mathcal{W}^{-1}_d(\boldsymbol{\Psi}, \nu)$, si $\boldsymbol{\Sigma}^{-1} \sim \mathcal{W}_d(\boldsymbol{\Psi}^{-1}, \nu)$, con $\nu > d - 1$. Su densidad es
$$
f(\boldsymbol{\Sigma}) = \frac{|\boldsymbol{\Psi}|^{\nu/2}}{2^{\nu d/2}\Gamma_d(\nu/2)}\,|\boldsymbol{\Sigma}|^{-(\nu + d + 1)/2}\exp\!\left(-\tfrac{1}{2}\operatorname{tr}(\boldsymbol{\Psi}\boldsymbol{\Sigma}^{-1})\right).
$$
:::

:::nota[Qué es X]
$X$ = una matriz de covarianza desconocida $\boldsymbol{\Sigma}$ tratada como aleatoria, por ejemplo la covarianza de la presión sistólica y la diastólica en un modelo bayesiano.
:::

:::nota[Qué hace cada parámetro]
- **$\nu$, grados de libertad:** cuánta información contiene el prior. Si aumenta, las covarianzas simuladas se concentran alrededor de $\boldsymbol{\Psi}/(\nu - d - 1)$.
- **$\boldsymbol{\Psi}$, matriz de escala:** la forma de la covarianza esperada. Si aumenta una de sus varianzas, la media de esa varianza sube en proporción; su correlación fija la inclinación media.
:::

:::nota[Qué significa cada símbolo]
- $\boldsymbol{\Sigma}$: matriz de covarianza aleatoria; $\boldsymbol{\Sigma}^{-1}$: su inversa, la matriz de precisión.
- $\boldsymbol{\Psi}$: matriz de escala; $\nu$: grados de libertad; $d$: dimensión.
- $\mathcal{W}_d$, $\mathcal{W}^{-1}_d$: Wishart y Wishart inversa.
- $|\cdot|$: determinante; $\operatorname{tr}$: traza; $\Gamma_d$: gamma multivariada.
:::

## Cómo usar la visualización

Cada matriz simulada aparece como su elipse, multiplicada por $\nu - 3$ para que la elipse punteada de $\boldsymbol{\Psi}$ sea su media en dos dimensiones. Los controles fijan $\nu$, desde 4, y la escala $\boldsymbol{\Psi}$ con dos desviaciones y una correlación; el panel compara la última matriz y el promedio de las simuladas con $\boldsymbol{\Psi}$. Los casos cargan un prior poco informativo, uno moderado y una posterior tras datos.

Con $\nu = 4$ simula 20 matrices y observa algunas elipses gigantes: la cola es pesada. Sube $\nu$ a 36 y observa que se concentran. Con $\rho = 0$ en la escala, observa cuántas elipses salen inclinadas de todos modos.

## Ejemplo

Para la covarianza de dos mediciones se usa el prior $\boldsymbol{\Sigma} \sim \mathcal{W}^{-1}_2(3\mathbf{I}, 6)$.

1. Media: $\mathbb{E}[\boldsymbol{\Sigma}] = \frac{3\mathbf{I}}{6 - 2 - 1} = \mathbf{I}$: se esperan varianzas 1 y correlación 0.
2. Cada varianza tiene distribución gamma inversa: $\Sigma_{11} \sim \operatorname{GI}\!\left(\frac{\nu - d + 1}{2}, \frac{\psi_{11}}{2}\right) = \operatorname{GI}(2.5, 1.5)$, con media $1.5/1.5 = 1$.
3. Probabilidad de una varianza grande: $P(\Sigma_{11} > 2) \approx 0.087$.
4. Probabilidad de una varianza chica: $P(\Sigma_{11} < 0.5) \approx 0.306$.
5. Tras 30 observaciones de media conocida $\boldsymbol{\mu}$, con matriz de dispersión $\mathbf{A} = \sum_{i}(\mathbf{x}_i - \boldsymbol{\mu})(\mathbf{x}_i - \boldsymbol{\mu})^{\top}$, la posterior es $\mathcal{W}^{-1}(3\mathbf{I} + \mathbf{A}, 36)$.

:::figura[Prior moderado: con ν = 6 y Ψ = 3I la media es la identidad (círculo punteado de radio 1.73 tras multiplicar por ν - 3 = 3), pero las matrices simuladas varían mucho.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
inversa: true
valores:
  nu: 6
  sigma1: 1.73
  sigma2: 1.73
  rho: 0
```
:::

## Propiedades

- **Media:** $\mathbb{E}[\boldsymbol{\Sigma}] = \boldsymbol{\Psi}/(\nu - d - 1)$ si $\nu > d + 1$.
- **Moda:** $\boldsymbol{\Psi}/(\nu + d + 1)$.
- **Marginal de una varianza:** $\Sigma_{ii} \sim \operatorname{GI}\!\left(\frac{\nu - d + 1}{2}, \frac{\psi_{ii}}{2}\right)$; con $d = 1$ es la [[distribucion-gamma-inversa]].
- **Conjugación:** con datos normales $\mathbf{x}_1, \dots, \mathbf{x}_n$ de media conocida $\boldsymbol{\mu}$, la posterior es $\mathcal{W}^{-1}\!\left(\boldsymbol{\Psi} + \sum_i(\mathbf{x}_i - \boldsymbol{\mu})(\mathbf{x}_i - \boldsymbol{\mu})^{\top},\ \nu + n\right)$.
- **Acoplamiento:** con pocos grados de libertad, varianzas grandes vienen con correlaciones de magnitud grande; las dos no se pueden fijar por separado.

:::figura[Casos con contexto (prior poco informativo, moderado, posterior con datos): cada botón carga ν y la escala, y una frase explica cuánta incertidumbre queda.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
inversa: true
valores:
  nu: 4
  sigma1: 1.73
  sigma2: 1.73
  rho: 0
casos:
  - nombre: 'Prior poco informativo'
    descripcion: 'ν = 4: elipses de tamaños muy distintos.'
    valores: {nu: 4, sigma1: 1.73, sigma2: 1.73, rho: 0}
  - nombre: 'Prior moderado'
    descripcion: 'ν = 6: media igual a la identidad.'
    valores: {nu: 6, sigma1: 1.73, sigma2: 1.73, rho: 0}
  - nombre: 'Posterior con datos'
    descripcion: 'ν = 36: matrices concentradas alrededor de la escala.'
    valores: {nu: 36, sigma1: 1.5, sigma2: 1, rho: 0.6}
```
:::

## Errores comunes

- **Pensar que $\boldsymbol{\Psi}$ es la covarianza esperada.** La media es $\boldsymbol{\Psi}/(\nu - d - 1)$; con $\nu = d + 2$ coinciden, pero en general no.
- **Usar $\nu \le d + 1$ y esperar una media.** Con tan pocos grados de libertad la media no existe y las simulaciones muestran elipses enormes de vez en cuando.
- **Creer que un prior con escala diagonal no dice nada sobre la correlación.** Con pocos grados de libertad, la Wishart inversa favorece correlaciones lejos de cero cuando las varianzas son grandes; la LKJ separa ambas cosas.
- **Confundir la escala de la Wishart inversa con la de la Wishart.** La Wishart inversa de escala $\boldsymbol{\Psi}$ corresponde a una Wishart de escala $\boldsymbol{\Psi}^{-1}$.

:::figura[Cola pesada: con ν = 4 la media existe pero apenas; entre unas pocas matrices aparece de vez en cuando una elipse mucho mayor que la punteada.]{componente="MultivariateExplorer"}
```yaml
modo: wishart
inversa: true
valores:
  nu: 4
  sigma1: 1
  sigma2: 1
  rho: 0
```
:::

## Conexiones

Es la inversa de la [[distribucion-de-wishart]] y generaliza la [[distribucion-gamma-inversa]], que es su caso de una dimensión. Es la distribución conjugada para la covarianza de una [[distribucion-normal-multivariada]]. Para separar varianzas y correlaciones se combina una distribución para cada desviación con la [[distribucion-lkj-para-matrices-de-correlacion|distribución LKJ]] para la matriz de correlaciones. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Definición]
$$
\boldsymbol{\Sigma} \sim \mathcal{W}^{-1}_d(\boldsymbol{\Psi}, \nu) \iff \boldsymbol{\Sigma}^{-1} \sim \mathcal{W}_d(\boldsymbol{\Psi}^{-1}, \nu)
$$

- $\boldsymbol{\Sigma}$: covarianza aleatoria; $\boldsymbol{\Psi}$: escala; $\nu$: grados de libertad; $d$: dimensión.
:::

:::formula[Densidad]
$$
f(\boldsymbol{\Sigma}) = \frac{|\boldsymbol{\Psi}|^{\nu/2}}{2^{\nu d/2}\Gamma_d(\nu/2)}\,|\boldsymbol{\Sigma}|^{-(\nu + d + 1)/2}\exp\!\left(-\tfrac{1}{2}\operatorname{tr}(\boldsymbol{\Psi}\boldsymbol{\Sigma}^{-1})\right)
$$

- $|\cdot|$: determinante; $\operatorname{tr}$: traza; $\Gamma_d$: gamma multivariada.
:::

:::formula[Media y moda]
$$
\mathbb{E}[\boldsymbol{\Sigma}] = \frac{\boldsymbol{\Psi}}{\nu - d - 1}, \qquad \operatorname{moda} = \frac{\boldsymbol{\Psi}}{\nu + d + 1}
$$

- La media existe si $\nu > d + 1$.
:::

:::formula[Marginal de una varianza]
$$
\Sigma_{ii} \sim \operatorname{GI}\!\left(\frac{\nu - d + 1}{2},\ \frac{\psi_{ii}}{2}\right)
$$

- $\operatorname{GI}(\alpha, \beta)$: gamma inversa de forma $\alpha$ y escala $\beta$; $\psi_{ii}$: entrada diagonal de $\boldsymbol{\Psi}$.
:::

:::formula[Actualización conjugada]
$$
\mathcal{W}^{-1}(\boldsymbol{\Psi}, \nu) \;\longrightarrow\; \mathcal{W}^{-1}\!\left(\boldsymbol{\Psi} + \textstyle\sum_{i=1}^{n}(\mathbf{x}_i - \boldsymbol{\mu})(\mathbf{x}_i - \boldsymbol{\mu})^{\top},\ \nu + n\right)
$$

- $\mathbf{x}_i$: observaciones normales; $\boldsymbol{\mu}$: su media conocida; $n$: número de observaciones.
:::
